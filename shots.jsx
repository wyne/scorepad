// shots.jsx — real app screenshots in simple device frames
// Exports: Device, DuoSection

/* screen aspect (w/h) and corner radius (as % of width) per device */
const DEVICES = {
  iphone:     { ratio: 1206 / 2622, radius: 0.15 },
  duoCover:   { ratio: 1398 / 2034, radius: 0.11 },
  duoWide:    { ratio: 2853 / 2007, radius: 0.045 },
  duoTall:    { ratio: 2007 / 2853, radius: 0.065 },
};

function Device({ src, alt, kind = "iphone", width = 300, className = "", eager = false }) {
  const d = DEVICES[kind];
  const bezel = Math.max(6, Math.round(width * 0.035));
  const r = Math.round(width * d.radius);
  return (
    <div
      className={"device device-" + kind + " " + className}
      style={{ "--w": width + "px", "--bezel": bezel + "px", "--r": r + "px" }}
    >
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        style={{ aspectRatio: String(d.ratio) }}
      />
    </div>
  );
}

/* ---- iPhone Duo showcase ---- */
function DuoSection() {
  const modes = [
    {
      key: "cover",
      kind: "duoCover",
      src: "assets/screens/duo-cover.webp",
      title: "Closed",
      sub: "The full board on the cover screen, same as any iPhone.",
    },
    {
      key: "book",
      kind: "duoTall",
      src: "assets/screens/duo-book.webp",
      title: "Half open, portrait",
      sub: "Players up top, every round docked below the fold.",
    },
    {
      key: "tent",
      kind: "duoWide",
      src: "assets/screens/duo-tent-landscape.webp",
      title: "Half open, landscape",
      sub: "Tiles on one side of the hinge, the scoreboard on the other.",
    },
  ];
  return (
    <section className="sec duo" id="duo">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">Made for iPhone Duo</span>
          <h2 className="display sec-h2">Unfold the whole table.</h2>
          <p className="sec-lead">
            Open it flat and every player gets a big, glanceable tile. Fold it
            halfway and Scorepad <b>splits around the hinge</b>, so the rounds
            table stays open while you score.
          </p>
        </div>
        <div className="duo-hero reveal">
          <Device
            kind="duoWide"
            width={880}
            src="assets/screens/duo-open.webp"
            alt="Scorepad on iPhone Duo, fully open in landscape, showing four large player tiles"
          />
          <span className="duo-tag">Fully open</span>
        </div>
        <div className="duo-grid reveal">
          {modes.map((m) => (
            <figure key={m.key} className={"duo-card duo-card-" + m.key}>
              <div className="duo-card-art">
                <Device kind={m.kind} width={m.kind === "duoWide" ? 340 : 230} src={m.src} alt={"Scorepad on iPhone Duo — " + m.title} />
              </div>
              <figcaption>
                <strong>{m.title}</strong>
                <span>{m.sub}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Device, DuoSection });
