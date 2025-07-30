// Configuración de la hoja de Google
const SPREADSHEET_ID = '1MOUt-fhusC7z3F0axUmglV4r500IaJuerdngvVJSJ5E';
const SHEET_NAME = 'Datos BSC';
const API_KEY = 'AIzaSyCSKa4k3fyULiZmH7ZZKkEYz2NWZ5EI2qI';

// Objeto para almacenar los datos
const dashboardData = {
  periodosDisponibles: [],
  indicadores: [],
  datos: {}
};

// Función para cargar los datos de la hoja de cálculo
async function loadSheetData() {
  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`);
    const data = await response.json();
    
    if (!data.values) {
      throw new Error("No se encontraron datos en la hoja de cálculo");
    }
    
    return data.values;
  } catch (error) {
    console.error("Error al cargar datos:", error);
    showError("Error al cargar datos: " + error.message);
    return null;
  }
}

// Función para procesar los datos y estructurarlos
async function procesarDatos() {
  const sheetData = await loadSheetData();
  if (!sheetData) return false;
  
  const headers = sheetData[0];
  
  // Extraer periodos disponibles (columnas que empiezan con "Actual ")
  dashboardData.periodosDisponibles = headers
    .filter(h => h.startsWith("Actual "))
    .map(h => h.replace("Actual ", ""));
  
  // Procesar cada fila de indicadores
  dashboardData.indicadores = [];
  for (let i = 1; i < sheetData.length; i++) {
    const row = sheetData[i];
    if (!row[0]) continue; // Saltar filas vacías
    
    const indicador = {
      id: row[0],
      nombre: row[1],
      perspectiva: row[2] || "General",
      formula: row[3] || "",
      unidad: row[4] || "unidades",
      responsable: row[5] || "No definido",
      polaridad: row[6] || "positivo",
      datos: {}
    };
    
    // Procesar valores para cada período
    dashboardData.periodosDisponibles.forEach((periodo, index) => {
      const colActual = headers.indexOf(`Actual ${periodo}`);
      const colBudget = headers.indexOf(`Budget ${periodo}`);
      
      if (colActual !== -1 && row[colActual] !== "") {
        indicador.datos[periodo] = {
          actual: parseFloat(row[colActual]) || 0,
          budget: colBudget !== -1 ? parseFloat(row[colBudget]) || 0 : null
        };
      }
    });
    
    dashboardData.indicadores.push(indicador);
  }
  
  return true;
}

// Función para obtener datos comparativos
function obtenerDatosComparativos(periodoSeleccionado, tipoComparacion) {
  const resultados = [];
  
  // Obtener el índice del período seleccionado
  const indexPeriodo = dashboardData.periodosDisponibles.indexOf(periodoSeleccionado);
  if (indexPeriodo === -1) return null;
  
  // Calcular períodos de comparación según el tipo
  let periodosComparacion = [];
  if (tipoComparacion === "Mes Anterior") {
    if (indexPeriodo > 0) {
      periodosComparacion = [dashboardData.periodosDisponibles[indexPeriodo - 1]];
    }
  } 
  else if (tipoComparacion === "Trimestre Anterior") {
    const startIndex = Math.max(0, indexPeriodo - 3);
    periodosComparacion = dashboardData.periodosDisponibles.slice(startIndex, indexPeriodo);
  }
  else if (tipoComparacion === "Año Anterior") {
    // Buscar el mismo mes del año anterior
    const mesActual = periodoSeleccionado.split('-')[0];
    const anioAnterior = parseInt(periodoSeleccionado.split('-')[1]) - 1;
    const periodoAnterior = `${mesActual}-${anioAnterior}`;
    if (dashboardData.periodosDisponibles.includes(periodoAnterior)) {
      periodosComparacion = [periodoAnterior];
    }
  }
  
  // Procesar cada indicador
  dashboardData.indicadores.forEach(indicador => {
    const datosPeriodo = indicador.datos[periodoSeleccionado];
    if (!datosPeriodo) return;
    
    let valorComparacion = 0;
    let countComparacion = 0;
    
    // Calcular valor de comparación (promedio si es trimestre)
    periodosComparacion.forEach(periodo => {
      if (indicador.datos[periodo]) {
        valorComparacion += indicador.datos[periodo].actual;
        countComparacion++;
      }
    });
    
    valorComparacion = countComparacion > 0 ? valorComparacion / countComparacion : datosPeriodo.budget;
    
    // Calcular métricas
    const diferencia = datosPeriodo.actual - valorComparacion;
    const esFavorable = indicador.polaridad === "negativo" 
      ? datosPeriodo.actual < valorComparacion 
      : datosPeriodo.actual > valorComparacion;
    
    let cumplimiento = null;
    if (valorComparacion !== 0) {
      cumplimiento = indicador.polaridad === "negativo"
        ? 100 - ((datosPeriodo.actual - valorComparacion) / valorComparacion) * 100
        : (datosPeriodo.actual / valorComparacion) * 100;
      cumplimiento = Math.max(0, Math.min(cumplimiento, 200));
    }
    
    resultados.push({
      id: indicador.id,
      indicador: indicador.nombre,
      perspectiva: indicador.perspectiva,
      formula: indicador.formula,
      unidad: indicador.unidad,
      responsable: indicador.responsable,
      polaridad: indicador.polaridad,
      actual: datosPeriodo.actual,
      comparacion: valorComparacion,
      diferencia: Math.abs(diferencia),
      esFavorable: esFavorable,
      cumplimiento: cumplimiento
    });
  });
  
  return {
    data: resultados,
    periodoActual: periodoSeleccionado,
    periodoComparacion: periodosComparacion.join(", "),
    tipoComparacion: tipoComparacion
  };
}

// Función para cargar los períodos disponibles en el select
function cargarPeriodosDisponibles() {
  const periodoSelect = document.getElementById("periodo");
  periodoSelect.innerHTML = dashboardData.periodosDisponibles.map(p => 
    `<option value="${p}">${p}</option>`
  ).join("");

  if (dashboardData.periodosDisponibles.length > 0) {
    periodoSelect.value = dashboardData.periodosDisponibles[dashboardData.periodosDisponibles.length - 1];
  }
}

// Función para renderizar una perspectiva
function renderPerspective(perspective, data) {
  const containerId = perspective.toLowerCase() + "Metrics";
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '';
  
  if (!data || data.length === 0) {
    container.innerHTML = '<div class="no-data">No hay datos disponibles</div>';
    return;
  }

  // Crear tabla
  const table = document.createElement('div');
  table.className = 'metrics-table';
  
  // Encabezado
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

  // Ordenar datos (primero los favorables)
  data.sort((a, b) => b.esFavorable - a.esFavorable || b.diferencia - a.diferencia);

  // Agregar cada indicador
  data.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'metric-card';
    card.innerHTML = `
      <div class="metric-name">
        <strong>${item.indicador}</strong>
        <div class="metric-responsable">
          ${getPerspectiveIcon(item.perspectiva)} ${item.responsable} | ${item.unidad}
        </div>
        <div class="formula-info">${item.formula}</div>
        <div class="polarity-info">
          ${item.polaridad === "negativo" 
            ? '<i class="fas fa-arrow-down"></i> Menor es mejor' 
            : '<i class="fas fa-arrow-up"></i> Mayor es mejor'}
        </div>
      </div>
      <div class="metric-value">${formatNumber(item.actual, item.unidad)}</div>
      <div class="metric-value">${formatNumber(item.comparacion, item.unidad)}</div>
      <div class="metric-comparison ${item.esFavorable ? 'positive' : 'negative'}">
        ${item.esFavorable 
          ? '<i class="fas fa-arrow-up icon-up"></i>' 
          : '<i class="fas fa-arrow-down icon-down"></i>'} 
        ${formatNumber(item.diferencia, item.unidad)}
      </div>
      <div class="metric-meta">
        ${renderProgressBar(item.cumplimiento)}
      </div>
    `;
    
    card.addEventListener('click', () => showMetricModal(item));
    table.appendChild(card);
    
    // Animación
    setTimeout(() => card.classList.add('animate-pop'), index * 50);
  });

  container.appendChild(table);
}

// Funciones auxiliares
function getPerspectiveIcon(perspectiva) {
  const icons = {
    "Financial": "fa-chart-line",
    "Customer": "fa-users",
    "InternalProcesses": "fa-cogs",
    "LearningGrowth": "fa-graduation-cap",
    "Sustainability": "fa-leaf"
  };
  const iconClass = icons[perspectiva] || "fa-chart-pie";
  return `<i class="fas ${iconClass}"></i>`;
}

function renderProgressBar(cumplimiento) {
  if (cumplimiento === null || isNaN(cumplimiento)) {
    return '<div class="progress-text">N/A</div>';
  }
  
  const width = Math.min(Math.max(cumplimiento, 0), 100);
  let color = "var(--neutral)";
  if (cumplimiento >= 90) color = "var(--positive)";
  else if (cumplimiento < 70) color = "var(--negative)";
  
  return `
    <div class="progress-container">
      <div class="progress-text">${Math.round(cumplimiento)}%</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${width}%; background: ${color};"></div>
      </div>
    </div>
  `;
}

function formatNumber(value, unidad) {
  if (value === null || isNaN(value)) return "N/A";
  
  let numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return value;
  
  // Formatear según unidad
  if (unidad === "USD") {
    return `$${numValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  } 
  else if (unidad === "%") {
    return `${numValue.toFixed(1).replace(".", ",")}%`;
  }
  else if (unidad === "días" || unidad === "horas" || unidad === "minutos") {
    return `${Math.round(numValue)} ${unidad}`;
  }
  else {
    return numValue.toFixed(2).replace(".", ",");
  }
}

function showError(message) {
  const errorContainer = document.getElementById("errorContainer");
  if (errorContainer) {
    errorContainer.innerHTML = `
      <div class="error">
        <i class="fas fa-exclamation-triangle"></i>
        <div class="error-content">
          <strong>Error</strong>
          <div>${message}</div>
        </div>
      </div>
    `;
    errorContainer.style.display = "block";
  }
}

// Función principal para cargar y mostrar los datos
async function loadData() {
  const periodo = document.getElementById("periodo").value;
  const comparacion = document.getElementById("comparacion").value;
  
  // Mostrar loading
  document.querySelectorAll(".metrics-container").forEach(el => {
    el.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Cargando...</div>';
  });
  
  // Obtener datos comparativos
  const response = obtenerDatosComparativos(periodo, comparacion);
  if (!response) {
    showError("No se pudieron obtener los datos comparativos");
    return;
  }
  
  // Actualizar UI
  document.getElementById("currentPeriod").textContent = response.periodoActual;
  document.getElementById("comparePeriod").textContent = 
    response.tipoComparacion === "Trimestre Anterior" 
      ? `${response.tipoComparacion} (${response.periodoComparacion})` 
      : response.periodoComparacion;
  
  document.getElementById("periodDisplay").style.display = "flex";
  
  // Agrupar por perspectiva
  const groupedData = {};
  const summaryStats = {};
  
  response.data.forEach(item => {
    if (!groupedData[item.perspectiva]) {
      groupedData[item.perspectiva] = [];
      summaryStats[item.perspectiva] = { total: 0, favorable: 0 };
    }
    
    groupedData[item.perspectiva].push(item);
    summaryStats[item.perspectiva].total++;
    if (item.esFavorable) summaryStats[item.perspectiva].favorable++;
  });
  
  // Actualizar resumen
  Object.entries(summaryStats).forEach(([perspective, data]) => {
    const element = document.getElementById(`${perspective}Summary`);
    const countElement = document.getElementById(`${perspective}Count`);
    
    if (element && data.total > 0) {
      const percentage = Math.round((data.favorable / data.total) * 100);
      element.textContent = `${percentage}%`;
      element.className = `summary-value ${
        percentage >= 70 ? "positive" : percentage >= 40 ? "neutral" : "negative"
      }`;
      
      if (countElement) countElement.textContent = `${data.total} KPI`;
    }
  });
  
  // Renderizar cada perspectiva
  renderPerspective("Financial", groupedData["Financial"] || []);
  renderPerspective("Customer", groupedData["Customer"] || []);
  renderPerspective("InternalProcesses", groupedData["InternalProcesses"] || []);
  renderPerspective("LearningGrowth", groupedData["LearningGrowth"] || []);
  renderPerspective("Sustainability", groupedData["Sustainability"] || []);
}

// Inicialización
document.addEventListener('DOMContentLoaded', async function() {
  // Cargar y procesar datos iniciales
  const success = await procesarDatos();
  if (!success) return;
  
  // Configurar interfaz
  cargarPeriodosDisponibles();
  
  // Configurar evento del botón
  document.getElementById("loadDataBtn").addEventListener('click', loadData);
  
  // Cargar datos iniciales
  if (dashboardData.periodosDisponibles.length > 0) {
    loadData();
  }
});
