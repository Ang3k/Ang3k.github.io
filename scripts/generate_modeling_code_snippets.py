"""Gera os snippets vetoriais usados na seção de modelagem do projeto SINAN."""

from __future__ import annotations

from html import escape
from pathlib import Path

from pygments import lex
from pygments.lexers import PythonLexer
from pygments.token import Comment, Keyword, Name, Number, Operator, String, Token


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "assets" / "projects" / "dengue"

COLORS = {
    "background": "#000000",
    "border": "#202326",
    "corner": "#454A50",
    "text": "#F1F3F5",
    "pink": "#FF4388",
    "green": "#00CE63",
    "purple": "#C56BFF",
    "blue": "#45A3FF",
    "orange": "#FFA31A",
    "comment": "#72777F",
}


SNIPPETS = {
    "14a-mlp-tabular-code": {
        "title": "Arquitetura tabular da MLP com embeddings e camadas densas",
        "desktop": '''hidden_layers: Sequence[int] = (1024, 512, 256, 128)

self.embeddings = nn.ModuleList(
    nn.Embedding(category_count, embedding_size)
    for category_count, embedding_size in embedding_sizes
)
self.numerical_normalization = nn.BatchNorm1d(numerical_size)

input_size = numerical_size + sum(size for _, size in embedding_sizes)
layers: list[nn.Module] = []
for layer_size in hidden_layers:
    layers.extend([
        nn.Linear(input_size, layer_size),
        nn.LeakyReLU(),
        nn.BatchNorm1d(layer_size),
        nn.Dropout(hidden_dropout),
    ])
    input_size = layer_size

self.layers = nn.Sequential(*layers)
self.output_layer = nn.Linear(input_size, 1)''',
        "mobile": '''hidden_layers: Sequence[int] = (
    1024, 512, 256, 128
)

self.embeddings = nn.ModuleList(
    nn.Embedding(
        category_count,
        embedding_size,
    )
    for category_count, embedding_size
    in embedding_sizes
)
self.numerical_normalization = (
    nn.BatchNorm1d(numerical_size)
)

layers: list[nn.Module] = []
for layer_size in hidden_layers:
    layers.extend([
        nn.Linear(input_size, layer_size),
        nn.LeakyReLU(),
        nn.BatchNorm1d(layer_size),
        nn.Dropout(hidden_dropout),
    ])

self.layers = nn.Sequential(*layers)
self.output_layer = nn.Linear(
    input_size, 1
)''',
    },
    "14b-gradient-boosting-code": {
        "title": "Construção dos modelos LightGBM e XGBoost",
        "desktop": '''if self.model_type == "lgbm":
    defaults = {
        "objective": "binary",
        "device_type": device_type,
        "n_jobs": -1,
        "verbose": -1,
    }
    defaults.update(params)
    return lgb.LGBMClassifier(**defaults)

defaults = {
    "objective": "binary:logistic",
    "device": device,
    "tree_method": "hist",
    "n_jobs": -1,
    "eval_metric": "logloss",
}
defaults.update(params)
return XGBClassifier(**defaults)''',
        "mobile": '''if self.model_type == "lgbm":
    defaults = {
        "objective": "binary",
        "device_type": device_type,
        "n_jobs": -1,
        "verbose": -1,
    }
    defaults.update(params)
    return lgb.LGBMClassifier(
        **defaults
    )
defaults = {
    "objective": "binary:logistic",
    "device": device,
    "tree_method": "hist",
    "n_jobs": -1,
    "eval_metric": "logloss",
}
defaults.update(params)
return XGBClassifier(**defaults)''',
    },
    "15a-ensemble-ponderado-code": {
        "title": "Normalização dos pesos e combinação dos scores do ensemble",
        "desktop": '''recall_total = sum(recalls.values())
weights = {
    name: recall / recall_total
    for name, recall in recalls.items()
}

ensemble_validation = sum(
    validation_scores[name] * weights[name]
    for name in weights
)

ensemble_test = sum(
    test_scores[name] * weights[name]
    for name in weights
)''',
        "mobile": '''recall_total = sum(recalls.values())
weights = {
    name: recall / recall_total
    for name, recall in recalls.items()
}

ensemble_validation = sum(
    validation_scores[name]
    * weights[name]
    for name in weights
)

ensemble_test = sum(
    test_scores[name]
    * weights[name]
    for name in weights
)''',
    },
}


def token_color(token_type: Token) -> str:
    if token_type in Comment:
        return COLORS["comment"]
    if token_type in String:
        return COLORS["green"]
    if token_type in Number:
        return COLORS["blue"]
    if token_type in Keyword:
        return COLORS["pink"]
    if token_type in Name.Function or token_type in Name.Class:
        return COLORS["orange"]
    if token_type in Name.Builtin or token_type in Name.Attribute:
        return COLORS["purple"]
    if token_type in Operator:
        return COLORS["pink"]
    return COLORS["text"]


def highlighted_lines(code: str) -> list[list[tuple[str, str]]]:
    lines: list[list[tuple[str, str]]] = [[]]
    tokens = list(lex(code.rstrip(), PythonLexer()))
    for index, (token_type, value) in enumerate(tokens):
        color = token_color(token_type)
        if token_type in Name:
            previous = ""
            following = ""
            for previous_index in range(index - 1, -1, -1):
                candidate = tokens[previous_index][1].strip()
                if candidate:
                    previous = candidate
                    break
            for following_index in range(index + 1, len(tokens)):
                candidate = tokens[following_index][1].strip()
                if candidate:
                    following = candidate
                    break
            if previous.endswith(".") or following.startswith("("):
                color = COLORS["purple"]
        parts = value.splitlines(keepends=True)
        for part in parts:
            content = part.rstrip("\r\n")
            if content:
                lines[-1].append((color, content))
            if part.endswith(("\n", "\r")):
                lines.append([])
    if lines and not lines[-1]:
        lines.pop()
    return lines


def render_svg(code: str, title: str, *, mobile: bool) -> str:
    width = 720 if mobile else 1600
    font_size = 23 if mobile else 27
    line_height = 35 if mobile else 40
    x_offset = 52 if mobile else 82
    y_offset = 84 if mobile else 90
    lines = highlighted_lines(code)
    height = y_offset + len(lines) * line_height + 62

    rendered_lines = []
    for index, line in enumerate(lines):
        y = y_offset + index * line_height
        spans = "".join(
            f'<tspan fill="{color}">{escape(text)}</tspan>'
            for color, text in line
        )
        rendered_lines.append(
            f'<text x="{x_offset}" y="{y}" xml:space="preserve">{spans}</text>'
        )

    border_x = 34
    border_y = 34
    border_width = width - border_x * 2
    border_height = height - border_y * 2
    corner = 34

    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title">
  <title id="title">{escape(title)}</title>
  <rect width="{width}" height="{height}" fill="{COLORS['background']}"/>
  <rect x="{border_x}" y="{border_y}" width="{border_width}" height="{border_height}" fill="none" stroke="{COLORS['border']}" stroke-width="2"/>
  <g stroke="{COLORS['corner']}" stroke-width="2">
    <path d="M0 {border_y}H{border_x + corner} M{border_x} 0V{border_y + corner}"/>
    <path d="M{width - border_x - corner} {height - border_y}H{width} M{width - border_x} {height - border_y - corner}V{height}"/>
  </g>
  <g fill="{COLORS['text']}" font-family="Cascadia Code, Consolas, Liberation Mono, monospace" font-size="{font_size}" font-weight="400">
    {''.join(rendered_lines)}
  </g>
</svg>
'''


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for filename, snippet in SNIPPETS.items():
        desktop = render_svg(snippet["desktop"], snippet["title"], mobile=False)
        mobile = render_svg(snippet["mobile"], snippet["title"], mobile=True)
        (OUTPUT_DIR / f"{filename}.svg").write_text(desktop, encoding="utf-8")
        (OUTPUT_DIR / f"{filename}-mobile.svg").write_text(mobile, encoding="utf-8")


if __name__ == "__main__":
    main()
