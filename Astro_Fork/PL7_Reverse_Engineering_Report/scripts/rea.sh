#!/bin/zsh
# usage: rea.sh "<rizin cmds>"  -> prints stdout of REA evidence, saves evidence json
SP=/private/tmp/claude-501/-Users-amriitmohapatra-Documents-Horary-App/533dc9e3-10eb-40f1-b120-e69c3992329d/scratchpad
mkdir -p $SP/evidence
OUT=$SP/evidence/ev_$(date +%s%N).json
cd $SP && npx -y rea-agents@latest execute-rizin-command $SP/target/${REA_TARGET:-PL7.exe} "e scr.color=0; e scr.utf8=false; $1" --format json --full-output > $OUT 2>/dev/null
python3 -I -c "
import json,sys
d=json.load(open(sys.argv[1]))
def find(o):
    if isinstance(o,dict):
        if 'stdout' in o and isinstance(o['stdout'],str): return o
        for v in o.values():
            r=find(v)
            if r: return r
    if isinstance(o,list):
        for v in o:
            r=find(v)
            if r: return r
r=find(d)
print(r['stdout'] if r else json.dumps(d)[:3000])
if r and r.get('stderr'): print('STDERR:',r['stderr'][:500],file=sys.stderr)
print('[evidence: '+sys.argv[1].split('/')[-1]+']')
" $OUT
