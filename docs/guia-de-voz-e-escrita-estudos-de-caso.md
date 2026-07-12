# Guia de voz e escrita dos estudos de caso de Angel Mansilla

## 1. Finalidade

Este documento descreve como Angel Mansilla escreve seus estudos de caso e transforma esse padrão autoral em instruções reproduzíveis para textos futuros. O objetivo não é criar uma voz genérica de portfólio nem apenas imitar palavras recorrentes. O objetivo é preservar a maneira como Angel conduz uma explicação: apresenta uma questão, mostra a decisão tomada, coloca uma evidência visual diante do leitor e retorna para interpretar o que ela significa.

O guia foi preparado a partir da leitura dos estudos de caso e orientou a redação da etapa de modelagem preditiva do projeto de arboviroses com dados do SINAN. Ele também deve orientar a futura seção de métricas e a futura apresentação da aplicação web, sem substituir o texto final de cada parte.

## 2. Corpus analisado e prioridade das referências

A análise considera os textos atualmente presentes no portfólio local e as páginas correspondentes do antigo portfólio no Wix:

1. [Home Credit Group](../projetos/home-credit/index.html), com o maior peso;
2. [Churn de cartões de crédito](../projetos/churn/index.html), com peso quase equivalente;
3. [IMDb e TMDB](../projetos/imdb/index.html), como referência histórica e secundária;
4. [Projeto de arboviroses](../projetos/dengue/index.html), apenas para compreender a voz que já foi adotada nas partes prontas e garantir continuidade;
5. [Dengue Ensembler Classifier](https://github.com/Ang3k/Dengue-Ensembler-Classifier), como fonte técnica futura, e não como referência de voz.

### 2.1 O que cada estudo ensina

| Referência | O que deve orientar nos textos futuros | O que não deve ser reproduzido automaticamente |
| --- | --- | --- |
| Home Credit | Parágrafos mais desenvolvidos, progressão entre hipótese, gráfico e interpretação, transições que anunciam a próxima etapa, sínteses depois de uma sequência longa | Períodos excessivamente extensos, repetições, afirmações financeiras sem premissas suficientemente delimitadas |
| Churn | Explicação de procedimentos de Machine Learning, comparação entre modelos, alternância entre código, resultado e interpretação, uso pontual de analogias | Excesso de anglicismos, conclusões causais a partir de associações, extrapolações financeiras não demonstradas |
| IMDb | Storytelling, curiosidade, entusiasmo e comentários que aproximam o leitor do processo | Exclamações frequentes, linguagem datada, personificação excessiva e comentários que substituam uma análise técnica |
| Arboviroses já escrito | Clareza, cautela epidemiológica, estrutura pergunta → evidência → implicação e conexão explícita com o modelo | Um tom distante demais da primeira pessoa ou uma repetição mecânica dos cards de insight |

Quando houver conflito, Home Credit define o ritmo narrativo, Churn define o modo de explicar modelagem e o projeto de arboviroses define o nível atual de rigor e cuidado com alegações de saúde.

## 3. Síntese da voz autoral

A voz de Angel pode ser definida como **uma narrativa técnica guiada, próxima e orientada por evidências visuais**.

Ela combina cinco características principais:

1. **Condução do leitor.** O texto mostra onde a análise está, o que será observado e por que a próxima etapa existe.
2. **Primeira pessoa responsável.** Angel assume suas decisões com verbos como “criei”, “utilizei”, “optei”, “selecionei” e “realizei”, sem transformar o estudo em uma autobiografia.
3. **Leitura compartilhada da evidência.** Depois de um gráfico, o texto costuma usar “podemos observar”, “é possível perceber” ou “isso indica” para interpretar o resultado junto com o leitor.
4. **Explicação por consequência.** Uma ferramenta não aparece isoladamente; ela é apresentada pelo que resolve, evita ou permite fazer.
5. **Entusiasmo controlado.** Existe interesse real pelas descobertas, sobretudo em IMDb e em alguns momentos de Churn, mas os trabalhos mais recentes deslocam esse entusiasmo para a relevância do resultado, em vez de depender de exclamações.

O texto não deve soar como artigo acadêmico impessoal, documentação de biblioteca ou lista de procedimentos. Também não deve soar como propaganda. O ponto de equilíbrio é o de alguém que conhece o projeto por dentro e o explica com naturalidade para um leitor tecnicamente interessado.

## 4. Posição do narrador e relação com o leitor

### 4.1 Primeira pessoa para decisões

Usar a primeira pessoa quando a frase relata uma escolha concreta do projeto:

- “selecionei os modelos”;
- “optei por uma separação temporal”;
- “utilizei a validação de 2020”;
- “criei uma representação cíclica”;
- “realizei a comparação”.

Esse uso é especialmente característico em Home Credit e Churn. Ele deixa claro que as decisões não surgiram de maneira automática. A primeira pessoa deve estar ligada a uma ação, a um critério ou a uma justificativa.

Evitar iniciar todos os parágrafos com “eu”. O sujeito pode permanecer implícito em português, preservando a presença autoral sem criar repetição.

### 4.2 Primeira pessoa do plural para interpretar

Usar “vamos”, “podemos” e “percebemos” quando o texto convida o leitor a acompanhar uma comparação:

- “vamos comparar os resultados”;
- “podemos perceber uma diferença”;
- “com isso, conseguimos observar”.

Home Credit usa esse recurso com frequência, inclusive para ligar um gráfico ao seguinte. Essa é uma das marcas mais fortes da voz de Angel. O plural cria proximidade, mas não deve ser usado para fabricar consenso. Em alegações incertas, preferir “os dados sugerem” ou “essa diferença pode indicar”.

### 4.3 Terceira pessoa em contextos simulados

Churn e IMDb utilizam personagens ou situações de negócio para dar contexto ao projeto. Esse recurso pode ser preservado quando houver um interlocutor real ou uma simulação clara. No projeto do SINAN, entretanto, não é necessário inventar um personagem, um hospital ou uma autoridade pública. O contexto de saúde já é concreto e suficientemente importante.

## 5. Ritmo dos parágrafos

Uma leitura quantitativa dos textos atuais reforça a diferença entre as referências:

| Estudo | Parágrafos narrativos analisados | Média aproximada de palavras | Mediana aproximada | Característica dominante |
| --- | ---: | ---: | ---: | --- |
| Home Credit | 32 | 68 | 70 | Parágrafos longos que encadeiam observação, interpretação e transição |
| Churn | 78 | 38 | 29 | Alternância entre explicações médias e conclusões curtas próximas às imagens |
| IMDb | 28 | 37 | 38 | Comentários breves, diretos e frequentemente entusiasmados |

Esses números não são metas rígidas. Eles mostram que escrever como Angel não significa adotar sempre um mesmo tamanho. O tamanho depende da função do parágrafo.

### 5.1 Parágrafo de abertura

Normalmente contém entre duas e quatro ideias conectadas:

1. situa a etapa atual;
2. relembra o problema ou a descoberta anterior;
3. apresenta o que será feito;
4. indica por que isso importa.

É comum terminar esse parágrafo apontando para a imagem ou para o próximo procedimento. Esse encerramento cria continuidade e evita que a figura pareça inserida sem preparação.

### 5.2 Parágrafo anterior à imagem

O parágrafo anterior à imagem deve responder a pelo menos duas perguntas:

- O que foi construído, calculado ou comparado?
- O que o leitor deve observar na imagem?

Quando o visual representa código, o texto explica a finalidade do código, e não cada linha. Quando representa um gráfico, o texto explica as variáveis, os grupos ou a hipótese. Quando representa uma matriz ou tabela, o texto antecipa o critério de leitura.

### 5.3 Parágrafo posterior à imagem

O parágrafo posterior não repete a legenda. Ele realiza uma ou mais destas funções:

- identifica o padrão principal;
- compara grupos ou modelos;
- traduz um valor técnico;
- explica por que o resultado importa;
- introduz uma ressalva;
- abre a próxima pergunta.

Essa volta ao texto depois da imagem é central. A figura não encerra a ideia sozinha.

### 5.4 Parágrafo de transição

Angel costuma terminar uma análise anunciando a próxima. Expressões como “vamos agora”, “em seguida” e “com isso” aparecem porque o estudo é tratado como um percurso. A transição ideal deve explicar a relação lógica entre as etapas, e não apenas informar que outra seção começou.

Exemplo abstrato de relação lógica:

> A comparação mostrou que os modelos individuais reconhecem padrões diferentes. Com isso, a próxima etapa é verificar se essas diferenças podem ser combinadas em um ensemble.

Esse exemplo descreve o mecanismo da voz sem antecipar o texto final do projeto.

## 6. Coreografia entre parágrafos e imagens

O padrão visual-narrativo dominante é:

> **Título → parágrafo de preparação → imagem → parágrafo de interpretação → transição**

Na marcação atual de Home Credit, a passagem de parágrafo para figura ocorre aproximadamente vinte vezes, e a volta de figura para parágrafo ocorre aproximadamente dezesseis vezes. Churn usa ainda mais imagens e, por isso, inclui sequências de figuras comparáveis antes de retornar ao texto. IMDb frequentemente usa uma explicação curta, apresenta o resultado e passa à próxima análise.

### 6.1 Sequência canônica

Usar esta sequência quando uma imagem sustenta uma decisão importante:

1. Título que formula a etapa ou a pergunta.
2. Parágrafo que apresenta o procedimento e o motivo.
3. Imagem de código, fluxo, arquitetura ou resultado.
4. Parágrafo que interpreta o que ficou visível.
5. Segundo parágrafo, apenas quando for necessário tratar uma consequência ou limitação separadamente.

### 6.2 Duas imagens comparáveis

Quando duas imagens respondem à mesma pergunta:

1. apresentar as duas no mesmo parágrafo;
2. exibi-las juntas, se continuarem legíveis;
3. compará-las no parágrafo posterior;
4. evitar escrever uma introdução e uma conclusão completas para cada imagem.

### 6.3 Sequência de código e resultado

O padrão mais próximo de Churn é:

1. explicar o objetivo do código;
2. mostrar o trecho ou diagrama;
3. mostrar o resultado relacionado;
4. interpretar o resultado em linguagem de negócio ou do domínio;
5. registrar a limitação relevante.

Não inserir capturas de código apenas para provar que houve implementação. Cada imagem técnica precisa participar da narrativa.

## 7. Estrutura do raciocínio dentro de cada análise

O raciocínio autoral pode ser reproduzido com a seguinte sequência:

### 7.1 Hipótese ou necessidade

O texto começa com uma expectativa, uma pergunta ou um problema. Home Credit faz isso de maneira explícita ao partir de ideias comuns e verificar se elas aparecem nos dados. Churn parte dos requisitos do gerente e retorna a eles na conclusão.

### 7.2 Ação tomada

Em seguida, Angel descreve o que fez. A explicação costuma mencionar a ferramenta, mas o verbo principal representa a ação: separar, padronizar, balancear, codificar, treinar, comparar ou visualizar.

### 7.3 Evidência

A imagem, tabela ou métrica aparece depois que sua função foi explicada. O leitor sabe antecipadamente o que está vendo.

### 7.4 Leitura da evidência

O texto destaca o padrão de maior importância, geralmente começando com construções como:

- “é possível perceber”;
- “podemos observar”;
- “o gráfico mostra”;
- “comparando os resultados”;
- “com isso, fica evidente”.

### 7.5 Consequência

Por fim, o resultado é conectado a uma decisão, a uma pergunta inicial ou à próxima etapa. É essa consequência que impede o texto de se tornar uma descrição superficial de gráficos.

## 8. Forma de explicar Machine Learning

Churn e Home Credit mostram que Angel prefere explicar Machine Learning por meio do processo e da finalidade, e não por definições isoladas.

### 8.1 Ordem recomendada

Ao apresentar uma decisão de modelagem, seguir esta ordem:

1. problema que precisava ser resolvido;
2. técnica escolhida;
3. motivo da escolha;
4. como ela foi aplicada no projeto;
5. efeito esperado ou observado;
6. imagem relacionada;
7. interpretação e transição.

Por exemplo, não basta dizer que houve validação temporal. É necessário explicar que essa separação impede que informações de períodos posteriores orientem decisões feitas com períodos anteriores e torna o teste final mais próximo de um cenário de uso futuro.

### 8.2 Nível de detalhe

O texto deve citar nomes técnicos quando eles ajudam o leitor a compreender uma decisão: `StandardScaler`, validação cruzada, early stopping, Optuna, limiar, recall ou ensemble. Em seguida, deve traduzir a função do termo na mesma frase ou no período posterior.

Não transformar o estudo em uma aula completa sobre cada algoritmo. Explicar somente o necessário para entender:

- por que o modelo entrou na comparação;
- o que ele oferece de diferente;
- como foi treinado ou ajustado;
- qual papel exerce no resultado final.

### 8.3 Comparações entre modelos

Angel tende a personificar levemente o comportamento dos modelos, usando construções como “cada modelo possui seu próprio modo de entender as informações”. Esse recurso pode ser preservado de forma moderada, desde que a frase seguinte seja tecnicamente precisa.

Uma comparação deve apresentar primeiro o critério comum e depois as diferenças. Evitar declarar que um modelo é “melhor” sem dizer em qual métrica, conjunto e ponto de operação.

## 9. Marcadores linguísticos característicos

Os conectores abaixo aparecem de forma recorrente e ajudam a reproduzir a cadência autoral.

### 9.1 Para iniciar uma ação

- “para isso”;
- “inicialmente”;
- “comecei”;
- “em seguida”;
- “depois”;
- “a partir disso”.

### 9.2 Para interpretar

- “é possível observar”;
- “podemos perceber”;
- “comparando”;
- “isso indica”;
- “isso mostra”;
- “fica evidente”.

### 9.3 Para contrastar ou limitar

- “porém”;
- “no entanto”;
- “ainda que”;
- “apesar disso”;
- “vale lembrar”;
- “é importante ressaltar”.

### 9.4 Para concluir ou avançar

- “com isso”;
- “em resumo”;
- “enfim”;
- “por fim”;
- “vamos agora”;
- “a próxima etapa”.

Home Credit usa demonstrativos como “esse”, “essa” e “nesse” com grande frequência para apontar para o gráfico ou procedimento próximo. Essa marca pode ser preservada, mas o referente precisa continuar inequívoco. Se houver duas imagens ou duas técnicas no parágrafo anterior, repetir o nome do elemento em vez de usar apenas “isso”.

## 10. Títulos e perguntas

Os títulos mais característicos não nomeiam apenas uma ferramenta. Eles formulam uma questão ou uma relação a ser investigada.

Preferir:

- uma pergunta que o bloco responderá;
- uma decisão técnica acompanhada de sua finalidade;
- uma comparação explícita;
- uma consequência relevante.

Evitar títulos como “XGBoost”, “Código” ou “Resultados” quando for possível dizer o que será discutido sobre eles.

Em uma seção longa, o título pode combinar uma formulação técnica e uma pergunta mais próxima do leitor. Esse recurso aparece principalmente em Home Credit. Para a modelagem do SINAN, entretanto, as perguntas devem permanecer sóbrias e não sugerir que o modelo realiza diagnóstico.

## 11. Uso de listas e sínteses

Angel não depende de marcadores para desenvolver o raciocínio. A explicação principal acontece em parágrafos. Listas são usadas quando existe uma coleção real de elementos:

- perguntas do projeto;
- requisitos;
- etapas de uma metodologia;
- variáveis de um dicionário;
- conclusões depois de uma sequência de análises;
- limitações ou cuidados.

### 11.1 Regra prática

Se os itens precisam ser lidos em ordem e um depende do anterior, usar parágrafos. Se os itens são paralelos e podem ser consultados separadamente, usar marcadores.

### 11.2 Síntese depois de uma seção longa

Home Credit usa “Em resumo, podemos concluir que:” depois de desenvolver várias evidências. Esse padrão é adequado quando a lista realmente condensa o que já foi demonstrado. Não introduzir informações novas dentro da síntese.

## 12. Entusiasmo, informalidade e proximidade

IMDb contém marcas fortes de entusiasmo, como comentários de surpresa, exclamações e observações pessoais. Churn também usa analogias e frases mais enfáticas. Essas características fazem parte da história da voz, mas devem ser calibradas para o posicionamento profissional atual.

### Preservar

- curiosidade genuína;
- comentários breves que mostrem por que uma descoberta é interessante;
- analogias simples quando realmente facilitarem a explicação;
- convites discretos para acompanhar a próxima etapa;
- conclusões que mostrem o valor prático do trabalho.

### Reduzir

- exclamações sucessivas;
- superlativos como “incrível”, “ótimo” ou “sucesso completo” sem critério;
- expressões excessivamente coloquiais em alegações sensíveis;
- agradecimentos antes de todas as transições;
- comentários que interrompam a explicação técnica.

No projeto do SINAN, a proximidade deve vir da clareza da explicação, e não de um tom promocional.

## 13. O que significa preservar a voz sem preservar erros

Escrever como Angel não significa copiar problemas ortográficos ou construções antigas. A identidade está na condução do raciocínio, na relação com o leitor, no uso de evidências e no movimento entre as etapas.

Devem ser normalizados na redação futura:

- `oque` e `doque` para “o que” e “do que”;
- concordância nominal e verbal;
- uso de crase;
- pontuação de períodos muito extensos;
- nomes oficiais de bibliotecas e modelos;
- diferença entre precisão, acurácia, recall, especificidade e AUC;
- afirmações causais quando os dados sustentam apenas associação;
- anglicismos que possuem uma tradução natural e não são nomes técnicos;
- repetições do mesmo conector em frases próximas.

Também é necessário separar uma frase longa quando ela reunir muitas relações independentes. O parágrafo pode continuar desenvolvido, como em Home Credit, mas deve possuir períodos internamente claros.

## 14. Modelo operacional de escrita

Para redigir um novo bloco no estilo de Angel, usar este roteiro:

1. Escrever uma frase que situe a etapa em relação ao que veio antes.
2. Apresentar o problema ou a pergunta do bloco.
3. Explicar em primeira pessoa a decisão tomada.
4. Justificar a decisão pela necessidade do projeto.
5. Introduzir a imagem dizendo o que ela contém e como deve ser lida.
6. Depois da imagem, destacar o padrão principal.
7. Traduzir o padrão para o domínio do problema.
8. Incluir uma ressalva quando a evidência não permite uma conclusão absoluta.
9. Terminar conectando o resultado à próxima etapa.

O bloco deve parecer uma explicação contínua. Se os parágrafos puderem ser trocados de ordem sem prejuízo, provavelmente falta progressão narrativa.

## 15. Plano de escrita para a modelagem preditiva do SINAN

A seção de modelagem mantém o mesmo ritmo de Home Credit e usa Churn como referência técnica. Ela não repete em detalhe o contexto, o tratamento nem a análise exploratória já apresentados.

### 15.1 Limites editoriais da seção

A seção de modelagem deve explicar:

- como os dados tratados se tornaram entradas dos modelos;
- por que a separação temporal é indispensável;
- por que MLP, XGBoost e LightGBM foram selecionados;
- como treinamento, ajuste e validação foram organizados;
- por que combinar os modelos em um ensemble;
- como o ensemble recebe pesos e chega a um score de classificação;
- quais decisões foram congeladas antes do teste final.

A seção de modelagem **não deve esgotar**:

- os valores finais de todas as métricas;
- a análise detalhada das curvas ROC e precision-recall;
- as matrizes de confusão;
- a escolha final do ponto de operação;
- o funcionamento visual da aplicação web;
- endpoints, hospedagem e experiência do usuário.

Esses assuntos pertencem, respectivamente, à futura seção de métricas e à futura seção da aplicação.

### 15.2 Estrutura aplicada

| Bloco | Função narrativa | Movimento de texto e imagem |
| --- | --- | --- |
| Abertura da parte | Ligar as descobertas da EDA à necessidade de combinar informações clínicas, temporais, demográficas e territoriais | Dois parágrafos; sem lista; possível retomada do diagrama geral do pipeline apenas se não for repetitivo |
| Organização temporal | Explicar treino em 2017–2019, validação em 2020 e teste final em 2021, destacando que o futuro não orientou o passado | Parágrafo de problema → imagem da divisão temporal → interpretação e consequência |
| Construção das entradas | Retomar de forma breve as 107 features e explicar que diferentes famílias de variáveis chegam juntas aos modelos | Parágrafo curto → visual do esquema ou fluxo → parágrafo que evita repetir o tratamento já descrito |
| Três modelos complementares | Apresentar MLP, XGBoost e LightGBM pela função e pelas diferenças, sem transformar o bloco em três aulas isoladas | Introdução comum → três explicações equilibradas → imagem ou comparação → síntese |
| Treinamento e ajuste | Explicar Optuna, early stopping, conjunto de validação e critérios de ajuste a partir do papel de cada elemento | Parágrafo de necessidade → imagem de processo ou código relevante → leitura da decisão |
| Formação do ensemble | Mostrar por que combinar previsões e como os pesos derivados da validação participam do score | Hipótese → diagrama do ensemble → interpretação → transição para avaliação |
| Encerramento da parte | Congelar o processo e preparar o leitor para as métricas | Um ou dois parágrafos, sem antecipar toda a conclusão numérica |

### 15.3 Cadência visual aplicada

A seção deve priorizar poucos visuais, cada um com função clara:

1. divisão temporal dos dados;
2. fluxo dos modelos individuais;
3. processo de treinamento e validação, se houver uma imagem legível;
4. arquitetura do ensemble;
5. resultado técnico preliminar apenas quando necessário para introduzir a avaliação.

Cada visual será precedido por um parágrafo de preparação e seguido por interpretação. Imagens de importância de features, curvas, matrizes e comparações completas ficarão preferencialmente na seção de métricas.

### 15.4 Tom aplicado

- Usar primeira pessoa nas escolhas: “selecionei”, “dividi”, “utilizei”, “combinei”.
- Usar primeira pessoa do plural nas leituras: “podemos observar”, “vamos comparar”.
- Explicar termos técnicos imediatamente após mencioná-los.
- Dar prioridade ao motivo e à consequência de cada decisão.
- Evitar apresentar o ensemble como diagnóstico ou como substituto de avaliação médica.
- Tratar o resultado como score de classificação.
- Usar cautela especial ao explicar sensibilidade, falsos negativos e ponto de operação.

## 16. Fonte de verdade confirmada para as métricas do SINAN

O proprietário do projeto confirmou que a versão correta para publicação utiliza o limiar `0,30`. No teste temporal de 2021, com 940.304 registros, os valores canônicos são:

- **Accuracy de 72,1%:** 677.991 classificações corretas;
- **Precision de 66,1%:** de cada 100 casos marcados como dengue, aproximadamente 66 eram confirmados;
- **Recall de 87,3%:** aproximadamente 87 de cada 100 casos realmente confirmados foram encontrados;
- **ROC-AUC de 82,9%:** capacidade de separar confirmados e descartados ao considerar diferentes limiares.

Para a apresentação visual, o proprietário também definiu como oficiais os arquivos que estiverem atualmente em `reports/figures/modeling/evaluation/`. Essas imagens devem ser utilizadas diretamente na página, sem serem substituídas por versões recuperadas do histórico do Git, mesmo quando existirem outros artefatos de avaliação no repositório. Qualquer divergência futura entre texto e imagem deve ser levada ao proprietário, não resolvida pela escolha autônoma de uma versão histórica.

A parte de modelagem deve explicar como o ensemble foi construído sem antecipar esses resultados. O limiar, a troca entre Precision e Recall, as matrizes de confusão e a interpretação das quatro métricas pertencem à parte seguinte.

### 16.1 Ajuste de cadência confirmado pelo autor

O autor prefere uma escrita mais corrida, com ideias encadeadas por vírgulas e conectivos, evitando uma sucessão excessiva de frases curtas encerradas por ponto. Isso não significa construir períodos indefinidos ou eliminar pausas necessárias, mas aproximar o texto do fluxo observado principalmente em Home Credit, no qual contexto, decisão e consequência costumam permanecer dentro do mesmo movimento argumentativo.

Na prática, a redação deve:

- unir frases curtas quando elas descrevem a mesma relação de causa e consequência;
- usar conectivos como “por isso”, “com isso”, “enquanto”, “assim” e “portanto” para manter continuidade;
- reservar o ponto final para mudanças reais de ideia, etapa ou perspectiva;
- evitar períodos tão extensos que obriguem o leitor a recuperar o início da frase;
- alternar períodos longos com pausas pontuais, preservando naturalidade e legibilidade.

### 16.2 Capturas de aplicações

Quando uma aplicação fizer parte do estudo de caso, as capturas devem usar o modo claro, mostrar apenas o componente ou fluxo discutido no texto e evitar grandes áreas de navegação, fundo ou conteúdo não relacionado. As imagens não devem receber bordas ou molduras adicionais no portfólio, pois o próprio recorte da interface já deve fornecer a separação visual necessária.

## 17. Regras específicas para alegações de saúde

O projeto exige cuidados que não estavam presentes nos estudos financeiros e de entretenimento:

- nunca chamar o score de “probabilidade clínica”;
- nunca chamar a classificação de diagnóstico;
- não afirmar que um sintoma, ocupação, sexo ou local causa dengue com base nas associações observadas;
- explicar que a ferramenta trabalha com registros e padrões do SINAN;
- informar o período e o conjunto em que uma métrica foi obtida;
- separar desempenho estatístico de utilidade clínica;
- mencionar atrasos, ausências e limitações dos dados quando afetarem a interpretação;
- não esconder a troca entre recall e falsos positivos ao explicar o limiar;
- manter visível que avaliação médica continua necessária.

## 18. Checklist de imitação da voz

Antes de considerar um bloco pronto, verificar:

- [ ] O leitor entende por que essa etapa existe?
- [ ] Uma decisão concreta foi assumida e justificada?
- [ ] A ferramenta foi explicada por sua função, e não apenas nomeada?
- [ ] A imagem foi preparada pelo texto anterior?
- [ ] Existe interpretação depois da imagem?
- [ ] O resultado foi conectado ao problema ou à próxima etapa?
- [ ] A primeira pessoa aparece apenas onde existe uma decisão autoral?
- [ ] “Vamos” e “podemos” conduzem a leitura sem fabricar certeza?
- [ ] Os conectores variam o suficiente para não parecerem mecânicos?
- [ ] Listas foram usadas apenas para itens paralelos ou sínteses?
- [ ] O texto preserva curiosidade e proximidade sem exagerar no entusiasmo?
- [ ] Ortografia, concordância e terminologia foram revisadas?
- [ ] Toda métrica possui conjunto, período e interpretação?
- [ ] Associações não foram transformadas em causalidade?
- [ ] O score foi claramente separado de diagnóstico e probabilidade clínica?

## 19. Regra curta para futuras redações

Se for necessário resumir todo este guia em uma instrução operacional, usar:

> Escreva como alguém que realizou o projeto e agora conduz o leitor pelo mesmo raciocínio: apresente a pergunta, assuma e justifique a decisão, mostre a evidência visual, interprete o que ela revela, registre o cuidado necessário e conecte a descoberta à próxima etapa.
