function generarTabla() {
  const c = parseInt(document.getElementById("valorC").value, 10);
  const f = parseInt(document.getElementById("valorF").value, 10);

  if (Number.isNaN(c) || Number.isNaN(f) || c < 2 || c > 20 || f < 2 || f > 20) {
    alert("Las columnas y las filas deben ser números enteros entre 2 y 20.");
    return;
  }

  
  const contenedor = document.getElementById("contenedor-tabla");
  const contenedorResultado = document.getElementById("tablaResultados");


  contenedor.innerHTML = "";
  contenedorResultado.innerHTML="";

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
  document.getElementById("btnGenerarRandom").style.display = "inline-block";
  document.getElementById("labelW").style.display = "inline-block";
  document.getElementById("valorW").style.display = "inline-block";

}


function randomizar(){
  const contenedor = document.getElementById("contenedor-tabla");
  const tabla = contenedor.querySelector("table");
  for (let i = 2; i < tabla.rows.length; i++) {
    const fila = tabla.rows[i];
    let filai = [];
  
    for (let j = 1; j < fila.cells.length; j++) {
      const celda = fila.cells[j];
      const input = celda.querySelector("input");
      const random = (Math.random() * 200 - 100).toFixed(2); 
      input.value = random;
  
    }
  }
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
    if (isNaN(valorF) || valorF <= 0 || valorF >= 1) {
      alert("La probabilidad tiene que ser un número entre 0 y 1");
      return { esValido: false, probabilidades: [] };
    } else {
      suma += valorF;
      probabilidades.push(valorF);
    }
  }
  if (Math.abs(suma - 1) > 1e-5)  {
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

    for (let j = 0; j < fila.length; j++) {
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


function calcularMAXIMIN(matriz){
  MAXIMIN=-Infinity;
  posicion = 1;

  for (let i = 0; i < matriz.length; i++) {
    let fila = matriz[i];
    let min = +Infinity;

    for (let j = 0; j < fila.length; j++) {
      let valor = fila[j];
      if (valor<min){
        min=valor;
      
      }
    }
    if (min > MAXIMIN) {
     MAXIMIN=min;
     posicion=i+1;
    }
  }
  return {posicion,MAXIMIN};
}


function calcularHURWICZ(matriz,w){
  posicion = 1;
  hurwicz = -Infinity;

  for (let i = 0; i < matriz.length; i++) {
    let fila = matriz[i];

     min =Infinity;
     max =-Infinity;


     for (let j = 0; j < fila.length; j++) {
       let valor = fila[j];
       if (valor>max){
         max=valor;
      }
      if (valor<min){
        min=valor;
      }
    }
    h= w * max +  ((1-w)* min);
    if (h>hurwicz) {
       posicion=i+1;
       hurwicz=h;
    }
  }
  return {posicion,hurwicz};
}



function calcularSAVAGE(matriz) {
    const maxColumna = [];
    for (let j = 0; j < matriz[0].length; j++) {
      let max = -Infinity;
      for (let i = 0; i < matriz.length; i++) {
        if (matriz[i][j] > max) {
          max = matriz[i][j];
        }
      }
      maxColumna.push(max);
    }
  
    const matrizArrepentimiento = matriz.map((fila, i) =>
      fila.map((valor, j) => maxColumna[j] - valor)
    );

  
    const maximosPorFila = matrizArrepentimiento.map(fila =>
      Math.max(...fila)
    );
  

    const savage = Math.min(...maximosPorFila);
    const posicion = maximosPorFila.indexOf(savage) + 1; 
  
    return { posicion, savage };
  }


  function calcularBEIP(matriz, probabilidades) {
    let BEIP = 0;
    for (let j = 0; j < matriz[0].length; j++) {
        let maximoColumna = -Infinity;
        for (let i = 0; i < matriz.length; i++) {
            
            let valor = matriz[i][j];
            if (valor > maximoColumna) {
                maximoColumna = valor;
            }
        }
        BEIP += maximoColumna * probabilidades[j];
    }
    return BEIP;
}

function calcularBE(matriz, probabilidades) {
  let BEmaximo = -Infinity;
  let posicion = 1;
  
  for (let i = 0; i < matriz.length; i++) {
    let valorEsperado = 0;
    for (let j = 0; j < matriz[i].length; j++) {
      valorEsperado += matriz[i][j] * probabilidades[j];
    }
    if (valorEsperado > BEmaximo) {
      BEmaximo = valorEsperado;
      posicion = i + 1;
    }
  }
  
  return { BEmaximo, posicion };
}

function calcularVEIP(matriz, probabilidades) {
    let BEIP = calcularBEIP(matriz, probabilidades);
    let BE = calcularBE(matriz, probabilidades);
    return BEIP - BE.BEmaximo;
}





function calcular() {
  const objtProb = comprobarProbabilidades();
  const objtMatriz = comprobarMatriz();
  const probW = parseFloat(document.getElementById("valorW").value);

  if (isNaN(probW) || probW < 0 || probW > 1) {
    alert("La probabilidad tiene que estar entre 0 y 1");
    return;
  }
  
  if (objtProb.esValido && objtMatriz.esValido){
      const resultadoMAXIMAX = calcularMAXIMAX(objtMatriz.matrizBij);
      const resultadoMAXIMIN = calcularMAXIMIN(objtMatriz.matrizBij);
      const resultadoHurwicz = calcularHURWICZ(objtMatriz.matrizBij, probW);
      const resultadoSavage = calcularSAVAGE(objtMatriz.matrizBij);
      const resultadoBEIP = calcularBEIP(objtMatriz.matrizBij,objtProb.probabilidades);
      const resultadoVEIP = calcularVEIP(objtMatriz.matrizBij,objtProb.probabilidades);
      const mayorValorEsperado= calcularBE(objtMatriz.matrizBij,objtProb.probabilidades);
      const decisiones = [
        {
            metodo: "MAXIMAX",
            Accion: resultadoMAXIMAX.posicion ,
            valorDecision: resultadoMAXIMAX.MAXIMAX
        },
        {
            metodo: "MAXIMIN",
            Accion: resultadoMAXIMIN.posicion ,
            valorDecision: resultadoMAXIMIN.MAXIMIN
        },
        {
            metodo: "Hurwicz",
            Accion: resultadoHurwicz.posicion,
            valorDecision: resultadoHurwicz.hurwicz
        },
        {
            metodo: "Savage",
            Accion:resultadoSavage.posicion ,
            valorDecision: resultadoSavage.savage
        },
        {
          metodo: "MayorEsperanza",
          Accion:mayorValorEsperado.posicion ,
          valorDecision: mayorValorEsperado.BEmaximo
      },
  

    ];
    
    let tablaHTML = '<table border="1" style="border-collapse: collapse;">';
    tablaHTML += '<tr><th>Decisión Tomada</th><th>Valor de Decisión</th></tr>';
    
    decisiones.forEach(decision => {
        tablaHTML += `<tr>
                        <td>${decision.metodo} (Accion: ${decision.Accion})</td>
                        <td>${decision.valorDecision}</td>
                      </tr>`;
    });
    tablaHTML += `<tr>
    <td> BEIP:  </td>
    <td> ${resultadoBEIP} </td>
    </tr>`;

    tablaHTML += `<tr>
    <td> VEIP:  </td>
    <td> ${resultadoVEIP} </td>
    </tr>`;

    tablaHTML += '</table>';
    
    document.getElementById('tablaResultados').innerHTML = tablaHTML;


  }
  else {
    alert("No se pudo calcular los coeficientes");
  }



}

