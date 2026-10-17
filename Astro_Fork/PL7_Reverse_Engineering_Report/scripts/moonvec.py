import sys,glob; sys.path.insert(0,sys.argv[1]); from e31_parse import series
import swisseph as swe, numpy as np
swe.set_ephe_path(sys.argv[2])
def lah(jd):
    T=(jd-2451545)/36525+1; return 22.46045833333333+(5026.87434*T+1.11113*T*T)/3600
F=swe.FLG_SWIEPH|swe.FLG_NONUT
for path in sys.argv[3:]:
    jd0,jd1,runs=series(path); B={r[0][0]:np.array([v for _,v in r]) for r in runs}
    print(path[-11:])
    for off,body,name in [(840,0,'Su'),(2376,2,'Me'),(3400,3,'Ve'),(1864,4,'Ma'),(2888,5,'Ju'),(3912,6,'Sa')]:
        s=B[off]; n=min(len(s),62)
        res=[];X=[];dist=[];pred=[]
        for k in range(n):
            t=jd0+0.5*k
            x,_=swe.calc_ut(t,body,F); m,_=swe.calc_ut(t,1,F)
            r=(((x[0]-lah(t)-s[k])+180)%360-180)*3600
            res.append(r); dist.append(x[2])
            # predicted error if the full geocentric Moon vector were wrongly applied: shift = (r_moon/Delta)*sin(lam_moon - lam_planet)
            pred.append(np.degrees((m[2]/x[2])*np.sin(np.radians(m[0]-x[0])))*3600)
            X.append([1,np.sin(np.radians(m[0]-x[0])),np.cos(np.radians(m[0]-x[0]))])
        res=np.array(res);X=np.array(X);pred=np.array(pred)
        beta,*_=np.linalg.lstsq(X,res,rcond=None)
        fit=X@beta; r2=1-np.sum((res-fit)**2)/np.sum((res-res.mean())**2)
        k_scale=np.dot(pred,res-res.mean())/np.dot(pred,pred)
        resid_after=res-res.mean()-k_scale*pred
        print(f"  {name} Delta={np.mean(dist):5.2f}AU sd={res.std():6.1f}\" amp_sin={beta[1]:7.1f}\" R2={r2:.3f}  scale_vs_fullMoonVector={k_scale:6.3f}  sd_after={resid_after.std():5.1f}\"")
