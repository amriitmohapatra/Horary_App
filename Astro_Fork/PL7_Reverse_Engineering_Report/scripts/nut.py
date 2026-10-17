import sys; sys.path.insert(0,sys.argv[1]); from e31_parse import series
import swisseph as swe, numpy as np
swe.set_ephe_path(sys.argv[2])
for path in sys.argv[3:]:
    jd0,jd1,runs=series(path); B={r[0][0]:np.array([v for _,v in r]) for r in runs}
    def lah(jd):
        T=(jd-2451545)/36525+1; return 22.46045833333333+(5026.87434*T+1.11113*T*T)/3600
    for off,body,name in [(1352,1,'Mo'),(4424,11,'Ra'),(2888,5,'Ju'),(3912,6,'Sa')]:
        s=B[off]; r1=[];r2=[];nut=[]
        for k in range(63):
            t=jd0+0.5*k
            x,_=swe.calc_ut(t,body); xn,_=swe.calc_ut(t,body,swe.FLG_SWIEPH|swe.FLG_NONUT)
            r1.append((((x[0]-lah(t)-s[k])+180)%360-180)*3600); r2.append((((xn[0]-lah(t)-s[k])+180)%360-180)*3600)
            nut.append(swe.calc_ut(t,swe.ECL_NUT)[0][2]*3600)
        r1=np.array(r1); r2=np.array(r2)
        print(path[-10:],name,'apparent:',round(r1.mean(),2),round(r1.std(),2),' NONUT:',round(r2.mean(),2),round(r2.std(),2),' dpsi',round(np.mean(nut),2))
