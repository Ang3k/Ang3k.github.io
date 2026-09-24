/* Introdução "o ponto fora da curva": regressão avaliada no conjunto de
   teste, zoom no outlier e transição FLIP do nome até o header. Ativada
   apenas quando o script inline do <head> marca html.intro-pending. */
(function () {
  "use strict";

  var root = document.documentElement;
  if (!root.classList.contains("intro-pending")) {
    return;
  }

  /* Ritmo levemente desacelerado, preservando a sobreposição dos atos. */
  var TIME_SCALE = 0.8;

  var overlay = document.getElementById("intro-overlay");
  var device = overlay ? overlay.querySelector(".intro-device") : null;
  var chart = document.getElementById("intro-chart");
  var world = document.getElementById("intro-world");
  var pointsGroup = document.getElementById("intro-points");
  var metric = document.getElementById("intro-metric");
  var lineReveal = document.getElementById("intro-line-reveal");
  var residual = document.getElementById("intro-residual");
  var ring = document.getElementById("intro-ring");
  var skipButton = document.getElementById("intro-skip");
  var nameEl = document.getElementById("intro-name");
  var headerName = document.querySelector(".site-name");

  if (!overlay || !device || !chart || !world || !pointsGroup || !lineReveal || !nameEl || !headerName) {
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
  var frameRequest = 0;
  var outlierDot = null;
  var initialViewBox = [0, 0, 1000, 620];

  function wait(ms) {
    return new Promise(function (resolve) {
      timers.push(setTimeout(resolve, Math.round(ms * TIME_SCALE)));
    });
  }

  function finish() {
    if (done) {
      return;
    }
    done = true;
    timers.forEach(clearTimeout);
    cancelAnimationFrame(frameRequest);
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
       quase juntos; onde há vazio no eixo, uma pausa, como uma linha de
       scan avançando pelos dados. */
    var xs = POINTS.map(function (pair) { return pair[0]; });
    var minX = Math.min.apply(null, xs);
    var maxX = Math.max.apply(null, xs);
    var sweep = 1900 * TIME_SCALE;

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
    halo.style.animationDelay = Math.round(80 * TIME_SCALE) + "ms";
    pointsGroup.appendChild(halo);

    outlierDot = document.createElementNS(SVG_NS, "circle");
    outlierDot.setAttribute("class", "intro-point intro-point-outlier");
    outlierDot.setAttribute("cx", OUTLIER.x);
    outlierDot.setAttribute("cy", OUTLIER.y);
    outlierDot.setAttribute("r", 7.5);
    outlierDot.style.animationDelay = "0ms";
    pointsGroup.appendChild(outlierDot);
  }

  /* Equivalente a cubic-bezier() do CSS: resolve x(t) = progresso por
     Newton-Raphson, com bisseção como garantia, e devolve y(t). */
  function cubicBezier(x1, y1, x2, y2) {
    function sample(t, p1, p2) {
      return ((1 - 3 * p2 + 3 * p1) * t + (3 * p2 - 6 * p1)) * t * t + 3 * p1 * t;
    }

    function slope(t, p1, p2) {
      return 3 * (1 - 3 * p2 + 3 * p1) * t * t + 2 * (3 * p2 - 6 * p1) * t + 3 * p1;
    }

    return function (progress) {
      if (progress <= 0) {
        return 0;
      }
      if (progress >= 1) {
        return 1;
      }

      var t = progress;
      for (var i = 0; i < 8; i++) {
        var error = sample(t, x1, x2) - progress;
        if (Math.abs(error) < 1e-7) {
          return sample(t, y1, y2);
        }
        var derivative = slope(t, x1, x2);
        if (Math.abs(derivative) < 1e-6) {
          break;
        }
        t -= error / derivative;
      }

      var low = 0;
      var high = 1;
      t = progress;
      while (high - low > 1e-7) {
        if (sample(t, x1, x2) < progress) {
          low = t;
        } else {
          high = t;
        }
        t = (low + high) / 2;
      }
      return sample(t, y1, y2);
    };
  }

  var EASE_OUT = cubicBezier(0, 0, 0.58, 1);
  var EASE_IN_OUT = cubicBezier(0.42, 0, 0.58, 1);
  var ZOOM_EASE = cubicBezier(0.45, 0, 0.1, 1);

  /* Zoom no outlier e anel pulsante, quadro a quadro. Antes eram uma
     transição de transform no grupo e keyframes de opacity/scale no anel;
     os valores são os mesmos, mas escritos como atributos do SVG, o Chrome
     não cria camadas de composição para eles. O zoom é
     translate(-714.8, -145) scale(1.9) em 1520ms; o anel entra em 400ms
     (ease-out, escala 0.55 → 1) e depois pulsa a cada 1440ms (ease-in-out,
     escala 1 → 1.12 e opacidade 1 → 0.65 no meio do ciclo). Escalar um
     círculo pelo próprio centro equivale a multiplicar o raio. */
  function animateOutlierFocus() {
    var ringRadius = parseFloat(ring.getAttribute("r"));
    var start = null;

    function step(now) {
      if (start === null) {
        start = now;
      }
      var elapsed = now - start;

      var zoom = ZOOM_EASE(elapsed / 1520);
      world.setAttribute(
        "transform",
        "translate(" + -714.8 * zoom + " " + -145 * zoom + ") scale(" + (1 + 0.9 * zoom) + ")"
      );

      var scale;
      var opacity;
      if (elapsed < 400) {
        var entry = EASE_OUT(elapsed / 400);
        scale = 0.55 + 0.45 * entry;
        opacity = entry;
      } else {
        var cycle = ((elapsed - 400) % 1440) / 1440;
        var pulse = cycle < 0.5 ?
          EASE_IN_OUT(cycle * 2) :
          1 - EASE_IN_OUT(cycle * 2 - 1);
        scale = 1 + 0.12 * pulse;
        opacity = 1 - 0.35 * pulse;
      }
      ring.setAttribute("r", ringRadius * scale);
      ring.style.strokeOpacity = opacity;

      frameRequest = requestAnimationFrame(step);
    }

    frameRequest = requestAnimationFrame(step);
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

  function prepareCameraZoom() {
    var zoom = getPageZoom();
    var overlayRect = overlay.getBoundingClientRect();
    var deviceRect = device.getBoundingClientRect();
    var chartRect = chart.getBoundingClientRect();

    if (!overlayRect.width || !overlayRect.height || !deviceRect.width || !chartRect.width) {
      return;
    }

    /* Primeiro movimento: a câmera atravessa a moldura e centraliza a tela
       inteira. O scale uniforme preserva o notebook; o SVG ainda não muda. */
    var targetScale = Math.max(
      overlayRect.width / chartRect.width,
      overlayRect.height / chartRect.height
    ) * 1.04;
    var deviceCenterX = deviceRect.left + deviceRect.width / 2;
    var deviceCenterY = deviceRect.top + deviceRect.height / 2;
    var chartCenterX = chartRect.left + chartRect.width / 2;
    var chartCenterY = chartRect.top + chartRect.height / 2;
    var targetCenterX = overlayRect.left + overlayRect.width / 2 -
      (chartCenterX - deviceCenterX) * targetScale;
    var targetCenterY = overlayRect.top + overlayRect.height / 2 -
      (chartCenterY - deviceCenterY) * targetScale;

    device.style.setProperty("--intro-camera-x", (targetCenterX - deviceCenterX) / zoom + "px");
    device.style.setProperty("--intro-camera-y", (targetCenterY - deviceCenterY) / zoom + "px");
    device.style.setProperty("--intro-camera-scale", targetScale);
  }

  async function flipToHeader() {
    overlay.classList.add("is-flip");
    await wait(260);

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
    nameEl.style.transition = "transform 920ms cubic-bezier(0.22, 1, 0.36, 1)";
    nameEl.style.transform = "none";
    await wait(1200);
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

    chart.setAttribute("viewBox", initialViewBox.join(" "));

    /* A timeline se sobrepõe: dados, curva e aproximação da câmera
       acontecem no mesmo movimento, sem quadros de espera entre os atos. */
    await wait(650);

    pointsGroup.classList.add("intro-points-on");
    await wait(300);

    prepareCameraZoom();
    device.classList.add("is-camera-zoom");
    timers.push(setTimeout(function () {
      lineReveal.classList.add("is-on");
    }, Math.round(360 * TIME_SCALE)));
    timers.push(setTimeout(function () {
      metric.classList.add("is-on");
    }, Math.round(1050 * TIME_SCALE)));
    await wait(1900);

    pointsGroup.classList.add("intro-outlier-on");
    residual.classList.add("is-on");
    animateOutlierFocus();
    await wait(1900);

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
