import { useState } from "react";
import CheckboxItem from "../components/CheckboxItem";
import PatientForm from "../components/PatientForm";
import { triageItems } from "../demoData";
import type { Disease } from "../demoData";
import type { PatientData } from "../types/patient";

const grupos = [{ id: "symptoms", title: "Sintomas informados" }];

const estadoInicial: PatientData = {
  ageYears: "",
  sex: "",
  pregnancyStatus: "",
  race: "",
  educationLevel: "",
  occupationCode: "",
  occupationName: "",
  residenceState: "",
  residenceStateLabel: "",
  residenceMunicipality: "",
  residenceMunicipalityName: "",
  residenceHealthRegion: "",
  residenceHealthRegionName: "",
  notificationDate: "",
  symptomOnsetDate: "",
  daysToNotification: "",
  symptomEpiWeekNumber: "",
  symptomEpiYear: "",
};

function Triage() {
  const [disease, setDisease] = useState<Disease>("dengue");
  const [patientData, setPatientData] = useState<PatientData>(estadoInicial);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showDemoNotice, setShowDemoNotice] = useState(false);

  function toggleItem(id: string) {
    setSelectedItems(current =>
      current.includes(id) ? current.filter(item => item !== id) : [...current, id]
    );
  }

  return (
    <main className="container">
      <section className="card">
        <h1>Triagem de {disease === "dengue" ? "Dengue" : "Chikungunya"}</h1>
        <p>
          Explore os campos usados pela aplicação original. Nesta demonstração
          estática, nenhum dado é enviado e nenhuma predição é realizada.
        </p>

        <div className="form-group">
          <label htmlFor="disease">Doença avaliada</label>
          <select
            id="disease"
            value={disease}
            onChange={event => {
              setDisease(event.target.value as Disease);
              setShowDemoNotice(false);
            }}
          >
            <option value="dengue">Dengue</option>
            <option value="chikungunya">Chikungunya</option>
          </select>
        </div>

        <PatientForm patientData={patientData} setPatientData={setPatientData} />

        {grupos.map(grupo => {
          const items = triageItems.filter(item => item.group === grupo.id);
          return (
            <section className="grupo-sintomas" key={grupo.id}>
              <h2>{grupo.title}</h2>
              <div className="checkbox-list">
                {items.map(item => (
                  <CheckboxItem
                    key={item.id}
                    label={item.label}
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleItem(item.id)}
                  />
                ))}
              </div>
            </section>
          );
        })}

        <div className="actions">
          <button
            type="button"
            className="btn-primary"
            onClick={() => setShowDemoNotice(true)}
            aria-describedby="demo-triage-notice"
          >
            Visualizar limitação da triagem
          </button>
        </div>

        {showDemoNotice && (
          <p id="demo-triage-notice" className="demo-limitation" role="status">
            A interface está disponível para exploração, mas o cálculo foi
            desativado nesta versão. Os três modelos e a API FastAPI precisam de
            um servidor próprio para produzir os scores.
          </p>
        )}
      </section>
    </main>
  );
}

export default Triage;
