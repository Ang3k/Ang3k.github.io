import { useState } from "react";
import { formatModelName, staticDemoCases } from "../staticCases";

function PredictionSimulator() {
  const [caseIndex, setCaseIndex] = useState<number | null>(null);
  const example = caseIndex === null ? null : staticDemoCases[caseIndex];

  function showNextCase() {
    setCaseIndex(caseIndex === null ? 0 : (caseIndex + 1) % staticDemoCases.length);
  }

  const observedDengue = example?.observedClassification
    .toLowerCase()
    .includes("dengue");

  return (
    <div className="home-section">
      <h2>Simulação de predição</h2>
      <p>
        Gere um caso histórico real do conjunto de teste e veja a predição dos
        modelos treinados. O sistema seleciona o caso, aplica o mesmo
        pré-processamento do treino e apresenta o resultado.
      </p>

      {example && (
        <div className="sim-card" aria-live="polite">
          <div className="sim-dados">
            <div className="sim-campo">
              <span className="sim-label">Idade</span>
              <span className="sim-valor">{example.case.age} anos</span>
            </div>
            <div className="sim-campo">
              <span className="sim-label">Sexo</span>
              <span className="sim-valor">{example.case.sex}</span>
            </div>
            <div className="sim-campo">
              <span className="sim-label">Raça/cor</span>
              <span className="sim-valor">{example.case.race}</span>
            </div>
            <div className="sim-campo">
              <span className="sim-label">UF</span>
              <span className="sim-valor">{example.case.state}</span>
            </div>
            <div className="sim-campo sim-campo-largo">
              <span className="sim-label">Ocupação</span>
              <span className="sim-valor">
                {example.case.occupation ?? "Não informado"}
              </span>
            </div>
            <div className="sim-campo sim-campo-largo">
              <span className="sim-label">Município</span>
              <span className="sim-valor">{example.case.municipality}</span>
            </div>
          </div>

          <div className="sim-sintomas">
            <span className="sim-label">Sintomas informados</span>
            <div className="sim-tags">
              {example.case.symptoms.map(symptom => (
                <span key={symptom} className="sim-tag">{symptom}</span>
              ))}
            </div>
          </div>

          <div className="sim-bloco">
            <span className="sim-label">Resultado dos modelos</span>
            <div className="modelo-quadrados">
              {example.prediction.models.map(model => (
                <div className="modelo-quadrado" key={model.name}>
                  <span className="modelo-quadrado-nome">
                    {formatModelName(model.name)}
                  </span>
                  <span className="modelo-quadrado-prob">{model.probability}%</span>
                  <span className="modelo-quadrado-legenda">score de dengue</span>
                  <span className="modelo-quadrado-peso">
                    Peso no ensemble: {model.weight}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="sim-final-grid">
            <div className={`sim-veredito ${
              example.prediction.isPositive
                ? "sim-veredito-dengue"
                : "sim-veredito-nao"
            }`}>
              <span className="sim-veredito-titulo">Classificação do ensemble</span>
              {example.prediction.isPositive ? "Dengue" : "Não dengue"}
              <small>
                Score {example.prediction.average}%, limiar de {example.prediction.threshold}%
              </small>
            </div>

            <div className={`sim-veredito ${
              observedDengue ? "sim-veredito-dengue" : "sim-veredito-nao"
            }`}>
              <span className="sim-veredito-titulo">Registro histórico</span>
              {example.observedClassification}
              <small>Classificação registrada no SINAN</small>
            </div>
          </div>
        </div>
      )}

      <button type="button" className="btn-primary" onClick={showNextCase}>
        {example ? "Ver outro caso real" : "Ver simulação com resultado real"}
      </button>
    </div>
  );
}

export default PredictionSimulator;
