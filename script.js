/* =========================
   VARIABLES FÁCILES DE CAMBIAR
========================= */

// Cambia este precio cuando definas el precio real del paquete
let precioHamburguesa = 85;

// Precio fijo de la Chivacola
let precioChivacola = 23;

// Número de WhatsApp en formato internacional para México
let numeroWhatsApp = "525587925833";

// Datos de transferencia
let bancoTransferencia = "BBVA";
let cuentaTransferencia = "012854015496767584";
let titularTransferencia = "Mario Imanol Jimenez Bibiano";

/* =========================
   ELEMENTOS DEL HTML
========================= */

const cantidadHamburguesas = document.getElementById("cantidadHamburguesas");

const agregarChivacola = document.getElementById("agregarChivacola");
const cantidadChivacolas = document.getElementById("cantidadChivacolas");

const personalizaciones = document.querySelectorAll(".personalizacion");
const notas = document.getElementById("notas");

const nombre = document.getElementById("nombre");
const telefono = document.getElementById("telefono");

const metodoEntrega = document.getElementById("metodoEntrega");
const domicilioCampos = document.getElementById("domicilioCampos");
const direccion = document.getElementById("direccion");
const referencias = document.getElementById("referencias");

const metodoPago = document.getElementById("metodoPago");
const pagoConCampo = document.getElementById("pagoConCampo");
const pagoCon = document.getElementById("pagoCon");

const transferenciaCampo = document.getElementById("transferenciaCampo");
const momentoTransferencia = document.getElementById("momentoTransferencia");

const resumenHamburguesas = document.getElementById("resumenHamburguesas");
const resumenChivacolas = document.getElementById("resumenChivacolas");
const resumenPersonalizacion = document.getElementById("resumenPersonalizacion");
const resumenNotas = document.getElementById("resumenNotas");
const resumenPago = document.getElementById("resumenPago");
const totalPedido = document.getElementById("totalPedido");

const precioHamburguesaTexto = document.getElementById("precioHamburguesaTexto");
const precioChivacolaTexto = document.getElementById("precioChivacolaTexto");

const btnEnviarWhatsApp = document.getElementById("btnEnviarWhatsApp");
const alertPlaceholder = document.getElementById("alertPlaceholder");

/* =========================
   FUNCIONES DE APOYO
========================= */

// Formato de dinero en pesos mexicanos
function formatoDinero(cantidad) {
  return `$${cantidad.toFixed(2)} MXN`;
}

// Obtiene una cantidad válida
function obtenerCantidad(input) {
  const valor = parseInt(input.value, 10);

  if (isNaN(valor) || valor < 0) {
    return 0;
  }

  return valor;
}

// Obtiene las personalizaciones seleccionadas
function obtenerPersonalizaciones() {
  const seleccionadas = [];

  personalizaciones.forEach((opcion) => {
    if (opcion.checked) {
      seleccionadas.push(opcion.dataset.label);
    }
  });

  return seleccionadas;
}

// Muestra alerta con Bootstrap
function mostrarAlerta(mensaje, tipo = "danger") {
  alertPlaceholder.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show shadow-sm" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>
  `;

  alertPlaceholder.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

// Calcula total del pedido
function calcularTotal() {
  const hamburguesas = obtenerCantidad(cantidadHamburguesas);
  const chivacolas = obtenerCantidad(cantidadChivacolas);

  return (hamburguesas * precioHamburguesa) + (chivacolas * precioChivacola);
}

/* =========================
   ACTUALIZAR RESUMEN
========================= */

function actualizarResumen() {
  const hamburguesas = obtenerCantidad(cantidadHamburguesas);
  const chivacolas = obtenerCantidad(cantidadChivacolas);
  const opciones = obtenerPersonalizaciones();
  const notasTexto = notas.value.trim();

  resumenHamburguesas.textContent = hamburguesas;
  resumenChivacolas.textContent = chivacolas;

  resumenPersonalizacion.textContent =
    opciones.length > 0 ? opciones.join(", ") : "Ninguna";

  resumenNotas.textContent =
    notasTexto !== "" ? notasTexto : "Sin notas adicionales";

  if (metodoPago.value === "Transferencia") {
    resumenPago.textContent = `Transferencia - ${momentoTransferencia.value}`;
  } else {
    resumenPago.textContent = pagoCon.value.trim()
      ? `Efectivo - paga con ${pagoCon.value.trim()}`
      : "Efectivo";
  }

  totalPedido.textContent = formatoDinero(calcularTotal());
}

/* =========================
   MOSTRAR / OCULTAR CAMPOS
========================= */

function actualizarCampoChivacola() {
  if (agregarChivacola.checked) {
    cantidadChivacolas.disabled = false;

    if (obtenerCantidad(cantidadChivacolas) === 0) {
      cantidadChivacolas.value = 1;
    }
  } else {
    cantidadChivacolas.value = 0;
    cantidadChivacolas.disabled = true;
  }

  actualizarResumen();
}

function actualizarMetodoEntrega() {
  if (metodoEntrega.value === "Entrega a domicilio") {
    domicilioCampos.classList.remove("d-none");
  } else {
    domicilioCampos.classList.add("d-none");
  }

  actualizarResumen();
}

function actualizarMetodoPago() {
  if (metodoPago.value === "Efectivo") {
    pagoConCampo.classList.remove("d-none");
    transferenciaCampo.classList.add("d-none");
  } else {
    pagoConCampo.classList.add("d-none");
    transferenciaCampo.classList.remove("d-none");
    pagoCon.value = "";
  }

  actualizarResumen();
}

/* =========================
   VALIDACIONES
========================= */

function validarPedido() {
  const nombreCliente = nombre.value.trim();
  const direccionCliente = direccion.value.trim();

  const hamburguesas = obtenerCantidad(cantidadHamburguesas);
  const chivacolas = obtenerCantidad(cantidadChivacolas);

  if (nombreCliente === "") {
    mostrarAlerta("Por favor escribe tu nombre para hacer el pedido.");
    return false;
  }

  if (
    metodoEntrega.value === "Entrega a domicilio" &&
    direccionCliente === ""
  ) {
    mostrarAlerta("Por favor escribe la dirección de entrega.");
    return false;
  }

  if (hamburguesas === 0 && chivacolas === 0) {
    mostrarAlerta("Agrega al menos una hamburguesa o una Chivacola.");
    return false;
  }

  return true;
}

/* =========================
   ENVIAR PEDIDO POR WHATSAPP
========================= */

function enviarPedidoWhatsApp() {
  if (!validarPedido()) {
    return;
  }

  const hamburguesas = obtenerCantidad(cantidadHamburguesas);
  const chivacolas = obtenerCantidad(cantidadChivacolas);
  const opciones = obtenerPersonalizaciones();

  const nombreCliente = nombre.value.trim();
  const telefonoCliente = telefono.value.trim() || "No especificado";

  const entrega = metodoEntrega.value;

  const direccionCliente =
    entrega === "Entrega a domicilio"
      ? direccion.value.trim()
      : "Recoger pedido";

  const referenciasCliente =
    entrega === "Entrega a domicilio"
      ? referencias.value.trim() || "Sin referencias"
      : "No aplica";

  const pago = metodoPago.value;

  const pagoDetalle =
    pago === "Efectivo"
      ? pagoCon.value.trim() || "No especificado"
      : momentoTransferencia.value;

  const notasTexto = notas.value.trim() || "Sin notas adicionales";
  const total = calcularTotal();

  // Armamos el pedido en líneas para que se vea ordenado
  const pedidoLineas = [];

  if (hamburguesas > 0) {
    pedidoLineas.push(
      `* ${hamburguesas} Hamburguesa(s) Sirloin al Carbón con papas`
    );
  }

  if (opciones.length > 0) {
    opciones.forEach((opcion) => {
      pedidoLineas.push(`* ${opcion}`);
    });
  }

  if (chivacolas > 0) {
    pedidoLineas.push(`* ${chivacolas} Chivacola(s)`);
  }

  let datosTransferencia = "";

  if (pago === "Transferencia") {
    datosTransferencia = `
Datos para transferencia:
Banco: ${bancoTransferencia}
Cuenta/CLABE: ${cuentaTransferencia}
Nombre: ${titularTransferencia}
Momento de transferencia: ${momentoTransferencia.value}
`;
  }

  const mensaje = `Hola, quiero hacer un pedido en La Hamburguesita:

Nombre: ${nombreCliente}
Teléfono: ${telefonoCliente}
Entrega: ${entrega}
Dirección: ${direccionCliente}
Referencias: ${referenciasCliente}

Método de pago: ${pago}
Detalle de pago: ${pagoDetalle}
${datosTransferencia}
Pedido:
${pedidoLineas.join("\n")}

Notas: ${notasTexto}

Total aproximado: ${formatoDinero(total)}`;

  // encodeURIComponent sirve para que WhatsApp respete acentos, espacios y saltos de línea
  const mensajeCodificado = encodeURIComponent(mensaje);

  const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;

  window.open(urlWhatsApp, "_blank");
}

/* =========================
   EVENTOS
========================= */

cantidadHamburguesas.addEventListener("input", actualizarResumen);

agregarChivacola.addEventListener("change", actualizarCampoChivacola);
cantidadChivacolas.addEventListener("input", actualizarResumen);

personalizaciones.forEach((opcion) => {
  opcion.addEventListener("change", actualizarResumen);
});

notas.addEventListener("input", actualizarResumen);

metodoEntrega.addEventListener("change", actualizarMetodoEntrega);

metodoPago.addEventListener("change", actualizarMetodoPago);

pagoCon.addEventListener("input", actualizarResumen);

momentoTransferencia.addEventListener("change", actualizarResumen);

btnEnviarWhatsApp.addEventListener("click", enviarPedidoWhatsApp);

/* =========================
   INICIALIZAR PÁGINA
========================= */

precioHamburguesaTexto.textContent = formatoDinero(precioHamburguesa);
precioChivacolaTexto.textContent = formatoDinero(precioChivacola);

actualizarCampoChivacola();
actualizarMetodoEntrega();
actualizarMetodoPago();
actualizarResumen();