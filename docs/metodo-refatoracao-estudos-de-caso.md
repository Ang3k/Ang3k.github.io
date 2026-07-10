# Método de refatoração dos estudos de caso

Este documento resume o método usado na refatoração do estudo de caso do IMDb.
Ele deve servir como referência para ajustes futuros nos demais projetos do
portfólio, sem obrigar todos a terem exatamente a mesma composição visual.

## Objetivo

Transformar uma página extensa e fragmentada em uma narrativa técnica clara,
com transições perceptíveis entre etapas, imagens legíveis e boa experiência em
desktop, tablet e celular.

O princípio visual principal é:

> Título → contexto ou explicação → imagem ou resultado relacionado.

Uma imagem só deve aparecer quando ajudar a explicar o conteúdo imediatamente
anterior. Imagens decorativas, repetidas ou sem relação clara com o texto devem
ser removidas.

## 1. Diagnóstico da página existente

Antes de editar:

1. Ler o HTML completo do estudo de caso.
2. Identificar as seções, títulos, textos, imagens e transições existentes.
3. Levantar as dimensões naturais e o peso das imagens utilizadas.
4. Renderizar a página atual em desktop e celular.
5. Verificar:
   - mudanças abruptas entre partes;
   - desalinhamentos;
   - imagens pequenas ou grandes demais;
   - imagens soltas ou repetidas;
   - textos excessivamente largos;
   - grades que comprimem gráficos ou código;
   - overflow horizontal;
   - comportamento de imagens carregadas de forma tardia.

O diagnóstico deve considerar a página renderizada, e não apenas o código.

## 2. Organização da narrativa

Dividir o estudo de caso em capítulos com funções bem definidas. A estrutura
usada no IMDb foi:

1. Visão geral do projeto.
2. Dados e preparação.
3. Análises e visualizações.
4. Síntese dos resultados e conclusão.

Cada capítulo deve ter:

- número ou identificação visual;
- título descritivo;
- introdução curta explicando o que será apresentado;
- espaçamento e divisória suficientes para marcar a mudança de etapa.

Quando a página for longa, incluir uma navegação interna para os capítulos.

## 3. Construção dos blocos de conteúdo

Cada assunto ou análise deve ser um bloco autocontido, preferencialmente usando
`section` ou `article`.

Ordem recomendada:

1. Identificador da etapa ou análise.
2. Título.
3. Um ou dois parágrafos de contexto.
4. Resultado visual principal.
5. Legenda objetiva.
6. Material técnico complementar, quando existir.

Evitar alternar títulos, textos e imagens sem um contêiner que deixe clara a
relação entre eles.

## 4. Tratamento de consultas, código e detalhes extensos

Consultas SQL, dicionários de dados e outros detalhes importantes, mas
secundários para a leitura principal, podem ser colocados em elementos
`details`.

Exemplo de fluxo:

1. Explicar a pergunta.
2. Mostrar o gráfico ou resultado em tamanho grande.
3. Disponibilizar a consulta em `Ver consulta SQL` logo abaixo.

Isso mantém profundidade técnica sem obrigar todos os visitantes a percorrer
capturas de código extensas.

O controle deve:

- funcionar por teclado;
- possuir foco visível;
- indicar visualmente quando está aberto ou fechado;
- permanecer próximo do resultado ao qual pertence.

## 5. Tratamento das imagens

Para cada imagem escolhida:

- confirmar que ela explica o texto anterior;
- usar `alt` descritivo quando a imagem transmitir informação;
- usar legenda quando ela ajudar a interpretar o resultado;
- informar `width` e `height` naturais no HTML;
- manter `height: auto` para evitar deformação;
- usar `object-fit: contain` em gráficos e capturas;
- aplicar `loading="lazy"` fora da primeira dobra;
- manter a imagem principal do projeto com prioridade de carregamento;
- limitar a largura de acordo com a resolução e a legibilidade do arquivo.

Faixas usadas como referência no desktop:

- visualizações principais: aproximadamente 780 a 920 px;
- diagramas ou mapas detalhados: até aproximadamente 1040 px;
- capturas de código: aproximadamente 760 a 820 px;
- imagens pequenas ou verticais: largura menor e centralizada.

Esses valores são referências, não regras fixas. O tamanho final deve ser
validado visualmente.

## 6. Estilos e responsividade

Os estilos específicos de um projeto devem ficar dentro de uma classe de escopo
própria, evitando alterar os outros estudos de caso.

Exemplo:

```css
.imdb-refactor .imdb-analysis {
  /* estilos exclusivos deste estudo de caso */
}
```

Diretrizes:

- usar larguras fluidas com `min()`, `max()` e `clamp()`;
- limitar a largura dos textos para manter uma leitura confortável;
- centralizar imagens e figuras, não necessariamente todos os textos;
- evitar grades com duas colunas quando elas prejudicarem a leitura das imagens;
- transformar grades em uma coluna em telas menores;
- garantir que nenhum elemento ultrapasse a largura da viewport;
- preservar contraste e estados de foco;
- não depender de JavaScript para a leitura principal.

## 7. Revisão do texto

Durante a reorganização:

- corrigir ortografia, concordância e repetições;
- condensar trechos que dizem a mesma coisa;
- usar terminologia consistente, como `IMDb`, `Power BI` e `longa-metragem`;
- preservar as informações técnicas confirmadas;
- não criar novas métricas, resultados ou conclusões;
- declarar limitações do conjunto de dados quando forem relevantes.

## 8. Validação visual obrigatória

Após a implementação, renderizar a página e conferir pelo menos:

- cabeçalho e abertura do projeto;
- visão geral;
- transições entre capítulos;
- primeiro e último bloco de cada parte;
- gráficos horizontais, verticais, mapas e tabelas;
- consulta ou detalhe expansível aberto e fechado;
- conclusão e rodapé.

Testar as larguras:

- 320 px;
- 375 px;
- 390 px;
- 768 px;
- 1024 px;
- 1440 px.

Em cada largura, verificar:

- ausência de overflow horizontal;
- alinhamento dos capítulos;
- legibilidade das imagens;
- tamanho dos títulos;
- largura dos parágrafos;
- funcionamento dos elementos expansíveis;
- ausência de imagens quebradas;
- ausência de erros no navegador.

## 9. Verificação técnica final

Antes de encerrar:

- confirmar que todos os caminhos locais existem;
- verificar IDs duplicados;
- verificar imagens sem `width` ou `height`;
- executar `git diff --check` nos arquivos alterados;
- revisar o diff para garantir que apenas o escopo solicitado foi modificado;
- preservar alterações preexistentes do proprietário;
- confirmar que os caminhos relativos continuam compatíveis com GitHub Pages.

## Checklist resumido

- [ ] A página tem uma visão geral curta e objetiva.
- [ ] As partes possuem transições visuais claras.
- [ ] Cada imagem está relacionada ao texto imediatamente anterior.
- [ ] Não existem imagens decorativas soltas.
- [ ] Os resultados visuais têm prioridade sobre capturas de código.
- [ ] Consultas e detalhes longos podem ser expandidos quando necessário.
- [ ] As imagens possuem `alt`, dimensões naturais e legenda quando aplicável.
- [ ] Os estilos específicos estão isolados por classe.
- [ ] A página foi validada visualmente em desktop e celular.
- [ ] Não existe overflow horizontal.
- [ ] Não existem arquivos ou imagens ausentes.
- [ ] O conteúdo técnico não inventa resultados.

## Regra de decisão

Quando houver dúvida entre preservar uma imagem ou removê-la, fazer a seguinte
pergunta:

> Esta imagem ajuda o visitante a compreender o problema, o processo ou o
> resultado sem depender de contexto externo?

Se a resposta for não, a imagem provavelmente não deve permanecer na página.
