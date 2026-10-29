/* XQRENS / Portfolio 2.0
   Progressive enhancement only. The 24 project links and all original sections
   remain functional without this file. Avoid third-party UI dependencies.
*/
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = () =>
    document.documentElement.dataset.motion === "off" ||
    (document.documentElement.dataset.motion !== "on" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  function initializeReveal() {
    const elements = $$(".xq-reveal");
    if (!elements.length || reducedMotion() || !("IntersectionObserver" in window)) return;
    // Set the class only after the observer has been prepared.
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("xq-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07, rootMargin: "0px 0px -14px 0px" });
    elements.forEach(element => observer.observe(element));
    document.body.classList.add("xq-ready");
    const motionToggle = $("#motionSwitch");
    motionToggle?.addEventListener("click", () => {
      if (document.documentElement.dataset.motion === "off") {
        observer.disconnect();
        document.body.classList.remove("xq-ready");
      }
    });
  }

  function setupProjectPreviews() {
    const modal = $("#xqPreviewDialog");
    const frame = $("#xqPreviewIframe");
    const heading = $("#xqPreviewTitle");
    const external = $("#xqPreviewOpen");
    const close = $("#xqPreviewClose");
    if (!modal || !frame || !heading || !external || !close || typeof modal.showModal !== "function") return;

    function openPreview(button) {
      const raw = button.dataset.previewTarget;
      if (!raw || !raw.startsWith("./")) return;
      const link = new URL(raw, document.baseURI);
      if (link.origin !== location.origin || !/\/index\.html$/i.test(decodeURIComponent(link.pathname))) return;
      const card = button.closest(".project-card");
      heading.textContent = card?.dataset.title || "Prévia do projeto";
      external.href = link.href;
      frame.title = "Prévia interativa: " + heading.textContent;
      frame.src = link.href; // Only loaded on demand. Never 24 simultaneous iframes.
      modal.showModal();
      close.focus();
    }

    document.addEventListener("click", event => {
      const button = event.target.closest(".xq-preview-trigger");
      if (button) openPreview(button);
    });

    close.addEventListener("click", () => modal.close());
    modal.addEventListener("click", event => {
      if (event.target !== modal) return;
      const bounds = modal.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) {
        modal.close();
      }
    });
    modal.addEventListener("close", () => {
      frame.removeAttribute("src"); // Release memory and stop embedded media.
    });
  }

  function initializeComparison() {
    const select = $("#xqCompareSelect");
    const before = $("#xqBeforeCode");
    const after = $("#xqAfterCode");
    const source = $("#xqBeforeSource");
    const live = $("#xqAfterLive");
    if (![select, before, after, source, live].every(Boolean)) return;

    // Code excerpts are based on real GitHub revisions, not invented visual mockups.
    const baseline = "140d053b8c65f1856c91d531c2602e868774cd22";
    const examples = {
      errors: {
        path: "projeto_erro",
        before: `<html lang="en">
<title>Document</title>
<h1>9 ERROS GAME - AMONG US</h1>
<div class="container">
  <img src="./assets/foto2.png" alt="">
  <img src="./assets/x.svg"
       class="icone icone-01" alt="">
</div>

/* CSS antigo */
.container { width: 750px; }
.icone-01 { left: 65px; top: 40px; }`,
        after: `<html lang="pt-BR">
<main class="wrap">
  <section class="spot-compare">
    <figure class="surface">
      <img alt="Primeira cena do desafio"
           src="./assets/foto1.png">
    </figure>
    <figure class="surface">
      <div class="spot-board">...</div>
    </figure>
  </section>
</main>

/* CSS reutilizável */
.spot-compare { display: grid; }
.spot-board { container-type: inline-size; }`,
      },
      album: {
        path: "projeto_album",
        before: `<html lang="en">
<title>Album</title>
<div>
  <img class="fig" src="./assets/j1.jpg" alt="">
  <img class="fig" src="./assets/j2.jpg" alt="">
</div>

/* CSS antigo */
div { width: 750px; display: flex; flex-wrap: wrap; }
.fig { width: 150px; padding: 50px; }`,
        after: `<html lang="pt-BR">
<main class="wrap">
  <section class="photo-grid"
           aria-label="Figurinhas da Meme Cup">
    <figure>
      <img src="./assets/j1.jpg"
           alt="Figurinha 1 da coleção Meme Cup">
      <figcaption>FIGURINHA / 01</figcaption>
    </figure>
  </section>
</main>

/* CSS reutilizável */
.photo-grid { display: grid; gap: 16px; }`,
      },
      video: {
        path: "projeto_video",
        before: `<html lang="en">
<iframe width="560" height="315"
        src="https://www.youtube.com/embed/...">
</iframe>
<h1>lovers rock</h1>

/* JavaScript antigo */
setInterval(criarCoracao, 300);`,
        after: `<html lang="pt-BR">
<main class="wrap">
  <div class="video-frame">
    <iframe loading="lazy"
            title="Vídeo musical..."
            allowfullscreen></iframe>
  </div>
</main>

/* CSS responsivo */
.video-frame { aspect-ratio: 16 / 9; }

/* JS novo: menos elementos e preferência
   por movimento reduzido respeitada. */`,
      }
    };

    function render() {
      const item = examples[select.value] || examples.errors;
      before.textContent = item.before;
      after.textContent = item.after;
      source.href = "https://github.com/xqrens/Portifolio/blob/" +
        baseline + "/projetos/" + item.path + "/index.html";
      live.href = "./" + item.path + "/index.html";
    }

    select.addEventListener("change", render);
    render();
  }

  async function loadRecentGitHubChanges() {
    const container = $("#xqRecentCommits");
    const status = $("#xqRecentStatus");
    if (!container || !status) return;
    const endpoint = "https://api.github.com/repos/xqrens/Portifolio/commits?path=projetos&per_page=3";
    try {
      const response = await fetch(endpoint, {
        headers: { Accept: "application/vnd.github+json" },
        signal: AbortSignal.timeout ? AbortSignal.timeout(7500) : undefined
      });
      if (!response.ok) throw new Error("GitHub API: " + response.status);
      const commits = await response.json();
      if (!Array.isArray(commits) || commits.length === 0) throw new Error("No recent commits");
      const fragment = document.createDocumentFragment();
      commits.slice(0, 3).forEach(item => {
        if (typeof item.sha !== "string" ||
            typeof item.commit?.message !== "string") return;
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = "https://github.com/xqrens/Portifolio/commit/" + encodeURIComponent(item.sha);
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = item.commit.message.split("\n")[0].slice(0,67);
        li.append(link);
        fragment.append(li);
      });
      if (!fragment.childNodes.length) throw new Error("Unexpected commit data");
      container.replaceChildren(fragment);
      status.textContent = "Últimos commits públicos";
    } catch {
      status.textContent = "Atualizações no GitHub";
      container.replaceChildren();
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = "https://github.com/xqrens/Portifolio/commits/main/";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Consultar o histórico de alterações ↗";
      li.append(link);
      container.append(li);
    }
  }

  function start() {
    initializeReveal();
    setupProjectPreviews();
    initializeComparison();
    loadRecentGitHubChanges();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once:true });
  } else start();
})();
