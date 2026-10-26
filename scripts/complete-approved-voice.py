"""Supervise the staged batch, retry discrepancies, connect and verify the catalog."""
import json
from pathlib import Path
import subprocess
import sys
import time

ROOT=Path(__file__).resolve().parents[1]
PRIVATE=ROOT/'tmp'/'approved-voice-job'
PYTHON=sys.executable
catalog=json.loads(subprocess.check_output(['node','--input-type=module','-e',
    "import{voiceCatalog}from './src/data/voiceCatalog.js';console.log(JSON.stringify(voiceCatalog));"],cwd=ROOT,encoding='utf8'))
expected={entry['key'] for entry in catalog}
def read(name):
    path=PRIVATE/name
    return json.loads(path.read_text(encoding='utf8')) if path.exists() else {}
def status():
    return json.loads(subprocess.check_output(['node','scripts/voice-job-status.mjs'],cwd=ROOT,encoding='utf8'))
def run(command):
    print('RUN '+' '.join(command),flush=True)
    subprocess.run(command,cwd=ROOT,check=True)
def unresolved():
    s=status()
    state=read('state.json')
    missing=expected-set(state.get('files',{}))
    return sorted(missing|{entry['key'] for entry in s['review']})

try:
    print('Waiting for the main generation batch to finish all catalog keys',flush=True)
    while True:
        state=read('state.json')
        accounted=set(state.get('files',{}))|set(state.get('failures',{}))
        if expected<=accounted:
            time.sleep(5)
            break
        s=status()
        print(f"PROGRESS generated={s['generated']} verified={s['approved']} total={s['total']}",flush=True)
        time.sleep(45)
    (PRIVATE/'stop-validation').touch()
    for _ in range(60):
        if not read('watcher-status.json').get('running',False):break
        time.sleep(2)
    else:
        raise RuntimeError('Verifier did not stop; avoiding concurrent report writers')
    run([PYTHON,'-u','scripts/validate-approved-voice.py'])
    run([PYTHON,'-u','scripts/review-approved-voice.py'])
    for seed in [142,1142,2142]:
        keys=unresolved()
        if not keys:break
        print(f'RETRY {len(keys)} recordings with seed {seed}',flush=True)
        run([PYTHON,'-u','scripts/generate-approved-voice.py','--reference-config',
            'tmp/approved-voice-job/reference-config.json','--only-keys',','.join(keys),
            '--batch-size','1','--threads','6','--seed',str(seed)])
        run([PYTHON,'-u','scripts/validate-approved-voice.py'])
        run([PYTHON,'-u','scripts/review-approved-voice.py'])
    keys=unresolved()
    if keys:
        (PRIVATE/'needs-review.json').write_text(json.dumps({'keys':keys,'status':status()},ensure_ascii=False,indent=2),encoding='utf8')
        raise RuntimeError(f'{len(keys)} recordings still require review')
    run(['node','scripts/finalize-approved-voice.mjs'])
    run(['node','--test',*[str(p.relative_to(ROOT)) for p in sorted((ROOT/'tests').glob('*.test.mjs'))]])
    run([PYTHON,'scripts/test_voice_validation.py'])
    run(['node','node_modules/vite/bin/vite.js','build'])
    run(['node','scripts/check-voice-assets.mjs'])
    result={'status':'complete',**status()}
    (PRIVATE/'completion.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
    print('COMPLETE: all approved recordings connected and verified',flush=True)
except Exception as error:
    (PRIVATE/'supervisor-error.json').write_text(json.dumps({'error':str(error),'status':status()},ensure_ascii=False,indent=2),encoding='utf8')
    raise
