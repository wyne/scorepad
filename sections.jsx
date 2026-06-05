// sections.jsx — feature sections + footer
const { useRef: useRefS, useEffect: useEffectS, useState: useStateS } = React;

/* ---- section: the three gesture demos ---- */
function GestureSection(){
  return (
    <section className="sec gestures" id="gestures">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">No typing — just gestures</span>
          <h2 className="display sec-h2">Three ways to add a point.</h2>
          <p className="sec-lead">Pick the gesture that fits your game. Every one keeps your hands on the screen and your eyes on the table. <b>Try them — they're live.</b></p>
        </div>
        <div className="demo-grid reveal">
          <TapDemo/><SwipeDemo/><DialDemo/>
        </div>
        <p className="try-hint reveal">↑ Tap, drag, and spin the cards above</p>
      </div>
    </section>
  );
}

/* ---- big statement band: no number typing ---- */
function NoTypingBand(){
  return (
    <section className="sec band">
      <div className="wrap band-grid">
        <div className="reveal">
          <span className="band-eyebrow">No number typing</span>
          <h2 className="display band-h2">Zero<br/>keyboards.</h2>
        </div>
        <div className="band-copy reveal">
          <p>Pop-up keypads slow the whole game down. Scorepad replaces every one of them with a gesture, so scoring takes a single motion — even mid-conversation.</p>
          <ul className="band-list">
            <li>Big, glanceable totals from across the table</li>
            <li>Undo any change without retyping</li>
            <li>Stays out of the way until you need it</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---- wheel picker (mirrors the app's AddendModal wheel pickers) ---- */
function WheelPicker({ values, initial, onSelect }){
  const ref = useRefS(null);
  const ITEM = 46;
  const [sel, setSel] = useStateS(initial);
  useEffectS(()=>{
    const el = ref.current; if(!el) return;
    const target = Math.max(0, values.indexOf(initial)) * ITEM;
    const set = ()=>{
      el.style.scrollSnapType = 'none';
      el.scrollTop = target;
      requestAnimationFrame(()=>{ el.style.scrollSnapType = 'y mandatory'; });
    };
    const io = new IntersectionObserver((ents)=>{
      ents.forEach(e=>{ if(e.isIntersecting){ set(); io.unobserve(el); } });
    }, { threshold:0.4 });
    io.observe(el);
    return ()=> io.disconnect();
  }, []);
  const onScroll = ()=>{
    const idx = Math.round(ref.current.scrollTop / ITEM);
    const v = values[Math.max(0, Math.min(values.length-1, idx))];
    if (v !== sel){ setSel(v); onSelect && onSelect(v); try{ navigator.vibrate && navigator.vibrate(5); }catch(e){} }
  };
  return (
    <div className="wheel">
      <div className="wheel-band"></div>
      <div className="wheel-fade top"></div>
      <div className="wheel-fade bottom"></div>
      <div className="wheel-scroll" ref={ref} onScroll={onScroll}>
        <div className="wheel-pad"></div>
        {values.map(v => <div key={v} className={"wheel-item"+(v===sel?' sel':'')}>{v}</div>)}
        <div className="wheel-pad"></div>
      </div>
    </div>
  );
}

/* ---- feature: point values (resembles AddendModal) ---- */
function PointValuesFeature(){
  const [mode, setMode] = useStateS('tap');
  const labels = {
    tap:   ['Single Tap', 'Long Press'],
    swipe: ['Swipe', 'Hold + Swipe'],
    dial:  ['Drag', 'Hold'],
  };
  const nums = Array.from({length:30}, (_,i)=>i+1);
  const [base, hold] = labels[mode];
  return (
    <section className="sec feat" id="features">
      <div className="wrap feat-grid">
        <div className="feat-copy reveal">
          <span className="eyebrow">Custom point values</span>
          <h2 className="display feat-h2">One value to tap,<br/>another to hold.</h2>
          <p>Every gesture carries two point values. A quick tap, swipe, or dial-turn adds the base amount; <b>hold first</b> to add the bigger one — so a +1 game and a +25 game use the exact same moves.</p>
          <div className="seg" role="tablist">
            {['tap','swipe','dial'].map(m => (
              <button key={m} className={"seg-btn"+(mode===m?' on':'')} onClick={()=>setMode(m)}>{m[0].toUpperCase()+m.slice(1)}</button>
            ))}
          </div>
        </div>
        <div className="feat-visual reveal">
          <div className="pv-sheet">
            <div className="pv-handle"></div>
            <div className="pv-title">Point Values</div>
            <div className="pv-wheels">
              <div className="pv-col">
                <div className="pv-label">{base}</div>
                <WheelPicker values={nums} initial={1} />
              </div>
              <div className="pv-col">
                <div className="pv-label">{hold}</div>
                <WheelPicker values={nums} initial={10} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- feature: score history, inspired by the app's Rounds Table ---- */
function HistoryFeature(){
  const players = [
    { name:'Summer', total:47, color:'var(--pc-yellow)' },
    { name:'Morty', total:93, color:'var(--pc-blue)' },
    { name:'Beth', total:61, color:'var(--pc-red)' },
  ];
  const rounds = [
    { r:16, v:[2, 8, 5], live:true },
    { r:15, v:[11, 3, 9] },
    { r:14, v:[5, 9, 7] },
    { r:13, v:[7, 1, 12] },
    { r:12, v:[9, 14, 4] },
  ];
  return (
    <section className="sec feat alt">
      <div className="wrap feat-grid">
        <div className="feat-visual reveal">
          <div className="rt">
            <div className="rt-grid rt-head">
              <span className="rt-corner">RD</span>
              {players.map(p => (
                <span key={p.name} className="rt-player">
                  <span className="rt-chip" style={{ background:p.color }}></span>
                  {p.name}
                </span>
              ))}
            </div>
            <div className="rt-grid rt-totals">
              <span className="rt-corner">∑</span>
              {players.map(p => <span key={p.name} className="rt-total">{p.total}</span>)}
            </div>
            <div className="rt-body">
              {rounds.map(o=>(
                <div key={o.r} className={"rt-grid rt-row"+(o.live?' live':'')}>
                  <span className="rt-rd">{o.r}</span>
                  {o.v.map((n,i)=><span key={i} className="rt-cell">+{n}</span>)}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="feat-copy reveal">
          <span className="eyebrow">Round-by-round history</span>
          <h2 className="display feat-h2">The whole game, in one grid.</h2>
          <p>Every round for every player lands in a running table you can scroll back through — settle a dispute, spot a comeback, or jump to any round to fix a score.</p>
        </div>
      </div>
    </section>
  );
}

/* ---- feature: multiple games ---- */
function GamesFeature(){
  const games = [
    { name:'Smith Family Rummy', players:4, rounds:16, live:true, color:'var(--pc-yellow)' },
    { name:'Friday Cribbage', players:2, rounds:9, color:'var(--pc-green)' },
    { name:'Catan Night', players:5, rounds:1, color:'var(--pc-orange)' },
  ];
  return (
    <section className="sec feat">
      <div className="wrap feat-grid">
        <div className="feat-copy reveal">
          <span className="eyebrow">Unlimited games</span>
          <h2 className="display feat-h2">Keep every game going.</h2>
          <p>Run as many games as you like, side by side. Jump back into last week's tournament or start a fresh table in seconds — nothing gets lost.</p>
        </div>
        <div className="feat-visual reveal">
          <div className="games-stack">
            {games.map((g,i)=>(
              <div key={g.name} className={"game-card"+(g.live?' live':'')}>
                <span className="game-stripe" style={{ background:g.color }}></span>
                <div className="game-card-main">
                  <div className="game-name">{g.name}</div>
                  <div className="game-meta">{g.players} players · {g.rounds} {g.rounds===1?'round':'rounds'}</div>
                </div>
                {g.live ? <span className="game-badge">In play</span> : <span className="game-arrow">›</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- final CTA ---- */
function FinalCTA(){
  return (
    <section className="sec cta">
      <div className="wrap cta-inner reveal">
        <img className="cta-icon" src="assets/app-icon.webp" alt="Scorepad app icon" width="96" height="96"/>
        <h2 className="display cta-h2">Score your next<br/>game with a flick.</h2>
        <p>Free to play. No account needed. Works offline, on every device.</p>
        <StoreBadges/>
      </div>
    </section>
  );
}

/* ---- footer ---- */
function Footer(){
  return (
    <footer className="footer">
      <div className="wrap foot-grid">
        <div className="foot-brand"><Wordmark/><p>The gesture-first score keeper for board games, card games, and game nights.</p></div>
        <div className="foot-cols">
          <div><h4>App</h4><a href="#gestures">Gestures</a><a href="#features">Features</a><a href="#get">What's new</a></div>
          <div><h4>Get it</h4><a href="https://apps.apple.com/us/app/scorepad-with-rounds/id1577906063?platform=iphone" target="_blank" rel="noopener noreferrer">App Store</a><a href="https://play.google.com/store/apps/details?id=com.wyne.scorepad" target="_blank" rel="noopener noreferrer">Google Play</a><a href="https://wyne.github.io/scorepad-app/" target="_blank" rel="noopener noreferrer">Web app</a></div>
          <div><h4>More</h4><a href="mailto:scorepad@justinwyne.com">Support</a><a href="privacy.html">Privacy</a><a href="https://github.com/wyne/scorepad-react-native" target="_blank" rel="noopener noreferrer">GitHub</a></div>
        </div>
      </div>
      <div className="wrap foot-base"><span>© 2026 Scorepad with rounds</span><span>Made for game night.</span></div>
    </footer>
  );
}

function Wordmark(){
  return (
    <span className="wordmark"><img className="wm-icon" src="assets/app-icon.webp" alt="Scorepad with rounds app icon" width="36" height="36"/><span className="wm-lockup"><span className="wm-name">Scorepad</span><span className="wm-sub">with rounds</span></span></span>
  );
}

Object.assign(window, { GestureSection, NoTypingBand, PointValuesFeature, HistoryFeature, GamesFeature, FinalCTA, Footer, Wordmark });
