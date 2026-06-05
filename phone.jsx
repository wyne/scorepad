// phone.jsx — iOS device frame + faithful recreation of Scorepad's score screen
// Exports: PhoneFrame, AppScreen, DialFace
const { useState, useRef, useEffect } = React;

/* ----- the dark notched ring with tick marks, like the app ----- */
function DialFace({ size = 230, value = "+2", caption = "THIS ROUND", thickness = 0.27 }) {
  const ticks = [];
  for (let i = 0; i < 24; i++) {
    const ang = (i / 24) * 360;
    const long = i % 6 === 0;
    ticks.push(
      <div key={i} style={{
        position:'absolute', left:'50%', top:'50%',
        width: long ? 4 : 3, height: long ? 16 : 9,
        background: long ? 'rgba(199,190,150,.9)' : 'rgba(150,142,108,.7)',
        borderRadius: 3,
        transform:`translate(-50%,-50%) rotate(${ang}deg) translateY(-${size*0.40}px)`,
        transformOrigin:'center',
      }}/>
    );
  }
  return (
    <div style={{ width:size, height:size, position:'relative', margin:'0 auto' }}>
      <div style={{
        position:'absolute', inset:0, borderRadius:'50%',
        background:'var(--ring)',
        boxShadow:'inset 0 2px 10px rgba(0,0,0,.5)',
      }}/>
      {ticks}
      <div style={{
        position:'absolute', inset:`${thickness*100}%`, borderRadius:'50%',
        background:'var(--yellow)', display:'grid', placeItems:'center',
        boxShadow:'0 6px 18px rgba(0,0,0,.18) inset',
      }}>
        <div style={{ textAlign:'center', lineHeight:1 }}>
          <div style={{ fontSize:size*0.27, fontWeight:900, color:'#0c0c0d', letterSpacing:'-.02em' }}>{value}</div>
          <div style={{ fontSize:size*0.058, fontWeight:800, letterSpacing:'.16em', color:'var(--gold-muted)', marginTop:8 }}>{caption}</div>
        </div>
      </div>
    </div>
  );
}

/* ----- full app screen (static showcase; pass props to vary) ----- */
function AppScreen({ name="Summer", prev=45, round="Round 16", step="STEP +1", thisRound="+2", newTotal=47, dial }) {
  return (
    <div className="app-screen" style={{ position:'absolute', inset:0, background:'#0b0b0c', display:'flex', flexDirection:'column' }}>
      {/* status bar */}
      <div style={{ height:54, flex:'0 0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px 0 36px', color:'#fff', fontWeight:700, fontSize:17 }}>
        <span>1:55</span>
        <span style={{ display:'flex', gap:7, alignItems:'center', opacity:.95 }}>
          <Signal/><Wifi/><Battery/>
        </span>
      </div>
      {/* nav */}
      <div style={{ flex:'0 0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'4px 18px 12px' }}>
        <div style={{ width:46, height:46, borderRadius:'50%', background:'#202021', display:'grid', placeItems:'center', color:'#fff', fontSize:22, fontWeight:800 }}>‹</div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <span style={{ color:'var(--blue)', fontSize:24, fontWeight:800 }}>←</span>
          <span style={{ color:'#fff', fontSize:21, fontWeight:700, whiteSpace:'nowrap' }}>{round}</span>
          <span style={{ color:'var(--blue)', fontSize:24, fontWeight:800 }}>→</span>
        </div>
        <div style={{ height:42, padding:'0 12px', borderRadius:22, background:'#202021', display:'flex', alignItems:'center', gap:7, color:'#fff' }}>
          <span style={{ fontSize:11, fontWeight:800, lineHeight:.95, textAlign:'center' }}>1<br/>10</span>
          <span style={{ fontSize:17 }}>☼</span>
        </div>
      </div>
      {/* peeking player row */}
      <div style={{ margin:'0 14px', background:'var(--navy)', borderRadius:'16px 16px 0 0', padding:'14px 22px 26px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ color:'#5b6470', fontSize:30, fontWeight:800 }}>Morty</span>
        <span style={{ textAlign:'right', lineHeight:1 }}>
          <div style={{ color:'#cfd6dd', fontSize:30, fontWeight:900 }}>93</div>
          <div style={{ color:'#5b6470', fontSize:10, fontWeight:800, letterSpacing:'.15em' }}>TOTAL</div>
        </span>
      </div>
      {/* yellow sheet */}
      <div style={{ flex:'1 1 auto', margin:'-12px 6px 0', background:'var(--yellow)', borderRadius:'26px', padding:'14px 22px 18px', display:'flex', flexDirection:'column', alignItems:'center', position:'relative' }}>
        <div style={{ width:42, height:5, borderRadius:5, background:'rgba(0,0,0,.22)', marginBottom:6 }}/>
        <div style={{ fontSize:38, fontWeight:900, color:'#0c0c0d', letterSpacing:'-.02em' }}>{name}</div>
        <div style={{ fontSize:30, fontWeight:900, color:'#0c0c0d', marginTop:2 }}>{prev}</div>
        <div style={{ fontSize:11, fontWeight:800, letterSpacing:'.16em', color:'var(--gold-muted)' }}>PREVIOUS TOTAL</div>
        <div style={{ marginTop:12, background:'rgba(0,0,0,.12)', borderRadius:999, padding:'8px 18px', display:'flex', alignItems:'center', gap:9, color:'#0c0c0d', fontWeight:800, fontSize:15 }}>
          <span style={{ width:9, height:9, borderRadius:'50%', background:'var(--gold-pill)' }}/>{step}
        </div>
        <div style={{ margin:'14px 0 6px' }}>{dial || <DialFace size={188} value={thisRound}/>}</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:18, marginTop:2 }}>
          <div style={{ width:74, height:62, borderRadius:16, background:'rgba(0,0,0,.1)', display:'grid', placeItems:'center', fontSize:26, fontWeight:900, color:'#0c0c0d' }}>−1</div>
          <div style={{ textAlign:'center', lineHeight:1 }}>
            <div style={{ fontSize:46, fontWeight:900, color:'#0c0c0d' }}>{newTotal}</div>
            <div style={{ fontSize:11, fontWeight:800, letterSpacing:'.14em', color:'var(--gold-muted)', marginTop:3 }}>NEW TOTAL</div>
          </div>
          <div style={{ width:74, height:62, borderRadius:16, background:'rgba(0,0,0,.1)', display:'grid', placeItems:'center', fontSize:26, fontWeight:900, color:'#0c0c0d' }}>+1</div>
        </div>
        <button style={{ marginTop:'auto', width:'100%', background:'rgba(0,0,0,.1)', border:'none', borderRadius:16, padding:'16px', fontSize:21, fontWeight:900, color:'#0c0c0d', fontFamily:'inherit' }}>Done</button>
      </div>
      {/* bottom tab peek */}
      <div style={{ flex:'0 0 auto', background:'#0b0b0c', padding:'10px 0 8px', textAlign:'center' }}>
        <div style={{ color:'#fff', fontSize:18, fontWeight:800, padding:'10px 0 6px' }}>Smith Family Rummy</div>
        <div style={{ width:130, height:5, borderRadius:5, background:'#fff', margin:'2px auto 0' }}/>
      </div>
    </div>
  );
}

/* ----- shared chrome bits ----- */
const PC = { blue:'#01497c', red:'#c25858', yellow:'#f5c800', green:'#275436', orange:'#dc902c' };
const inkOn = (c) => (c===PC.yellow || c===PC.orange) ? '#0b0b0c' : '#ffffff';

function StatusRow(){
  return (
    <div style={{ height:54, flex:'0 0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px 0 36px', color:'#fff', fontWeight:700, fontSize:17 }}>
      <span>1:55</span>
      <span style={{ display:'flex', gap:7, alignItems:'center', opacity:.95 }}><Signal/><Wifi/><Battery/></span>
    </div>
  );
}
function TabPeek({ label }){
  return (
    <div style={{ flex:'0 0 auto', background:'#0b0b0c', padding:'10px 0 8px', textAlign:'center' }}>
      <div style={{ color:'#fff', fontSize:18, fontWeight:800, padding:'10px 0 6px' }}>{label}</div>
      <div style={{ width:130, height:5, borderRadius:5, background:'#fff', margin:'2px auto 0' }}/>
    </div>
  );
}

/* ----- list board (Dial mode) ----- */
function AppBoard(){
  const rows = [
    { name:'Morty', total:93, color:PC.blue },
    { name:'Beth', total:391, color:PC.red },
    { name:'Summer', color:PC.yellow, live:true, prev:45, rnd:2, total:47 },
    { name:'Jerry', total:44, color:PC.green },
  ];
  return (
    <div className="app-screen" style={{ position:'absolute', inset:0, background:'#0b0b0c', display:'flex', flexDirection:'column' }}>
      <StatusRow/>
      <div style={{ flex:'0 0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'4px 18px 14px' }}>
        <div style={{ width:46, height:46, borderRadius:'50%', background:'#202021', display:'grid', placeItems:'center', color:'#fff', fontSize:22, fontWeight:800 }}>‹</div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <span style={{ color:'var(--blue)', fontSize:24, fontWeight:800 }}>←</span>
          <span style={{ color:'#fff', fontSize:21, fontWeight:700, whiteSpace:'nowrap' }}>Round 16</span>
          <span style={{ color:'var(--blue)', fontSize:24, fontWeight:800 }}>→</span>
        </div>
        <div style={{ height:42, padding:'0 12px', borderRadius:22, background:'#202021', display:'flex', alignItems:'center', gap:7, color:'#fff' }}>
          <span style={{ fontSize:11, fontWeight:800, lineHeight:.95, textAlign:'center' }}>1<br/>10</span>
          <span style={{ fontSize:17 }}>☼</span>
        </div>
      </div>
      <div style={{ flex:'1 1 auto', padding:'2px 16px', display:'flex', flexDirection:'column', gap:12 }}>
        {rows.map(r=>{
          const ink = inkOn(r.color);
          return (
            <div key={r.name} style={{
              background:r.color, borderRadius:20, padding:'17px 16px', minHeight:66,
              display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, color:ink,
              boxShadow: r.live ? 'inset 0 0 0 2px rgba(0,0,0,.32), 0 0 0 3px var(--yellow), 0 12px 30px -10px rgba(245,200,0,.5)' : 'none'
            }}>
              <span style={{ fontSize:r.live?20:24, fontWeight:900, letterSpacing:'-.01em', whiteSpace:'nowrap' }}>{r.name}</span>
              {r.live ? (
                <span style={{ display:'flex', alignItems:'flex-end', gap:7 }}>
                  <span style={{ textAlign:'center', lineHeight:1 }}><div style={{ fontSize:16, fontWeight:900, opacity:.6 }}>{r.prev}</div><div style={{ fontSize:8, fontWeight:800, letterSpacing:'.1em', opacity:.7, marginTop:3 }}>PREV</div></span>
                  <span style={{ fontSize:15, fontWeight:800, opacity:.5, paddingBottom:9 }}>+</span>
                  <span style={{ textAlign:'center', lineHeight:1 }}><div style={{ fontSize:16, fontWeight:900, opacity:.6 }}>{r.rnd}</div><div style={{ fontSize:8, fontWeight:800, letterSpacing:'.1em', opacity:.7, marginTop:3 }}>RND</div></span>
                  <span style={{ fontSize:15, fontWeight:800, opacity:.5, paddingBottom:9 }}>=</span>
                  <span style={{ textAlign:'center', lineHeight:1 }}><div style={{ fontSize:23, fontWeight:900 }}>{r.total}</div><div style={{ fontSize:8, fontWeight:800, letterSpacing:'.1em', opacity:.7, marginTop:3 }}>TOTAL</div></span>
                </span>
              ) : (
                <span style={{ textAlign:'right', lineHeight:1 }}><div style={{ fontSize:27, fontWeight:900 }}>{r.total}</div><div style={{ fontSize:9, fontWeight:800, letterSpacing:'.14em', opacity:.7, marginTop:3 }}>TOTAL</div></span>
              )}
            </div>
          );
        })}
      </div>
      <TabPeek label="Smith Family Rummy"/>
    </div>
  );
}

/* ----- tile grid (Tap / Swipe mode) ----- */
function AppGrid(){
  const tiles = [
    { name:'Rick', color:PC.blue, prev:7, rnd:1, total:8 },
    { name:'Morty', color:PC.red, prev:4, rnd:1, total:5 },
    { name:'Summer', color:PC.yellow, prev:5, rnd:1, total:6 },
    { name:'Beth', color:PC.green, prev:3, rnd:2, total:5 },
    { name:'Jerry', color:PC.orange, prev:0, rnd:0, total:0, wide:true },
  ];
  return (
    <div className="app-screen" style={{ position:'absolute', inset:0, background:'#0b0b0c', display:'flex', flexDirection:'column' }}>
      <StatusRow/>
      <div style={{ flex:'0 0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'4px 20px 14px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:18, color:'var(--blue)' }}>
          <svg width="22" height="15" viewBox="0 0 20 14" stroke="#0A84FF" strokeWidth="2.2" strokeLinecap="round"><path d="M1 1h18M1 7h18M1 13h18"/></svg>
          <svg width="19" height="19" viewBox="0 0 18 18" stroke="#0A84FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"><path d="M7 2H2v5M11 16h5v-5M2 2l6 6M16 16l-6-6"/></svg>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <span style={{ color:'var(--blue)', fontSize:24, fontWeight:800 }}>‹</span>
          <span style={{ color:'#fff', fontSize:21, fontWeight:700 }}>Round 4</span>
          <span style={{ color:'var(--blue)', fontSize:24, fontWeight:800 }}>›</span>
        </div>
        <span style={{ color:'var(--blue)', fontSize:18, fontWeight:800 }}>1, 10</span>
      </div>
      <div style={{ flex:'1 1 auto', padding:'2px 16px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, gridAutoRows:'1fr' }}>
        {tiles.map(t=>{
          const ink = inkOn(t.color);
          return (
            <div key={t.name} style={{
              background:t.color, color:ink, borderRadius:20, padding:16,
              gridColumn: t.wide ? '1 / -1' : 'auto',
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center'
            }}>
              <div style={{ fontSize:24, fontWeight:900, lineHeight:1 }}>{t.name}</div>
              {!t.wide && <div style={{ fontSize:17, fontWeight:700, opacity:.65, margin:'9px 0 5px' }}>{t.prev} + {t.rnd}</div>}
              <div style={{ fontSize:38, fontWeight:900, lineHeight:1 }}>{t.total}</div>
            </div>
          );
        })}
      </div>
      <TabPeek label="Family Game Night"/>
    </div>
  );
}

/* ----- device bezel ----- */
function PhoneFrame({ children, width=320, scale=1, glow=true }) {
  const ratio = 2.16; // ~iPhone
  const h = width * ratio;
  return (
    <div style={{ width, height:h, transform:`scale(${scale})`, position:'relative', filter: glow ? 'drop-shadow(0 40px 80px rgba(0,0,0,.55))' : 'none' }}>
      <div style={{ position:'absolute', inset:0, borderRadius:54, background:'linear-gradient(160deg,#3a3a3c,#0d0d0e 60%)', padding:11 }}>
        <div style={{ position:'absolute', inset:0, borderRadius:54, boxShadow:'inset 0 0 0 2px rgba(255,255,255,.06)' }}/>
        <div style={{ width:'100%', height:'100%', borderRadius:44, overflow:'hidden', position:'relative', background:'#000' }}>
          {children}
          {/* dynamic island */}
          <div style={{ position:'absolute', top:11, left:'50%', transform:'translateX(-50%)', width:'34%', height:30, background:'#000', borderRadius:20, zIndex:5 }}/>
        </div>
      </div>
    </div>
  );
}

/* tiny status icons */
function Signal(){return <svg width="18" height="13" viewBox="0 0 18 13"><g fill="#fff">{[0,1,2,3].map(i=><rect key={i} x={i*5} y={9-i*3} width="3.4" height={4+i*3} rx="1"/>)}</g></svg>;}
function Wifi(){return <svg width="17" height="13" viewBox="0 0 17 13" fill="none"><path d="M8.5 11.5l1.6-2c-.9-.7-2.3-.7-3.2 0l1.6 2z" fill="#fff"/><path d="M3.2 6.1c3-2.6 8.6-2.6 11.6 0M5.3 8.6c1.9-1.6 4.8-1.6 6.7 0" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>;}
function Battery(){return <svg width="27" height="13" viewBox="0 0 27 13"><rect x="1" y="1" width="22" height="11" rx="3" fill="none" stroke="#fff" strokeOpacity=".5"/><rect x="3" y="3" width="18" height="7" rx="1.5" fill="#fff"/><rect x="24.5" y="4.5" width="1.8" height="4" rx="1" fill="#fff" fillOpacity=".5"/></svg>;}

Object.assign(window, { PhoneFrame, AppScreen, AppBoard, AppGrid, DialFace });
