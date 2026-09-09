function DemoBanner() {
  return (
    <aside className="demo-banner" aria-label="Aviso sobre a demonstração">
      <div className="demo-banner-inner">
        <strong>Demonstração visual</strong>
        <span>
          Versão estática da interface. Predições e consultas exigem o servidor
          dos modelos e não estão disponíveis.
        </span>
      </div>
    </aside>
  );
}

export default DemoBanner;
