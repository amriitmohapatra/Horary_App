import sys,glob,os; sys.path.insert(0,sys.argv[1]); from e31_parse import series
import swisseph as swe, numpy as np
swe.set_ephe_path(sys.argv[2])
def lah(jd):
    T=(jd-2451545)/36525+1; return 22.46045833333333+(5026.87434*T+1.11113*T*T)/3600
rows=[]
for path in sorted(glob.glob(sys.argv[3]+'/*.e31')):
    try: jd0,jd1,runs=series(path)
    except Exception as e: continue
    B={r[0][0]:np.array([v for _,v in r]) for r in runs}
    if 1352 not in B or 4424 not in B: continue
    n=min(len(B[1352]),len(B[4424]),int(round((jd1-jd0)*2))+1)
    mo=[];ra=[];dts=[]
    for k in range(n-1):
        t=jd0+0.5*k
        xm,_=swe.calc_ut(t,1,swe.FLG_SWIEPH|swe.FLG_NONUT|swe.FLG_SPEED)
        xr,_=swe.calc_ut(t,11,swe.FLG_SWIEPH|swe.FLG_NONUT)
        rm=(((xm[0]-lah(t)-B[1352][k])+180)%360-180)*3600
        rr=(((xr[0]-lah(t)-B[4424][k])+180)%360-180)*3600
        if abs(rm)>600: continue
        mo.append(rm); ra.append(rr)
        dts.append(swe.deltat(t)*86400 - rm/(xm[3]*3600/86400))
    y,m,d,_=swe.revjul(jd0)
    rows.append((y+(m-0.5)/12, np.mean(ra), np.std(ra), np.mean(mo), np.std(mo), np.mean(dts), swe.deltat(jd0)*86400))
for r in rows: print('%.2f  Ra %.2f±%.2f  Mo %.2f±%.2f  dT_PL=%.1fs  dT_SE=%.1fs'%r)
