// app.jsx — composition, nav, scroll reveals
const { useEffect: useEffectA, useState: useStateA } = React;

function NavBar(){
  const [solid, setSolid] = useStateA(false);
  useEffectA(()=>{
    const on = ()=> setSolid(window.scrollY > 40);
    on(); window.addEventListener('scroll', on, {passive:true});
    return ()=> window.removeEventListener('scroll', on);
  },[]);
  return (
    <nav className={"nav"+(solid?' solid':'')}>
      <div className="wrap nav-inner">
        <Wordmark/>
        <div className="nav-links">
          <a href="#gestures">Gestures</a>
          <a href="#features">Features</a>
          <a href="#">What's new</a>
        </div>
        <a className="btn btn-primary nav-cta" href="#get">Download</a>
      </div>
    </nav>
  );
}

function useReveal(){
  useEffectA(()=>{
    const els = document.querySelectorAll('.reveal:not(.in)');
    const io = new IntersectionObserver((ents)=>{
      ents.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold:.12, rootMargin:'0px 0px -8% 0px' });
    els.forEach(el=>io.observe(el));
    return ()=> io.disconnect();
  });
}

function App(){
  useReveal();
  useEffectA(()=>{
    document.documentElement.style.setProperty('--yellow', '#F5C800');
  },[]);

  return (
    <React.Fragment>
      <NavBar/>
      <Hero variant="split" phone="board"/>
      <GestureSection/>
      <NoTypingBand/>
      <PointValuesFeature/>
      <HistoryFeature/>
      <GamesFeature/>
      <div id="get"></div>
      <FinalCTA/>
      <Footer/>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
