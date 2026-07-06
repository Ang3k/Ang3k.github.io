# Animação de introdução — "O ponto fora da curva"

Data: 2026-07-06 · Status: aprovado pelo proprietário

## Objetivo

Ao abrir a página inicial, o visitante vê uma animação cinematográfica: um
gráfico de regressão linear avaliado no conjunto de teste, no qual todos os
pontos são bem explicados pela reta — exceto um outlier acima da curva. A
câmera dá zoom nesse ponto, o nome "Angel Mansilla" surge ao lado dele e, em
seguida, viaja até a posição do nome no header do site, conectando Machine
Learning à identidade pessoal.

## Decisões aprovadas

- **Frequência:** uma vez por sessão (`sessionStorage`).
- **Estilo:** editorial claro, idêntico à identidade do site (fundo
  `--paper`, tinta `--ink`, Oswald/Playfair). Anel de destaque do outlier em
  `--red`, já presente na paleta.
- **Reta:** surge como resultado final de um modelo já treinado, desenhada da
  esquerda para a direita, assentada na tendência. A narrativa é a avaliação
  no conjunto de teste ("Conjunto de teste", "R² = 0,94").
- **Nome:** grafia oficial "Angel Mansilla" (site, AGENTS.md, LinkedIn).

### Refinamentos aprovados em iteração (2026-07-06)

- Gráfico com aparência analítica real: grade 5×5 sutil, moldura completa,
  valores fictícios 0–100 nos dois eixos, rótulos "Experiência" (X) e
  "Performance" (Y) — o outlier é quem performa acima do que o modelo
  prevê para o seu nível de experiência.
- O nome parte da borda externa do anel pulsante (folga de 24px), não do
  ponto, para o pulso nunca invadir o texto.
- Tendência quadrática (Bézier `M75 515 Q560 470 940 135`) com 32 pontos
  orgânicos: espaçamento irregular, ruído variado e dispersão maior no topo.
- Outlier enfatizado: vermelho (`--red`), maior (r 7,5), com halo suave, e
  plotado por último, depois de todos os pontos comuns.
- Zoom reenquadrado (`translate(-980px, -38px) scale(2)`) para manter curva,
  resíduo e grade visíveis na cena do nome.
- A intro aguarda a aba ficar visível (`visibilitychange`) antes de começar,
  para não rodar invisível em abas de fundo.

## Abordagem técnica

SVG + JavaScript puro + CSS. Sem dependências externas (exigência do
AGENTS.md). Reta desenhada com `stroke-dashoffset`; zoom de câmera via
`transform` animado no grupo `<g>` do gráfico; nome como elemento DOM real
(fonte Oswald, a mesma do header) que viaja até o masthead com técnica FLIP.

Alternativas descartadas: Canvas 2D (texto serrilhado no zoom, pior
acessibilidade) e GSAP (dependência desnecessária).

## Roteiro (~7 s, sempre pulável)

1. **0–0,4 s** — Overlay em `--paper` com eixos finos e rótulo "Conjunto de
   teste" em Oswald.
2. **0,4–2 s** — ~29 pontos escuros surgem escalonados ao longo de uma
   tendência linear clara. Um deles, bem acima da tendência, é o outlier.
3. **2–3,4 s** — A reta de regressão se desenha da esquerda para a direita.
   Ao completar, surge "R² = 0,94".
4. **3,6–5,2 s** — Zoom suave no outlier; linha tracejada vertical marca o
   resíduo até a reta; anel vermelho pulsa ao redor do ponto.
5. **5,2–6 s** — "Angel Mansilla" surge ao lado do ponto.
6. **6–7,4 s** — FLIP: o nome se move e escala até a posição exata do
   `.site-name` do header enquanto o gráfico se dissolve; o overlay some e a
   página real fica visível, sem salto perceptível.

## Comportamento e robustez

- Botão "Pular introdução" (canto inferior) e tecla Esc saltam ao estado
  final a qualquer momento.
- `prefers-reduced-motion: reduce` → intro não roda.
- Sem JavaScript → intro não aparece (um script inline no `<head>` é quem
  ativa o overlay). Falha de carregamento de `intro.js` → fallback `onerror`
  remove o overlay.
- Scroll travado durante a intro; SVG decorativo com `aria-hidden`; conteúdo
  real da página permanece intacto no DOM (SEO e leitores de tela).
- Responsivo de 320 px a 1440 px; compatível com GitHub Pages (estático,
  caminhos relativos, funciona em subdiretório).
- `sessionStorage` marcado no início da execução; erros de storage tratados.

## Arquivos afetados

- `index.html` — script inline no `<head>`, markup do overlay, tag
  `<script src="./intro.js" defer>`. Somente a home; páginas de projeto não
  mudam.
- `styles.css` — estilos da intro ao final do arquivo.
- `intro.js` — novo; toda a lógica da animação.

## Critérios de aceite

1. Primeira carga da home: animação completa conforme roteiro; nome termina
   exatamente sobre o `.site-name` do header.
2. Recarregar a página na mesma sessão: intro não repete.
3. "Pular introdução" e Esc: página utilizável imediatamente.
4. `prefers-reduced-motion`: site aparece direto, sem overlay.
5. JavaScript desabilitado: site aparece direto, sem overlay preso.
6. Sem rolagem horizontal nem quebra em 320/375/768/1024/1440 px.
