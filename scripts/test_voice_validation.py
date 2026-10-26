import unittest
from voice_validation import check_transcript,normalize

class SpeechTargets(unittest.TestCase):
    def test_wrong_letter_is_rejected_even_when_the_rest_matches(self):
        r=check_transcript('game-letra-r-letter','Mira bien y toca la letra R.','Mira bien y toca la letra L.')
        self.assertEqual(r['status'],'review')
    def test_enye_is_not_ene(self):
        self.assertNotEqual(normalize('eñe'),normalize('ene'))
        self.assertEqual(check_transcript('game-letra-ñ-letter','Toca la letra Ñ.','Toca la letra N.')['status'],'review')
    def test_explicit_letter_names_identify_enye_i_without_accepting_ene(self):
        expected='Busca la sílaba ñi y tócala.'
        result=check_transcript('game-letra-enye-syllable-hunt',expected,'Busca la sílaba con eñe e i. Tócala.')
        self.assertEqual(result['status'],'pass')
        self.assertTrue(result['spelledTarget'])
        for wrong in ['ene e i','eñe e a','eme e i']:
            self.assertEqual(check_transcript('game-letra-enye-syllable-hunt',expected,f'Busca la sílaba con {wrong}. Tócala.')['status'],'review')
    def test_spelled_target_allows_asr_word_boundaries_and_b_v_spelling(self):
        expected='Busca la sílaba ñi y tócala.'
        for transcript in ['Buscada sílava con eñe e i tócala.','Buscada sálava con eñe e i tócala.','Busca la sílaba con eñei. Tócala.']:
            self.assertEqual(check_transcript('game-letra-enye-syllable-hunt',expected,transcript)['status'],'pass')
        self.assertEqual(check_transcript('game-letra-enye-syllable-hunt',expected,'Busca la sílaba con eñe e iglesia. Tócala.')['status'],'review')
    def test_seville_seseo_is_accepted_for_syllables(self):
        self.assertEqual(check_transcript('game-letra-z-syllable-hunt','Busca la sílaba zi y tócala.','Busca la sílaba si y tócala.')['status'],'pass')
    def test_seville_seseo_is_accepted_in_letter_names(self):
        self.assertEqual(check_transcript('game-letra-c-letter','Toca la letra C.','Toca la letra se.')['status'],'pass')
        self.assertEqual(check_transcript('game-letra-z-letter','Toca la letra Z.','Toca la letra seta.')['status'],'pass')
    def test_conjunction_y_cannot_hide_the_wrong_target_letter(self):
        self.assertEqual(check_transcript('game-letra-y-letter','Mira bien y toca la letra Y.','Mira bien y toca la letra A.')['status'],'review')
    def test_asr_y_spelling_represents_vowel_i_but_not_letter_ye(self):
        self.assertEqual(check_transcript('game-letra-i-letter','Mira bien y toca la letra I.','Mira bien y toca la letra Y.')['status'],'pass')
        self.assertEqual(check_transcript('game-letra-y-letter','Mira bien y toca la letra Y.','Mira bien y toca la letra Y.')['status'],'review')
        self.assertEqual(check_transcript('game-letra-y-letter','Mira bien y toca la letra Y.','Mira bien y toca la letra ye.')['status'],'pass')
    def test_repeating_the_same_letter_is_valid_but_a_different_letter_is_not(self):
        self.assertEqual(check_transcript('game-letra-q-letter','Mira bien y toca la letra Q.','Mira bien y toca la letra cu. Cu.')['status'],'pass')
        self.assertEqual(check_transcript('game-letra-q-letter','Mira bien y toca la letra Q.','Mira bien y toca la letra cu. Pe.')['status'],'review')
    def test_silent_h_and_qu_are_spelling_variants_of_the_same_syllable_sound(self):
        self.assertEqual(check_transcript('game-letra-h-syllable-hunt','Busca la sílaba hi y tócala.','Busca la sílaba i y tócala.')['status'],'pass')
        self.assertEqual(check_transcript('game-letra-k-syllable-hunt','Busca la sílaba ki y tócala.','Busca la sílaba qui y tócala.')['status'],'pass')
    def test_a_different_syllable_is_rejected(self):
        self.assertEqual(check_transcript('game-letra-z-syllable-hunt','Busca la sílaba zi y tócala.','Busca la sílaba pa y tócala.')['status'],'review')
    def test_initial_xi_has_the_spanish_sound_of_xilofono_not_j(self):
        self.assertEqual(check_transcript('game-letra-x-syllable-hunt','Busca la sílaba xi y tócala.','Busca la sílaba si y tócala.')['status'],'pass')
        self.assertEqual(check_transcript('game-letra-x-syllable-hunt','Busca la sílaba xi y tócala.','Busca la sílaba ji y tócala.')['status'],'review')
    def test_asr_merged_word_boundaries_do_not_change_the_spoken_syllable(self):
        self.assertEqual(check_transcript('game-letra-b-syllable-hunt','Busca la sílaba bi y tócala.','Búscala, sílaba, bitócala.')['status'],'pass')
        self.assertEqual(check_transcript('game-letra-d-syllable-hunt','Busca la sílaba di y tócala.','Buscala, si la vadi y tocala.')['status'],'pass')
    def test_a_merged_wrong_syllable_is_still_rejected(self):
        self.assertEqual(check_transcript('game-letra-d-syllable-hunt','Busca la sílaba di y tócala.','Búscala, sílaba, bitócala.')['status'],'review')
    def test_ambiguous_hiatus_stays_pending(self):
        self.assertEqual(check_transcript('game-letra-a-syllable-hunt','Busca la sílaba i y tócala.','Busca la sílaba ahí, toca la.')['status'],'review')
    def test_number_changes_are_not_hidden_by_a_high_text_similarity(self):
        self.assertEqual(check_transcript('idea','Forma grupos de diez unidades.','Forma grupos de dos unidades.')['status'],'review')
    def test_digit_transcription_is_equivalent_to_a_spoken_number(self):
        self.assertEqual(check_transcript('idea','Forma grupos de diez unidades.','Forma grupos de 10 unidades.')['status'],'pass')
    def test_a_missing_teaching_word_is_rejected(self):
        self.assertEqual(check_transcript('game-letra-a-picture-word','Mira el dibujo y toca su palabra. Es árbol.','Mira el dibujo y toca su palabra.')['status'],'review')
    def test_final_clue_is_part_of_the_teaching_content(self):
        expected='Escucha la pista: Hace miel. Ahora toca la palabra abeja.'
        self.assertEqual(check_transcript('game-letra-a-final',expected,'Escucha la pista. Hace bien. Ahora toca la palabra abeja.')['status'],'review')
        self.assertEqual(check_transcript('game-letra-a-final',expected,'Escucha la pista. Hace miel. Ahora toca la palabra abeja.')['status'],'pass')
    def test_spelling_and_word_boundaries_can_represent_identical_speech(self):
        for expected,actual in [('bota','vota'),('cebra','cebra'),('erizo','herizo'),('zorro','sorro'),('waterpolo','water polo'),('kilo','quilo')]:
            self.assertEqual(check_transcript('game-picture-word',f'Es {expected}.',f'Es {actual}.')['status'],'pass')
        self.assertEqual(check_transcript('game-picture-word','Mira el dibujo. Es cebra.','Mira el dibujo. Esebra.')['status'],'pass')
        self.assertEqual(check_transcript('game-sentence','Toca la que corresponde: Tito toma té.','Toca la que corresponde Tito tomate.')['status'],'pass')
    def test_phonetic_matching_does_not_accept_a_different_teaching_word(self):
        for expected,actual in [('fresa','presa'),('niña','niño'),('árbol','algo'),('insecto','insectos')]:
            self.assertEqual(check_transcript('game-picture-word',f'Mira. Es {expected}.',f'Mira. Es {actual}.')['status'],'review')
    def test_yeismo_keeps_the_same_sound_but_not_a_different_vowel(self):
        expected='Ahora toca la palabra yegua.'
        self.assertEqual(check_transcript('game-final',expected,'Ahora toca la palabra llegua.')['status'],'pass')
        self.assertEqual(check_transcript('game-final',expected,'Ahora toca la palabra llego.')['status'],'review')
    def test_approved_names_and_punctuation(self):
        self.assertEqual(check_transcript('home','¡Vamos a jugar! Soy Adri. Juan y Cayetana te esperan.','Vamos a jugar. Soy Adri, Juan y Cayetana te esperan.')['status'],'pass')

if __name__=='__main__':unittest.main()
