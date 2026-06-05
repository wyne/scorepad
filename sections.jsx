// sections.jsx — feature sections + footer
const { useRef: useRefS, useEffect: useEffectS, useState: useStateS } = React;

/* ---- section: the three gesture demos ---- */
function GestureSection() {
  return (
    <section className="sec gestures" id="gestures">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">No typing — just gestures</span>
          <h2 className="display sec-h2">Three ways to add a point.</h2>
          <p className="sec-lead">
            Pick the gesture that fits your game. Every one keeps your hands on
            the screen and your eyes on the table.{" "}
            <b>Try them — they're live.</b>
          </p>
        </div>
        <div className="demo-grid reveal">
          <TapDemo />
          <SwipeDemo />
          <DialDemo />
        </div>
        <p className="try-hint reveal">
          ↑ Tap, swipe, and spin the cards above
        </p>
      </div>
    </section>
  );
}

/* ---- big statement band: no number typing ---- */
function NoTypingBand() {
  return (
    <section className="sec band">
      <div className="wrap band-grid">
        <div className="reveal">
          <span className="band-eyebrow">No number typing</span>
          <h2 className="display band-h2">
            Zero
            <br />
            keyboards.
          </h2>
        </div>
        <div className="band-copy reveal">
          <p>
            Pop-up keypads slow the whole game down. Scorepad replaces every one
            of them with a gesture, so scoring takes a single motion — even
            mid-conversation.
          </p>
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
function WheelPicker({ values, initial, onSelect }) {
  const ref = useRefS(null);
  const ITEM = 46;
  const [sel, setSel] = useStateS(initial);
  useEffectS(() => {
    const el = ref.current;
    if (!el) return;
    const target = Math.max(0, values.indexOf(initial)) * ITEM;
    const set = () => {
      el.style.scrollSnapType = "none";
      el.scrollTop = target;
      requestAnimationFrame(() => {
        el.style.scrollSnapType = "y mandatory";
      });
    };
    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((e) => {
          if (e.isIntersecting) {
            set();
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const onScroll = () => {
    const idx = Math.round(ref.current.scrollTop / ITEM);
    const v = values[Math.max(0, Math.min(values.length - 1, idx))];
    if (v !== sel) {
      setSel(v);
      onSelect && onSelect(v);
      try {
        navigator.vibrate && navigator.vibrate(5);
      } catch (e) { }
    }
  };
  return (
    <div className="wheel">
      <div className="wheel-band"></div>
      <div className="wheel-fade top"></div>
      <div className="wheel-fade bottom"></div>
      <div className="wheel-scroll" ref={ref} onScroll={onScroll}>
        <div className="wheel-pad"></div>
        {values.map((v) => (
          <div key={v} className={"wheel-item" + (v === sel ? " sel" : "")}>
            {v}
          </div>
        ))}
        <div className="wheel-pad"></div>
      </div>
    </div>
  );
}

/* ---- feature: point values (resembles AddendModal) ---- */
function PointValuesFeature() {
  const [mode, setMode] = useStateS("tap");
  const labels = {
    tap: ["Tap", "Hold"],
    swipe: ["Swipe", "Hold + Swipe"],
    dial: ["Spin", "Hold + Spin"],
  };
  const nums = Array.from({ length: 30 }, (_, i) => i + 1);
  const [base, hold] = labels[mode];
  return (
    <section className="sec feat" id="features">
      <div className="wrap feat-grid">
        <div className="feat-copy reveal">
          <span className="eyebrow">Custom point values</span>
          <h2 className="display feat-h2">
            One value to tap,
            <br />
            another to hold.
          </h2>
          <p>
            Every gesture carries two point values. A quick tap, swipe, or
            dial-turn adds the base amount; <b>hold first</b> to add the bigger
            one — so a +1 game and a +25 game use the exact same moves.
          </p>
          <div className="seg" role="tablist">
            {["tap", "swipe", "dial"].map((m) => (
              <button
                key={m}
                className={"seg-btn" + (mode === m ? " on" : "")}
                onClick={() => setMode(m)}
              >
                {m[0].toUpperCase() + m.slice(1)}
              </button>
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
function HistoryFeature() {
  const players = [
    { name: "Summer", total: 47, color: "var(--pc-yellow)" },
    { name: "Morty", total: 93, color: "var(--pc-blue)" },
    { name: "Beth", total: 61, color: "var(--pc-red)" },
  ];
  const rounds = [
    { r: 16, v: [2, 8, 5], live: true },
    { r: 15, v: [11, 3, 9] },
    { r: 14, v: [5, 9, 7] },
    { r: 13, v: [7, 1, 12] },
    { r: 12, v: [9, 14, 4] },
  ];
  return (
    <section className="sec feat alt">
      <div className="wrap feat-grid">
        <div className="feat-visual reveal">
          <div className="rt">
            <div className="rt-grid rt-head">
              <span className="rt-corner">RD</span>
              {players.map((p) => (
                <span key={p.name} className="rt-player">
                  <span
                    className="rt-chip"
                    style={{ background: p.color }}
                  ></span>
                  {p.name}
                </span>
              ))}
            </div>
            <div className="rt-grid rt-totals">
              <span className="rt-corner">∑</span>
              {players.map((p) => (
                <span key={p.name} className="rt-total">
                  {p.total}
                </span>
              ))}
            </div>
            <div className="rt-body">
              {rounds.map((o) => (
                <div
                  key={o.r}
                  className={"rt-grid rt-row" + (o.live ? " live" : "")}
                >
                  <span className="rt-rd">{o.r}</span>
                  {o.v.map((n, i) => (
                    <span key={i} className="rt-cell">
                      +{n}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="feat-copy reveal">
          <span className="eyebrow">Round-by-round history</span>
          <h2 className="display feat-h2">The whole game, in one grid.</h2>
          <p>
            Every round for every player lands in a running table you can scroll
            back through — settle a dispute, spot a comeback, or jump to any
            round to fix a score.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---- feature: multiple games ---- */
function GamesFeature() {
  const games = [
    {
      name: "Smith Family Rummy",
      players: 4,
      rounds: 16,
      live: true,
      color: "var(--pc-yellow)",
    },
    {
      name: "Friday Cribbage",
      players: 2,
      rounds: 9,
      color: "var(--pc-green)",
    },
    { name: "Catan Night", players: 5, rounds: 1, color: "var(--pc-orange)" },
  ];
  return (
    <section className="sec feat">
      <div className="wrap feat-grid">
        <div className="feat-copy reveal">
          <span className="eyebrow">Unlimited games</span>
          <h2 className="display feat-h2">Keep every game going.</h2>
          <p>
            Run as many games as you like, side by side. Jump back into last
            week's tournament or start a fresh table in seconds — nothing gets
            lost.
          </p>
        </div>
        <div className="feat-visual reveal">
          <div className="games-stack">
            {games.map((g, i) => (
              <div
                key={g.name}
                className={"game-card" + (g.live ? " live" : "")}
              >
                <span
                  className="game-stripe"
                  style={{ background: g.color }}
                ></span>
                <div className="game-card-main">
                  <div className="game-name">{g.name}</div>
                  <div className="game-meta">
                    {g.players} players · {g.rounds}{" "}
                    {g.rounds === 1 ? "round" : "rounds"}
                  </div>
                </div>
                {g.live ? (
                  <span className="game-badge">In play</span>
                ) : (
                  <span className="game-arrow">›</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- final CTA ---- */
function FinalCTA() {
  return (
    <section className="sec cta" id="support">
      <div className="wrap cta-inner reveal">
        <img className="cta-icon" src="assets/app-icon.webp" alt="Scorepad app icon" width="96" height="96"/>
        <h2 className="display cta-h2">Score your next<br/>game with a flick.</h2>
        <p>Free to play. No account needed. Works offline, on every device.</p>
        <StoreBadges/>
        <div className="bmc-wrap">
          <p className="bmc-note">Scorepad is free &amp; open source. If it's made your game nights easier, a coffee goes a long way. ☕</p>
          <a className="bmc-btn" href="https://www.buymeacoffee.com/wyne" target="_blank" rel="noopener noreferrer">
            <svg className="bmc-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.001 0-.1-.026-.1-.026v-.001l-.028-.007c-.3-.075-.588-.169-.87-.277a1.5 1.5 0 01-.217-.1.866.866 0 01-.091-.057 1.15 1.15 0 01-.065-.063 1.038 1.038 0 01-.015-.021l-.003-.003v-.003l.001-.001.001-.001.001-.001c.164-.231.433-.373.734-.413a7.48 7.48 0 01.572-.037c1.06-.055 2.122-.079 3.184-.062 1.084.018 2.167.085 3.243.193.58.058 1.157.133 1.73.218.319.048.634.1.95.154.316.054.477.469.402.762-.083.319-.423.498-.742.41-.303-.084-.61-.155-.916-.224-1.053-.233-2.11-.399-3.175-.513a30.7 30.7 0 00-1.712-.119l-.23-.007-.23-.003h-.46l-.115.001-.116.002c-.768.019-1.535.073-2.297.175-.198.027-.396.059-.59.098a6.14 6.14 0 00-.576.138 2.773 2.773 0 00-.874.436 1.77 1.77 0 00-.621 1.062c-.046.271-.021.554.082.818.218.555.686.952 1.225 1.184a8.25 8.25 0 001.486.408 25.5 25.5 0 003.044.273c.993.038 1.988.01 2.978-.072.991-.082 1.977-.23 2.952-.44.39-.086.778-.184 1.16-.298.254-.076.503-.16.748-.252.495-.184.952-.438 1.322-.793a2.5 2.5 0 00.743-1.652c.03-.31.007-.624-.067-.926zm-4.14 7.124c-.006 0-.013 0-.02.001l-.115.01-.228.025c-.308.035-.616.077-.924.125-.617.096-1.234.214-1.843.369l-.45.117-.228.063-.231.073a22.68 22.68 0 00-1.793.71c-.576.27-1.135.58-1.648.946a7.14 7.14 0 00-1.285 1.197A4.854 4.854 0 005.3 18.009c-.085.407-.097.826-.016 1.237.08.41.251.802.49 1.142.48.682 1.216 1.12 1.998 1.302.406.094.82.13 1.233.133.415.003.83-.027 1.242-.078.823-.103 1.633-.306 2.424-.56a22.19 22.19 0 002.268-.97c.71-.37 1.39-.797 2.01-1.29.306-.245.596-.508.86-.795.265-.287.507-.596.695-.935.384-.685.542-1.473.4-2.24a2.946 2.946 0 00-1.058-1.82 4.02 4.02 0 00-1.974-.81zm1.44 2.07c.244.213.412.506.47.822.057.317.006.648-.143.934a3.347 3.347 0 01-.496.657 6.474 6.474 0 01-.715.605c-.55.405-1.147.745-1.765 1.038-.617.294-1.254.545-1.902.752-.648.208-1.31.372-1.975.484-.332.056-.666.097-1 .12-.334.024-.667.03-1.001.012-.666-.038-1.327-.183-1.867-.534a2.05 2.05 0 01-.685-.782 1.743 1.743 0 01-.115-.864 3.06 3.06 0 01.32-.969c.174-.31.39-.596.634-.857.488-.524 1.065-.97 1.673-1.367a19.5 19.5 0 012.01-.975c.712-.284 1.437-.529 2.169-.733.364-.102.73-.196 1.097-.28.184-.042.368-.082.552-.119.184-.036.37-.069.554-.099.184-.03.369-.056.553-.08l.276-.035.138-.017.069-.009.034-.004h.017c.005 0 .009 0 .013-.001a2.22 2.22 0 011.277.301z"/></svg>
            Buy me a coffee
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---- footer ---- */
function Footer() {
  return (
    <footer className="footer">
      <div className="wrap foot-grid">
        <div className="foot-brand">
          <Wordmark />
          <p>
            The gesture-first score keeper for board games, card games, and game
            nights.
          </p>
        </div>
        <div className="foot-cols">
          <div>
            <h4>App</h4>
            <a href="#gestures">Gestures</a>
            <a href="#features">Features</a>
            <a href="#get">What's new</a>
          </div>
          <div>
            <h4>Get it</h4>
            <a
              href="https://apps.apple.com/us/app/scorepad-with-rounds/id1577906063?platform=iphone"
              target="_blank"
              rel="noopener noreferrer"
            >
              App Store
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.wyne.scorepad"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Play
            </a>
            <a
              href="https://wyne.github.io/scorepad-app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web app
            </a>
          </div>
          <div>
            <h4>More</h4>
            <a href="mailto:scorepad@justinwyne.com">Support</a>
            <a href="privacy.html">Privacy</a>
            <a
              href="https://github.com/wyne/scorepad-react-native"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
      <div className="wrap foot-base">
        <span>© 2026 Scorepad with rounds</span>
        <span>Made for game night.</span>
      </div>
    </footer>
  );
}

function Wordmark() {
  return (
    <span className="wordmark">
      <img
        className="wm-icon"
        src="assets/app-icon.webp"
        alt="Scorepad with rounds app icon"
        width="36"
        height="36"
      />
      <span className="wm-lockup">
        <span className="wm-name">Scorepad</span>
        <span className="wm-sub">with rounds</span>
      </span>
    </span>
  );
}

Object.assign(window, {
  GestureSection,
  NoTypingBand,
  PointValuesFeature,
  HistoryFeature,
  GamesFeature,
  FinalCTA,
  Footer,
  Wordmark,
});
