function resistenciaUltima(b, fc, fy, fi, d, Mu) {
   //debe ingresar Mu en kN.m
   Mu = Mu * 1e6
   let AsSemilla = 1000
   let es = 0.5
   let ea = 100
   let AsCalculado
   while (ea > es) {
      AsCalculado = Mu / (fi * fy * (d - fy * AsSemilla / (1.7 * fc * b)))
      ea = Math.abs((AsCalculado - AsSemilla)) / AsCalculado * 100
      AsSemilla = AsCalculado
   }
   return AsCalculado
}

function verificar_campos(b, h, ag, MuMaxSuperior, MuMaxInferior) {
   if (b == '' || h == '') {
      console.log("Hay campos vacíos");
      document.getElementById("bh").innerHTML = '<h3 class="text-danger">Debe ingresar base y altura</h3>';
      return false;
   }
   else if (b < 200) {
      console.log('NOTA:Base No puede ser menor a 200mm');
      document.getElementById("bh").innerHTML = '<h3 class="text-danger">La base de la viga No puede ser menor a 200mm</h3>';
      return false;
   }
   else if (h < 0) {
      console.log('NOTA: No puede ser negativo');
      document.getElementById("bh").innerHTML = '<h3 class="text-danger">Los valores no pueden ser negativos</h3>';
      return false;
   }
   else if (ag == '') {
      console.log("Hay campos vacíos");
      document.getElementById("max_ag").innerHTML = '<h3 class="text-danger">Debe ingresar un tamaño máximo</h3>';
      return false;
   }
   else if (ag < 10) {
      console.log("Hay campos incorrectos");
      document.getElementById("max_ag").innerHTML = '<h3 class="text-danger">Debe ingresar un tamaño máximo mayor a 10 mm</h3>';
      return false;
   }
   else if (MuMaxSuperior == '' || MuMaxInferior == '') {
      console.log("Hay campos vacíos--" + MuMaxSuperior + "--" + typeof (MuMaxInferior) + "--");
      document.getElementById("res").innerHTML = '<h3 class="text-danger">Debe ingresar los dos valores</h3>';
      return false;
   }
   else if (MuMaxSuperior <= 0 || MuMaxInferior <= 0) {
      console.log("Hay campos incorrectos");
      document.getElementById("res").innerHTML = '<h3 class="text-danger">Los valores deben ser positivos</h3>';
      return false;
   }
   else { return true; }
}

function verificar_resistencia() {
   document.getElementById("res").innerHTML = '';
   document.getElementById("ver_datos_resistencia").innerHTML = '';
   limpiar_cortante();

   let b, h, Fc, Fy, ag, recubrimiento, numeroVarilla, diametro, area, numeroBarraEstribo, diametroBarraEstribo, AsSuministrado, MuMaxSuperior, MuMaxInferior;
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
   // AsSuministrado = Number(document.getElementById("asSum").value); //

   MuMaxSuperior = Number(document.getElementById("muSup").value); //
   MuMaxInferior = Number(document.getElementById("muInf").value); //
   if (Fc == '') {
      Fc=Fc1;
      console.log("Valor de FC: ",Fc);
      document.getElementById("fc").value = Fc;
   }

   console.log("Datos ingresados=> ", b, h, Fc, Fy, recubrimiento, numeroVarilla, diametro, area, MuMaxSuperior, MuMaxInferior);

   if (verificar_campos(b, h, ag, MuMaxSuperior, MuMaxInferior) == false) {
      console.log("Hay campos vacíos");
      document.getElementById("ver_datos_resistencia").innerHTML = '<h3 class="text-danger">Hay campos incorrectos</h3>';
   }
   else {
      console.log("--------------------------res");
      resistencia(numeroVarilla, Fc, Fy, h, recubrimiento, diametro, diametroBarraEstribo, b, area, ag, MuMaxSuperior, MuMaxInferior);
   }

}

function resistencia(numeroVarilla, Fc, Fy, h, recubrimiento, diametro, diametroBarraEstribo, b, area, ag, MuMaxSuperior, MuMaxInferior) {
   console.log("resistencia-values: ", numeroVarilla, Fc, Fy, h, recubrimiento, diametro, diametroBarraEstribo, b, area, ag, MuMaxSuperior, MuMaxInferior);
   /////////////////////////////////////////////////////////
   let roMin, d, Ac, AsMin, NoVarillas, AsMin_Suministrado, resMn, excesAs, separacion, separacionMinimaBarras;
   // 2.1 Diseño de vigas
   // Diseño a flexion
   //Cuantia minima
   roMin = cuantiaMinima(Fc, Fy);
   // console.log("Cuantia minima=>", roMin);
   //Distancia desde la parte superior de la viga al centroide de la varilla
   d = distancia(h, recubrimiento, diametro, diametroBarraEstribo);
   Ac = cuantiaConcreto(d, b);
   //• Cuantía del acero minimo
   AsMin = roMin * b * d;
   // console.log("Area del acero minimo => ", AsMin);
   //• Número (cantidad) de varillas, Minimo 2 varillas
   NoVarillas = cantidadVarillas(AsMin, area);
   AsMin_Suministrado = aceroSuministrado(area, NoVarillas);
   excesAs = excesoAs(AsMin_Suministrado, AsMin);
   separacion = separacionBarras(b, recubrimiento, diametroBarraEstribo, NoVarillas, diametro);
   separacionMinimaBarras = separacionMinima(diametro, ag);

   // console.log("Cantidad de varillas => ", NoVarillas);
   // Resistencia de la viga

   resMn = resistenciaViga(AsMin_Suministrado, Fy, Fc, d, b);
   console.log("resistencia de la viga => ", resMn, roMin, d, Ac, NoVarillas, AsMin_Suministrado, excesAs, separacion, diametroBarraEstribo, separacionMinimaBarras);
   //Mostrar el acero suministrado calculado
   // document.getElementById("OMn").value = resMn;
   ///Se debe cumplir que el momento que resiste(Mn) debe ser mayor al momento que se solicita(Mu): resMn > Mu
   // Para comprobarlo se elige los momentos máximos del eje:
   //Ingresa el momento maximo que se solicita(MuMaxSuperior) en la parte superior de la viga (KN-m)

   // Parte superior de la viga 
   let as_calcSup, NoVarillasSup, AsSuministradoSup, SupexcesAs, Supseparacion, SupseparacionMinimaBarras;
   let resMnSup;
   let msgSup = msgInf = '';
   let cumpleSup = cumpleInf = false;
   document.getElementById("resultadoFinal").style.display = 'block';

   if (resMn > MuMaxSuperior) {
      msgSup = `Para la fibra superior de la viga <b style="color:rgba(0,255,0,1);">si se cumple</b> que ϕMn>ϕMu <br>`;
      cumpleSup = true;
      resMnSup = resMn;
      as_calcSup = AsMin;
      NoVarillasSup = NoVarillas;
      AsSuministradoSup = AsMin_Suministrado;
      SupexcesAs = excesAs;
      Supseparacion = separacion;
      SupseparacionMinimaBarras = separacionMinimaBarras;
      //Respuesta: En la parte superior se necesita... Ej: 3 varillas No3, ENTONCES la varilla supuesta es la correcta
      console.log("CHECK Superior. Si cumple. Mn" + resMn + " > " + MuMaxSuperior);


      insertardatosTabla("superior", d, as_calcSup, NoVarillasSup, numeroVarilla, AsSuministradoSup, SupexcesAs, Supseparacion, SupseparacionMinimaBarras, resMnSup);
      document.getElementById("msgSup").innerHTML = `<div class="col-1">
      <img src="./img/right.png"  ></div><div class="col-8">
      ${msgSup}</div>
      `;
      condicion_separacion('superior', Supseparacion, SupseparacionMinimaBarras,numeroVarilla);

   }
   else {
      console.log("CHECK Superior. No cumple. Mn" + resMn + " > " + MuMaxSuperior);
      console.log(Fy, d, Fc, b, resMn);
      cumpleSup = false;
      // msgSup = `Para la parte superior no se cumple que Mn>Mu, por lo tanto, la cantidad de varillas con el número de varilla supuesta anteriormente <b>no es la correcta</b>.`;
      ///VERIFICAR SI APARECE ESTE MENSAJE CUANDO SE VUELVE A CALCULAR

      resistenciaIteracion("superior", numeroVarilla, b, Fc, Fy, d, MuMaxSuperior, area, recubrimiento, diametroBarraEstribo, diametro, ag);
   }

   // Parte inferior de la viga -----------------------------------
   let as_calcInf, NoVarillasInf, AsSuministradoInf, InfexcesAs, Infseparacion, InfseparacionMinimaBarras;
   let resMnInf;
   if (resMn > MuMaxInferior) {
      msgInf = `Para la fibra inferior de la viga <b style="color:rgba(0,255,0,1);">si se cumple</b> que ϕMn>ϕMu <br>`;
      cumpleInf = true;
      resMnInf = resMn;
      as_calcInf = AsMin;
      NoVarillasInf = NoVarillas;
      AsSuministradoInf = AsMin_Suministrado;
      InfexcesAs = excesAs;
      Infseparacion = separacion;
      InfseparacionMinimaBarras = separacionMinimaBarras;
      console.log("CHECK Inferior. Si cumple. Mn" + resMn + " > " + MuMaxInferior);

      insertardatosTabla("inferior", d, as_calcInf, NoVarillasInf, numeroVarilla, AsSuministradoInf, InfexcesAs, Infseparacion, InfseparacionMinimaBarras, resMnInf);
      document.getElementById("msgInf").innerHTML = `<div class="col-1">
      <img src="./img/right.png"  ></div><div class="col-8">
      ${msgInf}</div>
      `;
      condicion_separacion('inferior', Infseparacion, InfseparacionMinimaBarras,numeroVarilla);

   }
   else {
      //Acero necesario con iteracion:::
      // msgInf = "Para la parte inferior no se cumple que Mn>Mu, por lo tanto, la cantidad de varillas con el número de varilla supuesta anteriormente <b>no es la correcta</b>.";

      console.log("CHECK Inferior. No cumple. Mn" + resMn + " > " + MuMaxInferior);
      console.log(Fy, d, Fc, b, resMn);

      resistenciaIteracion("inferior", numeroVarilla, b, Fc, Fy, d, MuMaxInferior, area, recubrimiento, diametroBarraEstribo, diametro, ag);
   }
   
}

function condicion_separacion(tabla, Supseparacion, SupseparacionMinimaBarras,nvarilla) {
   let etiquetaCondicion;
   if (tabla == 'superior') {
      etiquetaCondicion = 'condicionSup';
   }
   else {
      etiquetaCondicion = 'condicionInf';
   }
   console.log(`separacion en---${tabla}-${etiquetaCondicion}`);

   if (Supseparacion >= SupseparacionMinimaBarras) {
      console.log(`Si cumple separacion ${Supseparacion} >= sepMinima ${SupseparacionMinimaBarras}`);

      document.getElementById(etiquetaCondicion).innerHTML = `<br>Para este caso, en la fibra ${tabla} de la viga <b class="green">si se cumple</b> con la separación mínima entre varillas. `;

      document.getElementById(`check_separacion_${tabla}`).value = "true";
   }
   else {
      console.log(`No cumple separacion ${Supseparacion} >= sepMinima ${SupseparacionMinimaBarras}`);
      document.getElementById(etiquetaCondicion).innerHTML = `<br>Para este caso, en la fibra ${tabla} de la viga <b class="red">no se cumple</b> con la
      separación mínima entre varillas, por lo tanto, para esta parte suponga otro número de
      varilla.
      `;
      document.getElementById(`check_separacion_${tabla}`).value = "false";

   }
   document.getElementById(`nvarilla_${tabla}`).value = nvarilla;

   let sep_sup = document.getElementById("check_separacion_superior").value;
   // document.getElementById("chek_separacion_superior").value = "0";
   let sep_inf = document.getElementById("check_separacion_inferior").value;
   if (sep_sup == "true" && sep_inf == "true") {
      console.log("-+-+-+-+-+-+-Separacion true");
      document.getElementById('campos_cortante').style.display = 'block';

   } else {
      console.log("-+-+-+-+-+-+-Separacion false");
      document.getElementById('campos_cortante').style.display = 'none';
   }

}

function insertardatosTabla(tabla, d, as_calcSup, NoVarillasSup, numeroVarilla, AsSuministradoSup, SupexcesAs, Supseparacion, SupseparacionMinimaBarras, resMnSup) {
   document.getElementById(`${tabla}`).innerHTML = `
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
                                 <td>d</td>
                                 <td>${d.toFixed(2)}</td>
                                 <td>mm</td>
                              </tr>
                              
                              <tr>
                                 <td>AsMin</td>
                                 <td>${as_calcSup.toFixed(2)}</td>
                                 <td>mm<sup>2</sup></td>
                              </tr>
                              <tr>
                                 <td>Cantidad de Varillas</td>
                                 <td>${NoVarillasSup}</td>
                                 <td>und</td>
                              </tr>
                              <tr>
                                 <td>No. Varilla</td>
                                 <td>No. ${numeroVarilla}</td>
                                 <td>-</td>
                              </tr>
                              <tr>
                                 <td>As suministrado</td>
                                 <td id="asSumSup">${AsSuministradoSup}</td>
                                 <td>mm<sup>2</sup></td>
                              </tr>
                              <tr>
                                 <td>Exceso de As</td>
                                 <td>${SupexcesAs.toFixed(2)}</td>
                                 <td>%</td>
                              </tr>
                              <tr>
                                 <td>Separación entre varillas</td>
                                 <td>${Supseparacion.toFixed(2)}</td>
                                 <td>mm</td>
                              </tr>
                              <tr>
                                 <td>Separación mínima</td>
                                 <td>${SupseparacionMinimaBarras.toFixed(2)}</td>
                                 <td>mm</td>
                              </tr>
                              <tr>
                                 <td>Resistencia Nominal</td>
                                 <td>${resMnSup.toFixed(2)}</td>
                                 <td>kN - m</td>
                              </tr>
                           </tbody>
                        </table>
                        `;
}

function resistenciaIteracion(tabla, numeroVarilla, b, Fc, Fy, d, MuMaxSuperior, area, recubrimiento, diametroBarraEstribo, diametro, ag) {
   console.log("No cumple. Mn > " + MuMaxSuperior);
   console.log("No cumple. Mn Iteracion con datos: ", tabla, numeroVarilla, b, Fc, Fy, d, MuMaxSuperior, area, recubrimiento, diametroBarraEstribo, diametro, ag);
   let etiquetaMsg = '';
   if (tabla == 'superior') {
      etiquetaMsg = 'msgSup';
   } else {
      etiquetaMsg = 'msgInf';
   }
   // let msgSup = `Para la parte ${tabla} no se cumple que Mn>Mu, por lo tanto, la cantidad de varillas con el número de varilla supuesta anteriormente <b>no es la correcta</b>.`;
   // Parte superior de la viga cuando Mu < Mn
   let as_calcSup, NoVarillasSup, AsSuministradoSup, SupexcesAs, Supseparacion, SupseparacionMinimaBarras;
   let resMnSup;

   //Acero necesario con iteracion:::
   as_calcSup = resistenciaUltima(b, Fc, Fy, 0.9, d, MuMaxSuperior);//Asmin

   //Cantidad de varillas
   NoVarillasSup = cantidadVarillas(as_calcSup, area);
   console.log("Numero de varillas => ", NoVarillasSup);

   AsSuministradoSup = aceroSuministrado(area, NoVarillasSup);
   console.log("AsSuministrado  => ", AsSuministradoSup);

   SupexcesAs = excesoAs(AsSuministradoSup, as_calcSup);
   Supseparacion = separacionBarras(b, recubrimiento, diametroBarraEstribo, NoVarillasSup, diametro);
   SupseparacionMinimaBarras = separacionMinima(diametro, ag);
   resMnSup = resistenciaViga(AsSuministradoSup, Fy, Fc, d, b);
   insertardatosTabla(tabla, d, as_calcSup, NoVarillasSup, numeroVarilla, AsSuministradoSup, SupexcesAs, Supseparacion, SupseparacionMinimaBarras, resMnSup);

   document.getElementById(etiquetaMsg).innerHTML = `<div class="col-1">
   <img src="./img/wrong.png"  ></div><div class="col-8">
   Para la fibra ${tabla} de la viga <b style="color:rgba(255,0,0,0.8);">no se cumple</b> que
   ϕMn>ϕMu, por lo tanto, la cantidad de varillas longitudinales obtenidas
   con el número de varilla supuesta anteriormente <b>no es la correcta</b>.</div>`;

   condicion_separacion(tabla, Supseparacion, SupseparacionMinimaBarras,numeroVarilla);
   ///////Esta correcta OK1
}

function recalcularResistencia(tabla) {
   let numeroVarillaSup = document.getElementById(`numeroVarilla_${tabla}`).value;
   let indice = numerosVarilla.indexOf(numeroVarillaSup);
   let diametro = Number(diametrosVarillas[indice]);
   let area = Number(areasVarillas[indice]);
   document.getElementById(`res_${tabla}`).innerHTML = '';
   // document.getElementById("res_inferior").innerHTML = '';
   console.log(`Otra varilla No. ${numeroVarillaSup} d=${diametro} ar=${area} para ${tabla}`);
   let b, h, Fc, Fy, ag, recubrimiento, numeroBarraEstribo, diametroBarraEstribo, MuMaxSuperior, MuMaxInferior;
   // Obtiene el valor de los inputs con los id
   b = Number(document.getElementById("b").value); //
   h = Number(document.getElementById("h").value); //
   Fc = Number(document.getElementById("fc").value); //
   Fy = Number(document.getElementById("fy").value); //
   ag = Number(document.getElementById("ag").value);
   recubrimiento = Number(document.getElementById("recubrimiento").value); //
   // numeroVarilla = Number(document.getElementById("numeroVarilla").value); //
   // diametro = Number(document.getElementById("diametro").value); //
   // area = Number(document.getElementById("area").value); //
   numeroBarraEstribo = Number(document.getElementById("numeroVarillaEstribo").value); //
   diametroBarraEstribo = Number(document.getElementById("diametro_estribo").value); //
   // AsSuministrado = Number(document.getElementById("asSum").value); //
   let etiquetaMsg;
   if (tabla == 'superior') {
      MuMaxSuperior = Number(document.getElementById("muSup").value); //Vamos a recalcular en superior
      MuMaxInferior = Number(document.getElementById("muInf").value); //
      etiquetaMsg = 'msgSup';
   }
   else {
      MuMaxSuperior = Number(document.getElementById("muInf").value); //Vamos a calcular en inferior
      MuMaxInferior = Number(document.getElementById("muSup").value); //
      etiquetaMsg = 'msgInf';

   }
   console.log(`Recalculando--Mu-${MuMaxSuperior}-${tabla}`);

   console.log("Datos ingresados=> ", b, h, Fc, Fy, recubrimiento, numeroVarillaSup, diametro, area, MuMaxSuperior, MuMaxInferior);

   if (verificar_campos(b, h, ag, MuMaxSuperior, MuMaxInferior) == false) {
      console.log("Hay campos vacíos");
      document.getElementById(`res_${tabla}`).innerHTML = '<h3 class="red ml-2">* Hay campos incorrectos</h3>';
   }
   else {
     
      let roMin, d, Ac, AsMin, NoVarillas, AsMin_Suministrado, resMn, excesAs, separacion, separacionMinimaBarras;
      // 2.1 Diseño de vigas
      // Diseño a flexion
      //Cuantia minima
      roMin = cuantiaMinima(Fc, Fy);
      // console.log("Cuantia minima=>", roMin);
      //Distancia desde la parte superior de la viga al centroide de la varilla
      d = distancia(h, recubrimiento, diametro, diametroBarraEstribo);
      Ac = cuantiaConcreto(d, b);
      //• Cuantía del acero minimo
      AsMin = roMin * b * d;
      // console.log("Area del acero minimo => ", AsMin);
      //• Número (cantidad) de varillas, Minimo 2 varillas
      NoVarillas = cantidadVarillas(AsMin, area);
      AsMin_Suministrado = aceroSuministrado(area, NoVarillas);
      excesAs = excesoAs(AsMin_Suministrado, AsMin);
      separacion = separacionBarras(b, recubrimiento, diametroBarraEstribo, NoVarillas, diametro);
      separacionMinimaBarras = separacionMinima(diametro, ag);

      // console.log("Cantidad de varillas => ", NoVarillas);
      // Resistencia de la viga

      resMn = resistenciaViga(AsMin_Suministrado, Fy, Fc, d, b);
      console.log("resistencia de la viga => ", resMn, roMin, d, Ac, NoVarillas, AsMin_Suministrado, excesAs, separacion, diametroBarraEstribo, separacionMinimaBarras);      //Mostrar el acero suministrado calculado
      // document.getElementById("OMn").value = resMn;
      ///Se debe cumplir que el momento que resiste(Mn) debe ser mayor al momento que se solicita(Mu): resMn > Mu
      // Para comprobarlo se elige los momentos máximos del eje:
      //Ingresa el momento maximo que se solicita(MuMaxSuperior) en la parte superior de la viga (KN-m)

      // Parte superior de la viga 
      let as_calcSup, NoVarillasSup, AsSuministradoSup, SupexcesAs, Supseparacion, SupseparacionMinimaBarras;
      let resMnSup;
      let msgSup = msgInf = '';
      let cumpleSup = cumpleInf = false;
      document.getElementById("resultadoFinal").style.display = 'block';

      if (resMn > MuMaxSuperior) {
         msgSup = `Para la fibra ${tabla} de la viga <b style="color:rgba(0,255,0,1);">si se cumple</b> que ϕMn>ϕMu <br>`;
         cumpleSup = true;
         resMnSup = resMn;
         as_calcSup = AsMin;
         NoVarillasSup = NoVarillas;
         AsSuministradoSup = AsMin_Suministrado;
         SupexcesAs = excesAs;
         Supseparacion = separacion;
         SupseparacionMinimaBarras = separacionMinimaBarras;
         //Respuesta: En la parte superior se necesita... Ej: 3 varillas No3, ENTONCES la varilla supuesta es la correcta
         console.log("Re CHECK " + tabla + ". Si cumple. Mn" + resMn + " > " + MuMaxSuperior);


         insertardatosTabla(tabla, d, as_calcSup, NoVarillasSup, numeroVarillaSup, AsSuministradoSup, SupexcesAs, Supseparacion, SupseparacionMinimaBarras, resMnSup);
         document.getElementById(etiquetaMsg).innerHTML = `<div class="col-1">
      <img src="./img/right.png"  ></div><div class="col-8">
      ${msgSup}</div>
      `;
         condicion_separacion(tabla, Supseparacion, SupseparacionMinimaBarras,numeroVarillaSup);

      }
      else {
         console.log("Re CHECK " + tabla + ". No cumple. Mn" + resMn + " > " + MuMaxSuperior);
         console.log(Fy, d, Fc, b, resMn);
         cumpleSup = false;

         msgSup = `Para la fibra ${tabla} no se cumple que ϕMn>ϕMu, por lo tanto, la cantidad de varillas longitudinales obtenidas con el número de varilla supuesta anteriormente <b>no es la correcta</b>.`;

         resistenciaIteracion(tabla, numeroVarillaSup, b, Fc, Fy, d, MuMaxSuperior, area, recubrimiento, diametroBarraEstribo, diametro, ag);
         //    document.getElementById(etiquetaMsg).innerHTML = `<div class="col-2">
         // <img src="./img/wrong.png"></div><div class="col-8" style="background-color:red;">
         // ${msgSup}</div>
         // `;
      }



   }
}