/* Introdução "o ponto fora da curva": regressão avaliada no conjunto de
   teste, zoom no outlier e transição FLIP do nome até o header. Ativada
   apenas quando o script inline do <head> marca html.intro-pending. */
(function () {
  "use strict";

  var root = document.documentElement;
  if (!root.classList.contains("intro-pending")) {
    return;
  }

  var overlay = document.getElementById("intro-overlay");
  var world = document.getElementById("intro-world");
  var pointsGroup = document.getElementById("intro-points");
  var caption = document.getElementById("intro-caption");
  var metric = document.getElementById("intro-metric");
  var line = document.getElementById("intro-line");
  var residual = document.getElementById("intro-residual");
  var ring = document.getElementById("intro-ring");
  var skipButton = document.getElementById("intro-skip");
  var nameEl = document.getElementById("intro-name");
  var headerName = document.querySelector(".site-name");

  if (!overlay || !world || !pointsGroup || !line || !nameEl || !headerName) {
    root.classList.remove("intro-pending");
    return;
  }

  try {
    sessionStorage.setItem("introPlayed", "1");
  } catch (error) {
    /* Sem storage, a intro roda mesmo assim, apenas sem memória de sessão. */
  }

  /* Coordenadas no viewBox (1000x620). A tendência segue a curva
     M75 515 Q560 470 940 135, com ruído irregular e dispersão maior no
     topo, como dados reais; o outlier fica bem acima da curva. */
  var POINTS = [
    [108, 496], [131, 522], [154, 489], [177, 513], [223, 476],
    [241, 502], [288, 461], [302, 490], [317, 470], [345, 484],
    [367, 442], [398, 460], [409, 429], [431, 452], [458, 415],
    [486, 439], [494, 407], [521, 419], [549, 375], [585, 397],
    [604, 349], [633, 371], [664, 318], [688, 340], [716, 288],
    [749, 305], [781, 243], [808, 271], [836, 208], [871, 232],
    [897, 174], [921, 143]
  ];
  var OUTLIER = { x: 700, y: 104 };
  var SVG_NS = "http://www.w3.org/2000/svg";

  var done = false;
  var timers = [];
  var outlierDot = null;

  function wait(ms) {
    return new Promise(function (resolve) {
      timers.push(setTimeout(resolve, ms));
    });
  }

  function finish() {
    if (done) {
      return;
    }
    done = true;
    timers.forEach(clearTimeout);
    document.removeEventListener("keydown", onKeydown);
    headerName.style.visibility = "";
    overlay.remove();
    nameEl.remove();
    root.classList.remove("intro-pending");
  }

  function onKeydown(event) {
    if (event.key === "Escape") {
      finish();
    }
  }

  function buildPoints() {
    POINTS.forEach(function (pair, index) {
      var dot = document.createElementNS(SVG_NS, "circle");
      dot.setAttribute("class", "intro-point");
      dot.setAttribute("cx", pair[0]);
      dot.setAttribute("cy", pair[1]);
      dot.setAttribute("r", 5.5);
      dot.style.animationDelay = ((index * 167) % 1250) + "ms";
      pointsGroup.appendChild(dot);
    });

    /* O outlier entra por último, com halo: todos os dados comuns já
       plotados... e então surge o ponto que não se encaixa. */
    var halo = document.createElementNS(SVG_NS, "circle");
    halo.setAttribute("class", "intro-halo");
    halo.setAttribute("cx", OUTLIER.x);
    halo.setAttribute("cy", OUTLIER.y);
    halo.setAttribute("r", 15);
    halo.style.animationDelay = "1450ms";
    pointsGroup.appendChild(halo);

    outlierDot = document.createElementNS(SVG_NS, "circle");
    outlierDot.setAttribute("class", "intro-point intro-point-outlier");
    outlierDot.setAttribute("cx", OUTLIER.x);
    outlierDot.setAttribute("cy", OUTLIER.y);
    outlierDot.setAttribute("r", 7.5);
    outlierDot.style.animationDelay = "1450ms";
    pointsGroup.appendChild(outlierDot);
  }

  function placeNameBesideOutlier() {
    var dotRect = outlierDot.getBoundingClientRect();
    var nameRect = nameEl.getBoundingClientRect();
    /* O nome parte da borda do anel pulsante (não do ponto), com folga
       para o pulso que escala até 1.12. */
    var ringRect = ring.getBoundingClientRect();
    var left = Math.max(ringRect.right, dotRect.right) + 24;
    var top = dotRect.top + dotRect.height / 2 - nameRect.height / 2;

    if (left + nameRect.width > window.innerWidth - 12) {
      left = Math.max(12, window.innerWidth - nameRect.width - 12);
      top = dotRect.bottom + 14;
    }

    nameEl.style.left = left + "px";
    nameEl.style.top = top + "px";
  }

  function flipToHeader() {
    var first = nameEl.getBoundingClientRect();
    var startFontSize = parseFloat(getComputedStyle(nameEl).fontSize);
    var targetFontSize = parseFloat(getComputedStyle(headerName).fontSize);
    var targetRect = headerName.getBoundingClientRect();

    nameEl.style.fontSize = targetFontSize + "px";
    nameEl.style.left = targetRect.left + "px";
    nameEl.style.top = targetRect.top + "px";

    var last = nameEl.getBoundingClientRect();
    var scale = startFontSize / targetFontSize;
    nameEl.style.transform =
      "translate(" + (first.left - last.left) + "px, " +
      (first.top - last.top) + "px) scale(" + scale + ")";
    nameEl.getBoundingClientRect();
    nameEl.style.transition = "transform 1150ms cubic-bezier(0.22, 1, 0.36, 1)";
    nameEl.style.transform = "none";
    overlay.classList.add("is-flip");
    return wait(1200);
  }

  async function run() {
    buildPoints();

    /* Em aba de fundo o navegador pausa a renderização e as transições nem
       começam; a intro só deve rodar com a página visível. */
    if (document.visibilityState === "hidden") {
      await new Promise(function (resolve) {
        document.addEventListener("visibilitychange", resolve, { once: true });
      });
    }

    await Promise.race([
      document.fonts ? document.fonts.ready : wait(0),
      wait(900)
    ]);

    caption.classList.add("is-on");
    await wait(350);

    pointsGroup.classList.add("intro-points-on");
    await wait(2100);

    line.classList.add("is-on");
    await wait(1450);
    line.classList.add("is-drawn");

    metric.classList.add("is-on");
    await wait(450);

    overlay.classList.add("is-zoom");
    world.classList.add("is-zoomed");
    await wait(850);

    residual.classList.add("is-on");
    ring.classList.add("is-on");
    await wait(950);

    placeNameBesideOutlier();
    nameEl.classList.add("is-visible");
    await wait(1250);

    await flipToHeader();

    headerName.style.visibility = "hidden";
    overlay.classList.add("is-leaving");
    await wait(500);
    finish();
  }

  skipButton.addEventListener("click", finish);
  document.addEventListener("keydown", onKeydown);
  run().catch(finish);
})();
