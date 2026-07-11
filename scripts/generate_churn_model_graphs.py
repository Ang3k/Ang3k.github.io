"""Generate high-resolution model interpretation figures for the churn case study.

The repository already contains the fitted models, so this script recreates the
model plots without repeating the expensive hyperparameter searches.
"""

from __future__ import annotations

import argparse
import warnings
from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap
from matplotlib.ticker import FuncFormatter
import numpy as np
import pandas as pd
import seaborn as sns
from joblib import load
from sklearn.metrics import ConfusionMatrixDisplay
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OrdinalEncoder, StandardScaler
from sklearn.tree import plot_tree
from xgboost import plot_tree as xgb_plot_tree


EXPORT_DPI = 420
ACCENT = "#b43c32"
INK = "#252322"
MUTED = "#6e6966"
GRID = "#ded9d5"
EXISTING = "#59666c"
PALETTE = {
    "Decision Tree": "#b7b0ac",
    "Random Forest": "#59666c",
    "XGBoost": ACCENT,
}
STATUS_LABELS = ["Cliente que\ncancelou", "Cliente ativo"]

DISPLAY_NAMES = {
    "Customer_Age": "Idade",
    "Dependent_count": "Dependentes",
    "Education_Level": "Escolaridade",
    "Marital_Status_Married": "Estado civil: casado",
    "Marital_Status_Single": "Estado civil: solteiro",
    "Income_Category": "Faixa de renda",
    "Card_Category": "Categoria do cartão",
    "Months_on_book": "Meses como cliente",
    "Total_Relationship_Count": "Produtos contratados",
    "Months_Inactive_12_mon": "Meses inativos",
    "Contacts_Count_12_mon": "Contatos no último ano",
    "Credit_Limit": "Limite de crédito",
    "Total_Revolving_Bal": "Saldo rotativo",
    "Avg_Open_To_Buy": "Crédito disponível",
    "Total_Amt_Chng_Q4_Q1": "Variação do valor transacionado",
    "Total_Trans_Amt": "Valor transacionado",
    "Total_Trans_Ct": "Quantidade de transações",
    "Total_Ct_Chng_Q4_Q1": "Variação das transações",
    "Avg_Utilization_Ratio": "Utilização média",
    "Gender_M": "Gênero: masculino",
}


def display_name(column: str) -> str:
    return DISPLAY_NAMES.get(column, column.replace("_", " "))


def configure_style() -> None:
    sns.set_theme(style="white", context="notebook")
    plt.rcParams.update(
        {
            "font.family": "DejaVu Sans",
            "font.size": 11,
            "axes.labelcolor": INK,
            "axes.edgecolor": "#b8b1ad",
            "axes.linewidth": 0.8,
            "axes.titlecolor": INK,
            "axes.titleweight": "semibold",
            "axes.titlesize": 16,
            "axes.labelsize": 11,
            "xtick.color": MUTED,
            "ytick.color": MUTED,
            "xtick.labelsize": 10,
            "ytick.labelsize": 10,
            "legend.frameon": False,
            "figure.facecolor": "white",
            "savefig.facecolor": "white",
        }
    )


def save_figure(fig: plt.Figure, output_dir: Path, *filenames: str) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    for filename in filenames:
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


def style_axis(ax: plt.Axes, grid_axis: str = "x") -> None:
    sns.despine(ax=ax, top=True, right=True)
    ax.set_axisbelow(True)
    ax.grid(False)
    if grid_axis:
        ax.grid(axis=grid_axis, color=GRID, linewidth=0.75, alpha=0.55)


def prepare_data(data_path: Path) -> tuple[np.ndarray, pd.Series, list[str]]:
    df = pd.read_csv(data_path)
    df = df.drop(df.columns[-2:], axis=1).drop(columns="CLIENTNUM")

    categorical_columns = list(df.select_dtypes(exclude=np.number).columns)
    for column in categorical_columns:
        df[column] = df[column].replace("Unknown", np.nan)

    for column in ["Marital_Status", "Income_Category", "Education_Level"]:
        df = df.sort_values(by="Credit_Limit")
        df[column] = df[column].ffill()

    def remove_outliers(frame: pd.DataFrame, column: str) -> pd.DataFrame:
        q25, q75 = np.percentile(frame[column], [25, 75])
        iqr = q75 - q25
        return frame[
            (frame[column] > q25 - 1.5 * iqr)
            & (frame[column] < q75 + 1.5 * iqr)
        ]

    for column in [
        "Months_on_book",
        "Credit_Limit",
        "Total_Trans_Amt",
        "Total_Trans_Ct",
    ]:
        df = remove_outliers(df, column)

    df = pd.get_dummies(df, columns=["Gender", "Marital_Status"], drop_first=True)
    natural_rankings = [
        "Education_Level",
        "Income_Category",
        "Card_Category",
        "Attrition_Flag",
    ]
    encoder = OrdinalEncoder(
        categories=[
            ["Uneducated", "High School", "College", "Graduate", "Post-Graduate", "Doctorate"],
            ["Less than $40K", "$40K - $60K", "$60K - $80K", "$80K - $120K", "$120K +"],
            ["Blue", "Silver", "Gold", "Platinum"],
            ["Attrited Customer", "Existing Customer"],
        ]
    )
    df[natural_rankings] = encoder.fit_transform(df[natural_rankings])

    x = df.drop(columns="Attrition_Flag")
    y = df["Attrition_Flag"]
    x_train, x_test, y_train, y_test = train_test_split(
        x, y, random_state=101, test_size=0.2
    )
    scaler = StandardScaler()
    x_train = scaler.fit_transform(x_train)
    x_test = scaler.transform(x_test)
    return x_test, y_test, list(x.columns)


def plot_feature_importance(
    model, model_name: str, feature_names: list[str], output_dir: Path
) -> None:
    importance = pd.Series(model.feature_importances_, index=feature_names)
    importance = importance.sort_values()
    top_threshold = importance.nlargest(5).min()
    colors = [
        ACCENT if value >= top_threshold else "#68757a"
        for value in importance
    ]
    fig, ax = plt.subplots(figsize=(14, 10), constrained_layout=True)
    bars = ax.barh(
        [display_name(name) for name in importance.index],
        importance.values,
        color=colors,
        edgecolor="white",
        linewidth=0.5,
    )
    ax.bar_label(bars, labels=[f"{value:.3f}" for value in importance], padding=5, fontsize=9)
    ax.set_title(f"Importância das features — {model_name}", loc="left")
    ax.set_xlabel("Importância relativa")
    ax.set_ylabel("")
    ax.xaxis.set_major_formatter(FuncFormatter(lambda value, _: f"{value:.2f}"))
    style_axis(ax, grid_axis="x")
    save_figure(
        fig,
        output_dir,
        f"{model_name}_feature_importances.png",
    )


def plot_confusion_matrices(
    models: dict[str, object], x_test: pd.DataFrame, y_test: pd.Series, output_dir: Path
) -> None:
    cmap = LinearSegmentedColormap.from_list(
        "confusion", ["#f8f5f2", "#d9a59e", ACCENT], N=256
    )
    fig, axes = plt.subplots(1, 3, figsize=(21, 7.2), constrained_layout=True)
    for ax, (name, model) in zip(axes, models.items()):
        predictions = model.predict(x_test)
        display = ConfusionMatrixDisplay.from_predictions(
            y_test,
            predictions,
            labels=[0, 1],
            display_labels=STATUS_LABELS,
            cmap=cmap,
            values_format=",d",
            colorbar=False,
            ax=ax,
        )
        display.ax_.set_title(name, loc="left", pad=12)
        display.ax_.set_xlabel("Previsão")
        display.ax_.set_ylabel("Valor real")
        display.ax_.tick_params(labelsize=10)
        for spine in display.ax_.spines.values():
            spine.set_visible(False)
    save_figure(fig, output_dir, "matriz_confusao_Random Forest.png")


def plot_tree_views(models: dict[str, object], feature_names: list[str], output_dir: Path) -> None:
    labels = [display_name(name) for name in feature_names]

    fig, ax = plt.subplots(figsize=(18, 12), constrained_layout=True)
    plot_tree(
        models["Decision Tree"],
        filled=True,
        max_depth=3,
        feature_names=labels,
        class_names=["Cancelou", "Ativo"],
        rounded=True,
        fontsize=8,
        ax=ax,
    )
    ax.set_title("Decision Tree — primeiros níveis", loc="left", pad=16)
    save_figure(fig, output_dir, "decision-tree-wix.png", "Decision_Tree_Visualization.png")

    fig, ax = plt.subplots(figsize=(18, 12), constrained_layout=True)
    plot_tree(
        models["Random Forest"].estimators_[0],
        filled=True,
        max_depth=3,
        feature_names=labels,
        class_names=["Cancelou", "Ativo"],
        rounded=True,
        fontsize=8,
        ax=ax,
    )
    ax.set_title("Random Forest — uma árvore da floresta", loc="left", pad=16)
    save_figure(
        fig,
        output_dir,
        "random-forest-wix.png",
        "Random_Forest_Tree_Visualization.png",
    )

    fig, ax = plt.subplots(figsize=(18, 12), constrained_layout=True)
    xgb_plot_tree(models["XGBoost"], num_trees=0, ax=ax)
    ax.set_title("XGBoost — primeira árvore", loc="left", pad=16)
    ax.axis("off")
    save_figure(
        fig,
        output_dir,
        "xgboost-wix.jpg",
        "XGBoost_Tree_Visualization.png",
    )


def generate(data_path: Path, model_dir: Path, output_dir: Path) -> None:
    configure_style()
    warnings.filterwarnings("ignore", message=r".*serialized model.*")
    x_test, y_test, feature_names = prepare_data(data_path)
    models = {
        "Decision Tree": load(model_dir / "optimized_dtc.joblib"),
        "Random Forest": load(model_dir / "optimized_rfc.joblib"),
        "XGBoost": load(model_dir / "optimized_xgb.joblib"),
    }

    for name, model in models.items():
        plot_feature_importance(model, name, feature_names, output_dir)
    plot_confusion_matrices(models, x_test, y_test, output_dir)
    plot_tree_views(models, feature_names, output_dir)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", type=Path, required=True, help="Original CSV path")
    parser.add_argument("--model-dir", type=Path, required=True, help="Directory with joblib models")
    parser.add_argument("--output-dir", type=Path, required=True, help="Image output directory")
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    generate(args.data, args.model_dir, args.output_dir)
