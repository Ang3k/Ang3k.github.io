"""Gera o PDF do currículo a partir de curriculo/curriculo.html (ou da versão em inglês).

Uso (na raiz do repositório):

    py -3.11 curriculo/gerar_pdf.py
    py -3.11 curriculo/gerar_pdf.py --idioma en
    py -3.11 curriculo/gerar_pdf.py --preview C:/caminho/previa.png
    py -3.11 curriculo/gerar_pdf.py --saida C:/caminho/teste.pdf

Por padrão, sobrescreve assets/angel-mansilla-curriculo.pdf (português) ou
assets/angel-mansilla-resume.pdf (inglês, com --idioma en), que são os arquivos
linkados no site. Precisa de playwright e pymupdf, além do Chrome ou do Edge
instalado (não é preciso baixar o Chromium do Playwright).
"""

from __future__ import annotations

import argparse
import sys
import tempfile
from pathlib import Path

try:
    import pymupdf
    from playwright.sync_api import Error as PlaywrightError
    from playwright.sync_api import sync_playwright
except ImportError as erro:  # pragma: no cover - mensagem para quem roda à mão
    sys.exit(
        f"Dependência ausente ({erro.name}). Rode com o Python que tem playwright e "
        "pymupdf, por exemplo: py -3.11 curriculo/gerar_pdf.py"
    )

PASTA = Path(__file__).resolve().parent
RAIZ = PASTA.parent
# idioma -> (HTML de origem, PDF publicado, assunto nos metadados)
VERSOES = {
    "pt": (PASTA / "curriculo.html", RAIZ / "assets" / "angel-mansilla-curriculo.pdf",
           "Currículo de Angel Mansilla"),
    "en": (PASTA / "curriculo-en.html", RAIZ / "assets" / "angel-mansilla-resume.pdf",
           "Resume of Angel Mansilla"),
}

METADADOS = {
    "title": "ML Resume - Angel Mansilla",
    "author": "Angel Mansilla",
    "keywords": "Machine Learning, Data Science, Python",
    "creator": "curriculo/gerar_pdf.py",
    "producer": "Chromium + PyMuPDF",
}

# Tamanho exato da página do Canva, em pt.
LARGURA_PT, ALTURA_PT = 595.5, 842.25

# Margem de segurança à direita, em pt: o texto não pode passar disso.
LIMITE_DIREITO_PT = 580.5

# Espaço mínimo entre a última linha e o fim da página, em pt. No original
# do Canva sobram 22,9pt; abaixo de 20pt o texto parece encostado na borda.
MARGEM_INFERIOR_PT = 20

# O Chrome arredonda posições para pixels inteiros (0,75pt no PDF), o que
# desloca linhas em até 0,4pt. Renderizar com zoom 10 e escala 0,1 deixa a
# grade em 0,075pt, e as posições batem com o original do Canva.
ZOOM = 10


def abrir_navegador(playwright):
    """Usa o Chrome ou o Edge já instalados; o Chromium do Playwright é o último recurso."""
    tentativas = ({"channel": "chrome"}, {"channel": "msedge"}, {})
    ultimo_erro = None
    for opcoes in tentativas:
        try:
            return playwright.chromium.launch(**opcoes)
        except PlaywrightError as erro:
            ultimo_erro = erro
    sys.exit(f"Não consegui abrir Chrome, Edge nem Chromium: {ultimo_erro}")


def renderizar(html: Path, destino: Path) -> dict:
    with sync_playwright() as playwright:
        navegador = abrir_navegador(playwright)
        pagina = navegador.new_page()
        pagina.goto(html.as_uri())
        pagina.evaluate("document.fonts.ready")
        medidas = pagina.evaluate(
            """() => {
                const page = document.querySelector('.page');
                const topo = page.getBoundingClientRect().top;
                const fundo = Math.max(
                    ...[...page.querySelectorAll('*')].map(e => e.getBoundingClientRect().bottom)
                );
                const fontes = [...document.fonts].filter(f => f.status === 'loaded').length;
                return {
                    fimConteudo: fundo - topo,
                    alturaPagina: page.clientHeight,
                    fontesCarregadas: fontes,
                };
            }"""
        )
        pagina.add_style_tag(content=f"@media print {{ .page {{ zoom: {ZOOM}; }} }}")
        pagina.pdf(
            path=str(destino),
            prefer_css_page_size=True,
            print_background=True,
            scale=1 / ZOOM,
            margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
            tagged=True,
            outline=True,
        )
        navegador.close()
    return medidas


def verificar(pdf: Path, medidas: dict) -> list[str]:
    problemas = []
    if medidas["fontesCarregadas"] < 4:
        problemas.append(
            f"Só {medidas['fontesCarregadas']} de 4 pesos da Poppins carregaram; "
            "confira curriculo/fonts/."
        )
    folga_pt = (medidas["alturaPagina"] - medidas["fimConteudo"]) * 0.75  # px -> pt
    if folga_pt < MARGEM_INFERIOR_PT:
        falta_pt = MARGEM_INFERIOR_PT - folga_pt
        problemas.append(
            f"Falta espaço: corte uns {falta_pt:.1f}pt (cerca de {falta_pt / 12:.1f} linhas). "
            f"A última linha ficou a {folga_pt:.1f}pt do fim da página e o mínimo é "
            f"{MARGEM_INFERIOR_PT}pt. Corte ou resuma algum texto; não reduza fontes nem "
            "espaços, que reproduzem o design original."
        )
    with pymupdf.open(pdf) as doc:
        if doc.page_count != 1:
            problemas.append(f"O PDF saiu com {doc.page_count} páginas; o currículo deve ter 1.")
        fontes = {f[3].split("+")[-1] for f in doc[0].get_fonts()}
        if not all(nome.startswith("Poppins") for nome in fontes):
            problemas.append(f"Apareceram fontes fora da Poppins: {sorted(fontes)}")
        for bloco in doc[0].get_text("dict")["blocks"]:
            for linha in bloco.get("lines", []):
                if linha["bbox"][2] > LIMITE_DIREITO_PT:
                    texto = "".join(s["text"] for s in linha["spans"]).strip()
                    problemas.append(f"Linha passando da margem direita: {texto[:60]!r}")
    return problemas


def finalizar(origem: Path, destino: Path, assunto: str) -> None:
    with pymupdf.open(origem) as doc:
        # Com escala, o Chrome devolve a página com alguns décimos de pt de
        # diferença. Fixa o tamanho exato, ancorado no canto superior esquerdo.
        pagina = doc[0]
        topo = pagina.mediabox.y1
        pagina.set_mediabox(pymupdf.Rect(0, topo - ALTURA_PT, LARGURA_PT, topo))
        doc.set_metadata({**METADADOS, "subject": assunto})
        destino.parent.mkdir(parents=True, exist_ok=True)
        doc.save(destino, garbage=3, deflate=True)


def salvar_preview(pdf: Path, png: Path, dpi: int = 144) -> None:
    with pymupdf.open(pdf) as doc:
        png.parent.mkdir(parents=True, exist_ok=True)
        doc[0].get_pixmap(dpi=dpi).save(png)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--idioma", choices=sorted(VERSOES), default="pt",
                        help="pt (curriculo.html) ou en (curriculo-en.html)")
    parser.add_argument("--saida", type=Path, help="PDF de saída (padrão: o PDF do site)")
    parser.add_argument("--preview", type=Path, help="Também salva um PNG da página")
    args = parser.parse_args()
    html, pdf_padrao, assunto = VERSOES[args.idioma]
    args.saida = args.saida or pdf_padrao

    with tempfile.TemporaryDirectory() as tmp:
        bruto = Path(tmp) / "bruto.pdf"
        medidas = renderizar(html, bruto)
        problemas = verificar(bruto, medidas)
        if problemas:
            print("O PDF NÃO foi salvo. Problemas encontrados:")
            for problema in problemas:
                print(f"  - {problema}")
            if args.preview:
                # Ajuda a achar onde cortar (linhas com uma palavra sozinha etc.).
                salvar_preview(bruto, args.preview)
                print(f"Prévia do rascunho recusado: {args.preview}")
            return 1
        finalizar(bruto, args.saida, assunto)

    folga_pt = (medidas["alturaPagina"] - medidas["fimConteudo"]) * 0.75
    print(f"PDF gerado: {args.saida}")
    print(f"Espaço livre no fim da página: {folga_pt:.1f}pt (mínimo {MARGEM_INFERIOR_PT}pt)")
    if args.preview:
        salvar_preview(args.saida, args.preview)
        print(f"Prévia: {args.preview}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
