function generarTabla() {
  const c = parseInt(document.getElementById("valorC").value, 10);
  const f = parseInt(document.getElementById("valorF").value, 10);

  if (Number.isNaN(c) || Number.isNaN(f) || c < 2 || c > 20 || f < 2 || f > 20) {
    alert("Las columnas y las filas deben ser números enteros entre 2 y 20.");
    return;
  }

  const contenedor = document.getElementById("contenedor-tabla");
  contenedor.innerHTML = "";

  const tabla = document.createElement("table");
  const tbody = document.createElement("tbody");

  const fila0 = document.createElement("tr");
  for (let j = 0; j <= c; j++) {
    const celda = document.createElement("td");
    if (j === 0) {
      celda.textContent = "";
      celda.style.backgroundColor = "#eee";
    } else {
      const input = document.createElement("input");
      input.type = "number";
      input.min = "0.00";
      input.max = "1.00";
      input.step = "0.01";
      input.placeholder = `P${j}`;
      celda.appendChild(input);
    }
    fila0.appendChild(celda);
  }
  tbody.appendChild(fila0);

  const fila1 = document.createElement("tr");
  for (let j = 0; j <= c; j++) {
    const celda = document.createElement("td");
    if (j === 0) {
      celda.textContent = "Acc/N";
      celda.style.backgroundColor = "#eee";
    } else {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = `N${j}`;
      celda.appendChild(input);
    }
    fila1.appendChild(celda);
  }
  tbody.appendChild(fila1);

  for (let i = 0; i < f; i++) {
    const fila = document.createElement("tr");
    for (let j = 0; j <= c; j++) {
      const celda = document.createElement("td");
      const input = document.createElement("input");
      if (j === 0) {
        input.type = "text";
        input.placeholder = `A${i + 1}`;
      } else {
        input.type = "number";
        input.step = "any";
      }
      celda.appendChild(input);
      fila.appendChild(celda);
    }
    tbody.appendChild(fila);
  }
  tabla.appendChild(tbody);
  contenedor.appendChild(tabla);

  document.getElementById("btnCalcular").style.display = "inline-block";
  document.getElementById("labelW").style.display = "inline-block";
  document.getElementById("valorW").style.display = "inline-block";

}
function comprobarProbabilidades() {
  const contenedor = document.getElementById("contenedor-tabla");
  const tabla = contenedor.querySelector("table");
  let esValido = true;
  const fila = tabla.rows[0];
  let suma = 0;
  const probabilidades = [];

  for (let i = 1; i < fila.cells.length; i++) {
    const celda = fila.cells[i];
    const input = celda.querySelector("input");
    const valor = input ? input.value : celda.textContent;
    const valorF = parseFloat(valor);

    if (isNaN(valorF) || valorF < 0.0 || valorF > 1.0) {
      alert("La probabilidad tiene que ser un número entre 0 y 1");
      return { esValido: false, probabilidades: [] };
    } else {
      suma += valorF;
      probabilidades.push(valorF);
    }
  }

  if (suma !== 1) {
    esValido = false;
    alert("La suma de las probabilidades debe dar 1.");
  }

  return { esValido, probabilidades };
}

function comprobarMatriz(){
  const matrizBij = [];
  const contenedor = document.getElementById("contenedor-tabla");
  const tabla = contenedor.querySelector("table");
  esValido=true;

  for (let i = 2; i < tabla.rows.length; i++) {
    const fila = tabla.rows[i];
    let filai = [];
  
    for (let j = 1; j < fila.cells.length; j++) {
      const celda = fila.cells[j];
      const input = celda.querySelector("input");
      const valor = input ? input.value : celda.textContent;
      const valorF = parseFloat(valor);
  
      if (isNaN(valorF) || (valorF % 1 !== 0 && valorF % 1 === 0)) {
        alert(`El valor de B(${i + 1},${j}) debe ser un número entero o con coma.`);
        return { esValido: false, matrizBij };
      }
  
      filai.push(valorF);
    }
  
    matrizBij.push(filai);
  }

  return { esValido, matrizBij };

}


function calcularMAXIMAX(matriz){
  MAXIMAX=matriz[0][0];
  posicion = 1;

  for (let i = 0; i < matriz.length; i++) {
    let fila = matriz[i];
    let mayor = fila[0];

    for (let j = 1; j < fila.length; j++) {
      let valor = fila[j];
      if (valor>mayor){
        mayor=valor;
      
      }
    }
    if (mayor> MAXIMAX) {
     MAXIMAX=mayor;
     posicion=i+1;
    }
  }
  return {posicion,MAXIMAX};
}



















function calcular() {
  const objtProb = comprobarProbabilidades();
  const objtMatriz = comprobarMatriz();

  if (objtProb.esValido && objtMatriz.esValido){
    resultadoMAXIMAX=calcularMAXIMAX(objtMatriz.matrizBij);
    console.log("La decisión a tomar es fila: " + (resultadoMAXIMAX.posicion + 2) + " con el valor MAXIMO de : " + resultadoMAXIMAX.MAXIMAX);
  }
  else {
    alert("No se pudo calcular los coeficientes");
  }



}

