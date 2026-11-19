/* Armenia en Movimiento — WebGIS de consulta histórica 2023-2025.
 * HotSpots Gi* y Kernel provienen de geoprocesos, no de tráfico actual.
 * TomTom es la capa opcional de movilidad actual; Waze es independiente.
 */
const ARMENIA = [4.5339, -75.6811];
const map = L.map("map", { zoomControl: false }).setView(ARMENIA, 13);

L.control.zoom({ position: "topleft" }).addTo(map);

// Mapa base Esri World Street Map (servicio público de teselas).
// No requiere insertar una API key en este prototipo; necesita internet.
// Respeta la atribución y las condiciones de uso del proveedor.
const mapStatus = document.getElementById("data-status");
const baseMap = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 19,
    attribution: 'Tiles &copy; <a href="https://www.esri.com/">Esri</a> — Sources: Esri, HERE, Garmin, OpenStreetMap contributors, and the GIS user community'
  }
).addTo(map);
let tileErrorCount = 0;
baseMap.on("tileerror", () => {
  tileErrorCount += 1;
  if (tileErrorCount >= 3 && mapStatus) {
    mapStatus.textContent = "No se cargan las teselas · revisa conexión o acceso al proveedor";
  }
});
baseMap.on("load", () => {
  tileErrorCount = 0;
  if (mapStatus) mapStatus.textContent = "Mapa SIG conectado · consulta Waze independiente";
});

// TomTom Orbis Traffic Raster Flow v2: capa opcional de tráfico real.
// No utiliza datos simulados ni guarda la clave en disco o localStorage.
// La clave viaja en las solicitudes de teselas visibles en las herramientas del navegador.
// Las teselas TomTom permanecen por encima del Kernel histórico.
map.createPane("tomtomTrafficPane");
map.getPane("tomtomTrafficPane").style.zIndex = 480;

let tomtomKey = "";
let tomtomLayer = null;
const tomtomToggle = document.getElementById("tomtom-toggle");
const tomtomInput = document.getElementById("tomtom-key");
const tomtomStatus = document.getElementById("tomtom-status");
const tomtomConnect = document.getElementById("tomtom-connect");
function removeTomtom() {
  if (tomtomLayer) { map.removeLayer(tomtomLayer); tomtomLayer = null; }
}
function enableTomtom() {
  removeTomtom();
  if (!tomtomToggle.checked) {
    tomtomStatus.textContent = "Capa TomTom desactivada.";
    return;
  }
  if (!tomtomKey) {
    tomtomToggle.checked = false;
    tomtomStatus.textContent = "Necesitas introducir una API Key válida para activar tráfico real.";
    return;
  }
  const url = "https://api.tomtom.com/maps/orbis/traffic/flow/raster/tile/{z}/{x}/{y}?apiVersion=2&style=light&tileSize=256&key=" + encodeURIComponent(tomtomKey);
  tomtomLayer = L.tileLayer(url, {
    tileSize: 256, opacity: 0.85, maxZoom: 19, pane: "tomtomTrafficPane",
    attribution: 'Tráfico &copy; <a href="https://www.tomtom.com/" target="_blank" rel="noopener noreferrer">TomTom</a>'
  });
  let failed = false;
  tomtomLayer.on("tileerror", () => {
    if (!failed) {
      failed = true;
      tomtomStatus.textContent = "No se pudieron cargar algunas teselas. Verifica clave, permisos, cobertura y conexión.";
    }
  });
  tomtomLayer.on("load", () => {
    if (!failed && tomtomToggle.checked) tomtomStatus.textContent = "Teselas TomTom cargadas. La información visible depende de la cobertura disponible.";
  });
  tomtomLayer.addTo(map);
  tomtomStatus.textContent = "Solicitando tráfico a TomTom…";
}
tomtomConnect.addEventListener("click", () => {
  tomtomKey = tomtomInput.value.trim();
  tomtomInput.value = "";
  if (!tomtomKey) {
    tomtomToggle.checked = false;
    removeTomtom();
    tomtomStatus.textContent = "Introduce una clave para conectar.";
    return;
  }
  try { sessionStorage.setItem("armenia_tomtom_key", tomtomKey); } catch (_) { /* almacenamiento no disponible */ }
  tomtomToggle.checked = true;
  enableTomtom();
});
tomtomToggle.addEventListener("change", enableTomtom);
// Recuperar la clave únicamente durante la sesión de esta pestaña.
try {
  const savedTomtomKey = sessionStorage.getItem("armenia_tomtom_key");
  if (savedTomtomKey) {
    tomtomKey = savedTomtomKey;
    tomtomToggle.checked = true;
    enableTomtom();
  }
} catch (_) { /* almacenamiento no disponible */ }
// Actualización de las teselas solo cuando la capa está activada.
setInterval(() => {
  if (tomtomLayer && tomtomToggle.checked) tomtomLayer.redraw();
}, 15 * 60 * 1000);


// ===============================================================
// DENSIDAD KERNEL: GeoTIFF 2023, 2024 y 2025; rampa QML compartida
// ===============================================================
// Capa de imagen GeoRGBA reproyectada a EPSG:4326 desde EPSG:9377.
// No representa incidentes ni tráfico actual. Se preserva el TIFF original.
// Transparencia aplicada exclusivamente a celdas cuyo valor original era 0.
// Comparación visual: escala de colores numérica fija del QML 2023 en los 3 años.
// Valores fuera del rango se saturan en los extremos; originales no se alteran.
const KERNEL_FILES = {
  "2023": {
    "image": "datos/kernel/2023_kernel_rgba.png",
    "bounds": [
      [
        4.4958246022,
        -75.717146957
      ],
      [
        4.5795314649,
        -75.6363155208
      ]
    ],
    "min": -34.5968819,
    "max": 46.1790466
  },
  "2024": {
    "image": "datos/kernel/2024_kernel_rgba.png",
    "bounds": [
      [
        4.4958246022,
        -75.717146957
      ],
      [
        4.5795314649,
        -75.6363155208
      ]
    ],
    "min": -76.57657623291016,
    "max": 39.60382843017578
  },
  "2025": {
    "image": "datos/kernel/2025_kernel_rgba.png",
    "bounds": [
      [
        4.4958246022,
        -75.717146957
      ],
      [
        4.5795314649,
        -75.6363155208
      ]
    ],
    "min": -51.130836486816406,
    "max": 31.33115005493164
  }
};

map.createPane("kernelRasterPane");
map.getPane("kernelRasterPane").style.zIndex = 420;
map.getPane("kernelRasterPane").style.pointerEvents = "none";

const kernelToggle = document.getElementById("kernel-toggle");
const kernelOpacity = document.getElementById("kernel-opacity");
const kernelOpacityValue = document.getElementById("kernel-opacity-value");
const kernelStatus = document.getElementById("kernel-status");
const kernelLegend = document.getElementById("kernel-legend");
const kernelLegendTitle = document.getElementById("kernel-legend-title");
const zoomToKernel = document.getElementById("zoom-to-kernel");
const kernelLayers = new Map();
const kernelErrors = new Set();

function kernelLayerFor(year) {
  const config = KERNEL_FILES[year];
  if (!config) return null;
  if (!kernelLayers.has(year)) {
    const layer = L.imageOverlay(config.image, config.bounds, {
      pane: "kernelRasterPane", opacity: Number(kernelOpacity.value) / 100,
      interactive: false, alt: `Mapa de densidad Kernel ${year}`
    });
    layer.on("load", () => {
      if (year === selectedYear && kernelToggle.checked) {
        kernelStatus.textContent = `Kernel ${year} cargado · rampa QGIS y transparencia configuradas.`;
      }
    });
    layer.on("error", () => {
      kernelErrors.add(year);
      if (year === selectedYear) {
        kernelStatus.textContent = `No se pudo cargar la imagen Kernel ${year}. Comprueba que la carpeta datos/kernel esté completa y usa Live Server.`;
        kernelLegend.hidden = true;
      }
      console.error(`No se pudo cargar Kernel ${year}: ${config.image}`);
    });
    kernelLayers.set(year,layer);
  }
  return kernelLayers.get(year);
}

function syncKernelLayer() {
  for (const layer of kernelLayers.values()) map.removeLayer(layer);
  const config = KERNEL_FILES[selectedYear];
  const visible = kernelToggle.checked && Boolean(config) && !kernelErrors.has(selectedYear);
  zoomToKernel.disabled = !Boolean(config);
  zoomToKernel.textContent = `Acercar a Kernel ${selectedYear}`;
  kernelLegend.hidden = !visible;
  if (!kernelToggle.checked) {
    kernelStatus.textContent = `Kernel ${selectedYear} oculto. La red vial Gi* sigue siendo independiente.`;
    return;
  }
  if (!config) {
    kernelStatus.textContent = `Kernel ${selectedYear} pendiente: todavía no se ha incorporado el ráster de este año. Los tramos Gi* siguen disponibles.`;
    return;
  }
  if (kernelErrors.has(selectedYear)) {
    kernelStatus.textContent = `Error de carga de Kernel ${selectedYear}. Comprueba datos/kernel y recarga la página.`;
    return;
  }
  kernelLegendTitle.textContent = `Densidad Kernel ${selectedYear}`;
  const layer = kernelLayerFor(selectedYear);
  layer.setOpacity(Number(kernelOpacity.value)/100);
  layer.addTo(map);
  kernelStatus.textContent = `Mostrando Kernel ${selectedYear} · opacidad ${kernelOpacity.value} %. La red vial Gi* puede activarse por separado.`;
}

kernelToggle.addEventListener("change", syncKernelLayer);
kernelOpacity.addEventListener("input", () => {
  kernelOpacityValue.textContent = `${kernelOpacity.value}%`;
  const active = kernelLayers.get(selectedYear);
  if (active) active.setOpacity(Number(kernelOpacity.value)/100);
});
zoomToKernel.addEventListener("click", () => {
  const config = KERNEL_FILES[selectedYear];
  if (config) map.fitBounds(config.bounds, {padding:[24,24], maxZoom:15});
});

// ===============================================================
// RED VIAL: HOT SPOTS GI* (archivos reales; uno por año)
// ===============================================================
// 2023, 2024 y 2025 ya están integrados como GeoJSON en EPSG:4326.
// Se preservan Gi_Bin, GiZScore, GiPValue y todos los demás campos originales.
// La carga es automática y no requiere importar los SHP manualmente.
const HISTORICAL_FILES = {
  "2023": "datos/hotspots/2023.geojson",
  "2024": "datos/hotspots/2024.geojson",
  "2025": "datos/hotspots/2025.geojson"
};

// Misma simbología de QGIS 2023 para LOS TRES AÑOS, por solicitud del usuario.
// El ancho QGIS (mm) se aproxima a píxeles CSS (1 mm = 96 / 25.4 px).
// No modifica los valores estadísticos: Gi_Bin es la clasificación original.
// Esta paleta es una elección visual compartida, no un recálculo estadístico.
const HOTSPOT_CLASSES = {
  "-3": {"color": "#adf58a", "title": "Frío · 99%", "description": "Agrupación de valores bajos, confianza del 99%", "weight": 0.983, "opacity": 1.0},
  "-2": {"color": "#8bcf5d", "title": "Frío · 95%", "description": "Agrupación de valores bajos, confianza del 95%", "weight": 0.983, "opacity": 1.0},
  "-1": {"color": "#93e872", "title": "Frío · 90%", "description": "Agrupación de valores bajos, confianza del 90%", "weight": 0.983, "opacity": 1.0},
  "0": {"color": "#81b152", "title": "No significativo", "description": "Sin significancia estadística según el geoproceso", "weight": 1.739, "opacity": 1.0},
  "1": {"color": "#d5bf44", "title": "Caliente · 90%", "description": "Agrupación de valores altos, confianza del 90%", "weight": 1.739, "opacity": 1.0},
  "2": {"color": "#f3860c", "title": "Caliente · 95%", "description": "Agrupación de valores altos, confianza del 95%", "weight": 1.739, "opacity": 1.0},
  "3": {"color": "#db1e2a", "title": "Caliente · 99%", "description": "Agrupación de valores altos, confianza del 99%", "weight": 3.25, "opacity": 0.856},
};

const yearLayers = new Map();
const yearCounts = new Map();
const yearDistributions = new Map();
const yearPromises = new Map();
let selectedYear = "2023";
let selectionVersion = 0;
const historicalToggle = document.getElementById("historical-toggle");
const yearStatus = document.getElementById("year-status");
const historicalLegend = document.getElementById("historical-legend");
const hotspotClassCount = document.getElementById("hotspot-class-count");
const zoomToHistory = document.getElementById("zoom-to-history");
const giCounterYear = document.getElementById("gi-counter-year");
const giHotTotal = document.getElementById("gi-hot-total");
const giHotPercentage = document.getElementById("gi-hot-percentage");
const giHotLevels = {
  "1": document.getElementById("gi-hot-count-1"),
  "2": document.getElementById("gi-hot-count-2"),
  "3": document.getElementById("gi-hot-count-3")
};

// Contar tramos con clasificación Gi* positiva (+1, +2 y +3).
// Este contador no calcula cuántas zonas geográficas diferentes existen.
function updateGiCounter(year) {
  giCounterYear.textContent = year;
  const distribution = yearDistributions.get(year);
  const totalRoads = yearCounts.get(year);
  if (!distribution || !Number.isFinite(totalRoads)) {
    giHotTotal.textContent = "—";
    giHotPercentage.textContent = "Consultando datos del año…";
    for (const target of Object.values(giHotLevels)) target.textContent = "—";
    return;
  }
  const hotCount = ["1", "2", "3"].reduce((sum, bin) => sum + distribution[bin], 0);
  giHotTotal.textContent = hotCount.toLocaleString("es-CO");
  giHotPercentage.textContent = `${(hotCount / totalRoads * 100).toLocaleString("es-CO", {maximumFractionDigits:1})}% de ${totalRoads} tramos`;
  for (const bin of ["1", "2", "3"]) {
    giHotLevels[bin].textContent = distribution[bin].toLocaleString("es-CO");
  }
}


map.createPane("hotspotsRoadsPane");
map.getPane("hotspotsRoadsPane").style.zIndex = 450;

function formatValue(value, decimals = 4) {
  const n = Number(value);
  if (value == null || !Number.isFinite(n)) return "Sin dato";
  if (n !== 0 && Math.abs(n) < 0.0001) return n.toExponential(3);
  return n.toLocaleString("es-CO", { maximumFractionDigits: decimals });
}
function normalizeHistoricalData(data) {
  if (Array.isArray(data)) throw new Error("Se encontraron varios SHP. Utiliza únicamente la red vial con su análisis Gi* para ese año.");
  if (data?.type === "FeatureCollection" && Array.isArray(data.features)) return data;
  if (data?.type === "Feature") return { type: "FeatureCollection", features: [data] };
  throw new Error("El archivo no contiene una colección de entidades geográficas válida.");
}
function hotspotStyle(feature) {
  const bin = String(Number(feature?.properties?.Gi_Bin));
  const item = HOTSPOT_CLASSES[bin];
  return {
    color: item?.color || "#3bd674",
    weight: item?.weight ?? 1,
    opacity: item?.opacity ?? 1,
    lineCap: "square",
    lineJoin: "bevel"
  };
}
function hotspotPopup(feature) {
  const props = feature.properties || {};
  const bin = String(Number(props.Gi_Bin));
  const item = HOTSPOT_CLASSES[bin] || {title:"Clasificación desconocida", color:"#7a8995"};
  const id = escapeHtml(String(props.SOURCE_ID ?? "Sin identificador"));
  return `<div class="hotspot-popup">
    <strong>Red vial · ${escapeHtml(selectedYear)}</strong>
    <div>Tramo: ${id}</div>
    <div><span class="hotspot-popup-swatch" style="background:${item.color}"></span> ${escapeHtml(item.title)} (Gi_Bin ${escapeHtml(bin)})</div>
    <div>Z-score Gi*: ${escapeHtml(formatValue(props.GiZScore))}</div>
    <div>Valor p: ${escapeHtml(formatValue(props.GiPValue, 6))}</div>
    <div>Vecinos: ${escapeHtml(String(props.NNeighbors ?? "—"))}</div>
    <div>Densidad: ${escapeHtml(formatValue(props.Densidad_k))}</div>
    <small>Estadísticos originales del geoproceso; no representan tráfico actual.</small>
  </div>`;
}

async function loadHistoricalYear(year) {
  const file = HISTORICAL_FILES[year];
  if (!file) throw new Error(`No hay ruta configurada para ${year}.`);
  const response = await fetch(file, { cache: "no-cache" });
  if (!response.ok) {
    if (response.status === 404) throw new Error(`${year} todavía no está integrado: falta ${file}. Comparte el SHP de ese año para incorporarlo.`);
    throw new Error(`Error HTTP ${response.status} al solicitar el archivo de ${year}.`);
  }
  let data;
  if (file.toLowerCase().endsWith(".zip")) {
    if (typeof shp !== "function") throw new Error("No se cargó shp.js. Verifica tu conexión a Internet.");
    data = await shp(await response.arrayBuffer());
  } else {
    data = await response.json();
  }
  const geojson = normalizeHistoricalData(data);
  const features = geojson.features.filter(f => f && f.geometry);
  if (!features.length) throw new Error(`${year}: el archivo no contiene geometrías.`);
  if (features.some(f => !["LineString", "MultiLineString"].includes(f.geometry.type))) {
    throw new Error(`${year}: se esperaba una capa de tramos viales (líneas), no puntos o polígonos.`);
  }
  if (features.some(f => !Object.prototype.hasOwnProperty.call(f.properties || {}, "Gi_Bin") ||
    !Object.prototype.hasOwnProperty.call(HOTSPOT_CLASSES, String(Number(f.properties.Gi_Bin))))) {
    throw new Error(`${year}: falta el campo Gi_Bin o hay categorías distintas de -3 a +3.`);
  }
  const distribution = Object.fromEntries(Object.keys(HOTSPOT_CLASSES).map(bin => [bin,0]));
  for (const f of features) distribution[String(Number(f.properties.Gi_Bin))]++;
  const layer = L.geoJSON({type:"FeatureCollection", features}, {
    pane: "hotspotsRoadsPane",
    style: hotspotStyle,
    onEachFeature: (feature, item) => item.bindPopup(() => hotspotPopup(feature), {maxWidth: 330})
  });
  const bounds = layer.getBounds();
  if (!bounds.isValid()) throw new Error(`${year}: extensión espacial inválida.`);
  const center = bounds.getCenter();
  if (center.lat < 3 || center.lat > 6 || center.lng < -77 || center.lng > -74) {
    throw new Error(`${year}: las coordenadas no están en Armenia. Revisa la referencia espacial del archivo.`);
  }
  yearLayers.set(year, layer);
  yearCounts.set(year, features.length);
  yearDistributions.set(year, distribution);
  return layer;
}

function displayHistoryInfo(year, visible) {
  const count = yearCounts.get(year);
  const distribution = yearDistributions.get(year);
  document.getElementById("hotspot-count").textContent = count == null ? "—" : String(count);
  document.getElementById("hotspot-source").textContent = count == null ? "Sin datos" : `Red vial ${year}`;
  const hot = distribution ? ["1", "2", "3"].reduce((s,k) => s + distribution[k], 0) : null;
  const cold = distribution ? ["-1", "-2", "-3"].reduce((s,k) => s + distribution[k], 0) : null;
  hotspotClassCount.textContent = distribution ? `${hot} calientes · ${cold} fríos` : "—";
  historicalLegend.hidden = !visible;
  zoomToHistory.disabled = !visible;
  if (distribution) {
    for (const [bin, n] of Object.entries(distribution)) {
      const target = document.getElementById(`gi-count-${bin.replace("-", "m")}`);
      if (target) target.textContent = String(n);
    }
  }
  updateGiCounter(year);
}

async function showSelectedYear() {
  const request = ++selectionVersion;
  for (const layer of yearLayers.values()) map.removeLayer(layer);
  const year = selectedYear;
  displayHistoryInfo(year, false);
  const wantVisible = historicalToggle.checked;
  yearStatus.textContent = `Año ${year}: consultando estadísticas…`;
  try {
    if (!yearPromises.has(year)) {
      const task = loadHistoricalYear(year).catch(error => {yearPromises.delete(year); throw error;});
      yearPromises.set(year, task);
    }
    const layer = await yearPromises.get(year);
    if (request !== selectionVersion || selectedYear !== year) return;
    const visible = historicalToggle.checked;
    if (visible) layer.addTo(map);
    const legendTitle = historicalLegend.querySelector("strong");
    if (legendTitle) legendTitle.textContent = `Red vial ${year} · estilo QGIS de 2023`;
    displayHistoryInfo(year, visible);
    const n = yearCounts.get(year);
    // Acercar una sola vez al primer resultado mostrado.
    if (visible && !window.__armeniaDidFocusHistory) {
      map.fitBounds(layer.getBounds(), { padding: [25, 25], maxZoom: 14 });
      window.__armeniaDidFocusHistory = true;
    }
    yearStatus.textContent = `Año ${year}: ${n} tramos · ${visible ? "red vial visible" : "red vial oculta"}. Contador Gi* actualizado.`;
  } catch (error) {
    if (request !== selectionVersion) return;
    displayHistoryInfo(year, false);
    giHotPercentage.textContent = "No se pudo leer el archivo del año.";
    console.error(`Error leyendo datos Gi* de ${year}:`, error);
    yearStatus.textContent = `${year}: error al cargar la red vial Gi*. Comprueba la carpeta datos/hotspots.`;
    console.warn(`Carga histórica ${year}`, error);
  }
}

document.querySelectorAll(".range-button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".range-button").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    selectedYear = button.dataset.year;
    syncKernelLayer();
    showSelectedYear();
  });
});
historicalToggle.addEventListener("change", showSelectedYear);
zoomToHistory.addEventListener("click", () => {
  const layer = yearLayers.get(selectedYear);
  if (layer && map.hasLayer(layer)) map.fitBounds(layer.getBounds(), { padding:[25,25], maxZoom:15 });
});

document.getElementById("reset-view").addEventListener("click", () => map.setView(ARMENIA, 13));

document.getElementById("search-form").addEventListener("submit", async event => {
  event.preventDefault();
  const query = document.getElementById("search-input").value.trim();
  if (!query) return;
  // Nominatim tiene política de uso; para despliegues intensivos use un proveedor o instancia apropiada.
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query + ", Armenia, Quindío, Colombia")}`;
    const response = await fetch(url, { headers: { "Accept": "application/json" } });
    if (!response.ok) throw new Error("Servicio de búsqueda no disponible");
    const results = await response.json();
    if (!results.length) { alert("No se encontró el lugar. Prueba con otro nombre."); return; }
    map.setView([Number(results[0].lat), Number(results[0].lon)], 16);
  } catch (error) {
    alert("No fue posible realizar la búsqueda. Comprueba la conexión e inténtalo más tarde.");
  }
});

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

syncKernelLayer();
showSelectedYear();

// Waze es un iframe independiente: no se mezclan datos ni capas con Leaflet.
const wazeRefresh = document.getElementById("waze-refresh");
const wazeFrame = document.getElementById("waze-frame");
if (wazeRefresh && wazeFrame) {
  wazeRefresh.addEventListener("click", () => {
    wazeFrame.src = "https://embed.waze.com/es/iframe?zoom=13&lat=4.5339&lon=-75.6811";
  });
}
