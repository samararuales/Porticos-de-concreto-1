const numerosVarilla = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '14', '18'];
const diametrosVarillas = [6.4, 9.5, 12.7, 15.9, 19.1, 22.2, 25.4, 28.7, 32.3, 35.8, 43, 57.3];
const areasVarillas = [32, 71, 129, 199, 284, 387, 510, 645, 819, 1006, 1452, 2581];

let boton = document.getElementById("btn_calcular1");
function verificar_datos_iniciales
   () {
   //boton.disabled=true;
   let b = Number(document.getElementById("b").value); //
   let h = Number(document.getElementById("h").value); //
   let Fc = Number(document.getElementById("fc").value); //
   let Fy = Number(document.getElementById("fy").value); //
   let ag = Number(document.getElementById("ag").value);
   let recubrimiento = Number(document.getElementById("recubrimiento").value); //
   let numeroVarilla = Number(document.getElementById("numeroVarilla").value); //
   if (b == '' || h == '' || Fc == '' || Fy == '' || ag == '' || recubrimiento == '' || numeroVarilla == '') {
      //boton.disabled=true;
      console.log("Boton disabled=", boton.disabled, b, h, Fc, Fy, ag, recubrimiento, numeroVarilla);
   } else {
      //boton.disabled=false;
      console.log("Boton disabled=", boton.disabled, b, h, Fc, Fy, ag, recubrimiento, numeroVarilla);
   }

}

function validarValorMinimo(id, min, msgErr) {
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
         //boton.disabled = true;
      }
   } else if (id == 'b' || id == 'h') {
      if (firstChar === "0" || firstChar == "1") {
         input.value = "";
         valor = input.value;
         input.focus();
         console.log("Valor no permitido", firstChar, "valor=", valor);
         //boton.disabled = true;
      }
   }
   if (id == 'fc'){
      if (isNaN(valor) || valor <= min) {
         mensajeError.textContent = "Ingrese el valor de resistencia deseado";
      }else {
         mensajeError.textContent = "";
      }
   }
   else if (id == 'muSup' || id == 'muInf' || id == 'Vu') {
      if (isNaN(valor) || valor <= min) {
         mensajeError.textContent = "Ingrese un número corecto, mayor a " + min;
      }else {
         mensajeError.textContent = "";
      }
   }
   else if (isNaN(valor) || valor < min) {
      mensajeError.textContent = "Ingrese un número mayor o igual a " + min;
      // input.value = "";
      // input.focus();
      //boton.disabled = true;
   } else {
      mensajeError.textContent = "";
      //boton.disabled = false;
   }
   verificar_datos_iniciales
      ();
}

function validarTeclaMenos(event, id) {
   var tecla = event.key;
   var input = document.getElementById(id);
   var valor = input.value;
   if (tecla === "-" || tecla === "+") {
      event.preventDefault();
      //boton.disabled = true;
   }
   verificar_datos_iniciales
      ();
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
   verificar_datos_iniciales
      ();

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
      }
   }
}

function cuantiaMinima(Fc, Fy) {
   //Cuantia minima
   let roMin = Math.max(1.4 / Fy, (0.25 * Math.sqrt(Fc)) / Fy);
   return roMin;
}

function distancia(h, recubrimiento, dVarilla, dEstribo) {
   //Distancia desde la parte superior de la viga al centroide de la varilla
   let d = h - recubrimiento - (dVarilla / 2) - dEstribo;
   return d;
}

function cuantiaConcreto(d, b) {
   //Cuantía del concreto
   let Ac = b * d;
   return Ac;
}

function cuantiaAceroMinimo(Ac, Pmin) {
   //• Cuantía del acero minimo
   let AsMin = Pmin * Ac;
   return AsMin;
}

function cantidadVarillas(AsMin, areaVarilla) {
   //• Número (cantidad) de varillas, Minimo 2 varillas
   let NoVarillas = Math.max(2, Math.ceil(AsMin / areaVarilla));
   return NoVarillas;
}

function aceroSuministrado(areaVarilla, NoVarillas) {
   //• Acero suministrado 
   let AsMin_Suministrado = areaVarilla * NoVarillas;
   return AsMin_Suministrado;
}

function excesoAs(AsMin_Suministrado, AsMin) {
   //Exceso de As
   let excAs = (AsMin_Suministrado - AsMin) / AsMin * 100;
   return excAs;
}

function minimoExceso(b, h, Fc, Fy, recubrimiento, diametroBarraEstribo, ag) {
   //Debemos retornar el numero de varilla con el menor exceso
   let excesos = [];
   let noVars = [];
   let roMin, d, Ac, AsMin, NoVarillas, AsSuministrado, numeroVarilla, diametro, area;
   roMin = cuantiaMinima(Fc, Fy);
   for (i = 0; i < 7; i++) {
      numeroVarilla = i + 2;
      diametro = diametrosVarillas[i];
      area = areasVarillas[i];

      d = distancia(h, recubrimiento, diametro, diametroBarraEstribo);
      Ac = cuantiaConcreto(d, b);
      AsMin = cuantiaAceroMinimo(Ac, roMin);
      NoVarillas = cantidadVarillas(AsMin, area);
      AsSuministrado = aceroSuministrado(area, NoVarillas);
      let excesAs = excesoAs(AsSuministrado, AsMin);
      //if
      separacion = separacionBarras(b, recubrimiento, diametroBarraEstribo, NoVarillas, diametro);
      separacionMinimaBarras = separacionMinima(diametro, ag);
      console.log(`No.${numeroVarilla} sep=${separacion.toFixed(2)} >= sepMin=${separacionMinimaBarras.toFixed(2)}`);
      if (separacion >= separacionMinimaBarras) {
         excesos.push(Number(excesAs.toFixed(4)));
         noVars.push(numeroVarilla);
      }
      //Debemos verificar que cumpla la separacion minima

   }
   console.log(excesos);
   minimoExc = Math.min(...excesos);
   console.log(excesos.indexOf(minimoExc));
   let posMenorExc = excesos.indexOf(minimoExc);
   let NoVarillaMenorExc = `No. ${noVars[posMenorExc]}`;
   return [minimoExc, NoVarillaMenorExc];
}
console.log(minimoExceso(250, 450, 28, 420, 40, 9.5, 25));

function separacionBarras(b, recubrimiento, dEstribo, NoVarillas, dVarilla) {
   //Separacion entre barras
   let separacion = (b - recubrimiento * 2 - 2 * dEstribo - NoVarillas * dVarilla) / (NoVarillas - 1);
   return separacion;
}

function separacionMinima(dVarilla, ag) {
   //Separacion minima entre barras
   let separacionMinima = Math.max(25, dVarilla, 1.33 * ag);
   return separacionMinima;
}

function resistenciaViga(AsMin_Suministrado, Fy, Fc, d, b) {
   let resMn;
   let fi = 0.9;
   resMn = fi * AsMin_Suministrado * Fy * (d - (Fy * AsMin_Suministrado) / (1.7 * Fc * b));
   resMn = resMn / 1000000;
   return resMn;
}



function deshabilitar() {
   // Deshabilitar edicion del valor de los inputs con los id
   document.getElementById("b").disabled = true; //
   document.getElementById("h").disabled = true; //
   document.getElementById("fc").disabled = true; //
   document.getElementById("fy").disabled = true; //
   document.getElementById("recubrimiento").disabled = true; //
   document.getElementById("numeroVarilla").disabled = true; //
   document.getElementById("ag").disabled = true; //
   document.getElementById("numeroVarillaEstribo").disabled = true; //
}

function habilitar() {
   // Habilitar edicion del valor de los inputs con los id
   document.getElementById("b").disabled = false; //
   document.getElementById("h").disabled = false; //
   document.getElementById("fc").disabled = false; //
   document.getElementById("fy").disabled = false; //
   document.getElementById("recubrimiento").disabled = false; //
   document.getElementById("numeroVarilla").disabled = false; //
   document.getElementById("ag").disabled = false; //
   document.getElementById("numeroVarillaEstribo").disabled = false; //

   document.getElementById("base").textContent = '';
   document.getElementById("max_ag").textContent = '';
   document.getElementById("bh").textContent = '';
   document.getElementById("resultado").innerHTML = '';
   document.getElementById("asmin_mayor").innerHTML = '';
   document.getElementById("condiciones").innerHTML = '';

   document.getElementById('tabla_resultado').style.display = 'none';
   document.getElementById("resultadoFinal").style.display = 'none';


   document.getElementById('asmin_mayor').style.display = 'none';
   document.getElementById('condiciones').style.display = 'none';
   document.getElementById('exceso').style.display = 'none';

   ///Ocultar formulario de resistencia
   document.getElementById('form_resistencia').style.display = 'none';
   document.getElementById('campos_cortante').style.display = 'none';

}

function calcular() {
   document.getElementById("base").textContent = '';
   document.getElementById("bh").textContent = '';
   document.getElementById("max_ag").textContent = '';
   document.getElementById("resultado").innerHTML = '';
   document.getElementById("resultadoFinal").style.display = 'none';
   ///Ocultar formulario de resistencia
   document.getElementById('form_resistencia').style.display = 'none';
   document.getElementById('campos_cortante').style.display = 'none';

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
   else if (b < 200) {
      console.log('NOTA: No puede ser menor a 200mm');
      document.getElementById("base").textContent = "(*) NOTA: Tener en cuenta el valor de la base";
      document.getElementById("bh").innerHTML = '<h3 id="bh" class="text-danger">La base de la viga No puede ser menor a 200mm</h3>';
   }
   else if (h < 0) {
      console.log('NOTA: No puede ser negativo');
      document.getElementById("base").textContent = "(*) NOTA: Tener en cuenta el valor de la altura";
      document.getElementById("bh").innerHTML = '<h3 id="bh" class="text-danger">Los valores no pueden ser negativos</h3>';
   } 
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
         Fc=Fc1;
         console.log("Valor de FC: ",Fc);
         document.getElementById("fc").value = Fc;
         // console.log("Hay campos vacíos");
         // document.getElementById("val_fc").innerHTML = '<h3 class="text-danger">Se necesita la resistencia a la compresión</h3>';
         // document.getElementById("base").textContent = '(*) Complete los campos vacios';
      }
      let roMin, d, Ac, AsMin, NoVarillas, AsMin_Suministrado, resMn, excesAs, separacion, separacionMinimaBarras;

      //Cuantia minima
      roMin = cuantiaMinima(Fc, Fy);
      console.log("Cuantia minima roMin=>", roMin);

      //Distancia desde la parte superior de la viga al centroide de la varilla
      d = distancia(h, recubrimiento, diametro, diametroBarraEstribo);
      console.log("Distancia parte superior - centroide d=> ", d);
      //Cuantía del concreto
      Ac = cuantiaConcreto(d, b);
      console.log("Cuantia del concreto Ac=>" + Ac);
      //• Cuantía del acero minimo
      AsMin = cuantiaAceroMinimo(Ac, roMin);
      console.log("Area del acero minimo AsMin => ", AsMin);
      //• Número (cantidad) de varillas, Minimo 2 varillas
      NoVarillas = cantidadVarillas(AsMin, area);
      console.log("Cantidad de varillas => ", NoVarillas);
      //• Acero suministrado 
      AsMin_Suministrado = aceroSuministrado(area, NoVarillas);
      console.log("Acero suministrado => ", AsMin_Suministrado);
      //Exceso de As
      excesAs = excesoAs(AsMin_Suministrado, AsMin);
      console.log("Exceso de As => " + excesAs);

      //Separacion entre barras
      separacion = separacionBarras(b, recubrimiento, diametroBarraEstribo, NoVarillas, diametro);
      console.log("Separacion entre varillas => " + separacion);

      //Separacion minima entre barras
      separacionMinimaBarras = separacionMinima(diametro, ag);
      console.log("Separacion minima entre varillas => " + separacionMinimaBarras);

      // Resistencia de la viga
      resMn = resistenciaViga(AsMin_Suministrado, Fy, Fc, d, b);
      console.log("resistencia de la viga => ", resMn);

      document.getElementById('asmin_mayor').style.display = 'block';

      document.getElementById("asmin_mayor").innerHTML = '<div class="resultado text-center"><h3>NOTA: Elija como varilla supuesta aquella que tenga un menor porcentaje de exceso o desperdicio de acero, pero que cumpla con la separación mínima</div>';

      ///AsSuministrado >= 1.3*Asmin
      if (AsMin_Suministrado >= 1.3 * AsMin) {
         console.log(AsMin_Suministrado + " >= " + AsMin)
         console.log("El acero suministrado es suficiente");

         // document.getElementById("asmin_mayor").innerHTML = '<div class="resultado text-center"><h3>El acero suministrado es suficiente</h3> Acero suministrado=' + AsMin_Suministrado + "<b>  >= </b> Acero mínimo(1.3xAsMin)=" + (1.3 * AsMin).toFixed(2) + '</div>';
         document.getElementById("asmin_mayor").innerHTML = '<div class="resultado text-center"><h3>NOTA: Elija como varilla supuesta aquella que tenga un menor porcentaje de exceso o desperdicio de acero, pero que cumpla con la separación mínima</div>';
         ///Mostrar formulario de resistencia
         document.getElementById('form_resistencia').style.display = 'block';
         //Deshabilitar formulario para evitar que cambie los valores
         // deshabilitar();
      }
      else {
         console.log(AsMin_Suministrado + " <= " + 1.3 * AsMin)
         console.log("Elija un area de la varilla ya que el acero suministrado sobrepasa demasiado el acero que necesita");
         document.getElementById('asmin_mayor').style.display = 'block';

         document.getElementById("asmin_mayor").innerHTML = '<div class="resultado text-center"><h3>NOTA: Elija como varilla supuesta aquella que tenga un menor porcentaje de exceso o desperdicio de acero, pero que cumpla con la separación mínima</div>';
         ///Mostrar formulario de resistencia
         document.getElementById('form_resistencia').style.display = 'block';
      }
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
                        <td>d</td>
                        <td>${d.toFixed(2)}</td>
                        <td>mm</td>
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
                        <td>AsMin suministrado</td>
                        <td>${AsMin_Suministrado}</td>
                        <td>mm<sup>2</sup></td>
                     </tr>
                     <tr>
                        <td>Exceso de As</td>
                        <td>${excesAs.toFixed(2)}</td>
                        <td>%</td>
                     </tr>
                     <tr>
                        <td>Separación entre varillas</td>
                        <td>${separacion.toFixed(2)}</td>
                        <td>mm</td>
                     </tr>
                     <tr>
                        <td>Separación mínima</td>
                        <td>${separacionMinimaBarras.toFixed(2)}</td>
                        <td>mm</td>
                     </tr>
                     <tr>
                        <td>Resistencia Nominal</td>
                        <td>${resMn.toFixed(2)}</td>
                        <td>kN - m</td>
                     </tr>
                  </tbody>
               </table>
            `;
      // ///Recomendar el menor exceso
      let menorExceso = minimoExceso(b, h, Fc, Fy, recubrimiento, diametroBarraEstribo, ag)[0];
      let varMenorExceso = minimoExceso(b, h, Fc, Fy, recubrimiento, diametroBarraEstribo, ag)[1];
      document.getElementById('exceso').style.display = 'block';
      document.getElementById('exceso').innerHTML = `<h3>Se recomienda utilizar la varilla ${varMenorExceso} ya que se obtiene un menor 
         exceso de ${menorExceso.toFixed(2)}%<h3/>`;

      //Verificar condicion
      document.getElementById('condiciones').style.display = 'block';
      if (separacion >= separacionMinimaBarras) {
         console.log(`Si cumple separacion ${separacion} >= sepMinima ${separacionMinimaBarras}`);
         document.getElementById("condiciones").innerHTML = `<b style="color:rgba(0,255,0,1);">Si cumple</b>&nbsp; la condicion: separacion entre varillas=${separacion.toFixed(2)}mm >= separacion
            minima=${separacionMinimaBarras}mm`;
      }
      else {
         console.log(`No cumple separacion ${separacion} >= sepMinima ${separacionMinimaBarras}`);
         document.getElementById("condiciones").innerHTML = `<b style="color:rgba(255,0,0,0.8);"> No cumple </b>&nbsp; la condicion: separacion entre varillas=${separacion.toFixed(2)}mm <= separacion
            minima=${separacionMinimaBarras}mm`;
      }
      //Mostrar el acero suministrado calculado
      document.getElementById("asCalculado").innerHTML = `<input type="text" class="form-control" id="asSum" name="asSum" value="${AsMin_Suministrado} mm&sup2;" placeholder="" required
      disabled />`;


      //Mostrar el acero suministrado calculado
      document.getElementById("OMn").value = resMn.toFixed(2) + " kN - m";
      ///Mostrar formulario de resistencia
      document.getElementById('form_resistencia').style.display = 'block';
   }
}
