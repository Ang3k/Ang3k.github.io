import type { PatientData } from "./types/patient";

export type StaticModelResult = {
  name: "mlp" | "xgboost" | "lightgbm";
  probability: number;
  weight: number;
};

export type StaticDemoCase = {
  id: string;
  sourceSeed: number;
  sourceIndex: number;
  case: {
    age: number;
    sex: string;
    race: string;
    occupation: string | null;
    state: string;
    municipality: string;
    symptoms: string[];
  };
  patientData: PatientData;
  selectedSymptoms: string[];
  observedClassification: string;
  prediction: {
    disease: "dengue";
    models: StaticModelResult[];
    average: number;
    threshold: number;
    isPositive: boolean;
  };
};

type CompactCase = {
  s: number; i: number; a: number; x: string; g: number | null;
  r: number | null; e: number | null; oc: string; on: string;
  uf: number; u: string; mc: number; mn: string; hr: number; hn: string;
  nd: string; sd: string; dt: number; ew: number; ey: number;
  sy: string[]; ob: string; mp: number[]; av: number; pos: boolean;
};

// Resultados reproduzidos com a API, os modelos e o conjunto de teste de 2021
// do commit d0cf55352db5433833690cb4f1ef8e3573da7115 do projeto original.
// Nenhum modelo é executado pela versão estática.
const compactCases: CompactCase[] = [
  {"s":0,"i":799845,"a":65,"x":"F","g":5,"r":1,"e":9,"oc":"","on":"","uf":35,"u":"SP","mc":3548500,"mn":"Santos","hr":1349,"hn":"Baixada Santista","nd":"2021-04-14","sd":"2021-04-05","dt":9,"ew":14,"ey":2021,"sy":["fever","myalgia","headache","rash","vomiting","nausea","arthritis","joint_pain"],"ob":"Descartado","mp":[47.1,58.6,62.7],"av":56.2,"pos":true},
  {"s":1,"i":444941,"a":21,"x":"M","g":6,"r":1,"e":6,"oc":"999991","on":"Estudante","uf":41,"u":"PR","mc":4115200,"mn":"Maringá","hr":1369,"hn":"15ª RS Maringá","nd":"2021-12-10","sd":"2021-11-28","dt":12,"ew":48,"ey":2021,"sy":["myalgia","rash","vomiting","nausea","joint_pain","retro_orbital_pain"],"ob":"Descartado","mp":[18.8,23,26.7],"av":22.9,"pos":false},
  {"s":2,"i":787575,"a":15,"x":"F","g":9,"r":4,"e":null,"oc":"","on":"","uf":35,"u":"SP","mc":3509502,"mn":"Campinas","hr":1342,"hn":"Região Metropolitana de Campinas","nd":"2021-04-16","sd":"2021-04-13","dt":3,"ew":15,"ey":2021,"sy":["fever","myalgia","headache"],"ob":"Dengue","mp":[24.7,49.9,48.7],"av":41.2,"pos":true},
  {"s":3,"i":763060,"a":28,"x":"F","g":5,"r":4,"e":7,"oc":"421125","on":"Operador de caixa","uf":35,"u":"SP","mc":3502804,"mn":"Araçatuba","hr":1336,"hn":"Central do DRS II","nd":"2021-03-15","sd":"2021-03-11","dt":4,"ew":10,"ey":2021,"sy":["fever","myalgia","headache","back_pain","arthritis","retro_orbital_pain"],"ob":"Descartado","mp":[23.9,38.4,34.6],"av":32.3,"pos":true},
  {"s":4,"i":683077,"a":32,"x":"F","g":9,"r":9,"e":9,"oc":"521110","on":"Vendedor de comércio varejista","uf":35,"u":"SP","mc":3513504,"mn":"Cubatão","hr":1349,"hn":"Baixada Santista","nd":"2021-03-15","sd":"2021-03-09","dt":6,"ew":10,"ey":2021,"sy":["fever","myalgia","rash","vomiting"],"ob":"Descartado","mp":[55.6,53.8,53.9],"av":54.4,"pos":true},
  {"s":5,"i":630746,"a":1,"x":"F","g":6,"r":1,"e":10,"oc":"","on":"","uf":35,"u":"SP","mc":3549805,"mn":"São José do Rio Preto","hr":1354,"hn":"São José do Rio Preto","nd":"2021-05-12","sd":"2021-05-12","dt":0,"ew":19,"ey":2021,"sy":["myalgia","headache"],"ob":"Descartado","mp":[13.9,22.9,22.2],"av":19.7,"pos":false},
  {"s":6,"i":418478,"a":30,"x":"M","g":6,"r":9,"e":null,"oc":"","on":"","uf":26,"u":"PE","mc":2602902,"mn":"Cabo de Santo Agostinho","hr":1497,"hn":"I Região de Saúde","nd":"2021-08-24","sd":"2021-08-20","dt":4,"ew":33,"ey":2021,"sy":["fever","joint_pain"],"ob":"Descartado","mp":[11.6,10.2,9.9],"av":10.6,"pos":false},
  {"s":7,"i":888497,"a":11,"x":"F","g":9,"r":4,"e":9,"oc":"","on":"","uf":35,"u":"SP","mc":3506508,"mn":"Birigui","hr":1336,"hn":"Consórcios do DRS II","nd":"2021-05-22","sd":"2021-05-21","dt":1,"ew":20,"ey":2021,"sy":["fever","headache","rash"],"ob":"Dengue","mp":[47.9,76.6,73.8],"av":66.1,"pos":true},
  {"s":8,"i":676595,"a":41,"x":"M","g":6,"r":4,"e":5,"oc":"999994","on":"Desempregado crônico (categoria do SINAN)","uf":35,"u":"SP","mc":3557105,"mn":"Votuporanga","hr":1354,"hn":"Votuporanga","nd":"2021-03-17","sd":"2021-03-16","dt":1,"ew":11,"ey":2021,"sy":["myalgia","headache","nausea"],"ob":"Dengue","mp":[15.7,25.1,23.4],"av":21.4,"pos":false},
  {"s":9,"i":396382,"a":40,"x":"F","g":5,"r":4,"e":8,"oc":"223505","on":"Enfermeiro","uf":26,"u":"PE","mc":2616407,"mn":"Vitória de Santo Antão","hr":1497,"hn":"I Região de Saúde","nd":"2021-02-27","sd":"2021-02-15","dt":12,"ew":7,"ey":2021,"sy":["fever","myalgia","rash","joint_pain"],"ob":"Descartado","mp":[42,51.3,49.2],"av":47.5,"pos":true},
  {"s":10,"i":730181,"a":33,"x":"F","g":5,"r":1,"e":null,"oc":"","on":"","uf":35,"u":"SP","mc":3554003,"mn":"Tatuí","hr":1353,"hn":"Itapetininga","nd":"2021-02-15","sd":"2021-02-14","dt":1,"ew":7,"ey":2021,"sy":["vomiting","back_pain"],"ob":"Descartado","mp":[25.5,33.3,33.2],"av":30.7,"pos":true},
  {"s":11,"i":125813,"a":0.003,"x":"F","g":6,"r":4,"e":10,"oc":"","on":"","uf":23,"u":"CE","mc":2304400,"mn":"Fortaleza","hr":1519,"hn":"1ª RS Fortaleza","nd":"2021-06-07","sd":"2021-06-06","dt":1,"ew":23,"ey":2021,"sy":["fever"],"ob":"Dengue","mp":[8,20.1,17.3],"av":15.1,"pos":false},
  {"s":12,"i":576122,"a":34,"x":"F","g":5,"r":3,"e":8,"oc":"252210","on":"Contador","uf":42,"u":"SC","mc":4205407,"mn":"Florianópolis","hr":1476,"hn":"Grande Florianópolis","nd":"2021-01-11","sd":"2021-01-08","dt":3,"ew":1,"ey":2021,"sy":["fever","myalgia","headache","rash","nausea","retro_orbital_pain"],"ob":"Descartado","mp":[9.4,11.4,12.9],"av":11.2,"pos":false},
  {"s":13,"i":842468,"a":29,"x":"F","g":6,"r":1,"e":6,"oc":"","on":"","uf":35,"u":"SP","mc":3529005,"mn":"Marília","hr":1344,"hn":"Marília","nd":"2021-02-17","sd":"2021-02-16","dt":1,"ew":7,"ey":2021,"sy":["fever","headache","nausea"],"ob":"Dengue","mp":[32.8,31.4,31.1],"av":31.8,"pos":true},
  {"s":14,"i":141302,"a":62,"x":"F","g":5,"r":4,"e":2,"oc":"999994","on":"Desempregado crônico (categoria do SINAN)","uf":23,"u":"CE","mc":2311801,"mn":"Russas","hr":1518,"hn":"4ª RS Litoral Leste/Jaguaribe","nd":"2021-06-18","sd":"2021-06-16","dt":2,"ew":24,"ey":2021,"sy":["fever","myalgia","headache","joint_pain","retro_orbital_pain"],"ob":"Dengue","mp":[67.4,84.7,84.7],"av":79,"pos":true},
  {"s":15,"i":875633,"a":33,"x":"M","g":6,"r":9,"e":9,"oc":"","on":"","uf":35,"u":"SP","mc":3554508,"mn":"Tietê","hr":1353,"hn":"Sorocaba","nd":"2021-06-14","sd":"2021-06-09","dt":5,"ew":23,"ey":2021,"sy":["fever","myalgia","joint_pain","retro_orbital_pain"],"ob":"Descartado","mp":[28,50.7,45.9],"av":41.6,"pos":true},
  {"s":16,"i":506423,"a":27,"x":"F","g":5,"r":1,"e":null,"oc":"","on":"","uf":41,"u":"PR","mc":4116208,"mn":"Morretes","hr":1355,"hn":"1ª RS Paranaguá","nd":"2021-04-05","sd":"2021-03-27","dt":9,"ew":12,"ey":2021,"sy":["fever","myalgia","headache"],"ob":"Dengue","mp":[48.1,83.5,85.1],"av":72.3,"pos":true},
  {"s":17,"i":696731,"a":15,"x":"F","g":5,"r":1,"e":4,"oc":"999991","on":"Estudante","uf":35,"u":"SP","mc":3529005,"mn":"Marília","hr":1344,"hn":"Marília","nd":"2021-01-18","sd":"2021-01-12","dt":6,"ew":2,"ey":2021,"sy":["fever","myalgia","headache","retro_orbital_pain"],"ob":"Dengue","mp":[23.4,35.5,34.7],"av":31.2,"pos":true},
  {"s":18,"i":840254,"a":75,"x":"M","g":6,"r":1,"e":3,"oc":"999993","on":"Aposentado/pensionista","uf":35,"u":"SP","mc":3542503,"mn":"Reginópolis","hr":1340,"hn":"Bauru","nd":"2021-04-12","sd":"2021-04-05","dt":7,"ew":14,"ey":2021,"sy":["fever","vomiting","back_pain"],"ob":"Descartado","mp":[59.2,44.4,43.1],"av":48.8,"pos":true},
  {"s":19,"i":553876,"a":74,"x":"M","g":6,"r":1,"e":3,"oc":"","on":"","uf":42,"u":"SC","mc":4209102,"mn":"Joinville","hr":1565,"hn":"Nordeste","nd":"2021-04-22","sd":"2021-04-21","dt":1,"ew":16,"ey":2021,"sy":["fever","myalgia","headache","retro_orbital_pain"],"ob":"Dengue","mp":[69.7,84.6,84.6],"av":79.7,"pos":true},
  {"s":20,"i":838988,"a":39,"x":"M","g":6,"r":1,"e":6,"oc":"","on":"","uf":35,"u":"SP","mc":3554003,"mn":"Tatuí","hr":1353,"hn":"Itapetininga","nd":"2021-02-22","sd":"2021-02-21","dt":1,"ew":8,"ey":2021,"sy":["fever","myalgia","headache","nausea","retro_orbital_pain"],"ob":"Dengue","mp":[78.2,84.2,83.1],"av":81.8,"pos":true},
  {"s":21,"i":283419,"a":37,"x":"M","g":6,"r":1,"e":null,"oc":"","on":"","uf":31,"u":"MG","mc":3170404,"mn":"Unaí","hr":1463,"hn":"Unaí/Paracatu","nd":"2021-01-27","sd":"2021-01-23","dt":4,"ew":3,"ey":2021,"sy":["fever","myalgia","headache","nausea","back_pain"],"ob":"Descartado","mp":[10.8,13.8,13.3],"av":12.6,"pos":false},
  {"s":22,"i":725204,"a":28,"x":"M","g":6,"r":2,"e":5,"oc":"","on":"","uf":35,"u":"SP","mc":3529005,"mn":"Marília","hr":1344,"hn":"Marília","nd":"2021-04-22","sd":"2021-04-21","dt":1,"ew":16,"ey":2021,"sy":["myalgia","headache","back_pain"],"ob":"Dengue","mp":[39.1,36.2,35.4],"av":36.9,"pos":true},
  {"s":23,"i":33766,"a":28,"x":"F","g":5,"r":4,"e":null,"oc":"","on":"","uf":12,"u":"AC","mc":1200385,"mn":"Plácido de Castro","hr":1938,"hn":"Baixo Acre e Purus","nd":"2021-03-07","sd":"2021-03-01","dt":6,"ew":9,"ey":2021,"sy":["fever","myalgia","headache","back_pain"],"ob":"Descartado","mp":[6.8,6.5,7.5],"av":6.9,"pos":false},
  {"s":24,"i":359831,"a":12,"x":"M","g":6,"r":9,"e":null,"oc":"","on":"","uf":51,"u":"MT","mc":5100250,"mn":"Alta Floresta","hr":1587,"hn":"Alto Tapajós","nd":"2021-11-30","sd":"2021-11-23","dt":7,"ew":47,"ey":2021,"sy":["fever","myalgia","headache","nausea"],"ob":"Dengue","mp":[93.2,85.7,84.2],"av":87.7,"pos":true},
  {"s":25,"i":474159,"a":6,"x":"F","g":6,"r":1,"e":10,"oc":"","on":"","uf":41,"u":"PR","mc":4124053,"mn":"Santa Terezinha de Itaipu","hr":1363,"hn":"9ª RS Foz do Iguaçu","nd":"2021-04-25","sd":"2021-04-25","dt":0,"ew":17,"ey":2021,"sy":["fever","myalgia","headache","joint_pain"],"ob":"Dengue","mp":[35.1,52.5,53.6],"av":47.1,"pos":true},
  {"s":26,"i":810601,"a":21,"x":"M","g":6,"r":9,"e":null,"oc":"","on":"","uf":35,"u":"SP","mc":3513504,"mn":"Cubatão","hr":1349,"hn":"Baixada Santista","nd":"2021-04-23","sd":"2021-04-18","dt":5,"ew":16,"ey":2021,"sy":["fever","myalgia","headache","retro_orbital_pain"],"ob":"Dengue","mp":[62.6,60.4,58.8],"av":60.6,"pos":true},
  {"s":27,"i":656084,"a":61,"x":"M","g":6,"r":1,"e":9,"oc":"","on":"","uf":35,"u":"SP","mc":3538709,"mn":"Piracicaba","hr":1345,"hn":"Piracicaba","nd":"2021-03-19","sd":"2021-03-01","dt":18,"ew":9,"ey":2021,"sy":["myalgia","headache","rash","back_pain"],"ob":"Dengue","mp":[58.4,54.5,56.5],"av":56.5,"pos":true},
  {"s":28,"i":626548,"a":59,"x":"M","g":6,"r":1,"e":6,"oc":"998999","on":"","uf":35,"u":"SP","mc":3529401,"mn":"Mauá","hr":1332,"hn":"Grande ABC","nd":"2021-04-23","sd":"2021-04-16","dt":7,"ew":15,"ey":2021,"sy":["fever","myalgia","headache"],"ob":"Dengue com sinais de alarme","mp":[15.6,47.4,47.1],"av":36.8,"pos":true},
  {"s":29,"i":878815,"a":24,"x":"F","g":5,"r":1,"e":null,"oc":"","on":"","uf":35,"u":"SP","mc":3512001,"mn":"Colina","hr":1339,"hn":"Norte - Barretos","nd":"2021-05-10","sd":"2021-05-08","dt":2,"ew":18,"ey":2021,"sy":["fever","myalgia","headache","vomiting"],"ob":"Descartado","mp":[11.2,16.8,17.1],"av":15,"pos":false}
];

const symptomLabels: Record<string, string> = {
  fever: "Febre",
  myalgia: "Mialgia",
  headache: "Cefaleia",
  rash: "Exantema",
  vomiting: "Vômitos",
  nausea: "Náusea",
  back_pain: "Dor nas costas",
  conjunctivitis: "Conjuntivite",
  arthritis: "Artrite",
  joint_pain: "Dor nas articulações",
  petechiae: "Petéquias",
  retro_orbital_pain: "Dor retro-orbital",
};

const sexLabels: Record<string, string> = {
  F: "Feminino", M: "Masculino", I: "Ignorado",
};

const raceLabels: Record<number, string> = {
  1: "Branca", 2: "Preta", 3: "Amarela", 4: "Parda", 5: "Indígena", 9: "Ignorado",
};

function shuffleCases(cases: CompactCase[]) {
  const shuffled = [...cases];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

// A sequência muda a cada carregamento. Cada caso aparece uma vez antes de o
// ciclo recomeçar; os dados, scores, sementes e índices originais não mudam.
const shuffledCases = shuffleCases(compactCases);

export const staticDemoCases: StaticDemoCase[] = shuffledCases.map(item => ({
  id: `caso-${item.s + 1}`,
  sourceSeed: item.s,
  sourceIndex: item.i,
  case: {
    age: item.a < 1 ? 0 : Math.round(item.a),
    sex: sexLabels[item.x] ?? "Não informado",
    race: item.r === null ? "Não informado" : raceLabels[item.r] ?? "Ignorado",
    occupation: item.on || null,
    state: item.u,
    municipality: item.mn,
    symptoms: item.sy.map(id => symptomLabels[id]),
  },
  patientData: {
    ageYears: String(item.a),
    sex: item.x,
    pregnancyStatus: item.g === null ? "" : String(item.g),
    race: item.r === null ? "" : String(item.r),
    educationLevel: item.e === null ? "" : String(item.e),
    occupationCode: item.oc,
    occupationName: item.on,
    residenceState: String(item.uf),
    residenceStateLabel: item.u,
    residenceMunicipality: String(item.mc),
    residenceMunicipalityName: item.mn,
    residenceHealthRegion: String(item.hr),
    residenceHealthRegionName: item.hn,
    notificationDate: item.nd,
    symptomOnsetDate: item.sd,
    daysToNotification: String(item.dt),
    symptomEpiWeekNumber: String(item.ew),
    symptomEpiYear: String(item.ey),
  },
  selectedSymptoms: item.sy,
  observedClassification: item.ob,
  prediction: {
    disease: "dengue",
    models: [
      { name: "mlp", probability: item.mp[0], weight: 33.2 },
      { name: "xgboost", probability: item.mp[1], weight: 33.4 },
      { name: "lightgbm", probability: item.mp[2], weight: 33.4 },
    ],
    average: item.av,
    threshold: 30,
    isPositive: item.pos,
  },
}));

export function formatModelName(name: string) {
  if (name === "mlp") return "MLP";
  if (name === "xgboost") return "XGBoost";
  if (name === "lightgbm") return "LightGBM";
  return name;
}
