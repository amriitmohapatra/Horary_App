import sys,struct,math
sys.path.insert(0,sys.argv[1]); from e31_parse import series
import swisseph as swe, numpy as np
swe.set_ephe_path(sys.argv[2])
path=sys.argv[3]
jd0,jd1,runs=series(path)
blocks={r[0][0]:np.array([v for _,v in r]) for r in runs}
order=[(840,'Su',0),(1352,'Mo',1),(1864,'Ma',4),(2376,'Me',2),(2888,'Ju',5),(3400,'Ve',3),(3912,'Sa',6),(4424,'Ra_true',11),(4424,'Ra_mean',10)]
def pl_lahiri(jd):
    T=(jd-2451545)/36525+1
    return 22.46045833333333+(5026.87434*T+1.11113*T*T)/3600
def wrap(x): return (x+180)%360-180
for off,name,body in order:
    s=blocks.get(off)
    if s is None: continue
    n=len(s); res=[]
    for k in range(n):
        jd=jd0+0.5*k
        # assume grid is UT; tropical apparent
        x,_=swe.calc_ut(jd,body,swe.FLG_SWIEPH)
        res.append(wrap(x[0]-pl_lahiri(jd)-s[k]))
    res=np.array(res)*3600
    print(f"{name:8s} n={n} resid(PL-Lahiri-poly) mean={res.mean():9.1f}\" sd={res.std():7.1f}\" min={res.min():.1f} max={res.max():.1f}")
