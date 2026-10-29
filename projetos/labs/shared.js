/* XQRENS Labs / 2026
   Five independent experiments, one small shared runtime.
   No dependencies; DOM is updated using textContent, never unsanitized HTML.
*/
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const MAX_NOTES = 30;
  const create = (tag, className = "", text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const notify = (text) => {
    const output = $("#status");
    if (output) output.textContent = text;
  };
  const read = (key, fallback) => {
    try {
      const value = localStorage.getItem("xqrens-lab:" + key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  };
  const save = (key, value) => {
    try {
      localStorage.setItem("xqrens-lab:" + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  };
  const shuffle = (items) => {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  async function copyText(value) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const helper = create("textarea");
        helper.value = value;
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.append(helper);
        helper.select();
        let copied = false;
        try {
          copied = document.execCommand("copy");
        } finally {
          helper.remove();
        }
        if (!copied) throw new Error("Clipboard unavailable");
      }
      notify("Cor copiada: " + value);
    } catch {
      notify("Não foi possível copiar automaticamente. Copie o código " + value + ".");
    }
  }

  function initPalette() {
    const grid = $("#colors");
    const generate = $("#generate");
    if (!grid || !generate) return;

    const isHex = (value) => typeof value === "string" && /^#[0-9A-Fa-f]{6}$/.test(value);
    const remembered = read("palette", []);
    let palette = Array.isArray(remembered) && remembered.length === 5 && remembered.every(isHex)
      ? remembered
      : [];
    const locked = new Set();

    function hslToHex(hue, saturation, lightness) {
      const s = saturation / 100;
      const l = lightness / 100;
      const k = (n) => (n + hue / 30) % 12;
      const a = s * Math.min(l, 1 - l);
      const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
      return "#" + [f(0), f(8), f(4)]
        .map((value) => Math.round(value * 255).toString(16).padStart(2, "0"))
        .join("").toUpperCase();
    }

    function render() {
      const fragment = document.createDocumentFragment();
      palette.forEach((hex, index) => {
        const card = create("article", "swatch");
        const visual = create("div", "swatch-color");
        visual.style.backgroundColor = hex;
        visual.append(create("b", "", String(index + 1).padStart(2, "0")));

        const details = create("div", "swatch-info");
        const actions = create("div", "swatch-actions");
        const copy = create("button", "", "Copiar");
        const lock = create("button", "", locked.has(index) ? "Destravar" : "Travar");

        copy.type = lock.type = "button";
        copy.setAttribute("aria-label", "Copiar cor " + hex);
        lock.setAttribute("aria-label", (locked.has(index) ? "Destravar" : "Travar") + " cor " + (index + 1));
        lock.setAttribute("aria-pressed", String(locked.has(index)));
        copy.addEventListener("click", () => copyText(hex));
        lock.addEventListener("click", () => {
          locked.has(index) ? locked.delete(index) : locked.add(index);
          render();
          notify(locked.has(index) ? "Cor " + (index + 1) + " travada." : "Cor " + (index + 1) + " destravada.");
        });

        actions.append(copy, lock);
        details.append(create("strong", "", hex), actions);
        card.append(visual, details);
        fragment.append(card);
      });
      grid.replaceChildren(fragment);
    }

    function regenerate() {
      const startHue = Math.floor(Math.random() * 360);
      palette = Array.from({ length: 5 }, (_, index) => {
        if (locked.has(index)) return palette[index];
        return hslToHex(
          (startHue + index * 27 + Math.floor(Math.random() * 20)) % 360,
          47 + Math.floor(Math.random() * 34),
          40 + Math.floor(Math.random() * 27)
        );
      });
      if (!save("palette", palette)) notify("Paleta gerada, mas não foi possível guardá-la.");
      else notify("Nova paleta criada. Trave as cores que quiser preservar.");
      render();
    }

    generate.addEventListener("click", regenerate);
    palette.length === 5 ? render() : regenerate();
  }

  function initTimer() {
    const dial = $("#timerDial");
    const time = $("#time");
    const mode = $("#mode");
    const start = $("#start");
    const reset = $("#reset");
    const choices = $$("[data-duration]");
    if (![dial, time, mode, start, reset].every(Boolean)) return;

    let duration = 25 * 60;
    let remaining = duration;
    let deadline = 0;
    let running = false;
    let intervalId = null;
    const format = (seconds) =>
      String(Math.floor(seconds / 60)).padStart(2, "0") + ":" +
      String(seconds % 60).padStart(2, "0");

    function render() {
      time.textContent = format(remaining);
      dial.style.setProperty("--progress", (100 * (duration - remaining) / duration).toFixed(2) + "%");
      document.title = format(remaining) + " · Focus Room";
      start.textContent = running ? "Pausar" : "Começar";
      choices.forEach((choice) => {
        choice.setAttribute("aria-pressed", String(Number(choice.dataset.duration) * 60 === duration));
      });
    }
    function stop() {
      clearInterval(intervalId);
      intervalId = null;
      running = false;
    }
    function tick() {
      if (!running) return;
      remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      if (remaining === 0) {
        stop();
        notify("Tempo concluído. Faça uma pausa se precisar.");
      }
      render();
    }
    function pause() {
      if (!running) return;
      remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      stop();
      render();
    }

    start.addEventListener("click", () => {
      if (running) {
        pause();
        notify("Contagem pausada.");
        return;
      }
      if (remaining <= 0) remaining = duration;
      deadline = Date.now() + remaining * 1000;
      running = true;
      intervalId = setInterval(tick, 250);
      render();
      notify("Contagem iniciada.");
    });
    reset.addEventListener("click", () => {
      pause();
      remaining = duration;
      render();
      notify("Timer reiniciado.");
    });
    choices.forEach((choice) => choice.addEventListener("click", () => {
      pause();
      const minutes = Number(choice.dataset.duration);
      if (![5, 15, 25].includes(minutes)) return;
      duration = minutes * 60;
      remaining = duration;
      mode.textContent = choice.dataset.label || "Foco";
      render();
      notify("Modo alterado para " + mode.textContent + ".");
    }));
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) tick();
    });
    window.addEventListener("pagehide", pause);
    render();
  }

  function initQuiz() {
    const questions = [
      { text: "Qual tag cria um link em HTML?", choices: ["<a>", "<link>", "<url>"], answer: 0, explanation: "A tag <a> cria hyperlinks." },
      { text: "Qual propriedade CSS muda a cor do texto?", choices: ["font-style", "color", "display"], answer: 1, explanation: "color define a cor do texto." },
      { text: "Como declarar uma constante em JavaScript?", choices: ["let", "var", "const"], answer: 2, explanation: "const declara uma referência que não pode ser reatribuída." },
      { text: "Qual evento responde a um clique?", choices: ["click", "hover", "loadfile"], answer: 0, explanation: "click corresponde ao evento de clique." },
      { text: "Qual método transforma uma string JSON em objeto?", choices: ["JSON.parse()", "JSON.stringify()", "JSON.text()"], answer: 0, explanation: "JSON.parse converte uma string JSON em um valor JavaScript." },
      { text: "Qual atributo fornece texto alternativo para imagens?", choices: ["aria-copy", "alt", "img-title"], answer: 1, explanation: "O atributo alt fornece descrição alternativa." }
    ];
    const number = $("#questionNumber");
    const question = $("#question");
    const answers = $("#answers");
    const feedback = $("#feedback");
    const next = $("#next");
    const progress = $("#progress");
    if (![number, question, answers, feedback, next, progress].every(Boolean)) return;
    let current = 0;
    let score = 0;
    let answered = false;

    function renderQuestion() {
      const data = questions[current];
      answered = false;
      number.textContent = "QUESTÃO " + String(current + 1).padStart(2, "0") + " / " + questions.length;
      question.textContent = data.text;
      progress.style.width = (current / questions.length * 100) + "%";
      feedback.textContent = "Escolha uma alternativa.";
      next.hidden = true;
      const buttons = data.choices.map((choice, index) => {
        const button = create("button", "", String.fromCharCode(65 + index) + ". " + choice);
        button.type = "button";
        button.addEventListener("click", () => {
          if (answered) return;
          answered = true;
          if (index === data.answer) score++;
          $$("#answers button").forEach((option, optionIndex) => {
            option.disabled = true;
            if (optionIndex === data.answer) option.classList.add("correct");
            else if (optionIndex === index) option.classList.add("wrong");
          });
          feedback.textContent = (index === data.answer ? "Correto! " : "Ainda não. ") + data.explanation;
          next.textContent = current === questions.length - 1 ? "Ver resultado" : "Próxima questão →";
          next.hidden = false;
        });
        return button;
      });
      answers.replaceChildren(...buttons);
    }

    function finish() {
      number.textContent = "QUIZ CONCLUÍDO";
      question.textContent = "Você acertou " + score + " de " + questions.length + " questões!";
      answers.replaceChildren(create("p", "muted", "Continue praticando. Cada tentativa ajuda a aprender."));
      progress.style.width = "100%";
      feedback.textContent = "Pontuação: " + score + "/" + questions.length;
      next.textContent = "Recomeçar ↺";
      next.hidden = false;
    }

    next.addEventListener("click", () => {
      if (current === questions.length - 1 && answered) {
        finish();
        answered = false;
        return;
      }
      if (current === questions.length - 1 && !answered) {
        current = 0;
        score = 0;
        renderQuestion();
        return;
      }
      if (!answered) return;
      current++;
      renderQuestion();
    });
    renderQuestion();
  }

  function initMemory() {
    const symbols = ["✦", "☾", "✿", "◆", "☼", "✳"];
    const grid = $("#memoryGrid");
    const movesOutput = $("#moves");
    const matchedOutput = $("#matches");
    const restart = $("#restart");
    if (![grid, movesOutput, matchedOutput, restart].every(Boolean)) return;
    let deck = [];
    let opened = [];
    let matched = 0;
    let moves = 0;
    let locked = false;
    let timeout = null;

    function render() {
      movesOutput.textContent = String(moves);
      matchedOutput.textContent = matched + "/" + symbols.length;
      grid.replaceChildren(...deck.map((card) => {
        const isOpen = card.done || opened.includes(card.id);
        const button = create(
          "button",
          "memory-card" + (isOpen ? " flipped" : "") + (card.done ? " matched" : ""),
          isOpen ? card.symbol : "?"
        );
        button.type = "button";
        button.disabled = card.done || locked || opened.includes(card.id);
        button.setAttribute("aria-label", card.done ? "Par encontrado " + card.symbol : isOpen ? "Carta " + card.symbol : "Virar carta " + (card.id + 1));
        button.addEventListener("click", () => reveal(card.id));
        return button;
      }));
    }

    function reveal(id) {
      const current = deck.find((card) => card.id === id);
      if (!current || current.done || locked || opened.includes(id)) return;
      opened.push(id);
      if (opened.length === 2) {
        moves++;
        const [first, second] = opened.map((index) => deck.find((card) => card.id === index));
        if (first.symbol === second.symbol) {
          first.done = second.done = true;
          matched++;
          opened = [];
          notify(matched === symbols.length ? "Você encontrou todos os pares em " + moves + " jogadas!" : "Par encontrado!");
        } else {
          locked = true;
          notify("As cartas não combinam. Tente novamente.");
          timeout = setTimeout(() => {
            opened = [];
            locked = false;
            render();
          }, 850);
        }
      }
      render();
    }

    function resetGame() {
      clearTimeout(timeout);
      timeout = null;
      opened = [];
      matched = 0;
      moves = 0;
      locked = false;
      deck = shuffle([...symbols, ...symbols]).map((symbol, id) => ({ id, symbol, done: false }));
      render();
      notify("Encontre os seis pares.");
    }
    restart.addEventListener("click", resetGame);
    resetGame();
  }

  function initNotes() {
    const form = $("#noteForm");
    const input = $("#noteText");
    const list = $("#noteList");
    const count = $("#noteCount");
    if (![form, input, list, count].every(Boolean)) return;
    const stored = read("notes", []);
    let notes = Array.isArray(stored)
      ? stored.filter((item) => item && typeof item.text === "string")
        .map((item) => ({ text: item.text.slice(0, 240), date: typeof item.date === "string" ? item.date : "" }))
        .slice(0, MAX_NOTES)
      : [];

    function persist() {
      if (!save("notes", notes)) {
        notify("Alteração local, mas o navegador impediu o salvamento. Faça uma cópia das notas importantes.");
        return false;
      }
      return true;
    }
    function render() {
      count.textContent = notes.length + (notes.length === 1 ? " nota salva" : " notas salvas");
      if (notes.length === 0) {
        list.replaceChildren(create("p", "muted", "Nenhuma nota ainda. Escreva a primeira!"));
        return;
      }
      list.replaceChildren(...notes.map((note, index) => {
        const card = create("article", "note");
        const text = create("p", "", note.text);
        const footer = create("div", "note-footer");
        const date = create("time", "", note.date || "Nota");
        const remove = create("button", "", "Apagar");
        remove.type = "button";
        remove.setAttribute("aria-label", "Apagar nota " + (index + 1));
        remove.addEventListener("click", () => {
          notes.splice(index, 1);
          const ok = persist();
          render();
          if (ok) notify("Nota apagada.");
        });
        footer.append(date, remove);
        card.append(text, footer);
        return card;
      }));
    }
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = input.value.trim().slice(0, 240);
      if (!value) return notify("Escreva alguma coisa primeiro.");
      if (notes.length >= MAX_NOTES) return notify("Limite de " + MAX_NOTES + " notas. Apague uma para continuar.");
      notes.unshift({ text: value, date: new Date().toLocaleDateString("pt-BR") });
      const ok = persist();
      input.value = "";
      render();
      if (ok) notify("Nota guardada somente neste navegador.");
    });
    render();
  }

  const apps = {
    palette: initPalette,
    timer: initTimer,
    quiz: initQuiz,
    memory: initMemory,
    notes: initNotes
  };
  const init = apps[document.body.dataset.app];
  if (typeof init === "function") init();
})();
