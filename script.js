// Configuración de la hoja de Google
const SPREADSHEET_ID = '1MOUt-fhusC7z3F0axUmglV4r500IaJuerdngvVJSJ5E';
const SHEET_NAME = 'Datos BSC';
const API_KEY = 'AIzaSyCSKa4k3fyULiZmH7ZZKkEYz2NWZ5EI2qI';

// Mapa de perspectivas
const PERSPECTIVES_MAP = {
  // Financiero
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
  
  // Clientes
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
  
  // Procesos Internos
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
  
  // Aprendizaje y Crecimiento
  "Horas de Capacitación por Empleado": { perspectiva: "LearningGrowth", polaridad: "positivo" },
  "Retención de Talento Clave": { perspectiva: "LearningGrowth", polaridad: "positivo" },
  "Índice de Satisfacción Laboral": { perspectiva: "LearningGrowth", polaridad: "positivo" },
  "Ideas Implementadas por Empleado": { perspectiva: "LearningGrowth", polaridad: "positivo" },
  "Tasa de Promoción Interna": { perspectiva: "LearningGrowth", polaridad: "positivo" },
  "Adopción de Nuevas Tecnologías": { perspectiva: "LearningGrowth", polaridad: "positivo" },
  "Participación en Programas de Desarrollo": { perspectiva: "LearningGrowth", polaridad: "positivo" },
  
  // Sostenibilidad
  "Huella de Carbono": { perspectiva: "Sustainability", polaridad: "negativo" },
  "Porcentaje de Energía Renovable": { perspectiva: "Sustainability", polaridad: "positivo" },
  "Diversidad en Puestos Gerenciales": { perspectiva: "Sustainability", polaridad: "positivo" },
  "Horas de Voluntariado Corporativo": { perspectiva: "Sustainability", polaridad: "positivo" }
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

// Función principal para procesar los datos (ADAPTADA A TUS COLUMNAS)
async function obtenerDatosDashboard(filtros) {
  try {
    const sheetData = await loadSheetData();
    if (!sheetData) return { error: "No se pudieron cargar los datos" };
    
    const headers = sheetData[0];
    const results = [];
    
    const periodoActual = filtros.periodo; // Formato "Mmm-AA" (ej: "Jun-24")
    let periodoComparacion = "";
    let comparePrefix = "";

    // Determinar período de comparación (adaptado a tu estructura)
    if (filtros.compararCon === "Año Anterior") {
      const [mes, anio] = periodoActual.split('-');
      periodoComparacion = `${mes}-${parseInt(anio)-1}`;
      comparePrefix = "Actual ";
    } 
    else if (filtros.compararCon === "Budget") {
      periodoComparacion = periodoActual; // Mismo periodo
      comparePrefix = "Budget ";
    }
    
    // Encontrar columnas (adaptado a tus nombres exactos)
    const actualCol = headers.indexOf(`Actual ${periodoActual}`);
    const compareCol = headers.indexOf(`${comparePrefix}${periodoComparacion}`);
    const metaCol = headers.indexOf("Meta");
    const polaridadCol = headers.indexOf("Polaridad");
    const unidadCol = headers.indexOf("Unidad");
    const responsableCol = headers.indexOf("Responsable");
    
    if (actualCol === -1) {
      return { error: `Columna 'Actual ${periodoActual}' no encontrada.` };
    }
    
    if (compareCol === -1) {
      return { error: `Columna '${comparePrefix}${periodoComparacion}' no encontrada.` };
    }
    
    // Procesar filas
    for (let i = 1; i < sheetData.length; i++) {
      const row = sheetData[i];
      const actualValue = parseFloat(row[actualCol]);
      const compareValue = parseFloat(row[compareCol]);
      const metaValue = metaCol !== -1 ? parseFloat(row[metaCol]) : null;
      const polaridad = polaridadCol !== -1 ? row[polaridadCol] : PERSPECTIVES_MAP[row[1]]?.polaridad || "positivo";
      
      const diferenciaAbsoluta = actualValue - compareValue;
      
      let esFavorable;
      if (polaridad === "negativo") {
        esFavorable = actualValue < compareValue;
      } else {
        esFavorable = actualValue > compareValue;
      }
      
      const diferenciaMostrar = Math.abs(diferenciaAbsoluta);
      
      let cumplimiento = null;
      if (compareValue !== 0 && !isNaN(compareValue)) {
        if (polaridad === "negativo") {
          cumplimiento = 100 - ((actualValue - compareValue) / compareValue) * 100;
        } else {
          cumplimiento = (actualValue / compareValue) * 100;
        }
        cumplimiento = Math.max(0, Math.min(cumplimiento, 200));
      }
      
      results.push({
        id: row[0],
        indicador: row[1],
        perspectiva: PERSPECTIVES_MAP[row[1]]?.perspectiva || row[2],
        formula: row[3],
        unidad: row[unidadCol] || "unidades",
        responsable: row[responsableCol] || "No definido",
        meta: metaValue,
        actual: actualValue,
        comparacion: compareValue,
        diferencia: diferenciaMostrar.toFixed(2),
        esFavorable: esFavorable,
        cumplimiento: cumplimiento !== null ? Number(cumplimiento.toFixed(2)) : null,
        polaridad: polaridad
      });
    }
    
    return { 
      data: results,
      periodoActual: periodoActual,
      periodoComparacion: periodoComparacion
    };
    
  } catch (e) {
    return { error: `Error al procesar los datos: ${e.message}` };
  }
}

// Función para mostrar error
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
    errorContainer.classList.add('animate-fade');
  }
}

// Función para actualizar las tarjetas de resumen
function updateSummaryCards(stats) {
  for (const [perspective, data] of Object.entries(stats)) {
    const elementId = perspective + "Summary";
    const element = document.getElementById(elementId);
    
    if (element && data.total > 0) {
      const percentage = Math.round((data.favorable / data.total) * 100);
      element.textContent = `${percentage}%`;
      
      if (percentage >= 70) {
        element.className = "summary-value positive";
      } else if (percentage >= 40) {
        element.className = "summary-value neutral";
      } else {
        element.className = "summary-value negative";
      }
      
      const countElement = document.getElementById(perspective + "Count");
      if (countElement) {
        countElement.textContent = `${data.total} KPI`;
      }
    }
  }
}

// Función para renderizar una perspectiva
function renderPerspective(perspective, data) {
  const containerId = perspective + "Metrics";
  const container = document.getElementById(containerId);
  
  if (!container) {
    console.error(`Contenedor no encontrado: ${containerId}`);
    return;
  }
  
  if (!data || data.length === 0) {
    container.innerHTML = '<div class="no-data">No hay datos disponibles para esta perspectiva</div>';
    return;
  }
  
  let html = `
    <div class="metric-header">
      <div>Indicador</div>
      <div>Actual</div>
      <div>Comparación</div>
      <div>Diferencia</div>
      <div>Cumplimiento</div>
    </div>
  `;
  
  // Ordenar por favorabilidad
  data.sort((a, b) => {
    if (a.esFavorable !== b.esFavorable) {
      return b.esFavorable - a.esFavorable;
    }
    return parseFloat(b.diferencia) - parseFloat(a.diferencia);
  });
  
  data.forEach(item => {
    const diferencia = parseFloat(item.diferencia);
    const cumplimiento = item.cumplimiento ? parseFloat(item.cumplimiento) : null;
    
    let trendIcon, trendClass;
    if (item.esFavorable) {
      trendIcon = '<i class="fas fa-arrow-up icon-up"></i>';
      trendClass = "positive";
    } else {
      trendIcon = '<i class="fas fa-arrow-down icon-down"></i>';
      trendClass = "negative";
    }
    
    let progressBar = '';
    let cumplimientoText = 'N/A';
    let progressWidth = 0;
    let progressColor = "var(--neutral)";
    
    if (cumplimiento !== null) {
      progressWidth = Math.min(Math.max(cumplimiento, 0), 100);
      cumplimientoText = `${cumplimiento.toFixed(0)}%`;
      
      if (cumplimiento >= 90) {
        progressColor = "var(--positive)";
      } else if (cumplimiento >= 70) {
        progressColor = "var(--neutral)";
      } else {
        progressColor = "var(--negative)";
      }
      
      progressBar = `
        <div class="progress-container">
          <div class="progress-text">${cumplimientoText}</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressWidth}%; background: ${progressColor};"></div>
          </div>
        </div>
      `;
    } else {
      progressBar = '<div class="progress-text">N/A</div>';
    }
    
    const actualFormatted = formatNumber(item.actual, item.unidad);
    const comparacionFormatted = formatNumber(item.comparacion, item.unidad);
    const diferenciaFormatted = formatNumber(diferencia, item.unidad);
    
    const polaridadText = item.polaridad === "negativo" ? 
      '<i class="fas fa-arrow-down"></i> Menor valor es mejor' : 
      '<i class="fas fa-arrow-up"></i> Mayor valor es mejor';
    
    let perspectiveIcon = '';
    switch(item.perspectiva) {
      case "Financial": perspectiveIcon = '<i class="fas fa-chart-line"></i>'; break;
      case "Customer": perspectiveIcon = '<i class="fas fa-users"></i>'; break;
      case "InternalProcesses": perspectiveIcon = '<i class="fas fa-cogs"></i>'; break;
      case "LearningGrowth": perspectiveIcon = '<i class="fas fa-graduation-cap"></i>'; break;
      case "Sustainability": perspectiveIcon = '<i class="fas fa-leaf"></i>'; break;
      default: perspectiveIcon = '<i class="fas fa-chart-pie"></i>';
    }
    
    html += `
      <div class="metric-card" onclick="showMetricModal(${JSON.stringify(item).replace(/"/g, '&quot;')})">
        <div class="metric-name">
          <strong>${item.indicador}</strong>
          <div class="metric-responsable">
            ${perspectiveIcon} ${item.responsable} | ${item.unidad}
          </div>
          <div class="formula-info">${item.formula.replace(/^'=/, "")}</div>
          <div class="polarity-info">${polaridadText}</div>
        </div>
        <div class="metric-value">${actualFormatted}</div>
        <div class="metric-value">${comparacionFormatted}</div>
        <div class="metric-comparison ${trendClass}">
          ${trendIcon} ${diferenciaFormatted}
        </div>
        <div class="metric-meta">
          ${progressBar}
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  
  setTimeout(() => {
    const cards = container.querySelectorAll('.metric-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-pop');
      }, index * 50);
    });
  }, 100);
}

// Función para cargar los períodos disponibles (ADAPTADA A TUS COLUMNAS)
async function loadAvailablePeriods() {
  const sheetData = await loadSheetData();
  if (!sheetData) return;
  
  const headers = sheetData[0];
  
  // Extraer periodos de columnas "Actual Mmm-AA"
  const actualPeriods = headers
    .filter(h => h.startsWith("Actual "))
    .map(h => h.replace("Actual ", ""))
    .filter(p => p.match(/[A-Za-z]{3}-\d{2}/)); // Filtra formato "Mmm-AA"

  const periodoSelect = document.getElementById("periodo");
  periodoSelect.innerHTML = actualPeriods.map(p => 
    `<option value="${p}">${p}</option>`
  ).join("");

  if (actualPeriods.length > 0) {
    periodoSelect.value = actualPeriods[actualPeriods.length - 1];
  }
}

// Función para cargar los datos
async function loadData() {
  const periodo = document.getElementById("periodo").value;
  const comparacion = document.getElementById("comparacion").value;
  
  document.querySelectorAll(".metrics-container").forEach(el => {
    if (el) {
      el.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i> Cargando datos...</div>';
    }
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
  if (comparePeriod) comparePeriod.textContent = response.periodoComparacion;
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
  
  response.data.forEach(item => {
    if (!groupedData[item.perspectiva]) {
      groupedData[item.perspectiva] = [];
    }
    groupedData[item.perspectiva].push(item);
    
    if (summaryStats[item.perspectiva]) {
      summaryStats[item.perspectiva].total++;
      if (item.esFavorable) {
        summaryStats[item.perspectiva].favorable++;
      }
    }
  });
  
  updateSummaryCards(summaryStats);
  
  renderPerspective("financial", groupedData["Financial"] || []);
  renderPerspective("customer", groupedData["Customer"] || []);
  renderPerspective("internalProcesses", groupedData["InternalProcesses"] || []);
  renderPerspective("learningGrowth", groupedData["LearningGrowth"] || []);
  renderPerspective("sustainability", groupedData["Sustainability"] || []);
}

// Función para alternar la visualización de una perspectiva
function togglePerspective(perspective) {
  const container = document.getElementById(`${perspective}Container`);
  container.classList.toggle('collapsed');
}

// Función para navegar a una perspectiva
function scrollToPerspective(perspective) {
  const element = document.getElementById(`${perspective}Container`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    
    if (element.classList.contains('collapsed')) {
      element.classList.remove('collapsed');
    }
  }
}

// Función para mostrar el modal
function showMetricModal(metric) {
  alert(`Detalles del indicador: ${metric.indicador}\nValor actual: ${metric.actual}\nComparación: ${metric.comparacion}`);
}

// Función para formatear números según su unidad
function formatNumber(value, unidad) {
  if (value === null || value === undefined) return "N/A";
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return value;
  
  if (unidad === "USD") {
    return `$${numValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  } 
  else if (unidad === "%" || unidad === "puntos" || unidad === "ratio" || 
           unidad === "veces/año" || unidad === "DPMO" || 
           unidad === "accidentes/200k horas" || unidad === "horas/empleado" || 
           unidad === "ideas/empleado") {
    return `${numValue.toFixed(2).replace(".", ",")}${unidad === "%" ? "%" : ""}`;
  }
  else if (unidad === "puntos (1-10)") {
    return `${numValue.toFixed(1).replace(".", ",")}`;
  }
  else if (unidad === "ton CO2" || unidad === "horas") {
    return `${numValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ${unidad}`;
  }
  else if (unidad === "días" || unidad === "minutos") {
    return `${numValue.toFixed(0)} ${unidad}`;
  }
  else {
    if (Number.isInteger(numValue)) {
      return numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    } else {
      return numValue.toFixed(2).replace(".", ",");
    }
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
  loadAvailablePeriods().then(() => {
    if (document.getElementById("periodo").options.length > 1) {
      loadData();
    }
  });
  
  document.getElementById("loadDataBtn").addEventListener('click', loadData);
});