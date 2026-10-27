(()=>{"use strict";function start(){const reduced=document.documentElement.dataset.motion==="off"||(document.documentElement.dataset.motion!=="on"&&matchMedia("(prefers-reduced-motion: reduce)").matches);
const bar=document.createElement("div");bar.className="plus-progress";bar.setAttribute("aria-hidden","true");document.body.append(bar);
const header=document.querySelector(".site-header"),visual=document.querySelector(".hero-visual");let scheduled=false;
function update(){const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);bar.style.transform="scaleX("+Math.min(1,scrollY/max)+")";header?.classList.toggle("plus-scrolled",scrollY>30);if(visual&&!reduced)visual.style.setProperty("--visual-y",Math.min(scrollY*.045,30)+"px");scheduled=false}
addEventListener("scroll",()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update)}},{passive:true});addEventListener("resize",update,{passive:true});update();
const els=[...document.querySelectorAll(".section-head,.about-copy,.about-terminal,.feature,.project-card,.reference-card,.spotify-hero,.spotify-shelf,.mente-layout,.contact-panel")];
if(!reduced&&"IntersectionObserver" in window){document.body.classList.add("plus-motion");const obs=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){e.target.classList.add("plus-visible");obs.unobserve(e.target)}}},{threshold:0,rootMargin:"0px 0px -24px 0px"});for(const el of els){el.classList.add("plus-reveal");obs.observe(el)}}else els.forEach(el=>el.classList.add("plus-visible"))}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start()})();

/* XQRENS / Spotify player v2 · três playlists públicas reais.
   Player só carrega no clique. Ao fechar, iframe é removido para interromper o áudio. */
(()=>{
  "use strict";

  const PLAYLISTS = [
    {
      titulo: "Rock & Melancolia",
      descricao: "Guitarras, nostalgia e músicas para sentir cada verso.",
      url: "https://open.spotify.com/playlist/0qZ9SKrLbXuQqYcHZwVnT4",
      tone: "purple",
      tag: "ROCK / MOOD"
    },
    {
      titulo: "Trabalho & Curso",
      descricao: "Minha companhia entre o trabalho e as linhas de código.",
      url: "https://open.spotify.com/playlist/5dl6z8fFzDX6QszGDhyQVx",
      tone: "mint",
      tag: "FOCO / DEV"
    },
    {
      titulo: "Escola",
      descricao: "Uma trilha sonora para acompanhar a rotina das aulas.",
      url: "https://open.spotify.com/playlist/4Y2xOdFInYSzyJNgPhQowe",
      tone: "blue",
      tag: "ESTUDOS / DAILY"
    }
  ];

  const KEY = "xqrens-motion";

  function getPlaylistId(input){
    try{
      const url=new URL(input);
      const parts=url.pathname.split("/").filter(Boolean);
      if(url.protocol!=="https:" || url.hostname!=="open.spotify.com")return null;
      return parts.length===2 && parts[0]==="playlist" && /^[a-zA-Z0-9]{22}$/.test(parts[1])?parts[1]:null;
    }catch(_){return null;}
  }

  function element(tag,className,text){
    const node=document.createElement(tag);
    if(className)node.className=className;
    if(text!==undefined)node.textContent=text;
    return node;
  }

  function setupMotion(){
    const toggle=document.getElementById("motionSwitch");
    const label=document.getElementById("motionSwitchLabel");
    const root=document.documentElement;
    const prefers=matchMedia("(prefers-reduced-motion: reduce)").matches;
    let saved=null;
    try{saved=localStorage.getItem(KEY);}catch(_){}
    const enabled=saved==="on" || (saved!=="off"&&!prefers);
    root.dataset.motion=enabled?"on":"off";

    if(toggle){
      toggle.hidden=false;
      toggle.setAttribute("aria-pressed",String(enabled));
      toggle.setAttribute("aria-label",enabled?"Desativar animações do site":"Ativar animações do site");
      if(label)label.textContent=enabled?"Efeitos ON":"Efeitos OFF";
      toggle.addEventListener("click",()=>{
        try{localStorage.setItem(KEY,enabled?"off":"on");}catch(_){}
        location.reload();
      });
    }
  }

  function setupPlaylists(){
    const container=document.getElementById("spotifyPlaylists");
    const counter=document.getElementById("spotifyCounter");
    if(!container)return;

    const playlists=PLAYLISTS.map(item=>({...item,id:getPlaylistId(item.url)})).filter(item=>item.id);
    if(!playlists.length)return;

    container.replaceChildren();
    if(counter)counter.textContent=String(playlists.length).padStart(2,"0")+" PLAYLISTS";

    const cards=[];

    function setOpen(entry,shouldOpen){
      const {card,button,label,icon,player,frameSlot,item}=entry;
      if(shouldOpen){
        if(!frameSlot.firstChild){
          const frame=document.createElement("iframe");
          frame.src="https://open.spotify.com/embed/playlist/"+item.id+"?utm_source=generator&theme=0";
          frame.title="Player do Spotify: "+item.titulo;
          frame.loading="lazy";
          frame.allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
          frame.referrerPolicy="strict-origin-when-cross-origin";
          frameSlot.append(frame);
        }
        player.setAttribute("aria-hidden","false");
        card.classList.add("is-open");
        button.setAttribute("aria-expanded","true");
        button.setAttribute("aria-label","Fechar player de "+item.titulo);
        label.textContent="Fechar player";
        icon.textContent="×";
      }else{
        card.classList.remove("is-open");
        button.setAttribute("aria-expanded","false");
        button.setAttribute("aria-label","Ouvir "+item.titulo+" aqui");
        label.textContent="Ouvir aqui";
        icon.textContent="▶";
        player.setAttribute("aria-hidden","true");
        frameSlot.replaceChildren(); // Fecha o player e interrompe a reprodução, se houver.
      }
    }

    playlists.forEach((item,index)=>{
      const card=element("article","spotify-card");
      card.dataset.tone=item.tone;
      card.style.setProperty("--card-delay",(index*110)+"ms");
      card.setAttribute("aria-label","Playlist "+item.titulo);

      const head=element("div","spotify-card-head");
      const cover=element("div","spotify-cover");
      cover.setAttribute("aria-hidden","true");
      cover.append(element("span","spotify-cover-disc"));
      const details=element("div","spotify-card-info");
      const kicker=element("span","spotify-card-kicker",String(index+1).padStart(2,"0")+" / "+item.tag);
      const title=element("h4","spotify-card-title",item.titulo);
      const description=element("p","spotify-card-desc",item.descricao);
      details.append(kicker,title,description);
      head.append(cover,details);

      const actions=element("div","spotify-card-actions");
      const button=element("button","spotify-listen");
      button.type="button";
      const icon=element("span","spotify-play-icon","▶");
      icon.setAttribute("aria-hidden","true");
      const label=element("span","spotify-listen-text","Ouvir aqui");
      button.append(icon,label);
      button.setAttribute("aria-expanded","false");
      button.setAttribute("aria-label","Ouvir "+item.titulo+" aqui");
      const external=element("a","spotify-external","Abrir Spotify ↗");
      external.href="https://open.spotify.com/playlist/"+item.id;
      external.target="_blank";
      external.rel="noopener noreferrer";
      actions.append(button,external);

      const player=element("div","spotify-player-shell");
      const panelId="spotify-player-"+index;
      player.id=panelId;
      player.setAttribute("aria-hidden","true");
      player.setAttribute("role","region");
      player.setAttribute("aria-label","Player incorporado: "+item.titulo);
      button.setAttribute("aria-controls",panelId);
      const inner=element("div","spotify-player-inner");
      const body=element("div","spotify-player-body");
      const topLine=element("div","spotify-player-bar");
      const playerState=element("span");
      playerState.append(element("i","spotify-player-led"),document.createTextNode("SPOTIFY EMBED"));
      topLine.append(playerState,element("span","","PRONTO PARA OUVIR"));
      const frameSlot=element("div","spotify-frame");
      const notice=element("p","spotify-player-notice","Para tocar, aperte reproduzir no player do Spotify.");
      body.append(topLine,frameSlot,notice);
      inner.append(body);
      player.append(inner);
      card.append(head,actions,player);
      container.append(card);

      const entry={card,button,label,icon,player,frameSlot,item};
      cards.push(entry);
      button.addEventListener("click",()=>{
        const open=!card.classList.contains("is-open");
        // Um player de cada vez evita várias músicas sobrepostas.
        cards.forEach(other=>{if(other!==entry&&other.card.classList.contains("is-open"))setOpen(other,false);});
        setOpen(entry,open);
      });
    });

    if(matchMedia("(hover: hover) and (pointer: fine)").matches){
      container.querySelectorAll(".spotify-card").forEach(card=>{
        card.addEventListener("pointermove",event=>{
          if(document.documentElement.dataset.motion!=="on")return;
          const box=card.getBoundingClientRect();
          card.style.setProperty("--spot-x",((event.clientX-box.left)/box.width*100).toFixed(1)+"%");
          card.style.setProperty("--spot-y",((event.clientY-box.top)/box.height*100).toFixed(1)+"%");
        },{passive:true});
      });
      const hero=document.querySelector(".spotify-hero");
      hero?.addEventListener("pointermove",event=>{
        if(document.documentElement.dataset.motion!=="on")return;
        const box=hero.getBoundingClientRect();
        hero.style.setProperty("--spot-x",((event.clientX-box.left)/box.width*100).toFixed(1)+"%");
        hero.style.setProperty("--spot-y",((event.clientY-box.top)/box.height*100).toFixed(1)+"%");
      },{passive:true});
    }
  }

  function start(){
    setupMotion();
    setupPlaylists();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();
