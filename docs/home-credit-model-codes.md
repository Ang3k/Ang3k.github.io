# Códigos das imagens — Home Credit Group

Transcrição das seis imagens de código usadas na seção “Modelagem Preditiva com Python”. O conteúdo abaixo preserva os nomes, parâmetros e comentários visíveis nas capturas; não foram feitas correções ou refatorações.

## `wix-part3-cleaning-columns.png`

```python
# Eliminando algumas colunas inúteis para o processo
colunas_inuteis = ["SK_ID_CURR", "WALLSMATERIAL_MODE", "EMERGENCYSTATE_MODE", "YEARS_BEGINEXPLUATATION_MEDI", "TOTALAREA_MODE", "YEARS_BEGINEXPLUATATION_MODE", "WEEKDAY_APPR_PROCESS_START"]
df = df.drop(colunas_inuteis, axis = 1)

# Juntando colunas dos cômodos para a média de cada uma das medidas
colunas_media = ["APARTMENTS_AVG", "BASEMENTAREA_AVG", "ELEVATORS_AVG", "ENTRANCES_AVG", "FLOORSMAX_AVG", "LANDAREA_AVG", "LIVINGAREA_AVG", "NONLIVINGAREA_AVG"]
df["BUILDING_AVG"] = df[colunas_media].mean(axis = 1)
df = df.drop(colunas_media, axis = 1)

colunas_modo = ["APARTMENTS_MODE", "BASEMENTAREA_MODE", "ELEVATORS_MODE", "ENTRANCES_MODE", "FLOORSMAX_MODE", "LANDAREA_MODE", "LIVINGAREA_MODE", "NONLIVINGAREA_MODE"]
df["BUILDING_MODE"] = df[colunas_modo].mean(axis = 1)
df = df.drop(colunas_modo, axis = 1)

colunas_mediana = ["APARTMENTS_MEDI", "BASEMENTAREA_MEDI", "ELEVATORS_MEDI", "ENTRANCES_MEDI", "FLOORSMAX_MEDI", "LANDAREA_MEDI", "LIVINGAREA_MEDI", "NONLIVINGAREA_MEDI"]
df["BUILDING_MEDI"] = df[colunas_mediana].mean(axis = 1)
df = df.drop(colunas_mediana, axis = 1)
```

## `wix-part3-imputation-numeric.png`

```python
from sklearn.impute import SimpleImputer

# Calculando a porcentagem de elementos faltantes
df_faltantes = percent_missing(df)

# Agrupando por colunas para eliminar e preencher
colunas_eliminar = list(df_faltantes[df_faltantes >= 0.6].index)
colunas_preencher = list(df_faltantes[df_faltantes < 0.6].index)

# Selecionando colunas numéricas e categóricas
preencher_numericas = list(df[colunas_preencher].select_dtypes(include = "number").columns)
preencher_strings = list(df[colunas_preencher].select_dtypes(exclude = "number").columns)

# Preenchendo com o valor médio das colunas numéricas
imputer_num = SimpleImputer(strategy="mean")
imputer_str = SimpleImputer(strategy="most_frequent")
df[preencher_numericas] = imputer_num.fit_transform(df[preencher_numericas])
df[preencher_strings] = imputer_str.fit_transform(df[preencher_strings])

# Removendo colunas com faltantes demais
df = df.drop(colunas_eliminar, axis = 1)
```

## `wix-part3-imputation-categorical.png`

```python
def iqr_outlier_remover(df, col):
    q25, q75 = np.percentile(df[col], [25, 75])
    iqr = q75 - q25
    limite_inferior = q25 - 1.5 * iqr
    limite_superior = q75 + 1.5 * iqr
    df_filtrado = df[(df[col] > limite_inferior) & (df[col] < limite_superior)]
    return df_filtrado

# Iterando por colunas que podem possuir outliers, e os removendo
colunas_outliers = ["AMT_INCOME_TOTAL", "AMT_CREDIT", "AMT_ANNUITY", "AMT_GOODS_PRICE", "DAYS_EMPLOYED"]
for column in colunas_outliers:
    df = iqr_outlier_remover(df, column)

# Aplicando one-hot encoding às colunas categóricas
colunas_cat = ["NAME_CONTRACT_TYPE", "CODE_GENDER", "FLAG_OWN_CAR", "FLAG_OWN_REALTY",
               "NAME_TYPE_SUITE", "NAME_INCOME_TYPE", "NAME_FAMILY_STATUS",
               "NAME_HOUSING_TYPE", "OCCUPATION_TYPE"]

df = pd.get_dummies(df, columns=colunas_cat, drop_first=True)

# Aplicando OrdinalEncoder para 'NAME_EDUCATION_TYPE'
ordinal_encoder = OrdinalEncoder(categories=[["Lower secondary", "Secondary / secondary special",
                                               "Incomplete higher", "Higher education", "Academic degree"]])

df["NAME_EDUCATION_TYPE"] = ordinal_encoder.fit_transform(df[["NAME_EDUCATION_TYPE"]])

# Eliminando colunas irrelevantes
df = df.drop(["ORGANIZATION_TYPE", "HOUSETYPE_MODE"], axis=1)
df = df.rename(columns = lambda x: re.sub('[^A-Za-z0-9_]+', '', x))
```

## `wix-part3-cleaning-code.png`

```python
X = df.drop("TARGET", axis=1)
y = df["TARGET"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)

undersample = NearMiss(version=1)
X_train, y_train = undersample.fit_resample(X_train, y_train)

scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)
```

## `wix-part3-preprocessing-code.png`

```python
import lightgbm as lgbm, numpy as np

x.columns = [str(col).replace("-", "_").replace("/", "_").replace(" ", "_").replace("(", "_").replace(")", "_") for col in x.columns]
lgbm_train = lgbm.Dataset(data=x, label=y, free_raw_data=False)

lgbm_params = {'boosting_type': 'dart', 'objective': 'binary', 'learning_rate': 0.1, 'min_data_in_leaf': 30,
               'num_leaves': 32, 'max_depth': -1, 'feature_fraction': 0.5, 'scale_pos_weight': 2,
               'drop_rate': 0.02, 'metric': 'auc'}

cv_results = lgbm.cv(train_set=lgbm_train, params=lgbm_params, nfold=5, num_boost_round=600,
                     metrics=['auc'], stratified=True, seed=42)

optimum_boost_rounds = np.argmax(cv_results['valid auc-mean']) + 1
print(f'Optimum boost rounds = {optimum_boost_rounds}'), print(f'Best CV result = {np.max(cv_results["valid auc-mean"])}')
```

## `wix-part3-lightgbm-code.png`

```python
# Fazendo previsões no conjunto de teste
y_pred_probs = model.predict(x_test)

# Calculando os valores para a ROC Curve
fpr, tpr, thresholds = roc_curve(y_test, y_pred_probs)
roc_auc = auc(fpr, tpr)

# Estatísticas para diferentes thresholds
thresholds_list = [0.1, 0.3, 0.5, 0.7, 0.75, 0.8]  # Exemplo de thresholds
metrics = {}

for threshold in thresholds_list:
    y_pred = (y_pred_probs >= threshold).astype(int)
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='binary')
    metrics[threshold] = {'Precision': precision, 'Recall': recall, 'F1-Score': f1}

# Exibindo as métricas
print("Métricas para diferentes thresholds:")
for threshold, values in metrics.items():
    print(f"Threshold = {threshold}: Precision = {values['Precision']:.3f}, Recall = {values['Recall']:.3f}, F1-Score = {values['F1-Score']:.3f}")

# Plotando a ROC Curve
plt.figure(figsize=(8, 6))
plt.plot(fpr, tpr, color='blue', lw=2, label=f'ROC Curve (AUC = {roc_auc:.3f})')
plt.plot([0, 1], [0, 1], color='gray', linestyle='--', lw=2) # Linha de referência
plt.show()
```
