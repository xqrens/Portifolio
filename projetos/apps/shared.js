(function startXQ(){
  "use strict";
  const app=document.body.dataset.app||"os";
  const root=document.getElementById("mount");
  const key="xqrens-suite-"+app;
  const currency=n=>Number(n||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
  const day=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");};
  const uuid=()=>crypto.randomUUID?crypto.randomUUID():Date.now()+"-"+Math.random().toString(36).slice(2);
  const el=(tag,txt="",cls="")=>{const x=document.createElement(tag);if(cls)x.className=cls;x.textContent=txt;return x;};
  const add=(parent,...children)=>{for(const x of children)if(x)parent.appendChild(x);return parent;};
  const btn=(txt,fn,cls="")=>{const x=el("button",txt,cls);x.type="button";x.addEventListener("click",fn);return x;};
  const card=(title)=>{const c=el("section","","card");add(c,el("h2",title));return c;};
  const wrap=(cls="stack")=>el("div","",cls);
  const empty=(text="Sem registros ainda.")=>el("div",text,"empty");
  const defs={
    os:{title:"Adicionar tarefa",fields:[["title","O que fazer?","text"],["date","Prazo","date"]]},
    finance:{title:"Novo lançamento",fields:[["title","Descrição","text"],["amount","Valor (R$)","number"],["type","Tipo","select",["Despesa","Receita"]],["date","Data","date"]]},
    studies:{title:"Nova atividade",fields:[["title","Atividade","text"],["subject","Matéria","text"],["date","Entrega","date"]]},
    chat:{title:"Enviar mensagem de teste",fields:[["title","Mensagem","text"]]},
    diary:{title:"Novo registro",fields:[["title","Título","text"],["body","Conteúdo","textarea"]]},
    manga:{title:"Adicionar obra",fields:[["title","Título","text"],["kind","Tipo","select",["Mangá","Anime"]],["total","Total de volumes / episódios","number"]]},
    work:{title:"Nova atividade",fields:[["title","Atividade realizada","text"],["date","Data","date"],["hours","Horas (opcional)","number"]]},
    studio:{title:"Novo projeto",fields:[["title","Nome do projeto","text"],["body","Descrição","textarea"],["tech","Tecnologias","text"],["url","Link público (opcional)","url"]]}
  };
  let data={entries:[],notes:"",sessions:0,nickname:"Eu",wall:"violet"};
  try{const saved=JSON.parse(localStorage.getItem(key));if(saved&&typeof saved==="object"&&!Array.isArray(saved))data={...data,...saved};}catch{}
  if(!Array.isArray(data.entries))data.entries=[];
  let mode="focus",room="geral",opened="",running=false,remaining=1500,deadline=0,interval;
  function save(){try{localStorage.setItem(key,JSON.stringify(data));}catch{alert("Não foi possível salvar. O armazenamento pode estar bloqueado ou cheio.");}}
  function backup(){
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download="xqrens-"+app+"-"+day()+".json";a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function field(form,[name,label,type,options]){
    const container=el("label",label,"hint");
    let control;
    if(type==="textarea"){control=el("textarea");control.maxLength=10000;}
    else if(type==="select"){control=el("select");for(const option of options)add(control,el("option",option));}
    else {control=el("input");control.type=type;control.maxLength=120;if(type==="date")control.value=day();if(type==="number"){control.min=name==="hours"?"0":"0.01";control.step=name==="total"?"1":"0.01";control.max="99999";}}
    control.name=name;control.required=!(name==="hours"||name==="url"||name==="tech");
    if(type==="text")control.placeholder=label;
    add(form,add(container,control));
  }
  function metric(container,label,value,css=""){
    const c=card("");c.querySelector("h2").remove();add(c,el("div",label,"eyebrow"),el("div",value,"kpi "+css));add(container,c);
  }
  function detail(x){
    if(app==="finance")return (x.type==="Receita"?"Entrada":"Saída")+" • "+currency(x.amount)+" • "+x.date;
    if(app==="os")return x.date+(x.done?" • Concluída":" • Pendente");
    if(app==="studies")return x.subject+" • "+x.date+(x.done?" • Estudada":"");
    if(app==="manga")return x.kind+" • "+x.progress+"/"+x.total;
    if(app==="work")return x.date+" • "+x.hours+" h";
    if(app==="chat")return (x.nickname||"Eu")+" • "+x.time;
    if(app==="diary")return x.date;
    if(app==="studio")return x.tech||"Projeto pessoal";
    return "";
  }
  function listSection(){
    const c=card(app==="chat"?"# "+room:"Seus registros");
    if(app==="chat"){
      add(c,el("p","DEMONSTRAÇÃO LOCAL: as mensagens não chegam a outros aparelhos.","hint"));
      const top=wrap("toolbar");
      for(const r of ["geral","estudos","aleatorio"])add(top,btn("# "+r,()=>{room=r;render();},room===r?"primary small":"small"));
      add(c,top);
      const n=el("input");n.value=data.nickname;n.placeholder="Seu apelido";n.maxLength=30;n.setAttribute("aria-label","Apelido");
      n.addEventListener("change",()=>{data.nickname=n.value.trim()||"Eu";save();});
      const theme=el("select");theme.setAttribute("aria-label","Papel de parede");
      for(const value of ["violet","aurora","mono"]){const option=el("option",value);option.value=value;theme.appendChild(option);}theme.value=data.wall;
      theme.addEventListener("change",()=>{data.wall=theme.value;save();render();});
      add(c,el("div","Personalização","hint"),n,theme);
    }
    const list=wrap("stack space");
    let entries=data.entries.slice().reverse();
    if(app==="chat")entries=entries.filter(x=>x.room===room);
    if(!entries.length)add(list,empty());
    for(const x of entries){
      const row=wrap("entry"),content=wrap(),actions=wrap("toolbar");
      add(content,el("b",x.title),el("p",detail(x)));
      if(app==="diary")add(content,el("p",opened===x.id?x.body:String(x.body||"").slice(0,115)+(x.body.length>115?"…":""),"hint"));
      if(app==="studio"){
        add(content,el("p",x.body,"hint"));
        try{const u=new URL(x.url);if(u.protocol==="https:"||u.protocol==="http:"){const link=el("a","Abrir projeto ↗","tag");link.href=u.href;link.target="_blank";link.rel="noopener noreferrer";add(content,link);}}catch{}
      }
      if(app==="manga"){
        const progress=wrap("progress"),fill=el("span");fill.style.width=Math.round(100*x.progress/x.total)+"%";add(progress,fill);add(content,progress);
        add(actions,btn("−",()=>{x.progress=Math.max(0,x.progress-1);save();render();},"small"),btn("+",()=>{x.progress=Math.min(x.total,x.progress+1);save();render();},"small"));
      }
      if(app==="os"||app==="studies")add(actions,btn(x.done?"↶":"✓",()=>{x.done=!x.done;save();render();},"small"));
      if(app==="diary")add(actions,btn(opened===x.id?"Ocultar":"Ler",()=>{opened=opened===x.id?"":x.id;render();},"small"));
      add(actions,btn("×",()=>{data.entries=data.entries.filter(t=>t.id!==x.id);save();render();},"small danger"));
      add(list,add(row,content,actions));
    }
    add(c,list,btn("↓ Exportar backup JSON",backup,"small ghost"));
    return c;
  }
  function renderCrud(){
    root.replaceChildren();
    if(app==="finance"){
      const group=wrap("grid3"),income=data.entries.filter(x=>x.type==="Receita").reduce((s,x)=>s+x.amount,0),expense=data.entries.filter(x=>x.type==="Despesa").reduce((s,x)=>s+x.amount,0);
      metric(group,"Entradas",currency(income),"good");metric(group,"Saídas",currency(expense),"bad");metric(group,"Saldo calculado",currency(income-expense));add(root,group);
    }
    if(app==="os"||app==="studies"){
      const group=wrap("grid3 space"),done=data.entries.filter(x=>x.done).length;
      metric(group,"Pendentes",String(data.entries.length-done));metric(group,"Concluídas",String(done),"good");metric(group,"Progresso",data.entries.length?Math.round(100*done/data.entries.length)+"%":"0%");add(root,group);
    }
    if(app==="work"){const box=wrap("space");metric(box,"Total de horas anotadas",data.entries.reduce((s,x)=>s+x.hours,0).toLocaleString("pt-BR")+" h");add(root,box);}
    if(app==="manga"){const group=wrap("grid3 space");metric(group,"Obras",String(data.entries.length));metric(group,"Finalizadas",String(data.entries.filter(x=>x.progress===x.total).length));metric(group,"Em andamento",String(data.entries.filter(x=>x.progress>0&&x.progress<x.total).length));add(root,group);}
    const columns=wrap("grid space"),c=card(defs[app].title),form=el("form","","form-grid");
    for(const f of defs[app].fields)field(form,f);
    const submit=el("button",app==="chat"?"Enviar mensagem":defs[app].title,"primary full");submit.type="submit";add(form,submit);
    form.addEventListener("submit",event=>{
      event.preventDefault();const values=new FormData(form),x={id:uuid(),date:day(),done:false};
      for(const [name,,type] of defs[app].fields){
        let v=String(values.get(name)||"").trim();
        if(type==="number"){v=Number(v);if(!Number.isFinite(v)||v<0||(name==="total"&&v<1))return alert("Informe um número válido.");}
        x[name]=v;
      }
      if(!x.title)return;
      if(app==="manga"){x.total=Math.max(1,Math.round(x.total));x.progress=0;}
      if(app==="chat"){x.nickname=data.nickname;x.time=new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});x.room=room;}
      if(app==="diary")x.date=new Date().toLocaleString("pt-BR");
      if(app==="studio"&&x.url){try{let u=new URL(x.url);if(u.protocol!=="http:"&&u.protocol!=="https:")x.url="";}catch{x.url="";}}
      data.entries.push(x);data.entries=data.entries.slice(-300);save();render();
    });
    add(c,form);
    if(app==="diary")add(c,el("p","Não há criptografia. Evite escrever informações confidenciais em computadores compartilhados.","hint"));
    if(app==="studio")add(c,el("p","Este gerenciador cria rascunhos locais e não altera o site publicado.","hint"));
    if(app==="chat")add(c,el("p","Para conversar online com outras pessoas, ainda será necessário conectar um servidor seguro com autenticação e moderação.","hint"));
    add(columns,c,listSection());add(root,columns);
    if(["os","studies","work"].includes(app)){
      const notes=card("Minhas anotações"),textarea=el("textarea","","notes");
      textarea.value=data.notes||"";textarea.placeholder="Escreva aqui. O texto é salvo automaticamente.";
      textarea.addEventListener("input",()=>{data.notes=textarea.value;save();});add(notes,textarea,el("p","Salvamento somente neste navegador.","hint"));add(root,notes);
    }
  }
  function pause(){if(!running)return;remaining=Math.max(0,(deadline-Date.now())/1000);clearInterval(interval);running=false;}
  function displayTime(){const clock=document.getElementById("focusClock");if(!clock)return;const n=Math.max(0,Math.ceil(remaining));clock.textContent=String(Math.floor(n/60)).padStart(2,"0")+":"+String(n%60).padStart(2,"0");}
  function tick(){if(!running)return;remaining=Math.max(0,(deadline-Date.now())/1000);displayTime();if(remaining<=0){pause();if(mode==="focus"){data.sessions=(Number(data.sessions)||0)+1;save();}remaining=mode==="focus"?1500:300;render();alert("Sessão concluída!");}}
  function renderFocus(){
    root.replaceChildren();const columns=wrap("grid"),left=card("Sessão de foco"),top=wrap("toolbar"),clock=el("div","","clock"),actions=wrap("toolbar"),right=card("Seu histórico");
    clock.id="focusClock";
    add(top,btn("Foco · 25 min",()=>{pause();mode="focus";remaining=1500;render();},mode==="focus"?"small primary":"small"),btn("Pausa · 5 min",()=>{pause();mode="break";remaining=300;render();},mode==="break"?"small primary":"small"));
    add(actions,btn(running?"Pausar":"Começar",()=>{if(running)pause();else{running=true;deadline=Date.now()+remaining*1000;interval=setInterval(tick,300);}render();},"primary"),btn("Reiniciar",()=>{pause();remaining=mode==="focus"?1500:300;render();}));
    add(left,top,clock,actions,el("p","O timer funciona enquanto esta aba permanecer aberta.","hint"));
    add(right,el("div",String(data.sessions||0),"kpi"),el("p","Sessões de foco concluídas."),el("div",String((data.sessions||0)*25)+" minutos","kpi"),btn("Zerar histórico",()=>{if(confirm("Apagar histórico de foco?")){data.sessions=0;save();render();}},"danger ghost"));
    add(root,add(columns,left,right));displayTime();
  }
  function simpleForm(container,fields,onSubmit,title){
    const c=card(title),form=el("form","","form-grid");
    for(const f of fields)field(form,f);
    const b=el("button","Executar","primary");b.type="submit";add(form,b);
    form.addEventListener("submit",e=>{e.preventDefault();onSubmit(new FormData(form),c);});
    add(c,form);add(container,c);return c;
  }
  function renderTools(){
    root.replaceChildren();const columns=wrap("grid");
    const calculator=simpleForm(columns,[["a","Valor A","number"],["b","Valor B","number"],["op","Operação","select",["+","−","×","÷"]]],(f,c)=>{
      const a=Number(f.get("a")),b=Number(f.get("b")),op=f.get("op");
      const result=op==="+"?a+b:op==="−"?a-b:op==="×"?a*b:b!==0?a/b:NaN;
      c.querySelector(".output").textContent=Number.isFinite(result)?result.toLocaleString("pt-BR",{maximumFractionDigits:9}):"Divisão inválida";
    },"Calculadora");
    add(calculator,el("div","Resultado...","kpi output"));
    const pass=card("Gerador de senhas"),length=el("input"),output=el("input"),controls=wrap("toolbar space");
    length.type="number";length.value="18";length.min="12";length.max="48";output.readOnly=true;output.placeholder="Senha gerada";
    add(controls,btn("Gerar senha",()=>{
      const chars="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*?",n=Math.min(48,Math.max(12,Number(length.value)||18)),limit=Math.floor(4294967296/chars.length)*chars.length;
      let result="";for(let i=0;i<n;i++){const bytes=new Uint32Array(1);do{crypto.getRandomValues(bytes);}while(bytes[0]>=limit);result+=chars[bytes[0]%chars.length];}output.value=result;
    },"primary"),btn("Copiar",async()=>{try{await navigator.clipboard.writeText(output.value);}catch{prompt("Copie a senha:",output.value);}}));
    add(pass,el("p","Tamanho da senha","hint"),length,controls,output);add(columns,pass);
    const converter=simpleForm(columns,[["value","Valor","number"],["from","De","select",["cm","m","km"]],["to","Para","select",["cm","m","km"]]],(f,c)=>{
      const factors={cm:.01,m:1,km:1000};const n=Number(f.get("value"))*factors[f.get("from")]/factors[f.get("to")];c.querySelector(".output").textContent=n.toLocaleString("pt-BR",{maximumFractionDigits:9});
    },"Conversor de medidas");
    add(converter,el("div","Resultado...","kpi output"));
    const slug=simpleForm(columns,[["title","Nome do projeto","text"]],(f,c)=>{
      c.querySelector(".output").textContent=String(f.get("title")||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
    },"Gerador de identificadores");
    add(slug,el("p","identificador","hint output"));add(root,columns);
  }
  function render(){if(defs[app])renderCrud();else if(app==="focus")renderFocus();else renderTools();}
  window.addEventListener("storage",event=>{if(event.key===key){try{const state=JSON.parse(event.newValue);if(state&&Array.isArray(state.entries)){data=state;render();}}catch{}}});
  render();
})();