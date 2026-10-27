(()=>{"use strict";function start(){const reduced=document.documentElement.dataset.motion==="off"||(document.documentElement.dataset.motion!=="on"&&matchMedia("(prefers-reduced-motion: reduce)").matches);
const bar=document.createElement("div");bar.className="plus-progress";bar.setAttribute("aria-hidden","true");document.body.append(bar);
const header=document.querySelector(".site-header"),visual=document.querySelector(".hero-visual");let scheduled=false;
function update(){const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);bar.style.transform="scaleX("+Math.min(1,scrollY/max)+")";header?.classList.toggle("plus-scrolled",scrollY>30);if(visual&&!reduced)visual.style.setProperty("--visual-y",Math.min(scrollY*.045,30)+"px");scheduled=false}
addEventListener("scroll",()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update)}},{passive:true});addEventListener("resize",update,{passive:true});update();
const els=[...document.querySelectorAll(".section-head,.about-copy,.about-terminal,.feature,.project-card,.reference-card,.inner-weather-copy,.inner-weather-art,.mente-layout,.contact-panel")];
if(!reduced&&"IntersectionObserver" in window){document.body.classList.add("plus-motion");const obs=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){e.target.classList.add("plus-visible");obs.unobserve(e.target)}}},{threshold:0,rootMargin:"0px 0px -24px 0px"});for(const el of els){el.classList.add("plus-reveal");obs.observe(el)}}else els.forEach(el=>el.classList.add("plus-visible"))}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start()})();

/* XQRENS / Spotify e botão de animações
 * Cole aqui apenas links públicos de PLAYLISTS do seu próprio Spotify:
 * {titulo:"Nome real",descricao:"Quando escutar",url:"https://open.spotify.com/playlist/ID"}
 */
(()=>{
 "use strict";
 const PLAYLISTS=[];
 const KEY="xqrens-motion";
 const run=()=>{
   const button=document.getElementById("motionSwitch");
   const label=document.getElementById("motionSwitchLabel");
   const root=document.documentElement;
   const prefers=matchMedia("(prefers-reduced-motion: reduce)").matches;
   let saved=null;
   try{saved=localStorage.getItem(KEY)}catch(e){}
   const on=saved==="on"||(saved!=="off"&&!prefers);
   root.dataset.motion=on?"on":"off";
   if(button){
     button.hidden=false;
     button.setAttribute("aria-pressed",String(on));
     button.setAttribute("aria-label",on?"Desativar animações e reiniciar efeitos":"Ativar animações e reiniciar efeitos");
     if(label)label.textContent=on?"Efeitos ON":"Efeitos OFF";
     button.addEventListener("click",()=>{
       try{localStorage.setItem(KEY,on?"off":"on")}catch(e){}
       location.reload();
     });
   }
   const list=document.getElementById("spotifyPlaylists");
   const count=document.getElementById("spotifyCounter");
   const getId=(input)=>{
     try{
       const url=new URL(input);
       const parts=url.pathname.split("/").filter(Boolean);
       return url.protocol==="https:"&&url.hostname==="open.spotify.com"&&parts.length===2&&parts[0]==="playlist"&&/^[a-zA-Z0-9]{22}$/.test(parts[1])?parts[1]:null;
     }catch(e){return null}
   };
   const items=PLAYLISTS.map(entry=>({...entry,id:getId(entry.url)})).filter(entry=>entry.id);
   if(list&&items.length){
     list.replaceChildren();
     if(count)count.textContent=items.length+" PLAYLIST"+(items.length>1?"S":"");
     items.forEach((item,index)=>{
       const card=document.createElement("article");
       card.className="spotify-card";
       const title=document.createElement("strong");
       title.textContent=(index+1).toString().padStart(2,"0")+" / "+(item.titulo||"Playlist");
       const description=document.createElement("p");
       description.textContent=item.descricao||"Seleção pessoal no Spotify";
       const actions=document.createElement("div");
       actions.className="spotify-card-actions";
       const link=document.createElement("a");
       link.href="https://open.spotify.com/playlist/"+item.id;
       link.target="_blank";
       link.rel="noopener noreferrer";
       link.textContent="Abrir Spotify ↗";
       const play=document.createElement("button");
       play.type="button";
       play.textContent="Ouvir aqui ♫";
       const embed=document.createElement("div");
       embed.className="spotify-embed";
       embed.id="spotify-embed-"+index;
       embed.hidden=true;
       play.setAttribute("aria-controls",embed.id);
       play.setAttribute("aria-expanded","false");
       play.addEventListener("click",()=>{
         const show=embed.hidden;
         embed.hidden=!show;
         play.setAttribute("aria-expanded",String(show));
         play.textContent=show?"Fechar player ×":"Ouvir aqui ♫";
         if(show&&!embed.firstChild){
           const frame=document.createElement("iframe");
           frame.src="https://open.spotify.com/embed/playlist/"+item.id;
           frame.title="Spotify: "+(item.titulo||"Playlist");
           frame.loading="lazy";
           frame.allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
           embed.append(frame);
         }
       });
       actions.append(link,play);
       card.append(title,description,actions,embed);
       list.append(card);
     });
   }
   const hero=document.querySelector(".spotify-hero");
   if(hero&&matchMedia("(hover: hover) and (pointer: fine)").matches){
     hero.addEventListener("pointermove",event=>{
       if(root.dataset.motion!=="on")return;
       const rect=hero.getBoundingClientRect();
       hero.style.setProperty("--spot-x",((event.clientX-rect.left)/rect.width*100).toFixed(1)+"%");
       hero.style.setProperty("--spot-y",((event.clientY-rect.top)/rect.height*100).toFixed(1)+"%");
     },{passive:true});
   }
 };
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run,{once:true});else run();
})();
