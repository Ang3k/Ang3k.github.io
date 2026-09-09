# Demonstração estática do Dengue Sense Classifier

Esta pasta contém uma cópia isolada do frontend do repositório
`Ang3k/Dengue-Ensembler-Classifier`, baseada no commit
`658b4a560a795cab73b587e58be1fc0a2f367cdf`.

A cópia foi adaptada exclusivamente para a demonstração estática publicada
no portfólio. O repositório original não foi modificado.

## Diferenças desta versão

- usa rotas por hash para funcionar em hospedagem estática;
- não realiza chamadas para a API FastAPI;
- inclui 30 casos anonimizados do teste de 2021 com resultados pré-calculados;
- permite carregar os mesmos casos no formulário de triagem;
- usa listas locais de referência, incluindo ocupações CBO reais;
- deixa explícito que o score não é diagnóstico nem probabilidade clínica;
- gera os arquivos publicados em `../../apps/dengue/`.

Os resultados foram reproduzidos com a API e os artefatos do commit
`d0cf55352db5433833690cb4f1ef8e3573da7115` do projeto original, usando as
sementes de 0 a 29. O índice anônimo de cada amostra e os scores retornados
ficam registrados em `src/staticCases.ts` para auditoria.

A ordem é embaralhada a cada carregamento. Cada caso aparece uma vez antes de o
ciclo recomeçar; sementes, índices e resultados permanecem inalterados.

## Gerar a demonstração

```powershell
npm ci
npm run build
```

Depois do build, copie o conteúdo de `dist/` para `apps/dengue/` na raiz do
portfólio.
