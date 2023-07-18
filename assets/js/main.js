// Se obtiene información de la selección de las opciones del input
const btn = document.getElementById("btnCoin");

// Función para obtener valores de las monedas desde API externa
async function getApiInfo(coin) {
  try {
    // Se obtiene tipo de moneda interpolando la selección del input
    const data = await fetch(`https://mindicador.cl/api/${coin}`);
    // Se obtiene respuesta
    const json = await data.json();
    return json;
  } catch (error) {
    // En caso se error se mostrará mensaje en consola y en DOM
    console.log("Error located in: ", error);
    // Mensaje de error con renderizado en el DOM
    const divError = document.getElementById("divError");
    divError.innerHTML = `<div class="alert alert-danger" role="alert"> An error occurred, our engineers have been informed. Please try again in a few moments.</div>`;
  }
}

//Se agrega evento al botón y se define función anónima
btn.addEventListener("click", async () => {
  // Se captura selección del input de la divisa extranjera
  const coin = document.querySelector("#currencyInput").value;
  // Se captura información del input del valor de CLP
  const clpValue = Number(document.getElementById("clpInput").value);
  // Se captura sección del DOM a modificar con valor de la conversión de divisa
  const currencySum = document.getElementById("currencySum");
  // Se captura sección del DOM a renderizar con gráfico
  const canvas = document.getElementById("chartCurrency");

  // Función asincrona para obtener información de función asincrona getApiInfo
  const infoApi = await getApiInfo(coin);
  // Función para calcular valor de CLP en divisa selecionada
  const resultCoin = clpValue / infoApi.serie[0].valor;
  // Resultado de conversión de divisa con 2 decimales y nombre de divisa
  currencySum.innerHTML = `Resultado: ${resultCoin.toFixed(2)} ${coin.charAt(0).toUpperCase() + coin.slice(1)}`;
  // Se obtiene fechas desde la divisa para el gráfico
  // Se altera el orden para obtener desde mas antigua a mas reciente
  const dates = infoApi.serie.map((elem) => elem.fecha.slice(0, 10)).reverse();
  // Se obtiene valores de divisa
  // Se altera orden para que coincidan con fechas
  const currencyValue = infoApi.serie.map((elem) => elem.valor).reverse();
  let currencyResult = document.getElementById("currencyResult");
  currencyResult.style.backgroundColor = "white";

  // Función para generar y construir gráfico
  const chartCurrency = {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          // Se interpola para modificar primera letra de la divisa en Mayús
          label: `${coin.charAt(0).toUpperCase() + coin.slice(1)}`,
          backgroundColor: "blue",
          data: currencyValue,
        },
      ],
    },
  };
  // Se modifica DOM para cambiar fondo de div del gráfico a blanco
  let chartCoin = document.getElementById("chartCoin");
  chartCoin.style.backgroundColor = "white";
  new Chart(canvas, chartCurrency);
});
