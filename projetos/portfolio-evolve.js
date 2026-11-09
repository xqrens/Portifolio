/* XQRENS STUDIO · command palette, favoritos e personalização.
   Sem dependências externas. O site permanece navegável sem este arquivo. */
(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const STORE = {tone:"xq-studio-tone",focus:"xq-focus",saved:"xq-saved-projects"};
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const write = (key,value) => { try { localStorage.setItem(key,value); } catch { /* modo privado */ } };
  const normalize = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  const reduceMotion = () => document.documentElement.dataset.motion === "off" ||
    (document.documentElement.dataset.motion !== "on" && matchMedia("(prefers-reduced-motion: reduce)").matches);
  let toastTimer;

  function announce(message) {
    const node = $("#xqToast");
    if (!node) return;
    node.textContent = message;
    node.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove("is-visible"), 2600);
  }

  async function copyText(value, successMessage) {
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(value);
      announce(successMessage);
    } catch {
      window.prompt("Copie o link abaixo:", value);
    }
  }

  function setupThemes() {
    const allowed = ["violet","mint","ice"];
    const current = allowed.includes(read(STORE.tone)) ? read(STORE.tone) : "violet";
    const buttons = $$("[data-xq-tone]");
    const update = tone => {
      document.documentElement.dataset.xqTheme = tone;
      buttons.forEach(button => {
        const selected = button.dataset.xqTone === tone;
        button.setAttribute("aria-pressed",String(selected));
        button.title = selected ? "Tema atual: " + button.dataset.xqLabel : "Usar tema " + button.dataset.xqLabel;
      });
    };
    update(current);
    buttons.forEach(button => button.addEventListener("click",() => {
      const tone = button.dataset.xqTone;
      if (!allowed.includes(tone)) return;
      write(STORE.tone,tone);
      update(tone);
      announce("Tema " + button.dataset.xqLabel + " ativado");
    }));

    const focusButton = $("#xqFocus");
    if (!focusButton) return;
    const refresh = () => {
      const focused = document.documentElement.dataset.xqFocus === "on";
      focusButton.textContent = focused ? "◉ Sair do modo foco" : "◎ Modo foco";
      focusButton.setAttribute("aria-pressed",String(focused));
    };
    refresh();
    focusButton.addEventListener("click",() => {
      const enable = document.documentElement.dataset.xqFocus !== "on";
      document.documentElement.dataset.xqFocus = enable ? "on" : "off";
      write(STORE.focus,enable ? "on" : "off");
      refresh();
      announce(enable ? "Modo foco ativado" : "Modo foco desativado");
    });
  }

  function setupProjects() {
    const cards = $$(".project-card",$("#projectGrid") || document);
    const data = cards.map(card => {
      const link = $(".card-link",card);
      return {card,title:card.dataset.title || $("h4",card)?.textContent || "Projeto",
        href:link?.getAttribute("href") || "",category:card.dataset.category || "outros"};
    }).filter(item => item.href);
    const supported = new Set(data.map(item => item.href));
    let old = [];
    try { old = JSON.parse(read(STORE.saved) || "[]"); } catch { old = []; }
    const saved = new Set((Array.isArray(old) ? old : []).filter(item => typeof item === "string" && supported.has(item)));
    const panel = $("#xqSavedPanel");
    const savedList = $("#xqSavedList");
    const count = $("#xqSavedCount");
    const toggle = $("#xqSavedToggle");

    function renderSaved() {
      if (count) count.textContent = String(saved.size);
      data.forEach(item => {
        const button = $(".xq-favorite",item.card);
        if (!button) return;
        const active = saved.has(item.href);
        button.setAttribute("aria-pressed",String(active));
        button.textContent = active ? "♥ Salvo" : "♡ Salvar";
        button.setAttribute("aria-label",(active ? "Remover dos favoritos: " : "Salvar nos favoritos: ") + item.title);
      });
      if (!savedList) return;
      savedList.replaceChildren();
      if (!saved.size) {
        const li = document.createElement("li");
        li.textContent = "Nenhum projeto salvo ainda. Use ♡ nos cartões para criar sua seleção.";
        savedList.append(li);
        return;
      }
      data.filter(item => saved.has(item.href)).forEach(item => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = item.href;
        a.textContent = item.title + " ↗";
        li.append(a);
        savedList.append(li);
      });
    }

    data.forEach(item => {
      const tools = document.createElement("div");
      tools.className = "xq-card-tools";
      const fav = document.createElement("button");
      fav.type = "button";
      fav.className = "xq-card-action xq-favorite";
      fav.addEventListener("click",() => {
        if (saved.has(item.href)) saved.delete(item.href);
        else saved.add(item.href);
        write(STORE.saved,JSON.stringify([...saved]));
        renderSaved();
        announce(saved.has(item.href) ? "Projeto adicionado aos favoritos" : "Projeto removido dos favoritos");
      });
      const copy = document.createElement("button");
      copy.type = "button";
      copy.className = "xq-card-action";
      copy.textContent = "↗ Copiar link";
      copy.setAttribute("aria-label","Copiar link do projeto " + item.title);
      copy.addEventListener("click",() => copyText(new URL(item.href,document.baseURI).href,"Link do projeto copiado"));
      tools.append(fav,copy);
      item.card.append(tools);
    });
    renderSaved();

    toggle?.addEventListener("click",() => {
      if (!panel) return;
      panel.hidden = !panel.hidden;
      toggle.setAttribute("aria-expanded",String(!panel.hidden));
      if (!panel.hidden) panel.scrollIntoView({behavior:reduceMotion() ? "auto" : "smooth",block:"nearest"});
    });

    $("#xqSurprise")?.addEventListener("click",() => {
      const available = data.filter(item => !item.card.hidden);
      if (!available.length) { announce("Limpe os filtros para descobrir projetos"); return; }
      const chosen = available[Math.floor(Math.random()*available.length)];
      chosen.card.scrollIntoView({behavior:reduceMotion() ? "auto" : "smooth",block:"center"});
      chosen.card.classList.add("xq-picked");
      setTimeout(() => chosen.card.classList.remove("xq-picked"),1800);
      announce("Descoberta: " + chosen.title);
    });
    return data;
  }

  function setupCommandPalette(projects) {
    const dialog = $("#xqCommand");
    const input = $("#xqCommandInput");
    const results = $("#xqCommandResults");
    const launch = $("#xqCommandLaunch");
    if (!dialog || !input || !results || typeof dialog.showModal !== "function") return;
    const sections = [
      ["Início","#inicio"],["Sobre mim","#sobre"],["Projetos","#projetos"],
      ["Spotify","#spotify"],["Mente em Flor","#mente"],["Bastidores","#bastidores"],["Contato","#contato"]
    ];
    const entries = [
      ...sections.map(([title,href]) => ({title,href,type:"Seção"})),
      ...projects.map(item => ({title:item.title,href:item.href,type:"Projeto"}))
    ];
    let matches = [];
    let selected = 0;
    const perform = item => {
      dialog.close();
      if (item.href.startsWith("#")) {
        const target = $(item.href);
        target?.scrollIntoView({behavior:reduceMotion() ? "auto" : "smooth",block:"start"});
        history.replaceState(null,"",item.href);
      } else {
        window.location.assign(new URL(item.href,document.baseURI).href);
      }
    };
    const highlight = () => {
      const buttons = $$("button[data-index]",results);
      buttons.forEach((button,i) => {
        button.classList.toggle("is-current",i === selected);
        button.setAttribute("aria-selected",String(i === selected));
      });
      if (buttons[selected]) {
        input.setAttribute("aria-activedescendant",buttons[selected].id);
        buttons[selected].scrollIntoView({block:"nearest"});
      } else input.removeAttribute("aria-activedescendant");
    };
    const render = () => {
      const query = normalize(input.value.trim());
      matches = entries.filter(item => normalize(item.title + " " + item.type).includes(query)).slice(0,12);
      selected = 0;
      results.replaceChildren();
      if (!matches.length) {
        const li = document.createElement("li");
        li.textContent = "Nenhum resultado. Tente outro nome de projeto.";
        li.style.padding = "17px";
        results.append(li);
      }
      matches.forEach((item,i) => {
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button";
        button.id = "xqCommandResult" + i;
        button.dataset.index = String(i);
        button.setAttribute("role","option");
        const label = document.createElement("span");
        label.textContent = item.title;
        const kind = document.createElement("small");
        kind.textContent = item.type + " ↗";
        button.append(label,kind);
        button.addEventListener("mouseenter",() => { selected = i; highlight(); });
        button.addEventListener("click",() => perform(item));
        li.append(button);
        results.append(li);
      });
      highlight();
    };
    const open = () => {
      if (dialog.open) return;
      dialog.showModal();
      input.value = "";
      render();
      input.focus();
    };
    launch?.addEventListener("click",open);
    $("#xqQuickSearch")?.addEventListener("click",open);
    document.addEventListener("keydown",event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        dialog.open ? dialog.close() : open();
      }
      if (event.key === "/" && !dialog.open &&
          !["INPUT","TEXTAREA"].includes(document.activeElement?.tagName) &&
          !document.activeElement?.isContentEditable) {
        event.preventDefault();
        open();
      }
    });
    input.addEventListener("input",render);
    input.addEventListener("keydown",event => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        selected = Math.min(matches.length - 1,selected + 1);
        if (selected < 0) selected = 0;
        highlight();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        selected = Math.max(0,selected - 1);
        highlight();
      } else if (event.key === "Enter" && matches[selected]) {
        event.preventDefault();
        perform(matches[selected]);
      }
    });
    $("#xqCommandClose")?.addEventListener("click",() => dialog.close());
    dialog.addEventListener("click",event => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close",() => input.removeAttribute("aria-activedescendant"));
  }

  function setupExtras() {
    $("#xqShare")?.addEventListener("click",async () => {
      const url = document.querySelector('link[rel="canonical"]')?.href || location.href;
      if (navigator.share) {
        try {
          await navigator.share({title:"Portfólio de Luiz Eduardo",url});
          return;
        } catch (error) {
          if (error?.name === "AbortError") return;
        }
      }
      copyText(url,"Link do portfólio copiado");
    });
    const back = $("#xqBackTop");
    if (back) {
      const update = () => back.classList.toggle("is-visible",scrollY > 650);
      addEventListener("scroll",update,{passive:true});
      update();
      back.addEventListener("click",() => scrollTo({top:0,behavior:reduceMotion() ? "auto" : "smooth"}));
    }
  }

  function start() {
    setupThemes();
    const projects = setupProjects();
    setupCommandPalette(projects);
    setupExtras();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();
