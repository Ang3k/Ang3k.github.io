# Método de refatoração dos estudos de caso

Este documento define o padrão usado nos estudos de caso do portfólio. Ele deve
orientar projetos atuais e futuros sem obrigar todos a terem exatamente a mesma
composição visual.

## Objetivo

Transformar páginas extensas em narrativas técnicas claras, com transições
perceptíveis, imagens legíveis e boa experiência em desktop, tablet e celular.

O princípio visual principal é:

> Título → texto → imagem ou grupo de imagens → continuação do texto.

O espaçamento entre esses elementos deve ser curto e constante. A troca de
assunto deve ser percebida pela hierarquia do título, não por grandes áreas em
branco nem por uma linha divisória depois de cada bloco.

Uma imagem só deve aparecer quando ajudar a explicar o conteúdo imediatamente
anterior. Imagens decorativas, repetidas ou sem relação clara com o texto devem
ser removidas.

## 1. Diagnóstico da página existente

Antes de editar:

1. Ler o HTML completo do estudo de caso.
2. Identificar seções, títulos, textos, imagens e transições existentes.
3. Levantar dimensões naturais e peso das imagens utilizadas.
4. Renderizar a página atual em desktop e celular.
5. Verificar mudanças abruptas, desalinhamentos, imagens mal dimensionadas,
   repetições, textos largos, grades comprimidas e overflow horizontal.

O diagnóstico deve considerar a página renderizada, não apenas o código.

## 2. Organização da narrativa

Dividir o estudo em capítulos com funções bem definidas. A estrutura de
referência é:

1. Visão geral do projeto.
2. Contexto, dados e preparação.
3. Análises, metodologia e visualizações.
4. Resultados, limitações e conclusão.

Cada capítulo deve ter número ou identificação visual, título descritivo e uma
introdução curta. Quando a página for longa, incluir navegação interna.

## 3. Blocos de conteúdo

Cada assunto ou análise deve ser um bloco autocontido, preferencialmente usando
`section` ou `article`.

Ordem recomendada:

1. Identificador da etapa ou análise.
2. Título.
3. Os parágrafos autorais do projeto, preservados integralmente e no ritmo em que
   foram escritos no Wix.
4. Resultado visual principal ou galeria relacionada.
5. Legenda objetiva.
6. Continuação da interpretação ou material técnico complementar.

Dentro do bloco, usar um ritmo compacto: cerca de `0.7rem` entre título e texto
e de `1.1rem` a `1.65rem` antes da mídia. Não inserir divisórias entre análises
quando o próprio título já estabelece a mudança.

## 4. Consultas, código e detalhes extensos

Consultas SQL, dicionários e detalhes secundários podem usar `details`. O
controle deve funcionar por teclado, possuir foco visível, indicar seu estado e
permanecer junto ao resultado correspondente.

Quando resultado e consulta tiverem proporções compatíveis, podem ficar lado a
lado no desktop. Em telas estreitas, devem voltar para uma coluna. Se a consulta
for essencial ao bloco, o `details` pode iniciar aberto; o visitante ainda pode
recolhê-lo.

Substituir capturas de código por código real quando isso melhorar a leitura e a
acessibilidade sem perder informação relevante.

## 5. Tratamento das imagens

Para cada imagem:

- confirmar que ela explica o texto anterior;
- usar `alt` descritivo quando transmitir informação;
- usar legenda quando ajudar a interpretar o resultado;
- informar `width` e `height` naturais no HTML;
- manter `height: auto` e `object-fit: contain`;
- aplicar `loading="lazy"` fora da primeira dobra;
- limitar a largura conforme resolução e legibilidade;
- validar o tamanho na página renderizada.

Faixas de referência no desktop:

- coluna de texto: aproximadamente 780 px;
- visualização principal: aproximadamente 780 a 940 px;
- diagrama, mapa ou galeria detalhada: até aproximadamente 1120 px;
- imagem pequena ou vertical: largura menor e centralizada.

Quando imagens pertencem à mesma análise, preferir uma galeria horizontal:

- três gráficos comparáveis: três colunas;
- dois resultados ou quatro imagens: duas colunas;
- imagem única detalhada: faixa ampla centralizada;
- celular: uma coluna quando o conteúdo deixar de ser legível lado a lado.

A galeria pode ser mais larga que a coluna de texto. Isso é preferível a
empilhar muitas imagens grandes e obrigar o visitante a rolar por uma sequência
formada apenas por figuras.

## 6. Estilo compartilhado e responsividade

Todo estudo completo deve carregar `portfolio-case-standard.css` depois de
`case-study.css` e usar `portfolio-case-study` no `body`. Essa folha controla a
largura de leitura, a hierarquia, o ritmo vertical e as galerias.

Não duplicar essas regras no CSS do projeto. A folha específica deve conter
somente cor de destaque, variações de mídia ou componentes exclusivos; ajustes
compartilhados devem ser feitos uma única vez no padrão editorial.

Estilos realmente específicos ficam em uma classe própria do projeto:

```css
.imdb-refactor .imdb-analysis {
  /* ajuste exclusivo deste estudo */
}
```

Diretrizes:

- usar `min()`, `max()` e `clamp()` para tamanhos fluidos;
- manter os textos narrativos ancorados à esquerda dentro de uma coluna editorial
  central no canvas;
- centralizar títulos, comentários e visualizações apenas nas seções de análises
  exploratórias;
- permitir uma faixa de mídia mais larga que o texto;
- manter imagens relacionadas lado a lado enquanto forem legíveis;
- transformar grades em uma coluna em telas menores;
- impedir que qualquer elemento amplie a viewport;
- preservar contraste, foco visível e redução de movimento;
- não depender de JavaScript para a leitura principal.

### Navegação para o próximo estudo

Todo estudo completo deve terminar com um único card `.case-next`. O rótulo,
título do projeto seguinte e indicador de ação precisam formar uma única área
clicável, com borda, estado de foco e resposta visual ao passar o cursor. Não
posicionar a seta como um elemento solto nem separar o título em outra coluna
sem relação aparente com a ação.

## 7. Preservação do texto autoral

- nos estudos IMDb, Home Credit e Churn, usar literalmente os textos publicados no
  Wix pelo autor;
- não corrigir ortografia, concordância, pontuação, repetições ou escolhas de voz
  nesses textos;
- não condensar nem reescrever parágrafos, ainda que sejam longos;
- preservar a ordem, as métricas, os resultados e as conclusões do texto original;
- manter textos técnicos de acessibilidade, como alternativas de imagens, fora
  dessa regra quando eles não aparecem visualmente no conteúdo autoral;
- declarar limitações relevantes.

## 8. Validação visual obrigatória

Após implementar, conferir cabeçalho, visão geral, transições, primeiro e último
bloco de cada capítulo, gráficos, mapas, tabelas, detalhes expansíveis, conclusão
e rodapé.

Testar as larguras:

- 320 px;
- 375 px;
- 390 px;
- 768 px;
- 1024 px;
- 1440 px.

Em cada largura, verificar overflow horizontal, alinhamento, legibilidade das
imagens, tamanho dos títulos, largura dos parágrafos, detalhes expansíveis,
imagens quebradas e erros no navegador.

## 9. Verificação técnica final

- confirmar que caminhos locais existem;
- verificar IDs duplicados;
- verificar imagens sem `width` ou `height`;
- executar `git diff --check`;
- revisar o diff e preservar alterações preexistentes;
- confirmar compatibilidade dos caminhos com GitHub Pages.

## Checklist resumido

- [ ] A página tem visão geral curta e objetiva.
- [ ] As partes possuem transições claras sem vazios excessivos.
- [ ] O ritmo vertical não depende de linhas divisórias.
- [ ] Cada imagem está ligada ao texto imediatamente anterior.
- [ ] Não existem imagens decorativas soltas.
- [ ] Imagens relacionadas aparecem lado a lado no desktop quando legíveis.
- [ ] O visitante não percorre longas sequências formadas apenas por imagens.
- [ ] As imagens possuem `alt`, dimensões naturais e legenda quando aplicável.
- [ ] O estudo carrega `portfolio-case-standard.css` e usa `portfolio-case-study`.
- [ ] Os estilos específicos estão isolados por classe.
- [ ] O card de próximo estudo é uma área clicável única e aponta para uma página existente.
- [ ] A página foi validada em desktop e celular.
- [ ] Não existe overflow horizontal nem arquivo ausente.
- [ ] O conteúdo técnico não inventa resultados.

## Regra de decisão

Quando houver dúvida sobre manter uma imagem, perguntar:

> Esta imagem ajuda o visitante a compreender o problema, o processo ou o
> resultado sem depender de contexto externo?

Se a resposta for não, a imagem provavelmente não deve permanecer na página.
