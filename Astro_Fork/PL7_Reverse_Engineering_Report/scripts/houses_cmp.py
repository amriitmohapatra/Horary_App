import swisseph as swe, sys, json, numpy as np
swe.set_ephe_path(sys.argv[1]); rng=np.random.default_rng(42)
swe.set_sid_mode(swe.SIDM_LAHIRI,0,0)
F=swe.FLG_SIDEREAL
f=1/298.257223563
def geoc(lat): return np.degrees(np.arctan(np.tan(np.radians(lat))*(1-f)**2))
YRS=[7,20,6,10,7,18,16,19,17]  # Ke Ve Su Mo Ma Ra Ju Sa Me
def star_sub(lon):
    a=int(lon*3600)%1296000; n=a//48000; star=n%9; off=a%48000
    i=star; acc=0
    for k in range(9):
        w=YRS[(star+k)%9]*400
        if off<acc+w: return star,(star+k)%9
        acc+=w
places={'Singapore':(1.28333,103.85,8),'Lapanga':(21.70330,84.03139,5.5)}
out={}
for pname,(lat,lon,tz) in places.items():
    d=[];flips_house=0;flips_lat=0;n=0;d_lat=[]
    for _ in range(2000):
        jd=swe.julday(2019,1,1,0)+rng.uniform(0,365.25*8)
        pl=swe.houses_ex(jd,lat,lon,b'P',F)[0]          # PL7: Placidus, geographic latitude
        kc=swe.houses_ex(jd,geoc(lat),lon,b'T',F)[0]    # KC: Topocentric, geocentric latitude
        pg=swe.houses_ex(jd,geoc(lat),lon,b'P',F)[0]    # Placidus with geocentric latitude (isolates lat effect)
        diff=[((a-b+180)%360-180)*3600 for a,b in zip(pl,kc)]
        d.append(diff); d_lat.append([((a-b+180)%360-180)*3600 for a,b in zip(pl,pg)])
        for c in range(12):
            n+=1
            if star_sub(pl[c])!=star_sub(kc[c]): flips_house+=1
    d=np.abs(np.array(d)); d_lat=np.abs(np.array(d_lat))
    out[pname]={'mean_abs_arcsec_by_cusp':d.mean(0).round(1).tolist(),'max_abs_arcsec_by_cusp':d.max(0).round(1).tolist(),
                'lat_only_mean':d_lat.mean(0).round(1).tolist(),'sub_flip_frac':flips_house/n}
    print(pname,'cusp |PL Placidus - KC Topocentric| mean (")',d.mean(0).round(0).astype(int).tolist())
    print(pname,'                         max (")',d.max(0).round(0).astype(int).tolist())
    print(pname,'  geographic vs geocentric latitude alone, mean (")',d_lat.mean(0).round(0).astype(int).tolist())
    print(pname,'  fraction of cusps whose star/sub lord changes:',round(flips_house/n,3))
# ayanamsa effect on sub lords (planets): Lahiri vs PL KP-New (~ -358.7")
for name,delta in [('PL Krishnamurti New vs KC Lahiri',358.7),('PL Krishnamurti (291AD) vs KC Lahiri',27.2),('PL Lahiri vs KC Lahiri',1.4)]:
    lons=rng.uniform(0,360,200000); fl=sum(star_sub(x)!=star_sub(x+delta/3600) for x in lons[:50000])
    out[name]=fl/50000; print(name,'-> fraction of points with a different star/sub lord:',round(fl/50000,4))
json.dump(out,open(sys.argv[2],'w'),indent=1)
