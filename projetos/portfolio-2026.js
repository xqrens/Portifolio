/* XQRENS / Portfolio 2.0
   Progressive enhancement: the 24 project links and core sections
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

  function start() {
    initializeReveal();
    setupProjectPreviews();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once:true });
  } else start();
})();
