import swisseph as swe, sys, json
swe.set_ephe_path(sys.argv[1])
def T1(jd): return (jd-2451545)/36525+1
def lah(jd): T=T1(jd); return 22.46045833333333+(5026.87434*T+1.11113*T*T)/3600
def tp(jd): return (jd-2415020.5)/36524
PL={1:('Lahiri',lah),2:('None (tropical)',lambda jd:0.0),3:('Yukteshwar',lambda jd:tp(jd)*1.5+21.015),
    4:('Raman',lambda jd:tp(jd)*1.398148148+21.013888889),5:('Bhasin',lambda jd:tp(jd)*1.398148148+21.363888889),
    6:('Fagan-Bradley',lambda jd:tp(jd)*1.398148148+23.348888889),7:('Krishnamurti',lambda jd:tp(jd)*1.3955235417+22.453973785),
    8:('Krishnamurti New',lambda jd:tp(jd)*0.0011118+lah(jd)-0.101388)}
SE={1:swe.SIDM_LAHIRI,3:swe.SIDM_YUKTESHWAR,4:swe.SIDM_RAMAN,6:swe.SIDM_FAGAN_BRADLEY,7:swe.SIDM_KRISHNAMURTI,8:swe.SIDM_KRISHNAMURTI}
rows=[]
def dms(x):
    s='-' if x<0 else ''; x=abs(x); d=int(x); m=int((x-d)*60); sec=(x-d-m/60)*3600
    return f"{s}{d}°{m:02d}'{sec:05.2f}\""
for y in [1900,1950,1980,2000,2025,2050]:
    jd=swe.julday(y,1,1,0)
    for k,(name,f) in PL.items():
        v=f(jd); row={'year':y,'sel':k,'name':name,'pl':v,'pl_dms':dms(v)}
        if k in SE:
            swe.set_sid_mode(SE[k],0,0); se=swe.get_ayanamsa(jd+swe.deltat(jd))  # mean-equinox ayanamsa (TT)
            row['se']=se; row['diff_arcsec']=(v-se)*3600
        rows.append(row)
for r in rows:
    print(r['year'],r['sel'],f"{r['name']:17s}",r['pl_dms'], ('  PL-SE = %+8.1f"'%r['diff_arcsec']) if 'se' in r else '')
# KC effective ayanamsa = SE Lahiri - 1.251"
swe.set_sid_mode(swe.SIDM_LAHIRI,0,0)
print()
for y in [2019,2020,2022,2024,2026,2030]:
    jd=swe.julday(y,7,1,0); se=swe.get_ayanamsa(jd+swe.deltat(jd))
    print(y,'PL Lahiri - KC(sf) Lahiri = %+.2f"'%((lah(jd)-(se-1.251/3600))*3600), ' PL KPnew - KC = %+.1f"'%((PL[8][1](jd)-(se-1.251/3600))*3600), ' PL KP(old) - KC = %+.1f"'%((PL[7][1](jd)-(se-1.251/3600))*3600))
json.dump(rows,open(sys.argv[2],'w'),indent=1)
