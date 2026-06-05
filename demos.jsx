// demos.jsx — three interactive gesture demos: Tap, Swipe, Dial
const { useState, useRef, useEffect, useCallback } = React;

const haptic = () => { try { navigator.vibrate && navigator.vibrate(8); } catch(e){} };

/* shared card shell for a gesture demo */
function DemoCard({ tag, title, sub, isNew, children, active, onActivate }) {
  return (
    <div className="demo-card" onPointerDown={onActivate}>
      <div className="demo-head">
        <span className="demo-tag">{tag}</span>
        {isNew && <span className="demo-new">NEW</span>}
      </div>
      <div className="demo-stage">{children}</div>
      <div className="demo-foot">
        <div className="demo-title">{title}</div>
        <div className="demo-sub">{sub}</div>
      </div>
    </div>
  );
}

/* floating delta chips */
function useFloaters(){
  const [items, setItems] = useState([]);
  const idRef = useRef(0);
  const push = (text, x=50) => {
    const id = ++idRef.current;
    setItems(s => [...s, { id, text, x }]);
    setTimeout(() => setItems(s => s.filter(i => i.id !== id)), 850);
  };
  const node = (
    <div className="floaters">
      {items.map(i => (
        <span key={i.id} className="floater" style={{ left:`${i.x}%`, color: i.text.startsWith('−')||i.text.startsWith('-') ? '#b3000f' : '#0c0c0d' }}>{i.text}</span>
      ))}
    </div>
  );
  return [node, push];
}

/* ============================ TAP ============================ */
// Tap the TOP half of the tile to add, the BOTTOM half to subtract.
function TapDemo(){
  const [total, setTotal] = useState(46);
  const [bounce, setBounce] = useState(0);
  const [touched, setTouched] = useState(false);
  const [flash, setFlash] = useState(null);   // 'top' | 'bottom'
  const [ripples, setRipples] = useState([]);
  const rid = useRef(0);
  const tileRef = useRef(null);

  const addRipple = (half, x, y) => {
    const id = ++rid.current;
    setRipples(r => [...r, { id, half, x, y }]);
    setTimeout(()=> setRipples(r => r.filter(p => p.id !== id)), 620);
  };

  const hit = (half, x=50, y=50) => {
    const d = half === 'top' ? 1 : -1;
    setTotal(t => Math.max(0, t + d));
    setBounce(b => b + 1);
    setFlash(half); setTimeout(()=>setFlash(null), 200);
    addRipple(half, x, y);
    haptic();
  };

  const onTap = (e) => {
    setTouched(true);
    const r = tileRef.current.getBoundingClientRect();
    const y = e.clientY - r.top;
    const half = y < r.height/2 ? 'top' : 'bottom';
    hit(half, ((e.clientX - r.left)/r.width)*100, (y/r.height)*100);
  };

  // autoplay: tap top a few times, then bottom
  useEffect(() => {
    if (touched) return;
    const seq = ['top','top','top','bottom','top','top'];
    let i = 0;
    const id = setInterval(()=>{ const h = seq[i++ % seq.length]; hit(h, 50, h==='top'?26:74); }, 1100);
    return () => clearInterval(id);
  }, [touched]);

  return (
    <DemoCard tag="Tap" title="Tap to count" sub="Tap the top half to add, the bottom half to subtract. Long-press a half to use the bigger value." onActivate={()=>setTouched(true)}>
      <div ref={tileRef} className="tap-tile" onPointerDown={onTap}>
        <div className={"tap-half top"+(flash==='top'?' on':'')}>
          <span className="tap-mark">+</span>
        </div>
        <div className={"tap-half bottom"+(flash==='bottom'?' on':'')}>
          <span className="tap-mark">−</span>
        </div>
        <div className="tap-center">
          <div className="tile-name">Summer</div>
          <div className={"tile-num"+(bounce?' pop':'')} key={bounce}>{total}</div>
          <div className="tile-cap">TOTAL</div>
        </div>
        {ripples.map(p => (
          <span key={p.id} className={"tap-ripple "+p.half} style={{ left:p.x+'%', top:p.y+'%' }}></span>
        ))}
      </div>
    </DemoCard>
  );
}

/* ============================ SWIPE ============================ */
function SwipeDemo(){
  const PER = 26; // px per point
  const [base, setBase] = useState(46);
  const [delta, setDelta] = useState(0);
  const [drag, setDrag] = useState(false);
  const [touched, setTouched] = useState(false);
  const [hintY, setHintY] = useState(0);
  const startY = useRef(0);
  const padRef = useRef(null);

  const commit = () => {
    setBase(b => Math.max(0, b + delta));
    setDelta(0);
  };

  const onDown = (e) => {
    setTouched(true); setDrag(true);
    startY.current = e.clientY;
    padRef.current?.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e) => {
    if (!drag) return;
    const dy = startY.current - e.clientY;
    const d = Math.round(dy / PER);
    if (d !== delta) haptic();
    setDelta(d);
  };
  const onUp = () => { if(drag){ setDrag(false); commit(); } };

  // autoplay: animate a swipe up then down
  useEffect(() => {
    if (touched) return;
    let raf, t0=null, phase=0;
    const dur = 1400;
    const loop = (ts) => {
      if (t0===null) t0=ts;
      let p = ((ts - t0) % (dur*2)) / dur;
      let up = p < 1;
      let k = up ? p : (2 - p);
      const ease = k<.5 ? 2*k*k : 1-Math.pow(-2*k+2,2)/2;
      const px = ease * 92;
      setHintY(px);
      setDelta(Math.round(px / PER) * (up?1:1));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [touched]);

  useEffect(()=>{ if(touched) setHintY(0); },[touched]);

  const shown = Math.max(0, base + delta);
  return (
    <DemoCard tag="Swipe" title="Swipe to add" sub="Swipe up to add, down to subtract. Hold first, then swipe, to jump in bigger steps." onActivate={()=>setTouched(true)}>
      <div ref={padRef} className={"swipe-pad"+(drag?' grab':'')}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        <div className="swipe-chev up">▲</div>
        <div className="tile bare">
          <div className="tile-name">Summer</div>
          <div className="tile-num">{shown}</div>
          <div className="tile-cap">TOTAL</div>
        </div>
        <div className="swipe-chev down">▼</div>
        {delta!==0 && <div className={"swipe-delta "+(delta>0?'pos':'neg')}>{delta>0?'+':'−'}{Math.abs(delta)}</div>}
        <div className="swipe-thumb" style={{ transform:`translateX(-50%) translateY(${-hintY + 40}px)`, opacity: touched?0:1 }}>
          <Thumb/>
        </div>
      </div>
    </DemoCard>
  );
}

/* ============================ DIAL ============================ */
function DialDemo(){
  const prev = 45;
  const [val, setVal] = useState(2);          // points this round
  const [drag, setDrag] = useState(false);
  const [touched, setTouched] = useState(false);
  const ringRef = useRef(null);
  const lastAngle = useRef(null);
  const accum = useRef(0);

  const angleAt = (e) => {
    const r = ringRef.current.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    return Math.atan2(e.clientY - cy, e.clientX - cx) * 180/Math.PI;
  };
  const onDown = (e) => {
    setTouched(true); setDrag(true);
    lastAngle.current = angleAt(e);
    ringRef.current?.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e) => {
    if(!drag) return;
    const a = angleAt(e);
    let diff = a - lastAngle.current;
    if (diff > 180) diff -= 360; if (diff < -180) diff += 360;
    lastAngle.current = a;
    accum.current += diff;
    const STEP = 15; // deg per point (== one tick)
    while (Math.abs(accum.current) >= STEP){
      const dir = accum.current > 0 ? 1 : -1;
      accum.current -= dir*STEP;
      setVal(v => v + dir);
      haptic();
    }
  };
  const onUp = () => setDrag(false);

  // autoplay rotate
  useEffect(()=>{
    if (touched) return;
    let dir = 1, id = setInterval(()=>{
      setVal(v=>{
        let nv = v + dir;
        if (nv >= 8) dir = -1;
        if (nv <= -2) dir = 1;
        return nv;
      });
      haptic();
    }, 520);
    return ()=>clearInterval(id);
  },[touched]);

  // the whole wheel rotates; each point = one tick (15°)
  const rotation = val * 15;
  const sign = val>=0?'+':'−';

  return (
    <DemoCard tag="Dial" title="Dial it in" isNew sub="Spin the ring to add or subtract step by step — or hold to switch to the bigger value." onActivate={()=>setTouched(true)}>
      <div className="dial-prev"><b>{prev}</b><span>PREVIOUS</span></div>
      <div ref={ringRef} className={"dial-wrap"+(drag?' grab':'')}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        <div className="dial-ring">
          <span className="dial-pointer"></span>
          <div className="dial-ticks" style={{ transform:`rotate(${rotation}deg)` }}>
            {Array.from({length:24}).map((_,i)=>{
              const long = i%6===0;
              return <span key={i} className={"dial-tick"+(long?' long':'')} style={{ transform:`translate(-50%,-50%) rotate(${i*15}deg) translateY(-86px)` }}></span>;
            })}
          </div>
          <div className="dial-core">
            <div className="dial-val">{sign}{Math.abs(val)}</div>
            <div className="dial-cap">THIS ROUND</div>
          </div>
        </div>
        <span className="dial-rot tl" aria-hidden="true">▲</span>
        <span className="dial-rot tr" aria-hidden="true">▲</span>
      </div>
      <div className="dial-total"><b>{Math.max(0,prev+val)}</b><span>NEW TOTAL</span></div>
    </DemoCard>
  );
}

function Thumb(){
  return (
    <svg width="46" height="60" viewBox="0 0 46 60" fill="none">
      <ellipse cx="23" cy="50" rx="15" ry="7" fill="rgba(0,0,0,.16)"/>
      <path d="M16 44V24c0-3 2-5 5-5s5 2 5 5v8h6c4 0 7 3 7 7v4c0 4-3 8-8 8H22c-3 0-6-3-6-7z" fill="#1a1a1b"/>
      <circle cx="21" cy="20" r="9" fill="#fff" stroke="#1a1a1b" strokeWidth="2.5"/>
    </svg>
  );
}

Object.assign(window, { TapDemo, SwipeDemo, DialDemo });
