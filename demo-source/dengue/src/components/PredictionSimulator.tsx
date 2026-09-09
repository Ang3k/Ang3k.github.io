import { useState } from "react";

function PredictionSimulator() {
  const [showDemoNotice, setShowDemoNotice] = useState(false);

  return (
    <div className="home-section">
      <h2>Simulação de predição</h2>
      <p>
        Na aplicação completa, esta área seleciona um registro anonimizado do
        teste de 2021, processa seus dados e compara os scores dos modelos com a
        classificação histórica registrada no SINAN.
      </p>
      <p>
        A simulação depende da API e dos artefatos treinados, por isso foi
        mantida apenas como parte da apresentação visual nesta versão estática.
      </p>

      <button
        type="button"
        className="btn-primary"
        onClick={() => setShowDemoNotice(true)}
        aria-describedby="demo-simulation-notice"
      >
        Ver como a simulação funcionaria
      </button>

      {showDemoNotice && (
        <p id="demo-simulation-notice" className="demo-limitation" role="status">
          Demonstração visual: nenhum caso foi consultado e nenhum modelo foi
          executado. Veja a seção Pipeline para conhecer o fluxo completo.
        </p>
      )}
    </div>
  );
}

export default PredictionSimulator;
