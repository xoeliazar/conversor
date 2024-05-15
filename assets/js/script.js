//Variable de input CLP
const inputCLP = document.getElementById("inputCLP");
//Variable de input vacío
const mensaje = document.getElementById("mensaje");
//Variable de select vacío
const mensaje2 = document.getElementById("mensaje2");
//Variable de select moneda
const selectMoneda = document.getElementById("moneda");
//Boton de conversión
const btnConvertir = document.getElementById("btn");
//Variable que muestra la conversión
const resultado = document.getElementById("resultado");
//Variable que muestra la gráfica
const myChart = document.getElementById("grafico");
let chart;

// Realizar una solicitud para obtener los tipos de cambio desde mindicador.cl

async function getMoneda() {
  const endpoint = "https://mindicador.cl/api/";
  try {
    const res = await fetch(endpoint);
    const dataMonedas = await res.json();
    const montoCLP = Number(inputCLP.value);
    const monedaTipo = selectMoneda.value;
    if (montoCLP == "" && monedaTipo == "") {
      let alerta = `<span class='alertaMensaje'>Debes agregar un valor valido</span>`;
      let alerta2 = `<span class='alertaMensaje'>Debes seleccionar una moneda</span>`;
      mensaje2.innerHTML = alerta2;
      mensaje.innerHTML = alerta;
    } else if (montoCLP <= 0) {
      let alerta = `<span class='alertaMensaje'>Debes agregar un valor valido</span>`;
      mensaje.innerHTML = alerta;
      mensaje2.innerHTML = "";
    } else if (monedaTipo !== "" && montoCLP == "") {
      let alerta = `<span class='alertaMensaje'>Debes agregar un valor valido</span>`;
      mensaje2.innerHTML = "";
      mensaje.innerHTML = alerta;
    } else if (monedaTipo == "" && montoCLP >= 0) {
      let alerta2 = `<span class='alertaMensaje'>Debes seleccionar una moneda</span>`;
      mensaje2.innerHTML = alerta2;
      mensaje.innerHTML = "";
    } else {
      const operacion = (montoCLP / dataMonedas[monedaTipo].valor).toFixed(2);
      // Mostrar el resultado en el DOM
      resultado.innerHTML = `Resultado: $${operacion} ${monedaTipo.toUpperCase()}`;
      mensaje.innerHTML = "";
      mensaje2.innerHTML = "";
      grafico(monedaTipo, dataMonedas[monedaTipo].nombre);

      inputCLP.value = "";
      selectMoneda.selectedIndex = 0;
    }
  } catch (error) {
    console.error("Error al obtener la tasa de cambio", error);
    const mensajeError = document.getElementById("errorCatch");
    if (mensajeError) {
      mensajeError.innerHTML =
        "Error al obtener la tasa de cambio: " + error.message;
    }
  }
}

btnConvertir.addEventListener("click", function () {
  getMoneda();
});

//Gráfica
const grafico = async (variable, nombreMoneda) => {
  const res = await fetch(`https://mindicador.cl/api/${variable}`);
  const data = await res.json();

  let series = data.serie.slice(0, 9);
  let fechas = series.map((item) => {
    return new Date(item.fecha).toLocaleDateString("en-GB");
  });
  let valores = series.map((item) => {
    return item.valor;
  });

  const xValues = fechas.reverse();
  const yValues = valores.reverse();

  if (chart) {
    chart.destroy();
  }
  // Crear el gráfico utilizando Chart.js
  chart = new Chart("grafico", {
    type: "line",
    data: {
      labels: xValues,
      datasets: [
        {
          label: nombreMoneda,
          fill: false,
          lineTension: 0,
          backgroundColor: "rgb(49,210,242)",
          borderColor: "rgba(108,117,125)",
          data: yValues,
        },
      ],
    },
  });
};
