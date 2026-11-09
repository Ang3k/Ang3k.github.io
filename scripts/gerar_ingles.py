"""Gera a versão em inglês do site (pasta en/) a partir das páginas em português.

Uso (na raiz do repositório):

    py -3.11 scripts/gerar_ingles.py              # gera en/ e sitemap.xml
    py -3.11 scripts/gerar_ingles.py --pendentes  # lista o que falta traduzir

As páginas em português são a fonte. O script separa cada página em trechos de
texto: o conteúdo de um elemento que tem texto próprio (um <p>, um <li>, um
<h2>, com o negrito e os links que estiverem dentro) e os atributos de texto
(alt, aria-label, title e as descrições do <head>). Cada trecho ganha uma chave
curta, calculada a partir do texto em português.

As traduções ficam em i18n/en/<página>.txt, assim:

    @@ 1a2b3c4d5e
    Texto em inglês, com o mesmo HTML interno do original.

    @@ 6f7a8b9c0d
    =

"=" mantém o texto original (nomes de ferramentas, números que não mudam).
Quando um texto em português muda, a chave dele muda também, e o script avisa
que aquele trecho está sem tradução. Use --pendentes para ver o texto original
de cada chave que falta.

O script também:
- corrige os caminhos relativos para a profundidade das páginas em en/;
- troca links entre páginas (e o currículo) pelo equivalente em inglês;
- escreve, nas duas versões, o bloco de idioma do <head> (canonical, hreflang,
  og:locale e o redirecionamento pelo idioma do navegador) e o botão PT/EN;
- gera sitemap.xml.

Não edite en/ à mão: o próximo build sobrescreve.
"""

from __future__ import annotations

import hashlib
import posixpath
import re
import sys
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DOMINIO = "https://angelmansilla.com.br/"

# (página em português, página em inglês, catálogo em i18n/en/)
PAGINAS = [
    ("index.html", "en/index.html", "index"),
    ("projetos/dengue/index.html", "en/projects/dengue/index.html", "dengue"),
    ("projetos/home-credit/index.html", "en/projects/home-credit/index.html", "home-credit"),
    ("projetos/churn/index.html", "en/projects/churn/index.html", "churn"),
    ("projetos/imdb/index.html", "en/projects/imdb/index.html", "imdb"),
]

# Arquivos que têm versão própria em inglês.
EQUIVALENTES = {
    "assets/angel-mansilla-curriculo.pdf": "assets/angel-mansilla-resume.pdf",
}

PT_PARA_EN = {pt: en for pt, en, _ in PAGINAS}
PT_PARA_EN.update(EQUIVALENTES)

INICIO_BLOCO = "<!-- idioma: gerado por scripts/gerar_ingles.py -->"
FIM_BLOCO = "<!-- /idioma -->"
INICIO_SELETOR = "<!-- seletor de idioma -->"
FIM_SELETOR = "<!-- /seletor de idioma -->"

# Robôs de busca e de pré-visualização de links não são redirecionados.
ROBOS = "bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|lighthouse"

SCRIPT_IDIOMA = """<script>
      (function () {
        var atual = "%(atual)s";
        var destino = "%(destino)s";
        document.addEventListener("click", function (evento) {
          var link = evento.target.closest && evento.target.closest("[data-idioma]");
          if (!link) return;
          try {
            localStorage.setItem("idioma", link.getAttribute("data-idioma"));
          } catch (erro) {}
        });
        if (/%(robos)s/i.test(navigator.userAgent)) return;
        var escolhido = null;
        try {
          escolhido = localStorage.getItem("idioma");
        } catch (erro) {}
        if (!escolhido) {
          try {
            if (document.referrer && new URL(document.referrer).origin === location.origin) return;
          } catch (erro) {}
          var lista = navigator.languages && navigator.languages.length
            ? navigator.languages
            : [navigator.language || ""];
          escolhido = "en";
          for (var i = 0; i < lista.length; i++) {
            var codigo = String(lista[i]).toLowerCase();
            if (codigo.indexOf("pt") === 0) { escolhido = "pt"; break; }
            if (codigo.indexOf("en") === 0) { escolhido = "en"; break; }
          }
        }
        if (escolhido !== atual && (escolhido === "pt" || escolhido === "en")) {
          location.replace(destino + location.hash);
        }
      })();
    </script>"""


# ---------- trechos de texto ----------

VAZIOS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}
SEM_TRADUCAO = {"script", "style", "pre", "code"}
ATRIBUTOS_TEXTO = {"alt", "aria-label", "title", "placeholder"}
METAS_TEXTO = {"description", "og:title", "og:description", "og:image:alt", "twitter:title", "twitter:description"}


@dataclass
class Trecho:
    inicio: int
    fim: int
    texto: str  # como está no HTML

    @property
    def normalizado(self) -> str:
        return " ".join(self.texto.split())

    @property
    def chave(self) -> str:
        return hashlib.sha1(self.normalizado.encode("utf-8")).hexdigest()[:10]


class Extrator(HTMLParser):
    def __init__(self, html: str):
        super().__init__(convert_charrefs=True)
        self.html = html
        self.linhas = [0]
        for posicao, caractere in enumerate(html):
            if caractere == "\n":
                self.linhas.append(posicao + 1)
        self.pilha: list[dict] = []
        self.elementos: list[Trecho] = []
        self.atributos: list[Trecho] = []

    def posicao(self) -> int:
        linha, coluna = self.getpos()
        return self.linhas[linha - 1] + coluna

    def dentro_de_codigo(self) -> bool:
        return any(item["tag"] in SEM_TRADUCAO for item in self.pilha)

    def handle_starttag(self, tag, attrs):
        inicio = self.posicao()
        texto_tag = self.get_starttag_text() or ""
        fim_tag = inicio + len(texto_tag)
        if not self.dentro_de_codigo():
            self.coletar_atributos(tag, dict(attrs), texto_tag, inicio)
        if tag not in VAZIOS and not texto_tag.endswith("/>"):
            self.pilha.append({"tag": tag, "inicio": fim_tag, "texto_proprio": False})

    def coletar_atributos(self, tag, attrs, texto_tag, inicio):
        nomes = set(ATRIBUTOS_TEXTO)
        if tag == "meta" and (attrs.get("name") in METAS_TEXTO or attrs.get("property") in METAS_TEXTO):
            nomes.add("content")
        for achado in re.finditer(r'\s([a-zA-Z-]+)="([^"]*)"', texto_tag):
            if achado.group(1).lower() in nomes and achado.group(2).strip():
                self.atributos.append(
                    Trecho(inicio + achado.start(2), inicio + achado.end(2), achado.group(2))
                )

    def handle_startendtag(self, tag, attrs):
        if not self.dentro_de_codigo():
            inicio = self.posicao()
            self.coletar_atributos(tag, dict(attrs), self.get_starttag_text() or "", inicio)

    def handle_endtag(self, tag):
        fim = self.posicao()
        while self.pilha:
            item = self.pilha.pop()
            if item["tag"] == tag:
                if item["texto_proprio"] and tag not in SEM_TRADUCAO and not self.dentro_de_codigo():
                    self.elementos.append(Trecho(item["inicio"], fim, self.html[item["inicio"]:fim]))
                return

    def handle_data(self, data):
        if self.pilha and data.strip():
            self.pilha[-1]["texto_proprio"] = True


def tem_conteudo(trecho: Trecho) -> bool:
    """Pula trechos só com símbolos (setas, dois-pontos) ou só com <code>."""
    sem_codigo = re.sub(r"<code\b.*?</code>", "", trecho.texto, flags=re.S)
    sem_tags = re.sub(r"<[^>]+>", "", sem_codigo)
    return bool(re.search(r"[0-9A-Za-zÀ-ÿ]", sem_tags))


def extrair(html: str) -> list[Trecho]:
    extrator = Extrator(html)
    extrator.feed(html)
    extrator.close()
    # Um elemento dentro de outro que já é trecho vai junto com o de fora.
    elementos = sorted(extrator.elementos, key=lambda t: (t.inicio, -t.fim))
    externos: list[Trecho] = []
    for trecho in elementos:
        if externos and trecho.inicio >= externos[-1].inicio and trecho.fim <= externos[-1].fim:
            continue
        externos.append(trecho)
    atributos = [
        a for a in extrator.atributos
        if not any(e.inicio <= a.inicio and a.fim <= e.fim for e in externos)
    ]
    return [t for t in sorted(externos + atributos, key=lambda t: t.inicio) if tem_conteudo(t)]


# ---------- catálogo ----------

def caminho_catalogo(nome: str) -> Path:
    return RAIZ / "i18n" / "en" / f"{nome}.txt"


def ler_catalogo(nome: str) -> dict[str, str]:
    arquivo = caminho_catalogo(nome)
    if not arquivo.exists():
        return {}
    catalogo, chave, linhas = {}, None, []
    for linha in arquivo.read_text(encoding="utf-8").splitlines():
        if linha.startswith("@@ "):
            if chave:
                catalogo[chave] = "\n".join(linhas).strip()
            chave, linhas = linha[3:].strip(), []
        elif linha.startswith("#") and chave is None:
            continue
        else:
            linhas.append(linha)
    if chave:
        catalogo[chave] = "\n".join(linhas).strip()
    return catalogo


def traduzir(html: str, catalogo: dict[str, str]) -> tuple[str, list[Trecho]]:
    faltando, partes, cursor = [], [], 0
    for trecho in extrair(html):
        traducao = catalogo.get(trecho.chave)
        if traducao is None:
            faltando.append(trecho)
            continue
        if traducao == "=":
            continue
        # Mantém os espaços e quebras de linha das pontas do original.
        antes = trecho.texto[: len(trecho.texto) - len(trecho.texto.lstrip())]
        depois = trecho.texto[len(trecho.texto.rstrip()):]
        partes.append(html[cursor:trecho.inicio] + antes + traducao + depois)
        cursor = trecho.fim
    partes.append(html[cursor:])
    return "".join(partes), faltando


# ---------- caminhos ----------

def url_publica(pagina: str) -> str:
    """index.html -> https://dominio/ ; projetos/x/index.html -> https://dominio/projetos/x/"""
    pasta = posixpath.dirname(pagina)
    return DOMINIO + (pasta + "/" if pasta else "")


def link_pasta(de: str, para: str) -> str:
    """Link relativo da página `de` para a pasta da página `para` (termina em /)."""
    alvo = posixpath.dirname(para) or "."
    rel = posixpath.relpath(alvo, posixpath.dirname(de) or ".")
    return "./" if rel == "." else rel + "/"


def reescrever_url(url: str, pagina_pt: str, pagina_en: str) -> str:
    if not url or re.match(r"^(?:[a-z][a-z0-9+.-]*:|#|/)", url, re.I):
        return url
    caminho, sufixo = url, ""
    for separador in ("#", "?"):
        if separador in caminho:
            caminho, resto = caminho.split(separador, 1)
            sufixo = separador + resto + sufixo
    if not caminho:
        return url
    pasta = caminho.endswith("/")
    absoluto = posixpath.normpath(posixpath.join(posixpath.dirname(pagina_pt), caminho))
    if absoluto == ".":
        absoluto, pasta = "", True
    chave = posixpath.join(absoluto, "index.html") if pasta else absoluto
    if chave in PT_PARA_EN:
        destino = PT_PARA_EN[chave]
        if pasta:  # mantém o estilo "pasta/" do link original
            destino = posixpath.dirname(destino)
    else:
        destino = absoluto
    base = posixpath.dirname(pagina_en) or "."
    final = posixpath.relpath(destino or ".", base)
    if pasta:
        final = "./" if final == "." else final + "/"
    if not final.startswith("."):
        final = "./" + final
    return final + sufixo


ATRIBUTO_URL = re.compile(r'(\s(?:href|src|poster)=")([^"]*)(")')
ATRIBUTO_SRCSET = re.compile(r'(\ssrcset=")([^"]*)(")')
ATRIBUTO_CONTENT = re.compile(r'(\scontent=")((?:\./|\.\./|assets/)[^"]*)(")')


def reescrever_caminhos(html: str, pagina_pt: str, pagina_en: str) -> str:
    def simples(m: re.Match) -> str:
        return m.group(1) + reescrever_url(m.group(2), pagina_pt, pagina_en) + m.group(3)

    def srcset(m: re.Match) -> str:
        itens = []
        for item in m.group(2).split(","):
            partes = item.strip().split(None, 1)
            if partes:
                partes[0] = reescrever_url(partes[0], pagina_pt, pagina_en)
                itens.append(" ".join(partes))
        return m.group(1) + ", ".join(itens) + m.group(3)

    html = ATRIBUTO_URL.sub(simples, html)
    html = ATRIBUTO_SRCSET.sub(srcset, html)
    return ATRIBUTO_CONTENT.sub(simples, html)


# ---------- blocos de idioma ----------

def bloco_head(pagina_pt: str, pagina_en: str, idioma: str) -> str:
    url_pt, url_en = url_publica(pagina_pt), url_publica(pagina_en)
    if idioma == "pt":
        canonica, locale, alternativo = url_pt, "pt_BR", "en_US"
        destino = link_pasta(pagina_pt, pagina_en)
    else:
        canonica, locale, alternativo = url_en, "en_US", "pt_BR"
        destino = link_pasta(pagina_en, pagina_pt)
    script = SCRIPT_IDIOMA % {"atual": idioma, "destino": destino, "robos": ROBOS}
    linhas = [
        INICIO_BLOCO,
        f'<link rel="canonical" href="{canonica}">',
        f'<link rel="alternate" hreflang="pt-BR" href="{url_pt}">',
        f'<link rel="alternate" hreflang="en" href="{url_en}">',
        f'<link rel="alternate" hreflang="x-default" href="{url_en}">',
        f'<meta property="og:url" content="{canonica}">',
        f'<meta property="og:locale" content="{locale}">',
        f'<meta property="og:locale:alternate" content="{alternativo}">',
        script,
        FIM_BLOCO,
    ]
    return "\n    ".join(linhas)


def seletor(pagina_pt: str, pagina_en: str, idioma: str) -> str:
    if idioma == "pt":
        href = link_pasta(pagina_pt, pagina_en)
        botao = (
            f'<a class="nav-lang" href="{href}" hreflang="en" lang="en" '
            'data-idioma="en" aria-label="Read this page in English">EN</a>'
        )
    else:
        href = link_pasta(pagina_en, pagina_pt)
        botao = (
            f'<a class="nav-lang" href="{href}" hreflang="pt-BR" lang="pt-BR" '
            'data-idioma="pt" aria-label="Ler esta página em português">PT</a>'
        )
    return INICIO_SELETOR + botao + FIM_SELETOR


def trocar_entre(html: str, inicio: str, fim: str, novo: str) -> str:
    i, j = html.find(inicio), html.find(fim)
    return html[:i] + novo + html[j + len(fim):]


# Tags que o bloco de idioma gera. Se a página em português tiver uma cópia escrita
# à mão, ela sai, para não ficar duplicada (e errada na versão em inglês).
TAGS_DO_BLOCO = re.compile(
    r'\n[ \t]*<(?:link rel="canonical"|meta property="og:(?:url|locale(?::alternate)?)")[^>]*>'
)

# Textos dentro do JSON-LD, que fica num <script> e não passa pelo catálogo.
DADOS_ESTRUTURADOS_EN = [
    ('"inLanguage": "pt-BR"', '"inLanguage": "en"'),
    ('"Ciência de Dados"', '"Data Science"'),
]


def preparar_fonte(html: str, pagina_pt: str, pagina_en: str) -> str:
    """Coloca (ou atualiza) o bloco de idioma e o botão PT/EN na página em português."""
    if INICIO_BLOCO in html:
        html = trocar_entre(html, INICIO_BLOCO, FIM_BLOCO, "<!--@@BLOCO@@-->")
    else:
        html = html.replace("</head>", "  <!--@@BLOCO@@-->\n  </head>", 1)
    html = TAGS_DO_BLOCO.sub("", html)
    html = html.replace("<!--@@BLOCO@@-->", bloco_head(pagina_pt, pagina_en, "pt"))
    botao = seletor(pagina_pt, pagina_en, "pt")
    if INICIO_SELETOR in html:
        return trocar_entre(html, INICIO_SELETOR, FIM_SELETOR, botao)
    nav = re.search(r'<nav class="(?:main-nav|wix-project-nav)"[^>]*>.*?(\s*)</nav>', html, re.S)
    if not nav:
        raise SystemExit(f"{pagina_pt}: não achei a navegação principal para o botão PT/EN.")
    posicao = nav.start(1)
    return html[:posicao] + nav.group(1) + "  " + botao + html[posicao:]


def versao_inglesa(html: str, pagina_pt: str, pagina_en: str, catalogo) -> tuple[str, list[Trecho]]:
    html = trocar_entre(html, INICIO_BLOCO, FIM_BLOCO, "<!--@@BLOCO@@-->")
    html = trocar_entre(html, INICIO_SELETOR, FIM_SELETOR, "<!--@@SELETOR@@-->")
    html, faltando = traduzir(html, catalogo)
    html = reescrever_caminhos(html, pagina_pt, pagina_en)
    html = html.replace('<html lang="pt-BR">', '<html lang="en">', 1)
    for antes, depois in DADOS_ESTRUTURADOS_EN:
        html = html.replace(antes, depois)
    html = html.replace("<!--@@BLOCO@@-->", bloco_head(pagina_pt, pagina_en, "en"))
    html = html.replace("<!--@@SELETOR@@-->", seletor(pagina_pt, pagina_en, "en"))
    return html, faltando


# ---------- conferência ----------

PALAVRAS_PT = re.compile(
    r"[ãõçâêôáéíóú]|\b(?:de|da|das|dos|para|com|não|uma|que|em|pelo|pela|mais|como|são|foi|entre)\b",
    re.I,
)

# Textos que ficam em português de propósito ou que só parecem português.
NAO_E_PORTUGUES = {"Rio de Janeiro, Brazil", "Ler esta página em português"}
# Nomes próprios em português que aparecem no texto em inglês.
NOMES_PROPRIOS = re.compile(r"Júlia|Estado de Minas|Aurélien Géron|Rio de Janeiro|São Paulo")


def sobras_em_portugues(html: str) -> list[str]:
    vistos, sobras = set(), []
    for trecho in extrair(html):
        texto = re.sub(r"<[^>]+>", " ", re.sub(r"<code\b.*?</code>", " ", trecho.texto, flags=re.S))
        texto = " ".join(texto.split())
        if not texto or texto in vistos or texto in NAO_E_PORTUGUES or re.search(r"https?:|@|www\.", texto):
            continue
        vistos.add(texto)
        if PALAVRAS_PT.search(NOMES_PROPRIOS.sub(" ", texto)):
            sobras.append(texto[:100])
    return sobras


# ---------- sitemap ----------

def sitemap() -> str:
    entradas = []
    for pt, en, _ in PAGINAS:
        alternativas = (
            f'    <xhtml:link rel="alternate" hreflang="pt-BR" href="{url_publica(pt)}"/>\n'
            f'    <xhtml:link rel="alternate" hreflang="en" href="{url_publica(en)}"/>\n'
            f'    <xhtml:link rel="alternate" hreflang="x-default" href="{url_publica(en)}"/>\n'
        )
        for pagina in (pt, en):
            entradas.append(f"  <url>\n    <loc>{url_publica(pagina)}</loc>\n{alternativas}  </url>")
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
        'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
        + "\n".join(entradas)
        + "\n</urlset>\n"
    )


# ---------- arquivos ----------

def ler(caminho: Path) -> str:
    return caminho.read_text(encoding="utf-8-sig")


def gravar(caminho: Path, texto: str) -> bool:
    caminho.parent.mkdir(parents=True, exist_ok=True)
    if caminho.exists() and caminho.read_text(encoding="utf-8") == texto:
        return False
    caminho.write_text(texto, encoding="utf-8", newline="\n")
    return True


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    so_pendentes = "--pendentes" in sys.argv[1:]
    faltas, avisos = 0, []
    for pagina_pt, pagina_en, nome in PAGINAS:
        fonte = RAIZ / pagina_pt
        html_pt = preparar_fonte(ler(fonte), pagina_pt, pagina_en)
        catalogo = ler_catalogo(nome)
        html_en, faltando = versao_inglesa(html_pt, pagina_pt, pagina_en, catalogo)
        faltas += len(faltando)
        if so_pendentes:
            for trecho in faltando:
                print(f"@@ {trecho.chave}  [{nome}]\n{trecho.normalizado}\n")
            continue
        if gravar(fonte, html_pt):
            print(f"Atualizado: {pagina_pt}")
        if faltando:
            print(f"{nome}: {len(faltando)} trechos sem tradução em {caminho_catalogo(nome).relative_to(RAIZ)}")
            continue
        sobrando = set(catalogo) - {t.chave for t in extrair(html_pt)}
        if sobrando:
            avisos.append(f"{nome}: {len(sobrando)} traduções sem uso no catálogo (texto antigo?)")
        avisos += [f"{pagina_en}: {texto!r}" for texto in sobras_em_portugues(html_en)]
        if gravar(RAIZ / pagina_en, html_en):
            print(f"Gerado: {pagina_en}")
    if so_pendentes:
        print(f"Total sem tradução: {faltas}")
        return 0
    if gravar(RAIZ / "sitemap.xml", sitemap()):
        print("Gerado: sitemap.xml")
    for aviso in avisos:
        print(f"  ? {aviso}")
    if faltas:
        print("Rode com --pendentes para ver o texto original do que falta.")
        return 1
    print("Versão em inglês em dia.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
