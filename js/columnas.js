/*
------- Diseño de columnas -------
        Datos de entrada:
- Dimensiones de la columna:
  - base mm
  - altura mm
- Datos de los materiales:
  - (fc) MPa
  - (Fy) MPa
- Varillas:
  - No Barra Long
  - Diametro Barra Long
  - Area Barra Long
  - No barra Estribo
  - Diametro Barra Estribo
- Pmin=0.01
- Recubrimiento mm
  */

function limpiar() {
    document.getElementById('tabla_resultado').style.display = 'none';
    document.getElementById('diagrama_interaccion').style.display = 'none';
    document.getElementById('condiciones').style.display = 'none';
    document.getElementById('condicion_separacionF').innerHTML = '';
    document.getElementById('tabla_diagrama').style.display = 'none';
    document.getElementById('campos_cortante').style.display = 'none';
}
function borrar() {
    document.getElementById('b').value = '';
    document.getElementById('h').value = '';
}

const numerosVarilla = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '14', '18'];
const diametrosVarillas = [6.4, 9.5, 12.7, 15.9, 19.1, 22.2, 25.4, 28.7, 32.3, 35.8, 43, 57.3];
const areasVarillas = [32, 71, 129, 199, 284, 387, 510, 645, 819, 1006, 1452, 2581];

function cuantiaConcreto(b, h) {
    //Cuantía del concreto
    let Ac = b * h;
    return Ac;
}

function aceroMinimoRequerido(Pmin, Ac) {
    //Acero minimo que requiere
    let AsMin = Pmin * Ac;
    return AsMin;
}

function cantidadBarras(AsMin, areaBarraLong) {
    //Número (cantidad) de varillas
    let numero = AsMin / areaBarraLong;
    if (numero >= 0) {
        const numeroRedondeado = Math.ceil(numero);
        //si es par lo devuelve, sino le suma uno
        return numeroRedondeado % 2 === 0 ? numeroRedondeado : numeroRedondeado + 1;
    } else {
        //solo si fuera negativo
        const numeroRedondeado = Math.floor(numero);
        //si es par lo devuelve, sino le resta uno
        return numeroRedondeado % 2 === 0 ? numeroRedondeado : numeroRedondeado - 1;
    }
}

function as_Suministrado(areaBarraLong, cantidadBarras) {
    //Acero suministrado suficiente
    let As_suministrado = areaBarraLong * cantidadBarras;
    return As_suministrado;
}

function excesoAs(As_Suministrado, AsMin) {
    //Exceso de As
    let excAs = (As_Suministrado - AsMin) / AsMin * 100;
    return excAs;
}

function minimoExcesoCol(b, h, recubrimiento, diametroBarraEstribo, Ag) {
    //Debemos retornar el numero de varilla con el menor exceso
    let excesos = [];
    let noVars = [];
    let roMin, Ac, AsMin, NoVarillas, AsSuministrado, numeroVarilla, diametro, area, excesAs, separacion, separacionBase, separacionAltura;
    roMin = 0.01;
    for (i = 0; i < 7; i++) {
        numeroVarilla = i + 2;
        diametro = diametrosVarillas[i];
        area = areasVarillas[i];

        Ac = b * h;
        AsMin = roMin * Ac;
        NoVarillas = cantidadBarras(AsMin, area);
        AsSuministrado = area * NoVarillas;
        excesAs = excesoAs(AsSuministrado, AsMin);
        //if
        separacionBase = separacionBarrasBase(b, recubrimiento, diametroBarraEstribo, NoVarillas, diametro);
        separacionAltura = separacionBarrasAltura(h, recubrimiento, diametroBarraEstribo, NoVarillas, diametro);
        separacion = Math.max(separacionBase, separacionAltura);
        let separacionMaxima = 150;
        let separacionMinima = separacionMinimaVars(diametro, Ag);

        console.log(`No.${numeroVarilla} sep=${separacion.toFixed(2)} >= sepMin=${separacionMinima}, sepMax:${separacionMaxima}, cantVars:${NoVarillas}, AsMin:${AsMin}, asSUM:${AsSuministrado},exceso:${excesAs}`);

        if (separacion >= separacionMinima && separacion <= separacionMaxima) {

            //solo si cantidad de varillas: 4 o mayor
            if (NoVarillas >= 4) {
                excesos.push(Number(excesAs.toFixed(4)));
                noVars.push(numeroVarilla);
            }
        }
        //Debemos verificar que cumpla la separacion 

    }
    console.log(excesos);
    if (excesos.length > 0) {
        let minimoExc = Math.min(...excesos);
        console.log(excesos.indexOf(minimoExc));
        let posMenorExc = excesos.indexOf(minimoExc);
        let NoVarillaMenorExc = `No. ${noVars[posMenorExc]}`;
        return [minimoExc, NoVarillaMenorExc];
    } else {
        return [];
    }
}
console.log("Excesos--");
console.log(minimoExcesoCol(500, 500, 40, 9.5, 10));

function separacionBarrasBase(b, recubrimiento, dEstribo, NoVarillas, dLong) {
    //Separacion entre barras en la base
    switch (NoVarillas) {
        case 4:
            return (b - recubrimiento * 2 - 2 * dEstribo - 2 * dLong);
        case 6:
            return (b - recubrimiento * 2 - 2 * dEstribo - 2 * dLong);
        case 8:
            return (b - recubrimiento * 2 - 2 * dEstribo - 3 * dLong) / 2;
        case 10:
            return (b - recubrimiento * 2 - 2 * dEstribo - 4 * dLong) / 3;
        case 12:
            return (b - recubrimiento * 2 - 2 * dEstribo - 4 * dLong) / 3;
        default:
            return (b - recubrimiento * 2 - 2 * dEstribo - NoVarillas * dLong) / (NoVarillas - 1);
    }
}
function separacionBarrasAltura(h, recubrimiento, dEstribo, NoVarillas, dLong) {
    //Separacion entre barras en la altura
    switch (NoVarillas) {
        case 4:
            return (h - recubrimiento * 2 - 2 * dEstribo - 2 * dLong);
        case 6:
            return (h - recubrimiento * 2 - 2 * dEstribo - 3 * dLong) / 2;
        case 8:
            return (h - recubrimiento * 2 - 2 * dEstribo - 3 * dLong) / 2;
        case 10:
            return (h - recubrimiento * 2 - 2 * dEstribo - 3 * dLong) / 2;
        case 12:
            return (h - recubrimiento * 2 - 2 * dEstribo - 4 * dLong) / 3;
        default:
            return (h - recubrimiento * 2 - 2 * dEstribo - NoVarillas * dLong) / (NoVarillas - 1);
    }
}
function separacionMinimaVars(diametroVarLong, Ag) {
    let sep_min = Math.max(25, diametroVarLong, 1.33 * Ag);
    return sep_min;
}

////Datos para concreto
function numeroFibras(base) {
    let nFibras = base / 25;
    return nFibras;
}

function longitudFibra(h, nFibras) {
    let lFibra = h / nFibras;
    return lFibra;
}

function esConcreto(fc) {
    let Es_concreto = 3900 * Math.sqrt(fc);
    return Es_concreto;
}


////Datos para acero
//Es_acero=200000MPa

////////Diagrama de interaccion
///Tablas de CONCRETO
function fi_Concreto(c) {
    let Fi = 0.003 / c;
    return Fi;
}
function ai_Concreto(Ac, nFibras) {
    let Ai = Ac / nFibras;
    return Ai;
}
function yi_Concreto(h, lFibra, FIBRA) {
    let Yi;
    if (FIBRA <= 10) {
        Yi = h / 2 - (lFibra / 2 + lFibra * (FIBRA - 1));
    } else {
        Yi = -(h / 2 - (lFibra / 2 + lFibra * (20 - FIBRA)));

    }
    return Yi;
}
function ei_ConcretoAcero(Fi, c, h, Yi) {
    let Ei = Fi * (c - (h / 2 - Yi));
    return Ei;
}
function gi_Concreto(Ei, Es_concreto) {
    let Gi = Ei * Es_concreto;
    if (Gi > 21) {
        return 21;
    } else if (Gi < 0) {
        return 0;
    } else {
        return Gi;
    }
}
function pi_ConcretoAcero(Ai, Gi) {
    let Pi = (Ai * Gi) / 1000;
    return Pi;
}
function mi_ConcretoAcero(Pi, Yi) {
    let Mi = (Pi * Yi) / 1000;
    return Mi;
}
function sumar_total_lista(lista_Pi) {
    const total_Pi = lista_Pi.reduce((acumulador, numero) => acumulador + numero, 0);
    return total_Pi;
}
// function mi_total_ConcretoAcero(lista_Mi) {
//     const total_Mi = lista_Mi.reduce((acumulador, numero) => acumulador + numero, 0);
//     return total_Mi;
// }

///Tablas de ACERO
function x_Acero(recubrimiento, diametroEstribo, diametroBarraLong) {
    let x = recubrimiento + diametroEstribo + (diametroBarraLong / 2);
    return x;
}
//separacion entre barras=130
function distribucionVarillas(cantidadVarillas) {
    switch (cantidadVarillas) {
        case 4:
            return [2, 2];
        case 6:
            return [2, 2, 2];
        case 8:
            return [3, 2, 3];
        case 10:
            return [4, 2, 4];
        case 12:
            return [4, 2, 2, 4];
        default:
            return [];
    }
}
function ai_Acero(areaBarraLong, numeroVarillasEnFibra) {
    //podria recibir la cantidad de varillas para distribuirlas en fibras
    let Ai = areaBarraLong * numeroVarillasEnFibra;
    return Ai;
}
function yi_Acero(h, x, separacionVarillas) {
    //separacionVarillas puede ser cero para la primera
    let Yi = h / 2 - (x + separacionVarillas);
    return Yi;
}
//Es igual a la anterior 
//function ei_Acero(Fi,c,h,Yi){
//     let Ei=Fi*(c-(h/2-Yi));
//     return Ei;
// }
function gi_Acero(Ei, ES_acero) {
    let Gi = Ei * ES_acero;
    if (Gi > 420) {
        return 420;
    } else if (Gi < -420) {
        return -420;
    }
    else {
        return Gi;
    }
}
// function pi_Acero(Ai,Gi){
//     let Pi=(Ai*Gi)/1000;
//     return Pi;
// }
// function mi_Acero(Pi,Yi){
//     let Mi=(Pi*Yi)/1000;
//     return Mi;
// }
function pi_total_Acero(lista_Pi) {
    const total_Pi = lista_Pi.reduce((acumulador, numero) => acumulador + numero, 0);
    return total_Pi;
}
function mi_total_Acero(lista_Mi) {
    const total_Mi = lista_Mi.reduce((acumulador, numero) => acumulador + numero, 0);
    return total_Mi;
}

////Para llenar en la tabla principal:
function Pn_ConcAcero(Pi_concreto, Pi_acero) {
    let Pn = Pi_concreto + Pi_acero;
    return Pn;
}
function Mn_ConcAcero(Mi_concreto, Mi_acero) {
    let Mn = Mi_concreto + Mi_acero;
    return Mn;
}
function Intercepto(Ei_ultimo) {
    //funcion para encontrar Phi
    let intercepto = 0.65 + (Math.abs(Ei_ultimo) - 0.002) * (250 / 3);
    if (Math.abs(Ei_ultimo) <= 0.002) {
        return 0.65;
    } else if (Math.abs(Ei_ultimo) >= 0.007) {
        return 0.9;
    } else {
        return intercepto;
    }
}
function Phi_Pn_Mn(Phi, Pn) {
    let phiPN = Pn * Phi;
    return phiPN;
}

function verificar_datos_iniciales
    () {
    //boton.disabled=true;
    let boton = document.getElementById('btn_calcular1');
    let b = Number(document.getElementById("b").value); //
    let h = Number(document.getElementById("h").value); //
    let Fc = Number(document.getElementById("fc").value); //
    let Fy = Number(document.getElementById("fy").value); //
    //    let ag = Number(document.getElementById("ag").value);
    let recubrimiento = Number(document.getElementById("recubrimiento").value); //
    let numeroVarilla = Number(document.getElementById("numeroVarilla").value); //
    if (b == '' || h == '' || Fc == '' || Fy == '' || recubrimiento == '' || numeroVarilla == '') {
        console.log(b, h, Fc, Fy, ag, recubrimiento, numeroVarilla);
    } else {
        console.log(b, h, Fc, Fy, ag, recubrimiento, numeroVarilla);
    }

}

function validarValorMinimo(id, min, msgErr) {
    let boton = document.getElementById('btn_calcular1');

    let mensajeError = document.getElementById(msgErr);

    let input = document.getElementById(id);
    let valor = input.value;
    let firstChar = (valor[0]);

    console.log("FirstChar", firstChar);

    console.log("Ingreso", "Texto", valor.charCodeAt(0), "-", typeof (valor[0]), "Valor", valor);
    if (id == 'ag') {
        if (firstChar === "0") {
            input.value = "";
            valor = input.value;
            input.focus();
            console.log("Valor no permitido", firstChar, "valor=", valor);
            boton.disabled = true;
        }
    } else if (id == 'b' || id == 'h') {
        if (firstChar === "0" || firstChar == "1") {
            input.value = "";
            valor = input.value;
            input.focus();
            console.log("Valor no permitido", firstChar, "valor=", valor);
            boton.disabled = true;
        }
    }
    if (id == 'fc') {
        if (isNaN(valor) || valor <= min) {
            mensajeError.textContent = "Ingrese el valor de resistencia deseado";
        } else {
            mensajeError.textContent = "";
        }
    }
    // else if (id == 'muSup' || id == 'muInf' || id == 'Vu') {
    //     if (isNaN(valor) || valor <= min) {
    //         mensajeError.textContent = "Ingrese un número corecto, mayor a " + min;
    //     } else {
    //         mensajeError.textContent = "";
    //     }
    // }
    else if (isNaN(valor) || valor < min) {
        mensajeError.textContent = "Ingrese un número mayor o igual a " + min;
        // input.value = "";
        // input.focus();
        boton.disabled = true;
    } else {
        mensajeError.textContent = "";
        boton.disabled = false;
    }
    //    verificar_datos_iniciales
    //       ();
}

function validarTeclaMenos(event, id) {
    var tecla = event.key;
    var input = document.getElementById(id);
    var valor = input.value;
    if (tecla === "-" || tecla === "+") {
        event.preventDefault();
        //boton.disabled = true;
    }
    //    verificar_datos_iniciales
    //       ();
}

function validarValorPositivo(id, msgErr) {
    let mensajeError = document.getElementById(msgErr);

    var input = document.getElementById(id);
    var valor = parseFloat(input.value);
    if (isNaN(valor) || valor <= 0 || valor == '') {
        mensajeError.textContent = "Ingrese un número mayor a 0";
        //input.value = "";
        //input.focus();
        //boton.disabled = true;
    } else {
        mensajeError.textContent = "";
        //boton.disabled = false;
    }
    //    verificar_datos_iniciales
    //       ();

}
function actualizar_fc(opcion) {
    // Al seleccionar el numero en fc se autocompleta el campo del formulario
    document.getElementById("fc").value = opcion.value;
}



function actualizar_varilla(opcion) {
    // Al seleccionar el numero de varilla muestra su diametro y area
    // console.log("Se eligio varilla No", opcion.value, typeof (opcion.value));
    for (i = 0; i < numerosVarilla.length; i++) {
        if (opcion.value == numerosVarilla[i]) {
            console.log("No." + numerosVarilla[i] + " diametro " + diametrosVarillas[i] + " area " + areasVarillas[i]);
            document.getElementById("diametro").value = diametrosVarillas[i];
            document.getElementById("area").value = areasVarillas[i];
        }
    }
}
function actualizar_varilla_estribo(opcion) {
    // console.log("Se eligio barra estribo No", opcion.value, typeof (opcion.value));
    for (i = 0; i < numerosVarilla.length; i++) {
        if (opcion.value == numerosVarilla[i]) {
            console.log("No." + numerosVarilla[i] + " diametro " + diametrosVarillas[i] + " area " + areasVarillas[i]);
            document.getElementById("diametro_estribo").value = diametrosVarillas[i];
            document.getElementById("area_estribo").value = areasVarillas[i];
        }
    }
}

function validarBaseAltura() {
    let b = Number(document.getElementById('b').value);
    let h = Number(document.getElementById('h').value);
    let boton = document.getElementById('btn_calcular1');
    if (b < 250) {
        console.log('NOTA: No puede ser menor a 25cm');
        document.getElementById("base").textContent = "(*) NOTA: Tener en cuenta el valor de la base y altura";
        document.getElementById("bh").innerHTML = '<h3 id="bh" class="text-danger">La base o la altura de la columna debe ser mínimo 250mm</h3>';
        boton.disabled = true;
        if (h >= 250) {
            document.getElementById("base").textContent = "";
            document.getElementById("bh").innerHTML = '';
            boton.disabled = false;

        }
    }
    if (h < 250) {
        console.log('NOTA: No puede ser menor a 25cm');
        document.getElementById("base").textContent = "(*) NOTA: Tener en cuenta el valor de la base y altura";
        document.getElementById("bh").innerHTML = '<h3 id="bh" class="text-danger">La base o la altura de la columna debe ser mínimo 250mm</h3>';
        boton.disabled = true;

        if (b >= 250) {
            document.getElementById("base").textContent = "";
            document.getElementById("bh").innerHTML = '';
            boton.disabled = false;

        }
    }
}
function calcularColumna() {
    // console.log("Vamos a calcular columnas");

    document.getElementById("base").textContent = '';
    document.getElementById("bh").textContent = '';
    //    document.getElementById("max_ag").textContent = '';
    document.getElementById("resultado").innerHTML = '';
    // document.getElementById("resultadoFinal").style.display = 'none';
    ///Ocultar formulario de resistencia
    document.getElementById('diagrama_interaccion').style.display = 'none';
    document.getElementById('campos_cortante').style.display = 'none';
    document.getElementById("condicion_separacionF").textContent = '';

    document.getElementById('tabla_diagrama').style.display = 'none';

    let b, h, Fc, Fy, ag, recubrimiento, numeroVarilla, diametro, area, numeroBarraEstribo, diametroBarraEstribo;
    // Obtiene el valor de los inputs con los id
    b = Number(document.getElementById("b").value); //
    h = Number(document.getElementById("h").value); //
    Fc = Number(document.getElementById("fc").value); //
    Fc1 = Number(document.getElementById("fc1").value); //
    Fy = Number(document.getElementById("fy").value); //
    ag = Number(document.getElementById("ag").value);
    recubrimiento = Number(document.getElementById("recubrimiento").value); //
    numeroVarilla = Number(document.getElementById("numeroVarilla").value); //
    diametro = Number(document.getElementById("diametro").value); //
    area = Number(document.getElementById("area").value); //
    numeroBarraEstribo = Number(document.getElementById("numeroVarillaEstribo").value); //
    diametroBarraEstribo = Number(document.getElementById("diametro_estribo").value); //

    console.log("Datos ingresados=> ", b, h, Fc, Fy, recubrimiento, numeroVarilla, diametro, area, diametroBarraEstribo);

    if (b == '' || h == '') {
        console.log("Hay campos vacíos");
        document.getElementById("bh").innerHTML = '<h3 class="text-danger">Debe ingresar base y altura</h3>';
        document.getElementById("base").textContent = '(*) Complete los campos vacios';
    }
    // else if (b < 200) {
    //     console.log('NOTA: No puede ser menor a 200mm');
    //     document.getElementById("base").textContent = "(*) NOTA: Tener en cuenta el valor de la base";
    //     document.getElementById("bh").innerHTML = '<h3 id="bh" class="text-danger">La base de la columna No puede ser menor a 200mm</h3>';
    // }
    // else if (h < 0) {
    //     console.log('NOTA: No puede ser negativo');
    //     document.getElementById("base").textContent = "(*) NOTA: Tener en cuenta el valor de la altura";
    //     document.getElementById("bh").innerHTML = '<h3 id="bh" class="text-danger">Los valores no pueden ser negativos</h3>';
    // }
    else if (Fc <= 0 && Fc != '') {
        console.log("Hay campos incorrectos");
        document.getElementById("val_fc").innerHTML = '<h3 class="text-danger">La resistencia a la compresión no puede ser negativa o cero</h3>';
        document.getElementById("base").textContent = '(*) Hay campos incorrectos';
    }

    else if (ag == '') {
        console.log("Hay campos vacíos");
        document.getElementById("max_ag").innerHTML = '<h3 class="text-danger">Debe ingresar un tamaño máximo</h3>';
        document.getElementById("base").textContent = '(*) Complete los campos vacios';
    }
    else if (ag < 10) {
        console.log("Hay campos incorrectos");
        document.getElementById("max_ag").innerHTML = '<h3 class="text-danger">Debe ingresar un tamaño máximo mayor a 10 mm</h3>';
        document.getElementById("base").textContent = '(*) Complete los campos incorrectos';
    }

    else {
        if (Fc == '') {
            Fc = Fc1;
            console.log("Valor de FC: ", Fc);
            document.getElementById("fc").value = Fc;
            // console.log("Hay campos vacíos");
            // document.getElementById("val_fc").innerHTML = '<h3 class="text-danger">Se necesita la resistencia a la compresión</h3>';
            // document.getElementById("base").textContent = '(*) Complete los campos vacios';
        }

        let roMin, Ac, AsMin, NoVarillas, As_Suministrado, excesAs, separacion, separacionBase, separacionAltura, separacionMaxima;
        roMin = 0.01;
        separacionMaxima = 150;
        let sep_minima = separacionMinimaVars(diametro, ag);

        Ac = cuantiaConcreto(b, h);
        console.log("Cuantia minima roMin=>", roMin);

        AsMin = aceroMinimoRequerido(roMin, Ac);
        console.log("Acero Minimo =>", AsMin);

        NoVarillas = cantidadBarras(AsMin, area);
        console.log("No Varillas =>", NoVarillas);

        As_Suministrado = as_Suministrado(area, NoVarillas);
        console.log("As Suministrado =>", As_Suministrado);

        excesAs = excesoAs(As_Suministrado, AsMin);
        console.log("Exceso As =>", excesAs);

        separacionBase = separacionBarrasBase(b, recubrimiento, diametroBarraEstribo, NoVarillas, diametro);
        separacionAltura = separacionBarrasAltura(h, recubrimiento, diametroBarraEstribo, NoVarillas, diametro);
        separacion = Math.max(separacionBase, separacionAltura);
        console.log('Separación =>', separacion, 'mm', separacionBase, separacionAltura);

        document.getElementById('asmin_mayor').style.display = 'block';

        document.getElementById("asmin_mayor").innerHTML = '<div class="resultado text-center"><h3>NOTA: Elija como varilla supuesta aquella que tenga un menor porcentaje de exceso o desperdicio de acero, pero que cumpla con la separación mínima</div>';

        document.getElementById('tabla_resultado').style.display = 'block';
        document.getElementById("resultado").innerHTML = `
        <h2>Valores calculados</h2>
              
                 <table class="peque">
                    <thead>
                       <tr>
                          <th scope="col">Dato</th>
                          <th scope="col">Valor</th>
                          <th scope="col">Unidades</th>
                       </tr>
                    </thead>
                    <tbody>
                       <tr>
                          <td>Pmin</td>
                          <td>${roMin.toFixed(4)}</td>
                          <td>&nbsp;</td>
                       </tr>
                       <tr>
                          <td>Recubrimiento</td>
                          <td>${recubrimiento.toFixed(2)}</td>
                          <td>mm</td>
                       </tr>
                       <tr>
                          <td>Ac</td>
                          <td>${Ac.toFixed(2)}</td>
                          <td>mm<sup>2</sup></td>
                       </tr>
                       
                       <tr>
                          <td>AsMin</td>
                          <td>${AsMin.toFixed(2)}</td>
                          <td>mm<sup>2</sup></td>
                       </tr>
                       <tr>
                          <td>Cantidad de Varillas</td>
                          <td>${NoVarillas}</td>
                          <td>und</td>
                       </tr>
                       <tr>
                          <td>No. Varilla</td>
                          <td>No. ${numeroVarilla}</td>
                          <td>-</td>
                       </tr>
                       <tr>
                          <td>As-suministrado</td>
                          <td>${As_Suministrado}</td>
                          <td>mm<sup>2</sup></td>
                       </tr>
                       <tr>
                          <td>Exceso de As</td>
                          <td>${excesAs.toFixed(2)}</td>
                          <td>%</td>
                       </tr>
                       <tr>
                          <td>Separación entre varillas (BASE)</td>
                          <td>${separacionBase.toFixed(2)}</td>
                          <td>mm</td>
                       </tr>
                       <tr>
                          <td>Separación entre varillas (ALTURA)</td>
                          <td>${separacionAltura.toFixed(2)}</td>
                          <td>mm</td>
                       </tr>
                       <tr>
                          <td>Separación mínima</td>
                          <td>${sep_minima.toFixed(2)}</td>
                          <td>mm</td>
                       </tr>
                       <tr>
                          <td>Separación máxima</td>
                          <td>${separacionMaxima.toFixed(2)}</td>
                          <td>mm</td>
                       </tr>
                       
                    </tbody>
                 </table>
              `;
        ///Recomendar el menor exceso

        if (minimoExcesoCol(b, h, recubrimiento, diametroBarraEstribo, ag).length > 0) {
            let menorExceso = minimoExcesoCol(b, h, recubrimiento, diametroBarraEstribo, ag)[0];
            let varMenorExceso = minimoExcesoCol(b, h, recubrimiento, diametroBarraEstribo, ag)[1];
            console.log("Menor Exc", menorExceso);

            document.getElementById('exceso').style.display = 'block';
            document.getElementById('exceso').innerHTML = `<h3>Se recomienda utilizar la varilla ${varMenorExceso} ya que se obtiene un menor exceso de ${menorExceso.toFixed(2)}%<h3/>`;
        } else {
            document.getElementById('exceso').style.display = 'none';
        }
        //Verificar condicion
        document.getElementById('condiciones').style.display = 'block';
        if(NoVarillas<4){
            document.getElementById('cumpleNoVarilla').innerHTML=`La norma NSR-10 recomienda como cantidad mínima 4 varillas longitudinales y en este caso <b style="color:rgba(255,0,0,0.8);"> No cumple </b>&nbsp;`;
        }else{
            document.getElementById('cumpleNoVarilla').innerHTML=``;
        }
        if (separacion >= sep_minima && separacion <= separacionMaxima) {
            console.log(`Si cumple separacion entre varillas (${separacion}mm) >= sepMinima ${sep_minima} y ${separacion}<= separación máxima (${separacionMaxima}`);
            document.getElementById("condicion_separacionF").innerHTML = `<b style="color:rgba(0,255,0,1);">Si cumple</b>&nbsp; la condición: separación entre varillas (${separacion.toFixed(2)}mm) >= separación
              mínima (${sep_minima.toFixed(2)}mm) y ${separacion.toFixed(2)}mm <= separación máxima (${separacionMaxima}mm)`;
            document.getElementById('diagrama_interaccion').style.display = 'block';
            document.getElementById('boton_gra').disabled = false;
        }
        else {
            console.log(`No cumple separacion ${separacion} >= sepMinima ${separacionMaxima}`);
            if (separacion < sep_minima) {
                document.getElementById("condicion_separacionF").innerHTML = `<b style="color:rgba(255,0,0,0.8);"> No cumple </b>&nbsp; la condición: separacion entre varillas (${separacion.toFixed(2)}mm) < separación
            mínima (${sep_minima.toFixed(2)}mm).`;
            } else if (separacion > separacionMaxima) {
                document.getElementById("condicion_separacionF").innerHTML = `<b style="color:rgba(255,0,0,0.8);"> No cumple </b>&nbsp; la condición: separacion entre varillas (${separacion.toFixed(2)}mm) <= separación
                máxima (${separacionMaxima.toFixed(2)}mm).`;
            } else {
                alert("Separación fuera de rango");
            }

        }

        ////Datos para concreto
        let numFibras = Math.round(b / 20);
        let longFibra = h / numFibras;
        let es_concreto = esConcreto(Fc);

        ////Datos para acero
        let es_acero = 200000;

        document.getElementById("nfibras").innerHTML = numFibras;
        document.getElementById("lfibra").innerHTML = longFibra;
        document.getElementById("es_concreto").innerHTML = es_concreto.toFixed(2);
        document.getElementById("es_acero").innerHTML = es_acero;
        document.getElementById("recub").innerHTML = recubrimiento;
        document.getElementById("dvlong").innerHTML = diametro;
        document.getElementById("avlong").innerHTML = area;
        document.getElementById("destribo").innerHTML = diametroBarraEstribo;

        let areaBarraEstribo = Number(document.getElementById("area_estribo").value);
        document.getElementById('campos_cortante').style.display = 'block';
        document.getElementById('formulas_cortante').style.display = 'none';
        document.getElementById('rec_cortante').innerHTML = recubrimiento;
        document.getElementById('noVar_cortante').innerHTML = numeroVarilla;
        document.getElementById('areaVar_cortante').innerHTML = area;
        document.getElementById('diametroVar_cortante').innerHTML = diametro;
        document.getElementById('cantVar_cortante').innerHTML = NoVarillas;
        document.getElementById('noVarEstribo').innerHTML = numeroBarraEstribo;
        document.getElementById('diamEstribo').innerHTML = diametroBarraEstribo;
        document.getElementById('areaEstribo').innerHTML = areaBarraEstribo;
    }

}