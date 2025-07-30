// Configuración de la hoja de Google
const SPREADSHEET_ID = '1MOUt-fhusC7z3F0axUmglV4r500IaJuerdngvVJSJ5E';
const SHEET_NAME = 'Datos BSC';
const API_KEY = 'AIzaSyCSKa4k3fyULiZmH7ZZKkEYz2NWZ5EI2qI';

// Configuración de paginación
const ITEMS_PER_PAGE = 5;
let currentPages = {
  Financial: 1,
  Customer: 1,
  InternalProcesses: 1,
  LearningGrowth: 1,
  Sustainability: 1
};

// Variables para el modal y gráficos
let trendChart = null;
let allHistoricalData = {};
let currentMetricData = null;

// Mapa de perspectivas
const PERSPECTIVES_MAP = {
  "Margen Neto": { perspectiva: "Financial", polaridad: "positivo" },
  "ROI": { perspectiva: "Financial", polaridad: "positivo" },
  "ROE": { perspectiva: "Financial", polaridad: "positivo" },
  "Liquidez Corriente": { perspectiva: "Financial", polaridad: "positivo" },
  "Endeudamiento Total": { perspectiva: "Financial", polaridad: "negativo" },
  "Rotación de Inventarios": { perspectiva: "Financial", polaridad: "positivo" },
  "EBITDA": { perspectiva: "Financial", polaridad: "positivo" },
  "Flujo de Caja Operativo": { perspectiva: "Financial", polaridad: "positivo" },
  "Rentabilidad sobre Ventas": { perspectiva: "Financial", polaridad: "positivo" },
  "Días de Cobranza Promedio": { perspectiva: "Financial", polaridad: "negativo" },
  "Margen Bruto": { perspectiva: "Financial", polaridad: "positivo" },
  "Costos Fijos/Variables": { perspectiva: "Financial", polaridad: "negativo" },
  "Crecimiento de Ingresos": { perspectiva: "Financial", polaridad: "positivo" },
  "Satisfacción del Cliente": { perspectiva: "Customer", polaridad: "positivo" },
  "NPS (Net Promoter Score)": { perspectiva: "Customer", polaridad: "positivo" },
  "Tasa de Retención de Clientes": { perspectiva: "Customer", polaridad: "positivo" },
  "Tasa de Recompra": { perspectiva: "Customer", polaridad: "positivo" },
  "Market Share": { perspectiva: "Customer", polaridad: "positivo" },
  "Tiempo de Respuesta a Consultas": { perspectiva: "Customer", polaridad: "negativo" },
  "Quejas Mensuales": { perspectiva: "Customer", polaridad: "negativo" },
  "Clientes Nuevos Adquiridos": { perspectiva: "Customer", polaridad: "positivo" },
  "Ticket Promedio": { perspectiva: "Customer", polaridad: "positivo" },
  "Índice de Fidelización": { perspectiva: "Customer", polaridad: "positivo" },
  "Encuestas de Satisfacción Resueltas": { perspectiva: "Customer", polaridad: "positivo" },
  "Reclamos Resueltos en Tiempo": { perspectiva: "Customer", polaridad: "positivo" },
  "Tiempo de Espera en Atención": { perspectiva: "Customer", polaridad: "negativo" },
  "Efectividad de Soporte Técnico": { perspectiva: "Customer", polaridad: "positivo" },
  "Clientes Referidos": { perspectiva: "Customer", polaridad: "positivo" },
  "Tasa de Uso de App/Plataforma": { perspectiva: "Customer", polaridad: "positivo" },
  "Satisfacción Post-Venta": { perspectiva: "Customer", polaridad: "positivo" },
  "Tasa de Cancelación": { perspectiva: "Customer", polaridad: "negativo" },
  "Eficiencia de Producción": { perspectiva: "InternalProcesses", polaridad: "positivo" },
  "Tiempo de Ciclo de Fabricación": { perspectiva: "InternalProcesses", polaridad: "negativo" },
  "Defectos por Millón de Unidades": { perspectiva: "InternalProcesses", polaridad: "negativo" },
  "Tiempo de Entrega Promedio": { perspectiva: "InternalProcesses", polaridad: "negativo" },
  "Órdenes Completadas Correctamente": { perspectiva: "InternalProcesses", polaridad: "positivo" },
  "Utilización de Maquinaria": { perspectiva: "InternalProcesses", polaridad: "positivo" },
  "Nivel de Inventario de Seguridad": { perspectiva: "InternalProcesses", polaridad: "positivo" },
  "Tiempo Medio de Reparación": { perspectiva: "InternalProcesses", polaridad: "negativo" },
  "Porcentaje de Desperdicios": { perspectiva: "InternalProcesses", polaridad: "negativo" },
  "Entregas Tardías": { perspectiva: "InternalProcesses", polaridad: "negativo" },
  "Proyectos Completados en Tiempo": { perspectiva: "InternalProcesses", polaridad: "positivo" },
  "Requisitos Cumplidos en Productos": { perspectiva: "InternalProcesses", polaridad: "positivo" },
  "Tiempo de Desarrollo de Nuevos Productos": { perspectiva: "InternalProcesses", polaridad: "negativo" },
  "Estandarización de Procesos": { perspectiva: "InternalProcesses", polaridad: "positivo" },
  "Documentación de Procesos Actualizada": { perspectiva: "InternalProcesses", polaridad: "positivo" },
  "Nivel de Automatización": { perspectiva: "InternalProcesses", polaridad: "positivo" },
  "Capacidad Ociosa": { perspectiva: "InternalProcesses", polaridad: "negativo" },
  "Reclamos Internos Resueltos": { perspectiva: "InternalProcesses", polaridad: "positivo" },
  "Efectividad de Reuniones": { perspectiva: "InternalProcesses", polaridad: "positivo" },
  "Procesos Optimizados": { perspectiva: "InternalProcesses", polaridad: "positivo" },
  "Tasa de Accidentes Laborales": { perspectiva: "InternalProcesses", polaridad: "negativo" },
  "Cumplimiento de Normativas": { perspectiva: "InternalProcesses", polaridad: "positivo" },
  "Horas de Capacitación por Empleado": { perspectiva: "LearningGrowth", polaridad: "positivo" },
  "Retención de Talento Clave": { perspectiva: "LearningGrowth", polaridad: "positivo" },
  "Índice de Satisfacción Laboral": { perspectiva: "LearningGrowth", polaridad: "positivo" },
  "Ideas Implementadas por Empleado": { perspectiva: "LearningGrowth", polaridad: "positivo" },
  "Tasa de Promoción Interna": { perspectiva: "LearningGrowth", polaridad: "positivo" },
  "Adopción de Nuevas Tecnologías": { perspectiva: "LearningGrowth", polaridad: "positivo" },
  "Participación en Programas de Desarrollo": { perspectiva: "LearningGrowth", polaridad: "positivo" },
  "Huella de Carbono": { perspectiva: "Sustainability", polaridad: "negativo" },
  "Porcentaje de Energía Renovable": { perspectiva: "Sustainability", polaridad: "positivo" },
  "Diversidad en Puestos Gerenciales": { perspectiva: "Sustainability", polaridad: "positivo" },
  "Horas de Voluntariado Corporativo": { perspectiva: "Sustainability", polaridad: "positivo" }
};

async function loadSheetData() {
  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`);
    const data = await response.json();
    if (!data.values) throw new Error("No se encontraron datos en la hoja de cálculo");
    return data.values;
  } catch (error) {
    console.error("Error al cargar datos:", error);
    showError("Error al cargar datos: " + error.message);
    return null;
  }
}

function getPreviousMonth(currentMonth) {
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const [currentMonthStr, currentYearStr] = currentMonth.split('-');
  const currentYear = parseInt(currentYearStr);
  const currentMonthIndex = months.indexOf(currentMonthStr);
  if (currentMonthIndex === 0) return [`${months[11]}-${currentYear - 1}`];
  return [`${months[currentMonthIndex - 1]}-${currentYear}`];
}

function getPreviousQuarterMonths(currentMonth) {
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const [currentMonthStr, currentYearStr] = currentMonth.split('-');
  const currentYear = parseInt(currentYearStr);
  const currentMonthIndex = months.indexOf(currentMonthStr);
  let quarterMonths = [];
  
  if (currentMonthIndex >= 9) quarterMonths = [6, 7, 8];
  else if (currentMonthIndex >= 6) quarterMonths = [3, 4, 5];
  else if (currentMonthIndex >= 3) quarterMonths = [0, 1, 2];
  else {
    quarterMonths = [9, 10, 11];
    return quarterMonths.map(m => `${months[m]}-${currentYear - 1}`);
  }
  return quarterMonths.map(m => `${months[m]}-${currentYear}`);
}

async function obtenerDatosDashboard(filtros) {
  try {
    const sheetData = await loadSheetData();
    if (!sheetData) return { error: "No se pudieron cargar los datos" };
    
    const headers = sheetData[0];
    const results = [];
    const periodoActual = filtros.periodo;
    let periodosComparacion = [];
    let comparePrefix = "";

    if (filtros.compararCon === "Mes Anterior") {
      periodosComparacion = getPreviousMonth(periodoActual);
      comparePrefix = "Actual ";
    } 
    else if (filtros.compararCon === "Trimestre Anterior") {
      periodosComparacion = getPreviousQuarterMonths(periodoActual);
      comparePrefix = "Actual ";
    }
    else if (filtros.compararCon === "Año Anterior") {
      const [mes, anio] = periodoActual.split('-');
      periodosComparacion = [`${mes}-${parseInt(anio)-1}`];
      comparePrefix = "Actual ";
    } 
    else if (filtros.compararCon === "Budget") {
      periodosComparacion = [periodoActual];
      comparePrefix = "Budget ";
    }
    
    const actualCol = headers.indexOf(`Actual ${periodoActual}`);
    const metaCol = headers.indexOf("Meta");
    const polaridadCol = headers.indexOf("Polaridad");
    const unidadCol = headers.indexOf("Unidad");
    const responsableCol = headers.indexOf("Responsable");
    
    if (actualCol === -1) return { error: `Columna 'Actual ${periodoActual}' no encontrada.` };
    
    // Extraer todos los datos históricos para el modal de tendencias
    const historicalCols = headers
      .filter(h => h.startsWith("Actual ") && h !== `Actual ${periodoActual}`)
      .map(h => h.replace("Actual ", ""));
    
    for (let i = 1; i < sheetData.length; i++) {
      const row = sheetData[i];
      const actualValue = parseFloat(row[actualCol]);
      
      let compareValues = [];
      for (const periodo of periodosComparacion) {
        const compareCol = headers.indexOf(`${comparePrefix}${periodo}`);
        if (compareCol !== -1 && row[compareCol] !== "") {
          const value = parseFloat(row[compareCol]);
          if (!isNaN(value)) compareValues.push(value);
        }
      }
      
      const compareValue = compareValues.length > 0 ? 
        compareValues.reduce((sum, val) => sum + val, 0) / compareValues.length : NaN;
      
      const metaValue = metaCol !== -1 ? parseFloat(row[metaCol]) : null;
      const polaridad = polaridadCol !== -1 ? row[polaridadCol] : PERSPECTIVES_MAP[row[1]]?.polaridad || "positivo";
      
      let diferenciaAbsoluta = 0;
      let esFavorable = false;
      let diferenciaMostrar = "N/A";
      let cumplimiento = null;
      
      if (!isNaN(actualValue) && !isNaN(compareValue)) {
        diferenciaAbsoluta = actualValue - compareValue;
        esFavorable = polaridad === "negativo" ? actualValue < compareValue : actualValue > compareValue;
        diferenciaMostrar = Math.abs(diferenciaAbsoluta).toFixed(2);
        
        if (compareValue !== 0) {
          cumplimiento = polaridad === "negativo" 
            ? 100 - ((actualValue - compareValue) / compareValue) * 100 
            : (actualValue / compareValue) * 100;
          cumplimiento = Math.max(0, Math.min(cumplimiento, 200));
        }
      }
      
      // Extraer datos históricos para este KPI
      const historicalData = {};
      historicalCols.forEach(period => {
        const colIndex = headers.indexOf(`Actual ${period}`);
        if (colIndex !== -1 && row[colIndex] !== "") {
          const value = parseFloat(row[colIndex]);
          if (!isNaN(value)) {
            historicalData[period] = value;
          }
        }
      });
      
      results.push({
        id: row[0],
        indicador: row[1],
        perspectiva: PERSPECTIVES_MAP[row[1]]?.perspectiva || row[2],
        formula: row[3],
        unidad: row[unidadCol] || "unidades",
        responsable: row[responsableCol] || "No definido",
        meta: metaValue,
        actual: !isNaN(actualValue) ? actualValue : null,
        comparacion: !isNaN(compareValue) ? compareValue : null,
        diferencia: diferenciaMostrar,
        esFavorable: esFavorable,
        cumplimiento: cumplimiento !== null ? Number(cumplimiento.toFixed(2)) : null,
        polaridad: polaridad,
        historicalData: historicalData
      });
    }
    
    // Guardar datos históricos para uso en el modal
    allHistoricalData = {};
    results.forEach(item => {
      allHistoricalData[item.indicador] = item.historicalData;
    });
    
    return { 
      data: results,
      periodoActual: periodoActual,
      periodoComparacion: periodosComparacion.join(", "),
      tipoComparacion: filtros.compararCon
    };
    
  } catch (e) {
    return { error: `Error al procesar los datos: ${e.message}` };
  }
}

function showError(message) {
  const errorContainer = document.getElementById("errorContainer");
  if (errorContainer) {
    errorContainer.innerHTML = `
      <div class="error">
        <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
        <div class="error-content">
          <strong>Error</strong>
          <div>${message}</div>
        </div>
      </div>
    `;
    errorContainer.style.display = "block";
    errorContainer.classList.add('animate-fade');
  }
}

function updateSummaryCards(stats) {
  for (const [perspective, data] of Object.entries(stats)) {
    const elementId = perspective + "Summary";
    const element = document.getElementById(elementId);
    if (element && data.total > 0) {
      const percentage = Math.round((data.favorable / data.total) * 100);
      element.textContent = `${percentage}%`;
      if (percentage >= 70) element.className = "summary-value positive";
      else if (percentage >= 40) element.className = "summary-value neutral";
      else element.className = "summary-value negative";
      
      const countElement = document.getElementById(perspective + "Count");
      if (countElement) countElement.textContent = `${data.total} KPI`;
    }
  }
}

function renderPerspective(perspective, data) {
  const containerId = perspective + "Metrics";
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Contenedor no encontrado: ${containerId}`);
    return;
  }
  
  container.innerHTML = '';
  
  if (!data || data.length === 0) {
    container.innerHTML = '<div class="no-data">No hay datos disponibles para esta perspectiva</div>';
    return;
  }

  const table = document.createElement('div');
  table.className = 'metrics-table';
  
  const header = document.createElement('div');
  header.className = 'metric-header';
  header.innerHTML = `
    <div>Indicador</div>
    <div>Actual</div>
    <div>Comparación</div>
    <div>Diferencia</div>
    <div>Cumplimiento</div>
  `;
  table.appendChild(header);

  data.sort((a, b) => {
    if (a.esFavorable !== b.esFavorable) return b.esFavorable - a.esFavorable;
    return parseFloat(b.diferencia) - parseFloat(a.diferencia);
  });

  // Aplicar paginación
  const page = currentPages[perspective] || 1;
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  paginatedData.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'metric-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Detalles de ${item.indicador}`);
    card.innerHTML = `
      <div class="metric-name">
        <strong>${item.indicador}</strong>
        <div class="metric-responsable">
          ${getPerspectiveIcon(item.perspectiva)} ${item.responsable} | ${item.unidad}
        </div>
        <div class="formula-info">${item.formula.replace(/^'=/, "")}</div>
        <div class="polarity-info">
          ${item.polaridad === "negativo" 
            ? '<i class="fas fa-arrow-down" aria-hidden="true"></i> Menor valor es mejor' 
            : '<i class="fas fa-arrow-up" aria-hidden="true"></i> Mayor valor es mejor'}
        </div>
      </div>
      <div class="metric-value">${formatNumber(item.actual, item.unidad)}</div>
      <div class="metric-value">${formatNumber(item.comparacion, item.unidad)}</div>
      <div class="metric-comparison ${item.esFavorable ? 'positive' : 'negative'}">
        ${item.esFavorable 
          ? '<i class="fas fa-arrow-up icon-up" aria-hidden="true"></i>' 
          : '<i class="fas fa-arrow-down icon-down" aria-hidden="true"></i>'} 
        ${formatNumber(item.diferencia, item.unidad)}
      </div>
      <div class="metric-meta">
        ${renderProgressBar(item.cumplimiento)}
      </div>
    `;
    
    card.addEventListener('click', () => showMetricModal(item));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showMetricModal(item);
      }
    });
    
    table.appendChild(card);
    
    setTimeout(() => card.classList.add('animate-pop'), index * 50);
  });

  container.appendChild(table);
  
  // Renderizar controles de paginación
  renderPaginationControls(perspective, data.length);
}

function renderPaginationControls(perspective, totalItems) {
  const paginationContainer = document.getElementById(`${perspective}Pagination`);
  if (!paginationContainer) return;
  
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  if (totalPages <= 1) {
    paginationContainer.style.display = 'none';
    return;
  }
  
  paginationContainer.style.display = 'flex';
  paginationContainer.innerHTML = '';
  
  const prevButton = document.createElement('button');
  prevButton.innerHTML = '<i class="fas fa-chevron-left" aria-hidden="true"></i>';
  prevButton.disabled = currentPages[perspective] === 1;
  prevButton.addEventListener('click', () => {
    if (currentPages[perspective] > 1) {
      currentPages[perspective]--;
      loadData();
    }
  });
  prevButton.setAttribute('aria-label', 'Página anterior');
  
  paginationContainer.appendChild(prevButton);
  
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.className = currentPages[perspective] === i ? 'active' : '';
    pageButton.addEventListener('click', () => {
      currentPages[perspective] = i;
      loadData();
    });
    pageButton.setAttribute('aria-label', `Ir a página ${i}`);
    paginationContainer.appendChild(pageButton);
  }
  
  const nextButton = document.createElement('button');
  nextButton.innerHTML = '<i class="fas fa-chevron-right" aria-hidden="true"></i>';
  nextButton.disabled = currentPages[perspective] === totalPages;
  nextButton.addEventListener('click', () => {
    if (currentPages[perspective] < totalPages) {
      currentPages[perspective]++;
      loadData();
    }
  });
  nextButton.setAttribute('aria-label', 'Página siguiente');
  
  paginationContainer.appendChild(nextButton);
}

function getPerspectiveIcon(perspectiva) {
  switch(perspectiva) {
    case "Financial": return '<i class="fas fa-chart-line" aria-hidden="true"></i>';
    case "Customer": return '<i class="fas fa-users" aria-hidden="true"></i>';
    case "InternalProcesses": return '<i class="fas fa-cogs" aria-hidden="true"></i>';
    case "LearningGrowth": return '<i class="fas fa-graduation-cap" aria-hidden="true"></i>';
    case "Sustainability": return '<i class="fas fa-leaf" aria-hidden="true"></i>';
    default: return '<i class="fas fa-chart-pie" aria-hidden="true"></i>';
  }
}

function renderProgressBar(cumplimiento) {
  if (cumplimiento === null || isNaN(cumplimiento)) return '<div class="progress-text">N/A</div>';
  
  const progressWidth = Math.min(Math.max(cumplimiento, 0), 100);
  let progressColor = "var(--neutral)";
  if (cumplimiento >= 90) progressColor = "var(--positive)";
  else if (cumplimiento >= 70) progressColor = "var(--neutral)";
  else progressColor = "var(--negative)";
  
  return `
    <div class="progress-container">
      <div class="progress-text">${cumplimiento.toFixed(0)}%</div>
      <div class="progress-bar" role="progressbar" aria-valuenow="${cumplimiento.toFixed(0)}" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-fill" style="width: ${progressWidth}%; background: ${progressColor};"></div>
      </div>
    </div>
  `;
}

async function loadAvailablePeriods() {
  const sheetData = await loadSheetData();
  if (!sheetData) return;
  
  const headers = sheetData[0];
  const actualPeriods = headers
    .filter(h => h.startsWith("Actual "))
    .map(h => h.replace("Actual ", ""))
    .filter(p => p.match(/[A-Za-z]{3}-\d{2}/));

  const periodoSelect = document.getElementById("periodo");
  periodoSelect.innerHTML = actualPeriods.map(p => `<option value="${p}">${p}</option>`).join("");

  if (actualPeriods.length > 0) periodoSelect.value = actualPeriods[actualPeriods.length - 1];
}

async function loadData() {
  const periodo = document.getElementById("periodo").value;
  const comparacion = document.getElementById("comparacion").value;
  const searchTerm = document.getElementById("search").value.toLowerCase();
  
  document.querySelectorAll(".metrics-container").forEach(el => {
    if (el) el.innerHTML = '<div class="loading"><i class="fas fa-spinner" aria-hidden="true"></i> Cargando datos...</div>';
  });
  
  const periodDisplay = document.getElementById("periodDisplay");
  const errorContainer = document.getElementById("errorContainer");
  if (periodDisplay) periodDisplay.style.display = "none";
  if (errorContainer) errorContainer.style.display = "none";
  
  document.querySelectorAll('.summary-value').forEach(el => {
    el.textContent = '...';
    el.className = 'summary-value';
  });
  
  const response = await obtenerDatosDashboard({
    periodo: periodo,
    compararCon: comparacion
  });
  
  if (response.error) {
    showError(response.error);
    return;
  }
  
  const currentPeriod = document.getElementById("currentPeriod");
  const comparePeriod = document.getElementById("comparePeriod");
  if (currentPeriod) currentPeriod.textContent = response.periodoActual;
  if (comparePeriod) comparePeriod.textContent = response.tipoComparacion === "Trimestre Anterior" 
    ? `${response.tipoComparacion} (${response.periodoComparacion})` 
    : response.periodoComparacion;
  if (periodDisplay) {
    periodDisplay.style.display = "flex";
    periodDisplay.classList.add('animate-fade');
  }
  
  const groupedData = {};
  const summaryStats = {
    "Financial": { total: 0, favorable: 0 },
    "Customer": { total: 0, favorable: 0 },
    "InternalProcesses": { total: 0, favorable: 0 },
    "LearningGrowth": { total: 0, favorable: 0 },
    "Sustainability": { total: 0, favorable: 0 }
  };
  
  // Filtrar por término de búsqueda si existe
  const filteredData = searchTerm 
    ? response.data.filter(item => item.indicador.toLowerCase().includes(searchTerm))
    : response.data;
  
  filteredData.forEach(item => {
    if (!groupedData[item.perspectiva]) groupedData[item.perspectiva] = [];
    groupedData[item.perspectiva].push(item);
    
    if (summaryStats[item.perspectiva]) {
      summaryStats[item.perspectiva].total++;
      if (item.esFavorable) summaryStats[item.perspectiva].favorable++;
    }
  });
  
  updateSummaryCards(summaryStats);
  renderPerspective("financial", groupedData["Financial"] || []);
  renderPerspective("customer", groupedData["Customer"] || []);
  renderPerspective("internalProcesses", groupedData["InternalProcesses"] || []);
  renderPerspective("learningGrowth", groupedData["LearningGrowth"] || []);
  renderPerspective("sustainability", groupedData["Sustainability"] || []);
}

function togglePerspective(perspective) {
  const container = document.getElementById(`${perspective}Container`);
  const isExpanded = container.classList.toggle('collapsed');
  const header = container.querySelector('.perspective-header');
  
  if (header) {
    header.setAttribute('aria-expanded', !isExpanded);
  }
}

function scrollToPerspective(perspective) {
  const element = document.getElementById(`${perspective}Container`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    if (element.classList.contains('collapsed')) {
      element.classList.remove('collapsed');
      const header = element.querySelector('.perspective-header');
      if (header) {
        header.setAttribute('aria-expanded', 'true');
      }
    }
  }
}

function showMetricModal(metric) {
  currentMetricData = metric;
  const modal = document.getElementById("metricModal");
  
  // Actualizar contenido del modal
  document.getElementById("modalTitle").textContent = metric.indicador;
  document.getElementById("modalIndicatorName").textContent = metric.indicador;
  document.getElementById("modalPerspective").textContent = metric.perspectiva;
  document.getElementById("modalFormula").textContent = metric.formula.replace(/^'=/, "");
  document.getElementById("modalResponsible").textContent = metric.responsable;
  document.getElementById("modalUnit").textContent = metric.unidad;
  document.getElementById("modalPolarity").textContent = metric.polaridad === "positivo" ? "Mayor es mejor" : "Menor es mejor";
  
  document.getElementById("modalCurrentValue").textContent = formatNumber(metric.actual, metric.unidad);
  document.getElementById("modalComparisonValue").textContent = formatNumber(metric.comparacion, metric.unidad);
  document.getElementById("modalDifference").textContent = formatNumber(metric.diferencia, metric.unidad);
  document.getElementById("modalCompliance").textContent = metric.cumplimiento !== null ? `${metric.cumplimiento.toFixed(2)}%` : "N/A";
  
  // Renderizar gráfico de tendencia
  renderTrendChart(metric);
  
  // Mostrar modal
  modal.style.display = "block";
  document.body.style.overflow = "hidden";
  
  // Enfocar el modal para accesibilidad
  modal.focus();
}

function closeModal() {
  const modal = document.getElementById("metricModal");
  modal.style.display = "none";
  document.body.style.overflow = "auto";
  
  // Destruir el gráfico anterior si existe
  if (trendChart) {
    trendChart.destroy();
    trendChart = null;
  }
}

function renderTrendChart(metric) {
  const ctx = document.getElementById("trendChart").getContext('2d');
  
  // Ordenar los períodos cronológicamente
  const periods = Object.keys(metric.historicalData).sort((a, b) => {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const [monthA, yearA] = a.split('-');
    const [monthB, yearB] = b.split('-');
    
    if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
    return months.indexOf(monthA) - months.indexOf(monthB);
  });
  
  const data = periods.map(period => metric.historicalData[period]);
  
  if (trendChart) {
    trendChart.destroy();
  }
  
  trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: periods,
      datasets: [{
        label: metric.indicador,
        data: data,
        borderColor: getPerspectiveColor(metric.perspectiva),
        backgroundColor: 'rgba(0, 180, 216, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#f0f0f0'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${formatNumber(context.raw, metric.unidad)}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#f0f0f0'
          }
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#f0f0f0',
            callback: function(value) {
              return formatNumber(value, metric.unidad);
            }
          }
        }
      }
    }
  });
}

function getPerspectiveColor(perspective) {
  switch(perspective) {
    case "Financial": return '#1a5276';
    case "Customer": return '#922b21';
    case "InternalProcesses": return '#9a7d0a';
    case "LearningGrowth": return '#1e8449';
    case "Sustainability": return '#6c3483';
    default: return '#0077b6';
  }
}

function formatNumber(value, unidad) {
  if (value === null || value === undefined) return "N/A";
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return value;
  
  if (unidad === "USD") return `$${numValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  else if (unidad === "%" || unidad === "puntos" || unidad === "ratio" || 
           unidad === "veces/año" || unidad === "DPMO" || 
           unidad === "accidentes/200k horas" || unidad === "horas/empleado" || 
           unidad === "ideas/empleado") return `${numValue.toFixed(2).replace(".", ",")}${unidad === "%" ? "%" : ""}`;
  else if (unidad === "puntos (1-10)") return `${numValue.toFixed(1).replace(".", ",")}`;
  else if (unidad === "ton CO2" || unidad === "horas") return `${numValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ${unidad}`;
  else if (unidad === "días" || unidad === "minutos") return `${numValue.toFixed(0)} ${unidad}`;
  else {
    if (Number.isInteger(numValue)) return numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    else return numValue.toFixed(2).replace(".", ",");
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar controles de modal
  document.querySelector('.close-modal').addEventListener('click', closeModal);
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('metricModal').addEventListener('click', function(e) {
    if (e.target === this) {
      closeModal();
    }
  });
  
  // Cerrar modal con Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('metricModal').style.display === 'block') {
      closeModal();
    }
  });
  
  // Buscar KPI
  document.getElementById('search').addEventListener('input', function() {
    currentPages = {
      Financial: 1,
      Customer: 1,
      InternalProcesses: 1,
      LearningGrowth: 1,
      Sustainability: 1
    };
    loadData();
  });
  
  // Cargar datos iniciales
  loadAvailablePeriods().then(() => {
    if (document.getElementById("periodo").options.length > 1) loadData();
  });
  
  document.getElementById("loadDataBtn").addEventListener('click', loadData);
  
  // Marcar el body como cargado para evitar FOUC
  document.body.classList.add('loaded');
});
