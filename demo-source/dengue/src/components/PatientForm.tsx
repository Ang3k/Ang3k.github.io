import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PatientData } from "../types/patient";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

type SelectOption = { code: number | string; name: string };
type UfOption = { code: number; sigla: string; name: string };
type MunicipioItem = { code: number; name: string; stateCode: number; state: string };
type RegiaoItem = { code: number; name: string; state: string; officialCode?: number };
type AutocompleteItem = { code: number | string; name: string; state?: string; stateCode?: number };

type TriageOptions = {
  sexos: SelectOption[];
  racas: SelectOption[];
  escolaridades: SelectOption[];
  situacoesGestacao: SelectOption[];
  ufs: UfOption[];
};

const DEMO_OPTIONS: TriageOptions = {
  sexos: [
    { code: "M", name: "Masculino" },
    { code: "F", name: "Feminino" },
    { code: "I", name: "Ignorado" },
  ],
  racas: [
    { code: 1, name: "Branca" },
    { code: 2, name: "Preta" },
    { code: 3, name: "Amarela" },
    { code: 4, name: "Parda" },
    { code: 5, name: "Indígena" },
    { code: 9, name: "Ignorada" },
  ],
  escolaridades: [
    { code: 0, name: "Analfabeto" },
    { code: 1, name: "1ª a 4ª série incompleta" },
    { code: 2, name: "4ª série completa" },
    { code: 3, name: "5ª à 8ª série incompleta" },
    { code: 4, name: "Ensino fundamental completo" },
    { code: 5, name: "Ensino médio incompleto" },
    { code: 6, name: "Ensino médio completo" },
    { code: 7, name: "Educação superior incompleta" },
    { code: 8, name: "Educação superior completa" },
    { code: 9, name: "Ignorada" },
    { code: 10, name: "Não se aplica" },
  ],
  situacoesGestacao: [
    { code: 1, name: "1º trimestre" },
    { code: 2, name: "2º trimestre" },
    { code: 3, name: "3º trimestre" },
    { code: 4, name: "Idade gestacional ignorada" },
    { code: 5, name: "Não" },
    { code: 6, name: "Não se aplica" },
    { code: 9, name: "Ignorada" },
  ],
  ufs: [
    { code: 12, sigla: "AC", name: "Acre" },
    { code: 27, sigla: "AL", name: "Alagoas" },
    { code: 13, sigla: "AM", name: "Amazonas" },
    { code: 16, sigla: "AP", name: "Amapá" },
    { code: 29, sigla: "BA", name: "Bahia" },
    { code: 23, sigla: "CE", name: "Ceará" },
    { code: 53, sigla: "DF", name: "Distrito Federal" },
    { code: 32, sigla: "ES", name: "Espírito Santo" },
    { code: 52, sigla: "GO", name: "Goiás" },
    { code: 21, sigla: "MA", name: "Maranhão" },
    { code: 31, sigla: "MG", name: "Minas Gerais" },
    { code: 50, sigla: "MS", name: "Mato Grosso do Sul" },
    { code: 51, sigla: "MT", name: "Mato Grosso" },
    { code: 15, sigla: "PA", name: "Pará" },
    { code: 25, sigla: "PB", name: "Paraíba" },
    { code: 26, sigla: "PE", name: "Pernambuco" },
    { code: 22, sigla: "PI", name: "Piauí" },
    { code: 41, sigla: "PR", name: "Paraná" },
    { code: 33, sigla: "RJ", name: "Rio de Janeiro" },
    { code: 24, sigla: "RN", name: "Rio Grande do Norte" },
    { code: 11, sigla: "RO", name: "Rondônia" },
    { code: 14, sigla: "RR", name: "Roraima" },
    { code: 43, sigla: "RS", name: "Rio Grande do Sul" },
    { code: 42, sigla: "SC", name: "Santa Catarina" },
    { code: 28, sigla: "SE", name: "Sergipe" },
    { code: 35, sigla: "SP", name: "São Paulo" },
    { code: 17, sigla: "TO", name: "Tocantins" },
  ],
};

const DEMO_OCCUPATIONS: AutocompleteItem[] = [
  { code: "999991", name: "Estudante" },
  { code: "421125", name: "Operador de caixa" },
  { code: "521110", name: "Vendedor de comércio varejista" },
  { code: "223505", name: "Enfermeiro" },
  { code: "223510", name: "Enfermeiro auditor" },
  { code: "223530", name: "Enfermeiro do trabalho" },
  { code: "252210", name: "Contador" },
  { code: "322205", name: "Técnico de enfermagem" },
  { code: "411010", name: "Assistente administrativo" },
  { code: "212415", name: "Analista de sistemas de automação" },
  { code: "231305", name: "Professor de ciências exatas e naturais" },
  { code: "223106", name: "Médico cardiologista" },
  { code: "999993", name: "Aposentado/pensionista" },
  { code: "999994", name: "Desempregado crônico (categoria do SINAN)" },
];

const DEMO_MUNICIPALITIES: MunicipioItem[] = [
  { code: 3304557, name: "Rio de Janeiro", stateCode: 33, state: "RJ" },
  { code: 3550308, name: "São Paulo", stateCode: 35, state: "SP" },
  { code: 3106200, name: "Belo Horizonte", stateCode: 31, state: "MG" },
  { code: 2927408, name: "Salvador", stateCode: 29, state: "BA" },
  { code: 2304400, name: "Fortaleza", stateCode: 23, state: "CE" },
  { code: 5300108, name: "Brasília", stateCode: 53, state: "DF" },
  { code: 3506508, name: "Birigui", stateCode: 35, state: "SP" },
  { code: 4205407, name: "Florianópolis", stateCode: 42, state: "SC" },
  { code: 4115200, name: "Maringá", stateCode: 41, state: "PR" },
  { code: 2616407, name: "Vitória de Santo Antão", stateCode: 26, state: "PE" },
  { code: 3557105, name: "Votuporanga", stateCode: 35, state: "SP" },
];

// ---------------------------------------------------------------------------
// Semana epidemiológica (padrão SINAN: semana começa no domingo)
// ---------------------------------------------------------------------------

function calcularSemanaEpi(data: Date): { semana: number; ano: number } {
  const quarta = new Date(data);
  quarta.setUTCDate(data.getUTCDate() + (3 - data.getUTCDay()));
  const ano = quarta.getUTCFullYear();
  const primeiroDeJaneiro = new Date(Date.UTC(ano, 0, 1));
  const primeiraQuarta = new Date(primeiroDeJaneiro);
  primeiraQuarta.setUTCDate(
    primeiroDeJaneiro.getUTCDate()
      + ((3 - primeiroDeJaneiro.getUTCDay() + 7) % 7)
  );
  const semana = Math.floor(
    (quarta.getTime() - primeiraQuarta.getTime()) / (7 * 24 * 60 * 60 * 1000)
  ) + 1;
  return { semana, ano };
}

function parseDate(value: string): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(Date.UTC(year, month - 1, day));
}

function atualizarCamposDeData(
  current: PatientData,
  field: "symptomOnsetDate" | "notificationDate",
  value: string
): PatientData {
  const next = { ...current, [field]: value };
  const onset = parseDate(next.symptomOnsetDate);
  const notification = parseDate(next.notificationDate);
  const epi = onset ? calcularSemanaEpi(onset) : null;
  const days = onset && notification && notification >= onset
    ? Math.round(
        (notification.getTime() - onset.getTime()) / (24 * 60 * 60 * 1000)
      )
    : null;

  return {
    ...next,
    symptomEpiWeekNumber: epi ? String(epi.semana) : "",
    symptomEpiYear: epi ? String(epi.ano) : "",
    daysToNotification: days === null ? "" : String(days),
  };
}

// ---------------------------------------------------------------------------
// Hook de autocomplete com debounce
// ---------------------------------------------------------------------------

function useAutocomplete(
  query: string,
  fetchFn: (q: string) => Promise<AutocompleteItem[]>,
  delay = 300,
  minimumQueryLength = 2
) {
  const [items, setItems] = useState<AutocompleteItem[]>([]);
  const [aberto, setAberto] = useState(false);
  const requestVersion = useRef(0);
  const selectedQuery = useRef<string | null>(null);

  const close = useCallback(() => {
    requestVersion.current += 1;
    setItems([]);
    setAberto(false);
  }, []);

  const queryChanged = useCallback((value: string) => {
    if (value.trim().length < minimumQueryLength) close();
  }, [close, minimumQueryLength]);

  const itemSelected = useCallback((value: string) => {
    selectedQuery.current = value;
    close();
  }, [close]);

  useEffect(() => {
    if (selectedQuery.current === query) {
      selectedQuery.current = null;
      return;
    }
    if (query.trim().length < minimumQueryLength || query.trim() === "") return;

    const version = requestVersion.current + 1;
    requestVersion.current = version;
    const timer = window.setTimeout(async () => {
      try {
        const resultado = await fetchFn(query);
        if (requestVersion.current !== version) return;
        setItems(resultado);
        setAberto(resultado.length > 0);
      } catch {
        if (requestVersion.current !== version) return;
        setItems([]);
        setAberto(false);
      }
    }, delay);
    return () => {
      window.clearTimeout(timer);
      requestVersion.current += 1;
    };
  }, [delay, fetchFn, minimumQueryLength, query]);

  const openForCurrentQuery = useCallback(async () => {
    const resultado = await fetchFn(query);
    setItems(resultado);
    setAberto(resultado.length > 0);
  }, [fetchFn, query]);

  return {
    items,
    aberto,
    setAberto,
    close,
    queryChanged,
    itemSelected,
    openForCurrentQuery,
  };
}

// ---------------------------------------------------------------------------
// Componente Autocomplete
// ---------------------------------------------------------------------------

type AutocompleteProps = {
  label: string;
  id: string;
  placeholder: string;
  fetchFn: (q: string) => Promise<AutocompleteItem[]>;
  onSelect: (item: AutocompleteItem, label: string) => void;
  onInputChange: (value: string) => void;
  renderLabel?: (item: AutocompleteItem) => string;
  showSuggestionsOnFocus?: boolean;
  minimumQueryLength?: number;
  value: string;
};

function Autocomplete({
  label,
  id,
  placeholder,
  fetchFn,
  onSelect,
  onInputChange,
  renderLabel,
  showSuggestionsOnFocus = false,
  minimumQueryLength = 2,
  value,
}: AutocompleteProps) {
  const {
    items,
    aberto,
    setAberto,
    close,
    queryChanged,
    itemSelected,
    openForCurrentQuery,
  } = useAutocomplete(value, fetchFn, 300, minimumQueryLength);
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusIndex, setFocusIndex] = useState(-1);
  const listId = `${id}-options`;

  // Fecha ao clicar fora
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [close]);

  function handleSelect(item: AutocompleteItem) {
    const selectedLabel = renderLabel ? renderLabel(item) : item.name;
    itemSelected(selectedLabel);
    onSelect(item, selectedLabel);
    setFocusIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!aberto) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setFocusIndex(i => Math.min(i + 1, items.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setFocusIndex(i => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && focusIndex >= 0) { e.preventDefault(); handleSelect(items[focusIndex]); }
    else if (e.key === "Escape") setAberto(false);
  }

  return (
    <div className="autocomplete-wrapper" ref={containerRef}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={aberto}
        aria-controls={listId}
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={event => {
          queryChanged(event.target.value);
          onInputChange(event.target.value);
          setFocusIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (showSuggestionsOnFocus) void openForCurrentQuery();
        }}
      />
      {aberto && (
        <ul className="autocomplete-list" role="listbox" id={listId}>
          {items.map((item, idx) => (
            <li
              key={item.code}
              role="option"
              aria-selected={idx === focusIndex}
              className={`autocomplete-item${idx === focusIndex ? " focused" : ""}`}
              onMouseDown={() => handleSelect(item)}
            >
              {renderLabel ? renderLabel(item) : item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

async function fetchOcupacoes(query: string): Promise<AutocompleteItem[]> {
  const normalized = query.trim().toLocaleLowerCase("pt-BR");
  return DEMO_OCCUPATIONS.filter(item =>
    item.name.toLocaleLowerCase("pt-BR").includes(normalized)
  );
}

function makeFetchMunicipios(stateCode?: number) {
  return async (query: string): Promise<AutocompleteItem[]> => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return DEMO_MUNICIPALITIES.filter(item =>
      (!stateCode || item.stateCode === stateCode)
      && item.name.toLocaleLowerCase("pt-BR").includes(normalized)
    );
  };
}

// ---------------------------------------------------------------------------
// PatientForm
// ---------------------------------------------------------------------------

type PatientFormProps = {
  patientData: PatientData;
  setPatientData: React.Dispatch<React.SetStateAction<PatientData>>;
};

function PatientForm({ patientData, setPatientData }: PatientFormProps) {
  const [options] = useState<TriageOptions>(DEMO_OPTIONS);
  const [regioesResidencia, setRegioesResidencia] = useState<RegiaoItem[]>([]);

  function set(field: keyof PatientData, value: string) {
    setPatientData(prev => ({ ...prev, [field]: value }));
  }

  function aoSelecionarMunicipio(
    item: AutocompleteItem,
    selectedLabel: string
  ) {
    const mun = item as MunicipioItem;
    const uf = options?.ufs.find(u => u.code === mun.stateCode);
    setPatientData(prev => ({
      ...prev,
      residenceMunicipality: String(mun.code),
      residenceMunicipalityName: selectedLabel,
      residenceState: mun.stateCode ? String(mun.stateCode) : prev.residenceState,
      residenceStateLabel: uf?.sigla ?? prev.residenceStateLabel,
      residenceHealthRegion: "",
      residenceHealthRegionName: "",
    }));

    setRegioesResidencia([]);
  }

  const selectedStateCode = patientData.residenceState
    ? Number(patientData.residenceState)
    : undefined;
  const fetchMunicipios = useMemo(
    () => makeFetchMunicipios(selectedStateCode),
    [selectedStateCode]
  );

  return (
    <section className="patient-form">
      <h2>Dados usados pelo modelo</h2>

      <div className="form-grid">

        {/* Idade */}
        <div className="form-group">
          <label htmlFor="ageYears">Idade (anos)</label>
          <input
            id="ageYears"
            type="number"
            value={patientData.ageYears}
            onChange={e => set("ageYears", e.target.value)}
            min="0" max="130" step="1"
            placeholder="Ex.: 25"
          />
        </div>

        {/* Sexo */}
        <div className="form-group">
          <label htmlFor="sex">Sexo</label>
          <select id="sex" value={patientData.sex} onChange={e => set("sex", e.target.value)}>
            <option value="">Selecione</option>
            {(options?.sexos ?? []).map(s => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Gestação */}
        <div className="form-group">
          <label htmlFor="pregnancyStatus">Situação de gestação</label>
          <select id="pregnancyStatus" value={patientData.pregnancyStatus} onChange={e => set("pregnancyStatus", e.target.value)}>
            <option value="">Selecione</option>
            {(options?.situacoesGestacao ?? []).map(g => (
              <option key={g.code} value={g.code}>{g.name}</option>
            ))}
          </select>
        </div>

        {/* Raça */}
        <div className="form-group">
          <label htmlFor="race">Raça/cor</label>
          <select id="race" value={patientData.race} onChange={e => set("race", e.target.value)}>
            <option value="">Selecione</option>
            {(options?.racas ?? []).map(r => (
              <option key={r.code} value={r.code}>{r.name}</option>
            ))}
          </select>
        </div>

        {/* Escolaridade */}
        <div className="form-group">
          <label htmlFor="educationLevel">Escolaridade</label>
          <select id="educationLevel" value={patientData.educationLevel} onChange={e => set("educationLevel", e.target.value)}>
            <option value="">Selecione</option>
            {(options?.escolaridades ?? []).map(e => (
              <option key={e.code} value={e.code}>{e.name}</option>
            ))}
          </select>
        </div>

        {/* Ocupação: autocomplete */}
        <div className="form-group form-group-wide">
          <Autocomplete
            id="occupationName"
            label="Ocupação"
            placeholder="Clique ou digite para ver ocupações"
            fetchFn={fetchOcupacoes}
            minimumQueryLength={0}
            showSuggestionsOnFocus
            value={patientData.occupationName}
            onInputChange={value => {
              setPatientData(prev => ({
                ...prev,
                occupationCode: "",
                occupationName: value,
              }));
            }}
            onSelect={(item, selectedLabel) => {
              setPatientData(prev => ({
                ...prev,
                occupationCode: String(item.code),
                occupationName: selectedLabel,
              }));
            }}
          />
          {patientData.occupationCode && (
            <span className="form-hint">CBO: {patientData.occupationCode}</span>
          )}
        </div>

        {/* UF de residência */}
        <div className="form-group">
          <label htmlFor="residenceState">UF de residência</label>
          <select
            id="residenceState"
            value={patientData.residenceState}
            onChange={e => {
              const uf = options?.ufs.find(u => String(u.code) === e.target.value);
              setPatientData(prev => ({
                ...prev,
                residenceState: e.target.value,
                residenceStateLabel: uf?.sigla ?? "",
                residenceMunicipality: "",
                residenceMunicipalityName: "",
                residenceHealthRegion: "",
                residenceHealthRegionName: "",
              }));
              setRegioesResidencia([]);
            }}
          >
            <option value="">Selecione</option>
            {(options?.ufs ?? []).map(uf => (
              <option key={uf.code} value={uf.code}>
                {uf.sigla} ({uf.name})
              </option>
            ))}
          </select>
        </div>

        {/* Município de residência: autocomplete */}
        <div className="form-group form-group-wide">
          <Autocomplete
            key={patientData.residenceState}
            id="residenceMunicipality"
            label="Município de residência"
            placeholder="Digite para buscar (ex: Rio de Janeiro...)"
            fetchFn={fetchMunicipios}
            value={patientData.residenceMunicipalityName}
            onInputChange={value => {
              setPatientData(prev => ({
                ...prev,
                residenceMunicipality: "",
                residenceMunicipalityName: value,
                residenceHealthRegion: "",
                residenceHealthRegionName: "",
              }));
              setRegioesResidencia([]);
            }}
            onSelect={aoSelecionarMunicipio}
            renderLabel={item =>
              item.state ? `${item.name} (${item.state})` : item.name
            }
          />
          {patientData.residenceMunicipality && (
            <span className="form-hint">IBGE: {patientData.residenceMunicipality}</span>
          )}
        </div>

        {/* Região de saúde: preenchida automaticamente ou selecionável. */}
        {regioesResidencia.length > 0 && (
          <div className="form-group form-group-wide">
            <label htmlFor="residenceHealthRegion">Região de saúde</label>
            <select
              id="residenceHealthRegion"
              value={patientData.residenceHealthRegion}
              onChange={event => {
                const selected = regioesResidencia.find(
                  item => String(item.code) === event.target.value
                );
                setPatientData(prev => ({
                  ...prev,
                  residenceHealthRegion: event.target.value,
                  residenceHealthRegionName: selected?.name ?? "",
                }));
              }}
            >
              {regioesResidencia.length > 1 && (
                <option value="">Selecione</option>
              )}
              {regioesResidencia.map(regiao => (
                <option key={regiao.code} value={regiao.code}>
                  {regiao.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Data dos primeiros sintomas */}
        <div className="form-group">
          <label htmlFor="symptomOnsetDate">Data dos primeiros sintomas</label>
          <input
            id="symptomOnsetDate"
            type="date"
            value={patientData.symptomOnsetDate}
            onChange={event =>
              setPatientData(prev =>
                atualizarCamposDeData(
                  prev,
                  "symptomOnsetDate",
                  event.target.value
                )
              )
            }
          />
        </div>

        {/* Data da notificação */}
        <div className="form-group">
          <label htmlFor="notificationDate">Data da notificação</label>
          <input
            id="notificationDate"
            type="date"
            value={patientData.notificationDate}
            onChange={event =>
              setPatientData(prev =>
                atualizarCamposDeData(
                  prev,
                  "notificationDate",
                  event.target.value
                )
              )
            }
          />
        </div>

      </div>
    </section>
  );
}

export default PatientForm;
