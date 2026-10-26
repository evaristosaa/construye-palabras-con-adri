"""Text checks for Spanish educational speech, including teaching targets."""
import re
import unicodedata
from difflib import SequenceMatcher
from collections import Counter

DIGITS={"0":"cero","1":"uno","2":"dos","3":"tres","4":"cuatro","5":"cinco","6":"seis","7":"siete","8":"ocho","9":"nueve","10":"diez","11":"once","12":"doce","13":"trece","14":"catorce","15":"quince","16":"dieciseis","17":"diecisiete","18":"dieciocho","19":"diecinueve","20":"veinte"}
LETTERS={"b":"be","c":"ce","d":"de","f":"efe","g":"ge","h":"hache","j":"jota","k":"ka","l":"ele","m":"eme","n":"ene","ñ":"eñe","p":"pe","q":"cu","r":"erre","s":"ese","t":"te","v":"uve","w":"dobleuve","x":"equis","y":"i","z":"zeta"}
def unaccent(text):
    text=text.lower().replace("ñ","\ue000")
    return "".join(c for c in unicodedata.normalize("NFD",text) if unicodedata.category(c)!="Mn").replace("\ue000","ñ")
def normalize(text):
    words=re.findall(r"[\w]+",text.lower(),flags=re.UNICODE)
    return unaccent(" ".join(LETTERS.get(w,DIGITS.get(w,w)) for w in words))
def syllable_sound(text):
    text=unaccent(text)
    if text=="y": return "i"
    text=re.sub(r"(?<!c)h","",text)
    text=text.replace("que","ke").replace("qui","ki")
    # These are isolated initial syllables: x sounds /s/, as in xilófono.
    return text.replace("ce","se").replace("ci","si").replace("z","s").replace("v","b").replace("ll","y").replace("x","s")
def phones(text):
    """Conservative spelling equivalences for Spanish with seseo; keep ñ distinct."""
    words=normalize(text).split()
    result=[]
    for word in words:
        word=re.sub(r"(?<!c)h","",word)
        word=re.sub(r"qu(?=[ei])","k",word)
        word=re.sub(r"c(?=[ei])","s",word)
        word=re.sub(r"c(?=[aou])","k",word)
        word=re.sub(r"g(?=[ei])","j",word)
        word=word.replace("z","s").replace("v","b").replace("ll","y")
        result.append(word)
    return "".join(result)
def asr_domain_prompt(key,catalog=None):
    # Include every candidate, never the answer for the current recording.
    if key.endswith("-syllable-hunt"):
        return "Fonética de primaria en español. Busca la sílaba y tócala. Sílabas: a, e, i, o, u, bi, cu, di, fi, gu, hi, ji, ki, li, mi, ni, ñi, pi, que, ri, si, ti, vi, wi, xi, yi, zi."
    if key.endswith("-letter"):
        return "Abecedario español. Toca la letra. A, be, ce, de, e, efe, ge, hache, i, jota, ka, ele, eme, ene, eñe, o, pe, cu, erre, ese, te, u, uve, uve doble, equis, ye, zeta."
    if catalog:
        patterns={"-sound-picture":r"Escucha:\s*(\w+)","-picture-word":r"\. Es\s+(\w+)",
            "-word":r"formar\s+(\w+)","-final":r"toca la palabra\s+(\w+)","-missing":r"dibujo de\s+(\w+)"}
        for suffix,pattern in patterns.items():
            if key.endswith(suffix):
                vocab=sorted({match.group(1) for line in catalog if line['key'].endswith(suffix)
                    for match in [re.search(pattern,line['text'],re.I)] if match})
                return "Juegos de lectura en español. Escucha y toca el dibujo o la palabra. Vocabulario: "+", ".join(vocab)+"."
        if key.endswith('-sentence'):
            vocab=set()
            for line in catalog:
                if line['key'].endswith('-sentence'):
                    part=line['text'].split('corresponde:')[-1]
                    vocab.update(re.findall(r'\w+',part))
            return "Lectura de frases de primaria. Nombres y palabras: "+", ".join(sorted(vocab))+"."
    return "Adri. Juan. Cayetana. Lectura. Matemáticas. Números del cero al veinte. Unidades y decenas."
def syllable_tail(text):
    joined=syllable_sound(re.sub(r"[^\w]","",text.lower()))
    joined=re.sub(r"(?<!c)h","",joined)
    joined=re.sub(r"y(?=$|[^aeiou])","i",joined)
    marker=joined.find("silaba")
    if marker<0:return ""
    tail=joined[marker+len("silaba"):]
    return re.sub(r"([aeiou])\1+",r"\1",tail)
def check_transcript(key,expected,actual):
    wanted,heard=normalize(expected),normalize(actual)
    similarity=SequenceMatcher(None,wanted,heard).ratio()
    coverage=len(heard.split())/max(1,len(wanted.split()))
    reasons=[]
    spelled_target=False
    if similarity < (.76 if len(wanted.split())<=4 else .68) or not .5<=coverage<=1.8:
        reasons.append("Text differs or is incomplete")
    expected_tokens=Counter(wanted.split())
    heard_tokens=Counter(heard.split())
    for number in set(DIGITS.values()):
        if expected_tokens[number] and not heard_tokens[number]:
            reasons.append(f"Missing number: {number}")
    if key.endswith("-letter"):
        match=re.search(r"(?:letra|vocal)\s+([a-zñ])\b",expected,re.I)
        if match:
            names={**LETTERS,"y":"ye"}
            def letter_sound(value,expected_symbol=False):
                value=unaccent(value).strip()
                value=re.sub(r"[^\w\s]","",value).strip()
                value=(names if expected_symbol else LETTERS).get(value,value)
                value=value.replace("i griega","ye").replace("y griega","ye").replace("uve doble","dobleuve").replace("doble uve","dobleuve")
                return phones(value)
            focus=letter_sound(match.group(1),expected_symbol=True)
            heard_match=re.search(r"(?:letra|vocal)\s*:?[\s]*(.*)$",actual,re.I)
            tail=heard_match.group(1) if heard_match else (actual.split()[-1] if actual.split() else "")
            if letter_sound(tail) not in (focus,focus*2):
                reasons.append("Teaching letter does not match")
    if key.endswith("-syllable-hunt"):
        match=re.search(r"sílaba\s+(\w+)",expected,re.I)
        if match:
            focus=syllable_sound(match.group(1))
            required=sum(syllable_sound(w)==focus for w in re.findall(r"\w+",expected.lower()))
            count=sum(syllable_sound(w)==focus for w in re.findall(r"\w+",actual.lower()))
            if count<required:
                # An explicit letter-name cue identifies ñi without mispronouncing it as ni.
                spelling_pattern=phones('con')+r'(?:la)?eñe(?:e|i)?(?:la)?i(?:i)?'+phones('tócala')
                named_words=re.search(r'\b(?:con|kon)\s+(?:la\s+)?eñe\s+(?:(?:e|i)\s+)?(?:la\s+)?i\b',heard)
                spelled_target=focus=='ñi' and bool(named_words or re.search(spelling_pattern,phones(actual)))
                tail=syllable_tail(actual)
                wanted_tail=syllable_tail(expected)
                # ASR often merges "bi y tócala" into "bitócala". Check the
                # anchored sound sequence, never an unrelated occurrence later.
                continuous=tail.startswith(focus) and tail.endswith("ocala") and SequenceMatcher(None,wanted_tail,tail).ratio()>=.88
                if not continuous and not spelled_target: reasons.append("Teaching syllable missing or different")
    for pattern in [r"Escucha:\s*(\w+)",r"dibujo de\s+(\w+)",r"formar\s+(\w+)",r"toca la palabra\s+(\w+)",r"\. Es\s+(\w+)"]:
        match=re.search(pattern,expected,re.I)
        if match:
            focus=normalize(match.group(1))
            if heard_tokens[focus]<expected_tokens[focus]:
                spoken_focus=phones(match.group(1))
                wanted_phones,heard_phones=phones(expected),phones(actual)
                at_end=not re.sub(r'[^\w]','',expected[match.end():])
                equivalent=heard_phones.count(spoken_focus)>=wanted_phones.count(spoken_focus)
                if at_end:equivalent=equivalent and heard_phones.endswith(spoken_focus)
                if not equivalent:reasons.append(f"Teaching word missing: {focus}")
    if key.endswith("-sentence"):
        match=re.search(r"corresponde:\s*(.+)$",expected,re.I)
        if match and not phones(actual).endswith(phones(match.group(1))):
            reasons.append("Teaching sentence differs")
    if key.endswith("-final"):
        match=re.search(r"pista:\s*(.+?)\.\s*Ahora",expected,re.I)
        if match and phones(match.group(1)) not in phones(actual):
            reasons.append("Teaching clue differs")
    return {"similarity":similarity,"status":"review" if reasons else "pass","reasons":sorted(set(reasons)),"validationVersion":4,**({'spelledTarget':True} if spelled_target else {})}
