import { useState } from "react";
import CheckboxItem from "../components/CheckboxItem";
import PatientForm from "../components/PatientForm";
import Resultado from "../components/Resultado";
import { triageItems } from "../demoData";
import type { Disease } from "../demoData";
import { staticDemoCases } from "../staticCases";
import type { PatientData } from "../types/patient";

const estadoInicial: PatientData = {
  ageYears: "", sex: "", pregnancyStatus: "", race: "",
  educationLevel: "", occupationCode: "", occupationName: "",
  residenceState: "", residenceStateLabel: "", residenceMunicipality: "",
  residenceMunicipalityName: "", residenceHealthRegion: "",
  residenceHealthRegionName: "", notificationDate: "",
  symptomOnsetDate: "", daysToNotification: "",
  symptomEpiWeekNumber: "", symptomEpiYear: "",
};

function Triage() {
  const [disease, setDisease] = useState<Disease>("dengue");
  const [patientData, setPatientData] = useState<PatientData>(estadoInicial);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [exampleChanged, setExampleChanged] = useState(false);

  const selectedCase = selectedCaseIndex === null
    ? null
    : staticDemoCases[selectedCaseIndex];

  function loadExample(index: number) {
    const example = staticDemoCases[index];
    setDisease("dengue");
    setPatientData({ ...example.patientData });
    setSelectedItems([...example.selectedSymptoms]);
    setSelectedCaseIndex(index);
    setShowResult(false);
    setExampleChanged(false);
  }

  function markChanged() {
    setExampleChanged(true);
    setShowResult(false);
  }

  function toggleItem(id: string) {
    markChanged();
    setSelectedItems(current =>
      current.includes(id) ? current.filter(item => item !== id) : [...current, id]
    );
  }

  return (
    <main className="container">
      <section className="card">
        <h1>Triagem de {disease === "dengue" ? "Dengue" : "Chikungunya"}</h1>
        <p>
          Preencha os dados do paciente e marque os sintomas informados. O
          sistema fará uma triagem baseada nos campos disponíveis na notificação
          de {disease === "dengue" ? "dengue" : "chikungunya"} do SINAN.
        </p>

        <section className="static-example-picker" aria-labelledby="example-title">
          <div>
            <span className="sim-label">Casos históricos</span>
            <h2 id="example-title">Carregar um caso histórico</h2>
            <p>Escolha um caso para preencher automaticamente dados e sintomas.</p>
          </div>
          <div className="form-group">
            <label htmlFor="static-case">Caso de exemplo</label>
            <select
              id="static-case"
              value={selectedCaseIndex ?? ""}
              onChange={event => loadExample(Number(event.target.value))}
            >
              <option value="" disabled>Selecione um caso</option>
              {staticDemoCases.map((example, index) => (
                <option key={example.id} value={index}>
                  Caso {String(index + 1).padStart(2, "0")} · {example.case.municipality} · {example.observedClassification}
                </option>
              ))}
            </select>
          </div>
        </section>

        <div className="form-group">
          <label htmlFor="disease">Doença avaliada</label>
          <select
            id="disease"
            value={disease}
            onChange={event => {
              setDisease(event.target.value as Disease);
              markChanged();
            }}
          >
            <option value="dengue">Dengue</option>
            <option value="chikungunya">Chikungunya</option>
          </select>
        </div>

        <PatientForm
          patientData={patientData}
          setPatientData={action => {
            markChanged();
            setPatientData(action);
          }}
        />

        <section className="grupo-sintomas">
          <h2>Sintomas informados</h2>
          <div className="checkbox-list">
            {triageItems.map(item => (
              <CheckboxItem
                key={item.id}
                label={item.label}
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleItem(item.id)}
              />
            ))}
          </div>
        </section>

        <div className="actions">
          <button
            type="button"
            className="btn-primary"
            disabled={!selectedCase || exampleChanged || disease !== "dengue"}
            onClick={() => setShowResult(true)}
          >
            Ver resultado da triagem
          </button>
        </div>

        {!selectedCase && (
          <p className="demo-limitation" role="status">
            Selecione um caso histórico acima para habilitar o resultado.
          </p>
        )}

        {selectedCase && exampleChanged && (
          <p className="demo-limitation" role="status">
            Os campos alterados não correspondem mais ao caso histórico
            selecionado. Recarregue o caso para restaurar seus dados e resultado.
          </p>
        )}

        {showResult && selectedCase && !exampleChanged && (
          <div aria-live="polite">
            <Resultado {...selectedCase.prediction} />
            <div className="static-triage-comparison">
              <span className="sim-label">Registro histórico no SINAN</span>
              <strong>{selectedCase.observedClassification}</strong>
              <p>
                O score é uma classificação do modelo e não representa
                diagnóstico nem probabilidade clínica.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default Triage;
