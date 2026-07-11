"""Generate the exploratory-analysis figures used by the churn case study.

The original notebook keeps plots as inline outputs and uses a single global
style. This script creates the same analysis views as standalone, publication-
ready images so they can be versioned and reused by the static portfolio.

Example
-------
python scripts/generate_churn_eda.py \
    --data "path/to/BankChurners.csv" \
    --output-dir "assets/projects/churn"
"""

from __future__ import annotations

import argparse
from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap
from matplotlib.patches import Patch
from matplotlib.ticker import FuncFormatter, MaxNLocator
import numpy as np
import pandas as pd
import seaborn as sns


ACCENT = "#b43c32"
INK = "#252322"
MUTED = "#6e6966"
GRID = "#ded9d5"
EXPORT_DPI = 420
EXISTING = "#59666c"
FEMALE = "#8a3f37"
MALE = "#4e5c63"

STATUS_PALETTE = {
    "Existing Customer": EXISTING,
    "Attrited Customer": ACCENT,
}
GENDER_PALETTE = {"F": FEMALE, "M": MALE}
GENDER_LABELS = {"F": "Feminino", "M": "Masculino"}
STATUS_LABELS = {
    "Existing Customer": "Cliente ativo",
    "Attrited Customer": "Cliente que cancelou",
}

DISPLAY_NAMES = {
    "CLIENTNUM": "ID do cliente",
    "Attrition_Flag": "Situação",
    "Customer_Age": "Idade",
    "Gender": "Gênero",
    "Dependent_count": "Dependentes",
    "Education_Level": "Escolaridade",
    "Marital_Status": "Estado civil",
    "Income_Category": "Faixa de renda",
    "Card_Category": "Categoria do cartão",
    "Months_on_book": "Meses como cliente",
    "Total_Relationship_Count": "Produtos contratados",
    "Months_Inactive_12_mon": "Meses inativos (último ano)",
    "Contacts_Count_12_mon": "Contatos (último ano)",
    "Credit_Limit": "Limite de crédito",
    "Total_Revolving_Bal": "Saldo rotativo",
    "Avg_Open_To_Buy": "Crédito disponível",
    "Total_Amt_Chng_Q4_Q1": "Variação do valor transacionado",
    "Total_Trans_Amt": "Valor transacionado",
    "Total_Trans_Ct": "Quantidade de transações",
    "Total_Ct_Chng_Q4_Q1": "Variação da quantidade de transações",
    "Avg_Utilization_Ratio": "Utilização média",
}

EDUCATION_ORDER = [
    "Uneducated",
    "High School",
    "College",
    "Graduate",
    "Post-Graduate",
    "Doctorate",
]
EDUCATION_LABELS = {
    "Uneducated": "Sem formação",
    "High School": "Ensino médio",
    "College": "Graduação",
    "Graduate": "Pós-graduação",
    "Post-Graduate": "Mestrado",
    "Doctorate": "Doutorado",
}


def display_name(column: str) -> str:
    return DISPLAY_NAMES.get(column, column.replace("_", " "))


def money_formatter(value: float, _position: int) -> str:
    if abs(value) >= 1000:
        return f"${value / 1000:.0f}k"
    return f"${value:,.0f}"


def integer_formatter(value: float, _position: int) -> str:
    return f"{value:,.0f}"


def density_formatter(value: float, _position: int) -> str:
    """Keep small density values precise without meaningless trailing zeros."""

    if value == 0:
        return "0"
    if abs(value) < 0.01:
        return f"{value:.5f}".rstrip("0").rstrip(".")
    return f"{value:.3f}".rstrip("0").rstrip(".")


def percent_formatter(value: float, _position: int) -> str:
    return f"{value:.0f}%"


def configure_style() -> None:
    sns.set_theme(style="white", context="notebook")
    plt.rcParams.update(
        {
            "font.family": "DejaVu Sans",
            "font.size": 10,
            "axes.labelcolor": INK,
            "axes.edgecolor": "#b8b1ad",
            "axes.linewidth": 0.8,
            "axes.titlecolor": INK,
            "axes.titleweight": "semibold",
            "axes.titlesize": 14,
            "axes.labelsize": 10,
            "xtick.color": MUTED,
            "ytick.color": MUTED,
            "xtick.labelsize": 9,
            "ytick.labelsize": 9,
            "legend.frameon": False,
            "legend.fontsize": 9,
            "figure.facecolor": "white",
            "savefig.facecolor": "white",
            "savefig.edgecolor": "white",
        }
    )


def style_axis(ax: plt.Axes, *, grid_axis: str = "y") -> None:
    sns.despine(ax=ax, top=True, right=True)
    ax.set_axisbelow(True)
    ax.grid(False)
    if grid_axis:
        ax.grid(
            axis=grid_axis,
            color=GRID,
            linewidth=0.7,
            alpha=0.55,
            linestyle="-",
        )


def save_figure(fig: plt.Figure, output_dir: Path, filename: str) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    pil_kwargs = {"optimize": True}
    if Path(filename).suffix.lower() in {".jpg", ".jpeg"}:
        pil_kwargs["quality"] = 95
    fig.savefig(
        output_dir / filename,
        dpi=EXPORT_DPI,
        bbox_inches="tight",
        facecolor="white",
        transparent=False,
        pil_kwargs=pil_kwargs,
    )
    plt.close(fig)


def plot_distribution(df: pd.DataFrame, column: str, output_dir: Path) -> None:
    fig, ax = plt.subplots(figsize=(11.5, 6.5), constrained_layout=True)
    for gender in ("F", "M"):
        subset = df.loc[df["Gender"] == gender, column].dropna()
        color = GENDER_PALETTE[gender]
        sns.histplot(
            subset,
            bins=26,
            stat="density",
            color=color,
            alpha=0.16,
            edgecolor=color,
            linewidth=0.35,
            ax=ax,
            label=GENDER_LABELS[gender],
        )
        sns.kdeplot(
            subset,
            color=color,
            linewidth=2.1,
            fill=True,
            alpha=0.07,
            bw_adjust=1.05,
            ax=ax,
        )

    ax.set_title(f"Distribuição de {display_name(column).lower()}", loc="left")
    ax.set_xlabel(display_name(column))
    ax.set_ylabel("Densidade")
    ax.yaxis.set_major_locator(MaxNLocator(5))
    ax.yaxis.set_major_formatter(FuncFormatter(density_formatter))
    if column == "Credit_Limit":
        ax.xaxis.set_major_formatter(FuncFormatter(money_formatter))
        ax.set_xlim(left=0)
    else:
        ax.xaxis.set_major_locator(MaxNLocator(integer=True, nbins=8))
        ax.xaxis.set_major_formatter(FuncFormatter(integer_formatter))
    ax.legend(loc="upper right", title=None)
    style_axis(ax, grid_axis="y")
    save_figure(fig, output_dir, f"{column}_distribution.png")


def plot_credit_limit_by_category(
    df: pd.DataFrame, column: str, filename: str, output_dir: Path
) -> None:
    means = (
        df.groupby([column, "Attrition_Flag"], observed=False)["Credit_Limit"]
        .mean()
        .reset_index()
    )
    order = (
        means.groupby(column, observed=False)["Credit_Limit"]
        .mean()
        .sort_values()
        .index.tolist()
    )
    fig_width = max(9.2, min(13, 5.4 + len(order) * 0.72))
    fig, ax = plt.subplots(figsize=(fig_width, 5.8), constrained_layout=True)
    sns.barplot(
        data=means,
        x=column,
        y="Credit_Limit",
        hue="Attrition_Flag",
        order=order,
        hue_order=list(STATUS_PALETTE),
        palette=STATUS_PALETTE,
        edgecolor="white",
        linewidth=0.8,
        ax=ax,
    )
    for container in ax.containers:
        labels = [money_formatter(rect.get_height(), 0) for rect in container]
        ax.bar_label(container, labels=labels, padding=3, fontsize=8, color=MUTED)
    ax.set_title(
        f"Limite de crédito médio por {display_name(column).lower()}",
        loc="left",
    )
    ax.set_xlabel("")
    ax.set_ylabel("Limite de crédito médio")
    ax.yaxis.set_major_formatter(FuncFormatter(money_formatter))
    legend_handles = [
        Patch(facecolor=color, edgecolor="none", label=STATUS_LABELS[name])
        for name, color in STATUS_PALETTE.items()
    ]
    ax.legend(handles=legend_handles, title=None, loc="upper left")
    if column == "Gender":
        ax.set_xticks(range(len(order)))
        ax.set_xticklabels([GENDER_LABELS.get(str(label), str(label)) for label in order])
    elif column == "Dependent_count":
        ax.set_xticks(range(len(order)))
        ax.set_xticklabels([str(int(float(label))) for label in order])
    style_axis(ax, grid_axis="y")
    save_figure(fig, output_dir, filename)


def plot_correlation(df: pd.DataFrame, output_dir: Path) -> None:
    numeric = df.select_dtypes(exclude="object").drop(df.columns[-2:], axis=1)
    corr = numeric.drop(columns=["CLIENTNUM"]).corr()
    labels = [display_name(column) for column in corr.columns]
    corr.columns = labels
    corr.index = labels
    mask = np.triu(np.ones_like(corr, dtype=bool), k=1)
    cmap = LinearSegmentedColormap.from_list(
        "churn_corr", ["#4f6068", "#f8f5f2", ACCENT], N=256
    )
    fig, ax = plt.subplots(figsize=(12.5, 10.5), constrained_layout=True)
    sns.heatmap(
        corr,
        mask=mask,
        cmap=cmap,
        vmin=-1,
        vmax=1,
        center=0,
        annot=True,
        fmt=".2f",
        annot_kws={"fontsize": 7, "color": INK},
        linewidths=0.6,
        linecolor="white",
        cbar_kws={"label": "Correlação", "shrink": 0.72},
        ax=ax,
    )
    ax.set_title("Matriz de correlação", loc="left", pad=16)
    ax.set_xlabel("")
    ax.set_ylabel("")
    ax.tick_params(axis="x", rotation=45, labelsize=8)
    ax.tick_params(axis="y", rotation=0, labelsize=8)
    ax.collections[0].colorbar.ax.tick_params(labelsize=8)
    ax.collections[0].colorbar.set_label("Correlação", size=9, color=MUTED)
    style_axis(ax, grid_axis=None)
    output_dir.mkdir(parents=True, exist_ok=True)
    for filename in ("correlation-matrix-wix.png", "correlation_matrix.png"):
        fig.savefig(
            output_dir / filename,
            dpi=EXPORT_DPI,
            bbox_inches="tight",
            facecolor="white",
            transparent=False,
            pil_kwargs={"optimize": True},
        )
    plt.close(fig)


def plot_category_donut(
    df: pd.DataFrame, column: str, filename: str, output_dir: Path
) -> None:
    counts = df[column].value_counts(dropna=False)
    churn_counts = (
        df.groupby(column, dropna=False, observed=False)["Attrition_Flag"]
        .value_counts()
        .unstack(fill_value=0)
    )
    churn_rate = churn_counts.get("Attrited Customer", 0).div(counts).mul(100)
    colors = sns.color_palette("Greys", n_colors=len(counts) + 2)[2:]
    fig, ax = plt.subplots(figsize=(7.5, 7.5), constrained_layout=True)
    wedges, _, _ = ax.pie(
        counts.values,
        colors=colors,
        startangle=90,
        counterclock=False,
        autopct=lambda pct: f"{pct:.0f}%" if pct >= 5 else "",
        pctdistance=0.78,
        wedgeprops={"width": 0.38, "linewidth": 1.2, "edgecolor": "white"},
        textprops={"color": INK, "fontsize": 10},
    )
    ax.text(
        0,
        0,
        f"{len(df):,}\nclientes",
        ha="center",
        va="center",
        fontsize=12,
        color=INK,
        linespacing=1.35,
    )
    legend_labels = [
        f"{str(category)} · {count:,} · cancelamento {churn_rate.loc[category]:.1f}%"
        for category, count in counts.items()
    ]
    ax.legend(
        wedges,
        legend_labels,
        title=display_name(column),
        loc="lower center",
        bbox_to_anchor=(0.5, -0.20),
        frameon=False,
        fontsize=8.5,
        title_fontsize=9,
    )
    ax.set_title(f"Distribuição por {display_name(column).lower()}", loc="left")
    ax.axis("equal")
    ax.grid(False)
    save_figure(fig, output_dir, filename)


def plot_age_relationship(
    df: pd.DataFrame, column: str, filename: str, output_dir: Path
) -> None:
    grouped = (
        df.groupby(["Customer_Age", "Gender"], observed=False)[column]
        .mean()
        .reset_index()
    )
    fig, ax = plt.subplots(figsize=(10.5, 5.8), constrained_layout=True)
    sns.lineplot(
        data=grouped,
        x="Customer_Age",
        y=column,
        hue="Gender",
        hue_order=["F", "M"],
        palette=GENDER_PALETTE,
        marker="o",
        markersize=3.5,
        linewidth=2,
        errorbar=None,
        ax=ax,
    )
    ax.set_title(
        f"{display_name(column)} médio por idade e gênero", loc="left"
    )
    ax.set_xlabel("Idade")
    ax.set_ylabel(display_name(column))
    ax.xaxis.set_major_locator(MaxNLocator(integer=True, nbins=9))
    if column in {"Credit_Limit", "Total_Trans_Amt"}:
        ax.yaxis.set_major_formatter(FuncFormatter(money_formatter))
    elif column == "Total_Trans_Ct":
        ax.yaxis.set_major_formatter(FuncFormatter(integer_formatter))
    elif column == "Avg_Utilization_Ratio":
        ax.yaxis.set_major_formatter(FuncFormatter(lambda value, _: f"{value:.0%}"))
        ax.set_ylim(bottom=0)
    ax.legend(
        title=None,
        labels=[GENDER_LABELS["F"], GENDER_LABELS["M"]],
        loc="upper left",
    )
    style_axis(ax, grid_axis="y")
    save_figure(fig, output_dir, filename)


def plot_education_by_card(
    df: pd.DataFrame, card: str, filename: str, output_dir: Path
) -> None:
    counts = (
        df.loc[df["Card_Category"] == card, "Education_Level"]
        .value_counts()
        .reindex(EDUCATION_ORDER, fill_value=0)
    )
    percentages = counts.div(counts.sum()).mul(100)
    colors = ["#d7d2ce", "#b4aeaa", "#8f8985", "#68625f", "#4e4946", ACCENT]
    fig, ax = plt.subplots(figsize=(10.5, 5.8), constrained_layout=True)
    bars = ax.bar(
        [EDUCATION_LABELS[level] for level in EDUCATION_ORDER],
        percentages.values,
        color=colors,
        edgecolor="white",
        linewidth=0.7,
    )
    ax.bar_label(bars, labels=[f"{value:.1f}%" for value in percentages], padding=4)
    ax.set_title(f"Escolaridade — cartão {card}", loc="left")
    ax.set_xlabel("")
    ax.set_ylabel("Participação")
    ax.yaxis.set_major_formatter(FuncFormatter(percent_formatter))
    ax.set_ylim(0, max(30, percentages.max() * 1.18))
    ax.tick_params(axis="x", rotation=18)
    style_axis(ax, grid_axis="y")
    save_figure(fig, output_dir, filename)


def plot_boxplot(
    df: pd.DataFrame, column: str, filename: str, output_dir: Path
) -> None:
    fig, ax = plt.subplots(figsize=(8.5, 5.8), constrained_layout=True)
    sns.boxplot(
        data=df,
        x="Attrition_Flag",
        y=column,
        hue="Attrition_Flag",
        order=list(STATUS_PALETTE),
        hue_order=list(STATUS_PALETTE),
        palette=STATUS_PALETTE,
        width=0.52,
        linewidth=1.1,
        showfliers=False,
        legend=False,
        ax=ax,
    )
    counts = df["Attrition_Flag"].value_counts()
    ax.set_title(f"{display_name(column)} por situação", loc="left")
    ax.set_xlabel("")
    ax.set_ylabel(display_name(column))
    ax.set_xticks(range(len(STATUS_PALETTE)))
    ax.set_xticklabels(
        [
            f"{STATUS_LABELS[status]}\n(n={counts.get(status, 0):,})"
            for status in STATUS_PALETTE
        ]
    )
    if column in {"Credit_Limit", "Total_Trans_Amt"}:
        ax.yaxis.set_major_formatter(FuncFormatter(money_formatter))
    elif column in {"Total_Trans_Ct", "Months_on_book"}:
        ax.yaxis.set_major_formatter(FuncFormatter(integer_formatter))
    style_axis(ax, grid_axis="y")
    save_figure(fig, output_dir, filename)


def plot_missing_values(df: pd.DataFrame, output_dir: Path) -> None:
    work = df.copy()
    for column in work.select_dtypes(include="object").columns:
        work[column] = work[column].replace("Unknown", np.nan)
    missing = work.isna().mean().mul(100).sort_values()
    missing = missing[missing > 0]
    fig, ax = plt.subplots(figsize=(13, 7.2), constrained_layout=True)
    bars = ax.barh(missing.index.map(display_name), missing.values, color=ACCENT)
    ax.bar_label(bars, labels=[f"{value:.1f}%" for value in missing.values], padding=5)
    ax.set_title("Valores ausentes antes da imputação", loc="left")
    ax.set_xlabel("Percentual de registros")
    ax.set_ylabel("")
    ax.xaxis.set_major_formatter(FuncFormatter(percent_formatter))
    ax.set_xlim(0, max(10, missing.max() * 1.2))
    style_axis(ax, grid_axis="x")
    save_figure(fig, output_dir, "missing-values-output.png")


def generate(data_path: Path, output_dir: Path) -> None:
    configure_style()
    df = pd.read_csv(data_path)

    for column in ("Customer_Age", "Credit_Limit", "Months_on_book"):
        plot_distribution(df, column, output_dir)

    for column, filename in (
        ("Gender", "Gender_credit_limit.png"),
        ("Dependent_count", "Dependents_credit_limit.png"),
        ("Education_Level", "Education_credit_limit.png"),
        ("Marital_Status", "Marital Status_credit_limit.png"),
        ("Income_Category", "Income Level_credit_limit.png"),
        ("Total_Relationship_Count", "Total Products_credit_limit.png"),
    ):
        plot_credit_limit_by_category(df, column, filename, output_dir)

    plot_correlation(df, output_dir)

    for column, filename in (
        ("Marital_Status", "Marital_Status_pie_plot.png"),
        ("Income_Category", "Income_Category_pie_plot.png"),
        ("Education_Level", "Education_Level_pie_plot.png"),
    ):
        plot_category_donut(df, column, filename, output_dir)

    for column, filename in (
        ("Credit_Limit", "Credit_Limit_plot.png"),
        ("Total_Trans_Amt", "Total_Trans_Amt_plot.png"),
        ("Total_Trans_Ct", "Total_Trans_Ct_plot.png"),
        ("Avg_Utilization_Ratio", "Avg_Utilization_Ratio_plot.png"),
    ):
        plot_age_relationship(df, column, filename, output_dir)

    card_filenames = {
        "Blue": "histogram_Blue.png",
        "Gold": "histogram_Gold.png",
        "Silver": "histogram_Silver.png",
        "Platinum": "histogram_Platinum_edited.jpg",
    }
    for card, filename in card_filenames.items():
        plot_education_by_card(df, card, filename, output_dir)

    for column, filename in (
        ("Months_on_book", "boxplot_Months_on_book.png"),
        ("Total_Trans_Amt", "boxplot_Total_Trans_Amt.png"),
        ("Total_Trans_Ct", "boxplot_Total_Trans_Ct.png"),
        ("Credit_Limit", "boxplot_Credit_Limit.png"),
    ):
        plot_boxplot(df, column, filename, output_dir)

    plot_missing_values(df, output_dir)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", type=Path, required=True, help="Original CSV path")
    parser.add_argument(
        "--output-dir",
        type=Path,
        required=True,
        help="Directory where the PNG/JPEG files will be written",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    generate(args.data, args.output_dir)
