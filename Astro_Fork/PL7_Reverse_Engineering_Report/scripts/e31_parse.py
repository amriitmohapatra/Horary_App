import struct,sys
def series(path):
    e=open(path,'rb').read()
    jd0,jd1=struct.unpack_from('<dd',e,8)
    vals=[]
    for off in range(0,len(e)-8,8):
        v=struct.unpack_from('<d',e,off)[0]
        vals.append((off,v))
    # split into runs of degree-like values with smooth change
    runs=[];cur=[]
    for off,v in vals:
        ok = v==v and -1e-9<=v<360.0001 and off>=200
        if ok and cur and abs(((v-cur[-1][1]+180)%360)-180)<20 and off-cur[-1][0]==8:
            cur.append((off,v))
        else:
            if len(cur)>=10: runs.append(cur)
            cur=[(off,v)] if ok else []
    if len(cur)>=10: runs.append(cur)
    return jd0,jd1,runs
if __name__=='__main__':
    jd0,jd1,runs=series(sys.argv[1])
    print(jd0,jd1)
    for r in runs: print(r[0][0], len(r), round(r[0][1],4), round(r[-1][1],4))

ORDER = ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa", "Ra"]   # inferred from daily motion (see report, Table e31)
def blocks(path):
    """Fixed layout of a PL7 transit-cache month file (*.e31): two doubles (start/end JD, UT) at
    byte 8, then one 64-slot double array per body starting at byte 840 + 512*i, sampled every
    0.5 day from the start JD."""
    import struct
    e = open(path, 'rb').read()
    jd0, jd1 = struct.unpack_from('<dd', e, 8)
    n = int(round((jd1 - jd0) * 2)) + 1
    out = {}
    for i, name in enumerate(ORDER):
        out[name] = list(struct.unpack_from('<%dd' % n, e, 840 + 512 * i))
    return jd0, jd1, out
