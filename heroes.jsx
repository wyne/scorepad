// heroes.jsx — three swappable hero directions + shared store badges
const { useEffect: useEffectH } = React;

function AppStoreBadge({ big }){
  return (
    <a className={"store-badge"+(big?' big':'')} href="https://apps.apple.com/us/app/scorepad-with-rounds/id1577906063?platform=iphone" target="_blank" rel="noopener noreferrer">
      <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M16.5 1.6c.1 1-.3 2-.9 2.8-.7.8-1.7 1.4-2.7 1.3-.1-1 .4-2 .9-2.7.7-.8 1.8-1.4 2.7-1.4zM19.9 17c-.5 1.2-.8 1.7-1.4 2.7-.9 1.4-2.2 3.1-3.8 3.1-1.4 0-1.8-.9-3.7-.9s-2.3.9-3.7.9c-1.6 0-2.8-1.6-3.7-2.9C1.1 16.7.8 12.2 2.4 9.8c1-1.6 2.7-2.6 4.2-2.6 1.6 0 2.6 1 3.9 1 1.3 0 2-1 3.9-1 1.4 0 2.9.8 3.9 2.1-3.4 1.9-2.9 6.8 1.7 7.7z"/></svg>
      <span><small>Download on the</small><strong>App Store</strong></span>
    </a>
  );
}
function PlayBadge(){
  return (
    <a className="store-badge" href="https://play.google.com/store/apps/details?id=com.wyne.scorepad" target="_blank" rel="noopener noreferrer">
      <svg viewBox="0 0 24 24" width="24" height="24"><path d="M3.6 2.3 13.4 12 3.6 21.7c-.3-.2-.5-.6-.5-1.1V3.4c0-.5.2-.9.5-1.1z" fill="#FBBC04"/><path d="M16.8 8.6 13.4 12l3.4 3.4 3.6-2.1c.8-.5.8-1.6 0-2.1l-3.6-2.6z" fill="#EA4335"/><path d="M3.6 2.3c.3-.2.7-.2 1.1 0l11.9 6.9-3.2 2.8L3.6 2.3z" fill="#34A853"/><path d="m13.4 12 3.2 2.8L4.7 21.7c-.4.2-.8.2-1.1 0L13.4 12z" fill="#4285F4"/></svg>
      <span><small>Get it on</small><strong>Google Play</strong></span>
    </a>
  );
}
function WebBadge(){
  return (
    <a className="store-badge ghost" href="https://wyne.github.io/scorepad-app/" target="_blank" rel="noopener noreferrer">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18"/></svg>
      <span><small>Play in your</small><strong>Browser</strong></span>
    </a>
  );
}
function StoreBadges({ big }){
  return <div className="badge-row">
    <AppStoreBadge big={big}/><PlayBadge/><WebBadge/>
  </div>;
}

/* which app screen shows inside the hero phone */
function PhoneContent({ variant }){
  if (variant === 'board') return <AppBoard/>;
  if (variant === 'grid') return <AppGrid/>;
  return <AppScreen/>;
}

/* ---------------- Hero A: Gesture-first split ---------------- */
function HeroSplit({ phone }){
  return (
    <header className="hero hero-split">
      <div className="wrap hero-split-grid">
        <div className="hero-copy reveal in">
          <span className="eyebrow">iOS · Android · Web</span>
          <h1 className="display hero-h1">Score every point.<br/><span className="hl">Type zero<br/>numbers.</span></h1>
          <p className="hero-lead">Scorepad is the score keeper with <b>no typing</b>. Tap, swipe, or spin the dial to add points in any game — from family rummy to game-night tournaments.</p>
          <StoreBadges big/>
          <div className="hero-note">Free · No account · Works offline · <a href="#support" style={{color:'var(--yellow)', textDecoration:'none', fontWeight:800}}>☕ Support the project</a></div>
        </div>
        <div className="hero-art">
          <div className="hero-glow"></div>
          <div className="phone-float">
            <PhoneFrame width={300}>
              <PhoneContent variant={phone}/>
            </PhoneFrame>
          </div>
          <div className="chip chip-1">No keyboard</div>
          <div className="chip chip-2">Tap · Swipe · Spin</div>
          <div className="chip chip-3">Offline</div>
          <div className="chip chip-4">No ads</div>
          <div className="chip chip-5">Dark mode</div>
          <div className="chip chip-6">Light mode</div>
        </div>
      </div>
    </header>
  );
}

/* ---------------- Hero B: Scoreboard type ---------------- */
function HeroScoreboard({ phone }){
  return (
    <header className="hero hero-board">
      <div className="board-ticker" aria-hidden="true"><div className="board-track">
        {Array.from({length:2}).map((_,k)=>(
          <span key={k}>TAP&nbsp;<i>·</i>&nbsp;SWIPE&nbsp;<i>·</i>&nbsp;DIAL&nbsp;<i>·</i>&nbsp;NO TYPING&nbsp;<i>·</i>&nbsp;</span>
        ))}
      </div></div>
      <div className="wrap board-inner">
        <span className="board-eyebrow">The gesture-first score keeper</span>
        <h1 className="display board-h1">SCORE<br/>WITHOUT<br/>TYPING</h1>
        <p className="board-lead">Add and subtract points with a flick. Three gestures — Tap, Swipe, and the all-new Dial — keep your eyes on the game, not the keyboard.</p>
        <StoreBadges/>
      </div>
      <div className="board-phone">
        <PhoneFrame width={280}><PhoneContent variant={phone}/></PhoneFrame>
      </div>
    </header>
  );
}

/* ---------------- Hero C: Phone showcase ---------------- */
function HeroShowcase({ phone }){
  return (
    <header className="hero hero-show">
      <div className="show-rings" aria-hidden="true"></div>
      <div className="wrap show-inner">
        <span className="eyebrow" style={{justifyContent:'center'}}>The no-typing score keeper</span>
        <h1 className="display show-h1">Every point,<br/>one gesture away.</h1>
        <p className="show-lead">Tap, swipe, or spin the dial. Scorepad makes keeping score so fast it disappears into the game.</p>
        <div className="show-stage">
          <div className="show-pill p-a">No number typing</div>
          <div className="show-pill p-b">Round-by-round history</div>
          <div className="show-pill p-c">Unlimited games</div>
          <div className="show-pill p-d">Custom point steps</div>
          <div className="phone-float">
            <PhoneFrame width={296}><PhoneContent variant={phone}/></PhoneFrame>
          </div>
        </div>
        <StoreBadges big/>
      </div>
    </header>
  );
}

function Hero({ variant, phone }){
  if (variant === 'scoreboard') return <HeroScoreboard phone={phone}/>;
  if (variant === 'showcase') return <HeroShowcase phone={phone}/>;
  return <HeroSplit phone={phone}/>;
}

Object.assign(window, { Hero, StoreBadges, AppStoreBadge, PlayBadge, WebBadge });
