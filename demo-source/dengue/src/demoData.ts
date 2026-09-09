export type Disease = "dengue" | "chikungunya";

export type TriageItem = {
  id: string;
  label: string;
  group: "symptoms";
};

export const triageItems: TriageItem[] = [
  { id: "fever", label: "Febre", group: "symptoms" },
  { id: "myalgia", label: "Mialgia / dor muscular", group: "symptoms" },
  { id: "headache", label: "Cefaleia / dor de cabeça", group: "symptoms" },
  { id: "rash", label: "Exantema / manchas na pele", group: "symptoms" },
  { id: "vomiting", label: "Vômitos", group: "symptoms" },
  { id: "nausea", label: "Náusea / enjoo", group: "symptoms" },
  { id: "back_pain", label: "Dor nas costas", group: "symptoms" },
  { id: "conjunctivitis", label: "Conjuntivite", group: "symptoms" },
  { id: "arthritis", label: "Artrite", group: "symptoms" },
  { id: "joint_pain", label: "Dor nas articulações", group: "symptoms" },
  { id: "petechiae", label: "Petéquias / pequenos pontos vermelhos na pele", group: "symptoms" },
  { id: "retro_orbital_pain", label: "Dor atrás dos olhos", group: "symptoms" },
];
