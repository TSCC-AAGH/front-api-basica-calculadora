
//Pruebas locales
const base="localhost:8000";

//Para el servidor
//const base=/api


// Muestra texto/JSON en el <pre id="out">
function mostrarSalida(texto) {
  var out = document.getElementById("out");
  out.textContent = (typeof texto === "string") ? texto : JSON.stringify(texto);
}

// Lee y valida A y B
function obtenerValores() {
  var a = parseFloat(document.getElementById("in-a").value);
  var b = parseFloat(document.getElementById("in-b").value);
  if (isNaN(a) || isNaN(b)) { throw "Los valores de A y B deben ser números."; }
  return { a: a, b: b };
}

// ---------- GET: /sumar ----------
function sumar() {
  try {
    var vals = obtenerValores();
    var url = base+"/sumar?a=" + encodeURIComponent(vals.a) + "&b=" + encodeURIComponent(vals.b);
    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) { mostrarSalida(data); })
      .catch(function (e) { mostrarSalida("Error: " + e); });
  } catch (e) { mostrarSalida("Error: " + e); }
}

// ---------- GET: /restar ----------
function restar() {
  try {
    var vals = obtenerValores();
    var url = base+"/restar?a=" + encodeURIComponent(vals.a) + "&b=" + encodeURIComponent(vals.b);
    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) { mostrarSalida(data); })
      .catch(function (e) { mostrarSalida("Error: " + e); });
  } catch (e) { mostrarSalida("Error: " + e); }
}

// ---------- POST: /multiplicar ----------
function multiplicar() {
  try {
    var vals = obtenerValores();
    fetch(base+"/multiplicar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vals)
    })
      .then(function (r) { return r.json(); })
      .then(function (data) { mostrarSalida(data); })
      .catch(function (e) { mostrarSalida("Error: " + e); });
  } catch (e) { mostrarSalida("Error: " + e); }
}

// ---------- POST: /dividir ----------
function dividir() {
  try {
    var vals = obtenerValores();
    fetch(base+"/dividir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vals)
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        // Si la API devolvió error de validación (división entre cero)
        if (data && data.detail) { mostrarSalida("⚠️ " + data.detail); }
        else { mostrarSalida(data); }
      })
      .catch(function (e) { mostrarSalida("Error: " + e); });
  } catch (e) { mostrarSalida("Error: " + e); }
}

// ---------- Health check al cargar ----------
function checkHealth() {
  var el = document.getElementById("health-msg");
  fetch(base+"/health")
    .then(function (r) { 
      if (!r.ok) { throw "API no disponible"; }
      return r.json();
    })
    .then(function (data) {
      el.textContent = (data && data.status === "ok") ? "API OK" : "API responde, revisar estado";
    })
    .catch(function () {
      el.textContent = "No se pudo conectar a la API (revisa Nginx/Uvicorn).";
      el.style.color = "#b91c1c";
    });
}

// Llama al health check sin addEventListener
checkHealth();
