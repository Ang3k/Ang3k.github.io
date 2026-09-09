# Demonstração estática do Dengue Sense Classifier

Esta pasta contém uma cópia isolada do frontend do repositório
`Ang3k/Dengue-Ensembler-Classifier`, baseada no commit
`658b4a560a795cab73b587e58be1fc0a2f367cdf`.

A cópia foi adaptada exclusivamente para a demonstração estática publicada
no portfólio. O repositório original não foi modificado.

## Diferenças desta versão

- usa rotas por hash para funcionar em hospedagem estática;
- não realiza chamadas para a API FastAPI;
- usa pequenas listas locais apenas para representar os campos da triagem;
- explica, na interface, quais recursos dependem do servidor e dos modelos;
- gera os arquivos publicados em `../../apps/dengue/`.

## Gerar a demonstração

```powershell
npm ci
npm run build
```

Depois do build, copie o conteúdo de `dist/` para `apps/dengue/` na raiz do
portfólio.
