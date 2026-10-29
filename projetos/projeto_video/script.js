/* Lovers Rock / small decorative animation.
   Preserves the original hearts with a bounded, motion-aware lifecycle. */
(() => {
  "use strict";
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (motionQuery.matches) return;

  const MAX_HEARTS = 12;
  const INTERVAL = 1100;
  const DURATION = 5500;
  const active = new Set();

  function makeHeart() {
    if (document.hidden || motionQuery.matches || active.size >= MAX_HEARTS) return;
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = "♥";
    heart.setAttribute("aria-hidden", "true");
    heart.style.setProperty("--heart-x", (8 + Math.random() * 84).toFixed(1) + "vw");
    heart.style.setProperty("--heart-size", (15 + Math.random() * 15).toFixed(0) + "px");
    heart.style.setProperty("--heart-duration", DURATION + "ms");

    active.add(heart);
    document.body.append(heart);
    const cleanup = () => {
      active.delete(heart);
      heart.remove();
    };
    heart.addEventListener("animationend", cleanup, { once: true });
    setTimeout(cleanup, DURATION + 200);
  }

  const loop = setInterval(makeHeart, INTERVAL);
  const stop = () => {
    clearInterval(loop);
    active.forEach((heart) => heart.remove());
    active.clear();
  };
  motionQuery.addEventListener?.("change", (event) => {
    if (event.matches) stop();
  }, { once: true });
  window.addEventListener("pagehide", stop, { once: true });
})();
