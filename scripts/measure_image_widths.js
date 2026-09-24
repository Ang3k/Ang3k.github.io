// Mede a maior largura (px CSS, já com o zoom da página) em que cada <img>
// aparece no desktop, para o generate_desktop_variants.py dimensionar as
// versões WebP. Grava scripts/image-display-widths.json.
//
// Uso (com o site servido localmente, por exemplo
// `python -m http.server 4173`):
//   node scripts/measure_image_widths.js [http://127.0.0.1:4173]
// Requer Playwright com Chromium.

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const BASE_URL = (process.argv[2] || "http://127.0.0.1:4173").replace(/\/$/, "");
const PAGES = [
  "index.html",
  "projetos/dengue/index.html",
  "projetos/churn/index.html",
  "projetos/imdb/index.html",
  "projetos/home-credit/index.html",
];
// Larguras de janela acima do breakpoint mobile (700px), até monitores 1440p.
const VIEWPORTS = [901, 1024, 1280, 1440, 1680, 1920, 2560];
const OUTPUT = path.join(__dirname, "image-display-widths.json");

(async () => {
  const browser = await chromium.launch();
  const result = {};

  for (const page of PAGES) {
    result[page] = {};
    for (const width of VIEWPORTS) {
      const context = await browser.newContext({ viewport: { width, height: 1000 } });
      const tab = await context.newPage();
      // O hash impede a introdução animada da página inicial.
      await tab.goto(`${BASE_URL}/${page}#medicao`);
      const widths = await tab.evaluate(async () => {
        const images = [...document.images];
        images.forEach((image) => { image.loading = "eager"; });
        await Promise.all(images.map((image) => image.decode().catch(() => {})));

        // getBoundingClientRect já inclui o zoom de <html> em navegadores
        // recentes; a sonda detecta o caso em que não inclui.
        const probe = document.createElement("div");
        probe.style.cssText = "position:absolute;width:100px;height:1px";
        document.body.appendChild(probe);
        const probeWidth = probe.getBoundingClientRect().width;
        probe.remove();
        const zoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
        const factor = Math.abs(probeWidth - 100) < 0.5 ? zoom : 1;

        return images.map((image) => [
          image.getAttribute("src"),
          image.getBoundingClientRect().width * factor,
        ]);
      });

      for (const [src, shown] of widths) {
        result[page][src] = Math.max(result[page][src] || 0, Math.ceil(shown));
      }
      await context.close();
    }
  }

  await browser.close();
  fs.writeFileSync(OUTPUT, JSON.stringify(result, null, 2) + "\n");
  console.log(`Larguras gravadas em ${path.relative(process.cwd(), OUTPUT)}`);
})();
