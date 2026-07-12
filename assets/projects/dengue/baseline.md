# Padrão unificado para estudos de caso do portfólio

## 1. Finalidade deste documento

Este arquivo é a fonte de verdade para criar novas páginas de projeto no portfólio de Angel Mansilla. Ele consolida o padrão editorial aprovado nos projetos **Data Analysis on IMDb**, **Credit Card Churn** e **Home Credit Group**.

O objetivo é permitir que um novo estudo de caso seja produzido a partir de apenas dois insumos:

1. o texto preenchido no modelo da seção 13;
2. uma pasta com as imagens, acompanhada do inventário da seção 14.

A implementação deve adaptar a quantidade de partes e de blocos à narrativa do projeto, sem alterar a linguagem visual compartilhada.

## 2. Referências e prioridade

Quando houver dúvida, usar esta ordem de prioridade:

1. este documento;
2. `portfolio-case-standard.css`, que contém o padrão compartilhado;
3. Churn e IMDb, como principais referências de ritmo, alinhamento e espaçamento;
4. Home Credit, como referência para projetos com narrativa extensa, muitas imagens, modelagem e resultados financeiros;
5. um CSS específico do projeto, apenas quando o conteúdo realmente exigir uma exceção.

Não copiar inconsistências antigas de marcação ou nomes de classes. O que deve ser preservado é o resultado visual e editorial.

## 3. Princípios obrigatórios

- Estética minimalista, editorial e predominantemente branca.
- Cabeçalho, abertura, navegação, partes, imagens e encerramento visualmente coerentes entre todos os projetos.
- Conteúdo organizado como estudo de caso, e não como uma sequência solta de gráficos.
- Pouco espaço vazio entre a capa, o sumário e a primeira parte.
- Trocas de parte marcadas por uma linha fina e um pequeno traço na cor de destaque.
- Texto corrido com largura confortável; gráficos podem ocupar uma largura maior.
- Imagens não podem ser deformadas, ampliadas além da qualidade útil ou usadas sem contexto.
- Toda imagem analítica deve ser introduzida ou explicada pelo texto.
- Grades ímpares não podem terminar com um espaço vazio: o último item deve ficar centralizado em meia linha.
- Em desktop, a última linha de um parágrafo, insight ou legenda não deve ficar com menos de cinco palavras.
- Exceções devem servir ao conteúdo, nunca apenas diferenciar visualmente um projeto.

## 4. Estrutura de arquivos

Cada projeto deve seguir esta organização:

```text
projetos/
└── [slug-do-projeto]/
    ├── index.html
    └── [slug-do-projeto]-standard.css

assets/
└── projects/
    └── [slug-do-projeto]/
        ├── hero.webp
        ├── card.webp
        ├── 01-[nome-descritivo].webp
        ├── 02-[nome-descritivo].webp
        └── ...
```

Regras de nomes:

- usar letras minúsculas, números e hífens;
- não usar espaços, acentos, parênteses ou nomes como `image.png`;
- numerar imagens na ordem em que aparecem;
- manter o arquivo original fora da pasta pública quando uma versão otimizada for criada;
- CSS específico deve conter somente cor de destaque e exceções indispensáveis.

## 5. Ordem obrigatória da página

Uma página completa deve seguir esta sequência:

1. metadados e fontes;
2. link “Pular para o conteúdo”;
3. cabeçalho global;
4. capa do projeto;
5. navegação numerada das partes;
6. partes do estudo de caso;
7. conclusão e links do projeto;
8. chamada para o próximo estudo;
9. rodapé.

### 5.1 Cabeçalho global

Usar exatamente o mesmo padrão de IMDb e Churn:

- nome “Angel Mansilla” à esquerda;
- links “Sobre”, “Contato” e “Portfólio”;
- linha divisória fina;
- todos os links retornam às âncoras correspondentes da página inicial.

### 5.2 Capa

A capa deve:

- ocupar toda a largura disponível;
- usar uma única imagem de fundo;
- aplicar sombra ou filtro somente para garantir contraste;
- mostrar o título dentro de um bloco central simples;
- evitar gráficos, listas, métricas ou imagens secundárias ao lado do título;
- terminar diretamente na navegação das partes, sem uma grande faixa branca intermediária.

O título pode permanecer em inglês apenas quando for o nome oficial do projeto. O restante da interface deve ficar em português.

### 5.3 Navegação das partes

- usar de três a cinco partes na maioria dos projetos;
- exibir `01`, `02`, `03` etc. com dois algarismos;
- cada item deve conter um nome curto e apontar para uma âncora real;
- os nomes devem descrever fases da narrativa, não ferramentas isoladas;
- o bloco deve ficar próximo da capa e da Parte 1.

Exemplo para Arboviroses:

1. Contexto e Objetivo;
2. Dados do SINAN;
3. Preparação e Engenharia de Atributos;
4. Modelagem e Avaliação;
5. Resultados, Limitações e Uso Responsável.

## 6. Organização dos capítulos

Cada parte deve conter:

- rótulo `PARTE N` na cor de destaque;
- título principal da parte;
- parágrafo introdutório opcional;
- um ou mais blocos numerados;
- uma transição clara para a próxima parte.

Estrutura conceitual:

```text
PARTE N
Título da parte
Resumo opcional da parte

1 - Título do bloco
Texto de contexto
Imagem ou galeria, quando necessário
Interpretação da imagem

2 - Título do bloco
...
```

Não é obrigatório usar cinco partes. Um projeto curto pode usar três; um projeto extenso pode usar cinco. Mais de cinco partes deve ser uma exceção justificada.

## 7. Tipos de bloco

Escolher o tipo conforme a função do conteúdo.

### 7.1 Narrativa

Usado para contexto de negócio, objetivo, dados, metodologia e decisões.

Ordem recomendada:

1. problema ou pergunta;
2. decisão tomada;
3. evidência ou imagem opcional;
4. consequência para o projeto.

### 7.2 Análise

Usado para EDA, consultas SQL, comparações e interpretação de gráficos.

Ordem obrigatória:

1. pergunta analítica;
2. explicação breve do que foi medido;
3. gráfico, tabela ou resultado;
4. insight apoiado pelo visual;
5. limitação ou ressalva, quando houver.

Na parte de EDA, títulos, textos e visualizações podem ficar centralizados, seguindo IMDb, Churn e Home Credit. Nas demais partes, o texto deve permanecer ancorado à esquerda em uma coluna editorial central.

### 7.3 Processo técnico

Usado para limpeza, transformação, engenharia de atributos, treinamento e implantação.

O texto deve explicar a decisão e o motivo. Não transformar o estudo em uma coleção de capturas de código. Preferir código real quando ele for legível e necessário; usar imagens de código apenas quando fizerem parte do material original e agregarem valor visual.

### 7.4 Resultados

Usado para métricas, comparação de modelos, matrizes, impacto e conclusão.

Cada métrica deve informar:

- nome;
- valor;
- conjunto ou período em que foi medida;
- interpretação;
- limitação relevante.

Nunca inventar ou arredondar uma métrica sem indicação. Alegações financeiras, clínicas ou operacionais devem explicitar as premissas.

### 7.5 Síntese

Usado no fim do projeto para responder às perguntas iniciais. Reunir de três a seis aprendizados objetivos, seguidos de uma conclusão curta e dos links para código, relatório ou demonstração.

## 8. Texto e tipografia

### 8.1 Hierarquia

- título da capa: nome completo do projeto;
- `h2`: título de cada parte;
- `h3`: bloco ou análise dentro da parte;
- `h4`: subdivisão rara, usada somente quando um `h3` realmente possui subtópicos;
- texto corrido: Playfair Display;
- rótulos, navegação e títulos: Oswald ou a fonte sem serifa definida pelo padrão.

Não pular níveis de título.

### 8.2 Larguras e ritmo

Usar as variáveis compartilhadas:

- texto: `780px`;
- cabeçalho editorial: `880px`;
- mídia comum: `940px`;
- mídia larga e galerias: `1120px`;
- espaço entre blocos: `clamp(1.65rem, 3vw, 2.8rem)`;
- espaço entre texto e mídia: `clamp(1.1rem, 2.2vw, 1.65rem)`;
- espaço entre uma imagem e o texto que a explica: `0.7rem`;
- espaço de transição entre partes: `1.5rem`, além do separador.

### 8.3 Regra da última linha

Em desktop, nenhuma última linha de parágrafo, insight ou legenda deve conter menos de cinco palavras. Essa regra vale especialmente para textos logo abaixo de gráficos.

Ordem de correção:

1. aplicar `text-wrap: pretty`;
2. ajustar levemente a largura do bloco dentro dos limites editoriais;
3. reescrever a frase sem mudar seu significado;
4. como último recurso, agrupar somente o trecho final de forma responsiva.

Não inserir quebras de linha fixas com `<br>` em parágrafos. Não criar espaços inseparáveis que causem overflow em telas menores. Títulos podem usar quebra intencional apenas quando ela fizer parte da composição.

## 9. Imagens e visualizações

### 9.1 Tamanhos recomendados

| Uso | Tamanho recomendado | Proporção | Formato preferido |
| --- | --- | --- | --- |
| Capa do estudo | 1920 × 1080 px | 16:9 | WebP ou AVIF |
| Card da página inicial | 1200 × 1200 px | 1:1 | WebP |
| Gráfico largo | 2200–2400 px de largura | livre | WebP ou PNG |
| Gráfico comum | 1800–2000 px de largura | livre | WebP ou PNG |
| Duas imagens em galeria | ao menos 1400 px de largura cada | semelhantes | WebP ou PNG |
| Captura de código/tabela | ao menos 1600 px de largura | livre | PNG ou WebP lossless |

A capa deve manter o assunto principal dentro dos 60% centrais, pois o recorte muda conforme a tela. Gráficos devem ser exportados em aproximadamente duas vezes o tamanho em que serão exibidos.

### 9.2 Escolha da largura

- `compacta`: tabela ou detalhe pequeno que perderia proporção se fosse ampliado;
- `média`: gráfico simples ou imagem vertical;
- `comum`: visual principal de um bloco;
- `larga`: gráfico complexo, comparação horizontal ou imagem de abertura;
- `galeria-2`, `galeria-3` ou `galeria-4`: imagens diretamente comparáveis.

Não colocar imagens em galeria apenas para economizar altura. Elas devem compartilhar escala, assunto ou função comparativa.

### 9.3 Marcação e carregamento

- informar `width` e `height` reais no HTML;
- usar `fetchpriority="high"` somente na imagem da capa;
- usar `loading="lazy"` nas imagens abaixo da primeira dobra;
- usar `decoding="async"`;
- manter `height: auto` e `object-fit: contain` em gráficos;
- usar `object-fit: cover` somente na capa ou em cards;
- nunca carregar uma imagem de milhares de pixels em um card pequeno sem uma versão otimizada.

### 9.4 Texto alternativo e legenda

- `alt` deve descrever o que a imagem comunica, não seu nome de arquivo;
- um gráfico deve mencionar variáveis e comparação principal;
- imagem decorativa deve usar `alt=""`;
- legenda é opcional quando o parágrafo seguinte já interpreta a imagem;
- não repetir literalmente o mesmo texto no `alt`, na legenda e no parágrafo.

### 9.5 Grades com quantidade ímpar

Em qualquer grade de duas colunas com 3, 5, 7 ou 9 elementos, o último deve:

- ocupar a linha inteira como área de posicionamento;
- manter largura de meia coluna;
- ficar centralizado;
- conservar bordas simétricas.

Aplicar a mesma regra a perguntas, dicionários, métricas, insights e pequenos cards. Nunca deixar uma célula visualmente vazia.

## 10. Componentes especiais

### 10.1 Perguntas e requisitos

Usar uma grade quando houver quatro ou mais itens curtos. Para textos longos, usar lista vertical. Perguntas e requisitos devem ser separados quando representam necessidades diferentes.

### 10.2 Dicionário de dados

- mostrar apenas as variáveis relevantes para compreender o estudo;
- usar termo e definição;
- dividir em duas colunas somente quando a leitura continuar confortável;
- centralizar o último grupo quando a quantidade for ímpar;
- usar expansão apenas se o dicionário for realmente longo e secundário.

### 10.3 Conteúdo expansível

Usar `<details>` para consultas SQL, explicações auxiliares ou código extenso. O insight principal nunca deve ficar escondido. O controle precisa funcionar por teclado, possuir foco visível e indicar os estados com `+` e `−`.

### 10.4 Métricas e insights

- de duas a seis unidades por grupo;
- rótulo curto, valor destacado e contexto;
- mesma altura visual sempre que o conteúdo permitir;
- regra de centralização para quantidade ímpar;
- não usar cards decorativos sem informação concreta.

### 10.5 Próximo estudo

Sempre encerrar com:

- rótulo “Próximo estudo”;
- título do projeto seguinte;
- seta circular;
- link envolvendo todo o componente;
- foco de teclado e estado de hover visíveis.

## 11. Metadados, acessibilidade e qualidade

Cada página deve conter:

- `lang="pt-BR"`;
- título único;
- descrição curta e específica;
- Open Graph com tipo `article`, título, descrição e imagem;
- canonical quando a URL final estiver definida;
- um único `h1`;
- IDs únicos e âncoras correspondentes ao sumário;
- HTML semântico com `header`, `main`, `section`, `article`, `figure`, `nav` e `footer`;
- navegação por teclado;
- foco visível;
- respeito a `prefers-reduced-motion`;
- nenhum overflow horizontal;
- links externos com `target="_blank"` e `rel="noreferrer"`, quando abrirem outra aba.

Antes da publicação, revisar ortografia, concordância, nomes de tecnologias, unidades, períodos e métricas. Não apresentar classificação de saúde como diagnóstico ou probabilidade clínica.

## 12. Fluxo de criação de um novo projeto

1. Receber o texto preenchido e a pasta de imagens.
2. Confirmar título, slug, cor de destaque, links e projeto seguinte.
3. Conferir métricas, datas, fontes e alegações sensíveis.
4. Mapear cada marcador de imagem do texto para um arquivo real.
5. Renomear e otimizar apenas os arquivos usados.
6. Definir de três a cinco partes conforme a narrativa.
7. Criar a página reutilizando o cabeçalho e o padrão compartilhado.
8. Criar CSS específico mínimo, sem duplicar regras compartilhadas.
9. Integrar o projeto à página inicial e à cadeia de “Próximo estudo” quando solicitado.
10. Validar HTML, caminhos, IDs, links, dimensões e textos alternativos.
11. Conferir visualmente espaçamentos, recortes, grades ímpares e últimas linhas.
12. Testar larguras de 320, 375, 390, 768, 1024 e 1440 px antes de publicar.

## 13. Modelo de texto a ser preenchido

Copiar a estrutura abaixo para um novo arquivo e substituir todos os campos entre colchetes. Partes ou campos opcionais podem ser removidos.

```markdown
# [NOME DO PROJETO]

## Metadados

- Slug: [nome-curto-com-hifens]
- Título da página: [título | Angel Mansilla]
- Título da capa: [título exibido]
- Idioma do título: [português/inglês]
- Descrição SEO: [120 a 160 caracteres]
- Resumo em uma frase: [problema + abordagem + resultado]
- Cor de destaque: [hexadecimal]
- Período do projeto: [mês/ano ou intervalo]
- Tecnologias: [lista]
- Repositório: [URL ou não disponível]
- Demonstração: [URL ou não disponível]
- Fonte dos dados: [nome e URL]
- Próximo estudo: [título e caminho]

## Capa

- Imagem: [IMAGEM-HERO]
- Texto alternativo: [descrição ou vazio se decorativa]
- Ponto focal: [centro/esquerda/direita e observação]

## Navegação

1. [NOME CURTO DA PARTE 1]
2. [NOME CURTO DA PARTE 2]
3. [NOME CURTO DA PARTE 3]
4. [OPCIONAL]
5. [OPCIONAL]

## PARTE 1 — [TÍTULO]

Introdução da parte: [opcional]

### 1 - [Título do bloco]

Tipo: [narrativa/análise/processo/resultado]

[Texto antes da imagem. Use parágrafos separados.]

[IMAGEM-01 | largura: comum | legenda: opcional]

[Interpretação ou continuação após a imagem.]

### 2 - [Título do bloco]

[Conteúdo]

Perguntas ou itens:

- [item]
- [item]
- [item]

## PARTE 2 — [TÍTULO]

### 1 - [Pergunta ou título analítico]

[O que será medido e por quê.]

[IMAGEM-02 | largura: larga]

[Insight apoiado pela imagem.]

[Limitação ou ressalva, se houver.]

### 2 - [Título]

[Repetir a estrutura necessária.]

## PARTE 3 — [TÍTULO]

### 1 - [Título do processo]

[Decisão técnica, justificativa e consequência.]

[IMAGEM-03 e IMAGEM-04 | galeria-2]

### 2 - [Título do resultado]

- Métrica: [nome]
- Valor: [valor]
- Conjunto/período: [contexto]
- Interpretação: [texto]
- Limitação: [texto]

## PARTE FINAL — [RESULTADOS E CONCLUSÃO]

### Principais respostas

1. Pergunta: [pergunta inicial]
   Resposta: [resposta baseada nos resultados]
2. Pergunta: [pergunta inicial]
   Resposta: [resposta baseada nos resultados]

### Limitações

- [limitação]
- [limitação]

### Conclusão

[Um a três parágrafos.]

### Links

- Código: [URL]
- Relatório: [URL]
- Demonstração: [URL]
```

## 14. Inventário de imagens a ser entregue

Entregar as imagens em uma única pasta e preencher uma linha por arquivo:

| Marcador | Arquivo entregue | Parte e bloco | Função | Largura/galeria | Alt | Legenda | Observações |
| --- | --- | --- | --- | --- | --- | --- | --- |
| IMAGEM-HERO | `[arquivo]` | Capa | imagem de abertura | capa | `[alt ou decorativa]` | não | `[ponto focal]` |
| IMAGEM-01 | `[arquivo]` | Parte 1, bloco 1 | contexto/diagrama/gráfico | comum | `[alt]` | `[texto ou não]` | `[recorte, ordem etc.]` |
| IMAGEM-02 | `[arquivo]` | Parte 2, bloco 1 | resultado analítico | larga | `[alt]` | `[texto ou não]` | `[observação]` |

Se não souber a largura ou o texto alternativo, deixar o campo como `definir na implementação`. O marcador usado no texto deve ser idêntico ao marcador desta tabela.

## 15. Como o padrão se aplica aos projetos atuais

| Projeto | Estrutura dominante | Elementos que viraram padrão |
| --- | --- | --- |
| Credit Card Churn | contexto → EDA → tratamento → modelagem → conclusões | ritmo entre partes, listas de requisitos, galerias de gráficos, síntese final |
| Data Analysis on IMDb | coleta → análises SQL/Power BI → relatório final | pares resultado/consulta, conteúdo expansível, grades ímpares centralizadas |
| Home Credit Group | contexto → EDA → modelagem → resultados | narrativa longa, imagens largas, dicionário, modelagem e impacto financeiro |

O futuro projeto de Arboviroses deve usar a mesma estrutura visual, mas incluir cuidados próprios de saúde: fonte e período dos dados, separação temporal, métricas por classe, limitações, possíveis vieses e aviso explícito de que o resultado é um score de classificação, não diagnóstico.

## 16. Critérios de aceite

Um novo estudo de caso só está concluído quando:

- segue a ordem definida na seção 5;
- reutiliza o cabeçalho e o rodapé compartilhados;
- possui capa, sumário e primeira parte sem vazios excessivos;
- todas as âncoras funcionam;
- toda imagem possui caminho, dimensões e `alt` corretos;
- imagens comparáveis usam proporções coerentes;
- grades ímpares terminam centralizadas;
- últimas linhas curtas foram corrigidas em desktop;
- as partes são separadas sem espaçamento excessivo;
- métricas e conclusões são sustentadas pelo conteúdo;
- links, foco, redução de movimento e responsividade foram verificados;
- a página funciona como site estático no GitHub Pages.
