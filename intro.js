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
  var metric = document.getElementById("intro-metric");
  var lineReveal = document.getElementById("intro-line-reveal");
  var residual = document.getElementById("intro-residual");
  var ring = document.getElementById("intro-ring");
  var skipButton = document.getElementById("intro-skip");
  var nameEl = document.getElementById("intro-name");
  var headerName = document.querySelector(".site-name");

  if (!overlay || !world || !pointsGroup || !lineReveal || !nameEl || !headerName) {
    root.classList.remove("intro-pending");
    return;
  }

  try {
    sessionStorage.setItem("introPlayed", "1");
  } catch (error) {
    /* Sem storage, a intro roda mesmo assim, apenas sem memória de sessão. */
  }

  /* Coordenadas no viewBox (1000x620) como [x, y, raio]. Pontos gerados
     por amostragem aleatória ao redor da tendência (ruído gaussiano de
     cauda pesada, aglomerados e vazios naturais). A curva do gráfico é
     uma spline Catmull-Rom pelas médias locais dos aglomerados, formando um
     ajuste sensível, quase overfittando. O outlier fica bem acima dela,
     no valor 60 do eixo x. */
  var POINTS = [
    [138, 525, 6.2], [176, 488, 5.2], [198, 490, 5.7], [203, 484, 6.3],
    [222, 510, 5.9], [223, 461, 4.9], [346, 464, 5.1], [368, 435, 5.1],
    [383, 458, 5.2], [400, 460, 6.1], [448, 433, 5.8], [460, 463, 5.2],
    [471, 410, 6.3], [480, 382, 4.8], [485, 415, 4.5], [496, 401, 5.5],
    [556, 396, 5.0], [558, 363, 5.1], [572, 379, 5.4], [610, 392, 4.6],
    [656, 309, 5.6], [663, 319, 6.0], [683, 340, 5.6], [676, 265, 6.0],
    [720, 284, 5.3], [741, 284, 4.7], [776, 282, 6.1], [808, 218, 6.4],
    [817, 242, 5.8], [830, 207, 4.7], [855, 261, 6.3], [884, 182, 4.8],
    [885, 203, 5.1], [912, 169, 5.0]
  ];
  var OUTLIER = { x: 592, y: 150 };
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
    /* Varredura da esquerda para a direita: o atraso de cada ponto é
       proporcional à sua posição X. Onde há aglomerado, vários surgem
       quase juntos; onde há vazio no eixo, uma pausa — como uma linha de
       scan avançando pelos dados. */
    var xs = POINTS.map(function (pair) { return pair[0]; });
    var minX = Math.min.apply(null, xs);
    var maxX = Math.max.apply(null, xs);
    var sweep = 1350;

    POINTS.forEach(function (pair) {
      var dot = document.createElementNS(SVG_NS, "circle");
      dot.setAttribute("class", "intro-point");
      dot.setAttribute("cx", pair[0]);
      dot.setAttribute("cy", pair[1]);
      dot.setAttribute("r", pair[2]);
      var t = (pair[0] - minX) / (maxX - minX);
      dot.style.animationDelay = Math.round(t * sweep) + "ms";
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

  function getPageZoom() {
    var zoom = parseFloat(getComputedStyle(root).zoom);
    return Number.isFinite(zoom) && zoom > 0 ? zoom : 1;
  }

  function placeFixedElement(element, left, top) {
    var zoom = getPageZoom();
    element.style.left = left / zoom + "px";
    element.style.top = top / zoom + "px";
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

    placeFixedElement(nameEl, left, top);
  }

  function flipToHeader() {
    var first = nameEl.getBoundingClientRect();
    var startFontSize = parseFloat(getComputedStyle(nameEl).fontSize);
    var targetFontSize = parseFloat(getComputedStyle(headerName).fontSize);
    var targetRect = headerName.getBoundingClientRect();
    var zoom = getPageZoom();

    nameEl.style.fontSize = targetFontSize + "px";
    placeFixedElement(nameEl, targetRect.left, targetRect.top);

    var last = nameEl.getBoundingClientRect();
    var scale = startFontSize / targetFontSize;
    nameEl.style.transform =
      "translate(" + (first.left - last.left) / zoom + "px, " +
      (first.top - last.top) / zoom + "px) scale(" + scale + ")";
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

    await wait(350);

    pointsGroup.classList.add("intro-points-on");
    await wait(2100);

    lineReveal.classList.add("is-on");
    await wait(1450);

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
