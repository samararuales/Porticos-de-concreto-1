

function calcular_cortante_columna() {
    document.getElementById('tabla_resultado_cortante_cols').style.display = 'none';
    document.getElementById("resultado_cortante_cols").innerHTML = "";


    document.getElementById('cumple_estribos').innerHTML = '';
    document.getElementById('NOcumple_estribos').innerHTML = '';
    document.getElementById('cumple_estribos2').innerHTML = '';
    document.getElementById('NOcumple_estribos2').innerHTML = '';

    document.getElementById('cumple_estribosHor').innerHTML = '';
    document.getElementById('NOcumple_estribosHor').innerHTML = '';
    document.getElementById('cumple_estribos2Hor').innerHTML = '';
    document.getElementById('NOcumple_estribos2Hor').innerHTML = '';

    document.getElementById('refMinVert2').innerHTML = '';
    document.getElementById('refMinVert1').innerHTML = '';
    document.getElementById('refMinHor1').innerHTML = '';
    document.getElementById('refMinHor2').innerHTML = '';

    let b = Number(document.getElementById("b").value);
    let h = Number(document.getElementById("h").value);
    let Fc = Number(document.getElementById("fc").value);
    let Fc1 = Number(document.getElementById("fc1").value);
    let Fy = Number(document.getElementById("fy").value);
    let diametroVarLong = Number(document.getElementById("diametro").value);
    let areaBarraLong = Number(document.getElementById("area").value);
    let recubrimiento = Number(document.getElementById("recubrimiento").value);
    let numeroBarraEstribo = Number(document.getElementById("numeroVarillaEstribo").value); //
    let Vu = Number(document.getElementById("Vu_col").value);

    let diametroBarraEstribo = Number(document.getElementById("diametro_estribo").value);
    let ag = Number(document.getElementById("ag").value);

    if (b == '' || h == '') {
        console.log("Hay campos vacíos");
        document.getElementById("bh").innerHTML = '<h3 class="text-danger">Debe ingresar base y altura</h3>';
        document.getElementById("base").textContent = '(*) Complete los campos vacios';
    }
    else if (b < 200) {
        console.log('NOTA: No puede ser menor a 200mm');
        document.getElementById("base").textContent = "(*) NOTA: Tener en cuenta el valor de la base";
        document.getElementById("bh").innerHTML = '<h3 id="bh" class="text-danger">La base de la columna No puede ser menor a 200mm</h3>';
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
    } else if (ag == '') {
        console.log("Hay campos vacíos");
        document.getElementById("max_ag").innerHTML = '<h3 class="text-danger">Debe ingresar un tamaño máximo</h3>';
        document.getElementById("base").textContent = '(*) Complete los campos vacios';
    }
    else if (ag < 10) {
        console.log("Hay campos incorrectos");
        document.getElementById("max_ag").innerHTML = '<h3 class="text-danger">Debe ingresar un tamaño máximo mayor a 10 mm</h3>';
        document.getElementById("base").textContent = '(*) Complete los campos incorrectos';
    } else if (Vu == '') {
        console.log('NOTA: No puede ser vacío');
        document.getElementById("datos_cortante").textContent = "(*) NOTA: Tener en cuenta el valor de Vu";
        document.getElementById("inputVu_col").innerHTML = '<h3 class="text-danger">El valor no puede estar vacío</h3>';
    } else if (Vu < 0) {
        console.log('NOTA: No puede ser negativo');
        document.getElementById("datos_cortante").textContent = "(*) NOTA: Tener en cuenta el valor de Vu";
        document.getElementById("inputVu_col").innerHTML = '<h3 class="text-danger">El valor no puede ser negativo</h3>';
    } else {
        if (Fc == '') {
            Fc = Fc1;
            console.log("Valor de FC: ", Fc);
            document.getElementById("fc").value = Fc;
            // console.log("Hay campos vacíos");
            // document.getElementById("val_fc").innerHTML = '<h3 class="text-danger">Se necesita la resistencia a la compresión</h3>';
            // document.getElementById("base").textContent = '(*) Complete los campos vacios';
        }
        recubrimiento = 40;
        let areaBarraEstribo = 71;
        // let cantidadVarillas = 10;
        let Ac = b * h;
        let Asmin = 0.01 * Ac;
        let cantidadVarillas = cantidadBarras(Asmin, areaBarraLong);
        ///calcular separacion
        let sepA = (Math.min(b, h)) / 4;
        let sepB = 6 * diametroVarLong;
        let sepC = 150;
        let sep = Math.min(sepA, sepB, sepC);
        let separacion = Math.round(sep / 10) * 10;///

        document.getElementById('formulas_cortante').style.display = 'block';


        document.getElementById('sep_varillas').innerHTML = `${separacion}mm`;
        if (separacion < 50) {
            console.log(`S=${separacion} es menor a 50. Se debe cambiar de barra Long`);
            msgResistencia = `Para este caso <b class="red">no se cumple</b> que la separación S (${separacion}mm) > 50mm. Por lo tanto, se recomienda que ingrese otros valores.`;
            document.getElementById('condicion_separacion').innerHTML = msgResistencia;

            document.getElementById('seguir_proceso').style.display = 'none';

        } else {


            document.getElementById("resultado_cortante_cols").innerHTML = `
        <h1>Resumen de los valores calculados</h1>
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
              <td>Separación entre varillas</td>
              <td id="separacion_vars"></td>
              <td>mm</td>
            </tr>
            <tr>
              <td>Área confinada</td>
              <td id="area_conf"></td>
              <td>mm<sup>2</sup></td>
            </tr>
            <tr>
              <td>No. Varilla Estribo</td>
              <td>${numeroBarraEstribo}</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>Refuerzo mínimo vertical</td>
              <td id="ref_min_vertical"></td>
              <td>mm<sup>2</sup></td>
            </tr>
            <tr>
              <td>No Estribos vertical</td>
              <td id="no_est_vertical"></td>
              <td>und</td>
            </tr>
            <tr>
              <td>Refuerzo mínimo horizontal</td>
              <td id="ref_min_horizontal"></td>
              <td>mm<sup>2</sup></td>
            </tr>
            <tr>
              <td>No Estribos horizontal</td>
              <td id="no_est_horizontal"></td>
              <td>und</td>
            </tr>
            <tr>
              <td>Cortante Nominal (Vn)</td>
              <td id="res_OVN"></td>
              <td>kN</td>
            </tr>
            <tr>
              <td>Cortante Última (Vu)</td>
              <td id="res_Vu">${Vu}</td>
              <td>kN</td>
            </tr>
        </tbody>
        </table>`;

            console.log(`S=${separacion} es mayor a 50`);
            msgResistencia = `Para este caso <b class="green">sí se cumple</b> que la separación S (${separacion}mm) > 50mm`;
            document.getElementById('condicion_separacion').innerHTML = msgResistencia;
            document.getElementById('seguir_proceso').style.display = 'block';


            ///area confinada
            let base = b - (recubrimiento * 2) - (diametroBarraEstribo * 2);
            let altura = h - (recubrimiento * 2) - (diametroBarraEstribo * 2);
            let ach = base * altura;///
            document.getElementById('baseCort').innerHTML = `${base}mm`;
            document.getElementById('altCort').innerHTML = `${altura}mm`;
            document.getElementById('a_conf').innerHTML = `${base}mm * ${altura}mm = ${ach}mm<sup>2</sup>`;

            //--refuerzo minimo (vertical)
            let ash1Vertical = ((0.3 * separacion * b * Fc) / Fy) * (((b * h) / (ach)) - 1);
            let ash2Vertical = ((0.09 * separacion * b * Fc) / Fy);
            let ashVertical = Math.max(ash1Vertical, ash2Vertical);///
            let noEstribosVert = Math.max(2, Math.floor(ashVertical / areaBarraEstribo));///
            document.getElementById('ash1Cort').innerHTML = `${ash1Vertical.toFixed(2)}mm<sup>2</sup>`;
            document.getElementById('ash2Cort').innerHTML = `${ash2Vertical.toFixed(2)}mm<sup>2</sup>`;
            document.getElementById('ref_min').innerHTML = `(${ash1Vertical.toFixed(2)}mm<sup>2</sup>; ${ash2Vertical.toFixed(2)}mm<sup>2</sup>) = ${ashVertical.toFixed(2)}mm<sup>2</sup>`;
            document.getElementById('noEstribs').innerHTML = `${noEstribosVert} und`;

            let numeroEstribosVertical;
            if (cantidadVarillas == 4 || cantidadVarillas == 6) {
                numeroEstribosVertical = 2;
            } else if (cantidadVarillas == 8) {
                numeroEstribosVertical = 3;
            } else {
                numeroEstribosVertical = 4;
            }
            if (cantidadVarillas == 4 || cantidadVarillas == 6 || cantidadVarillas == 8 || cantidadVarillas == 10 || cantidadVarillas == 12) {
                document.getElementById("refMinVert2").innerHTML = `<img src="./img/refVertical_${numeroEstribosVertical}_${cantidadVarillas}.png" alt="" width="250">`;
                document.getElementById("refMinVert1").innerHTML = `<img src="./img/refVertical_${numeroEstribosVertical}_${cantidadVarillas}.png" alt="" width="250">`;
            }

            if (noEstribosVert != numeroEstribosVertical) {
                // ///se debe disminuir la separacion

                document.getElementById('reducir_separacion').style.display = 'block';

                reducirSeparacionVert(separacion, b, Fc, Fy, h, ach, areaBarraEstribo, numeroEstribosVertical, cantidadVarillas);




            } else {
                //se muestra resultados
                if (cantidadVarillas == 4 || cantidadVarillas == 6 || cantidadVarillas == 8 || cantidadVarillas == 10 || cantidadVarillas == 12) {
                    document.getElementById("refMinVert1").innerHTML = `<img src="./img/refVertical_${noEstribosVert}_${cantidadVarillas}.png" alt="" width="250">`;
                }
                document.getElementById('reducir_separacion').style.display = 'none';
                document.getElementById('cumple_estribos').innerHTML = `<b class="green">El Número de estribos es suficiente</b>`;

                // Mostrar tabla de resumen final
                // document.getElementById('tabla_resultado_cortante_cols').style.display = 'block';
                // document.getElementById("separacion_vars").innerHTML = separacion;
                // document.getElementById("area_conf").innerHTML = ach;
                document.getElementById("ref_min_vertical").innerHTML = ashVertical.toFixed(2);
                document.getElementById("no_est_vertical").innerHTML = noEstribosVert;
                // document.getElementById("ref_min_horizontal").innerHTML = ashHorizontal.toFixed(2);
                // document.getElementById("no_est_horizontal").innerHTML = noEstribosHor;
            }


            /////////////////////////////////////////////
            //--refuerzo minimo (horizontal)
            separacion = Math.round(sep / 10) * 10;
            let ash1Horizontal = ((0.3 * separacion * h * Fc) / Fy) * (((b * h) / (ach)) - 1);
            let ash2Horizontal = ((0.09 * separacion * h * Fc) / Fy);
            let ashHorizontal = Math.max(ash1Horizontal, ash2Horizontal);///
            let noEstribosHor = Math.max(2, Math.floor(ashHorizontal / areaBarraEstribo));
            document.getElementById('ash1CortHor').innerHTML = `${ash1Horizontal.toFixed(2)}mm<sup>2</sup>`;
            document.getElementById('ash2CortHor').innerHTML = `${ash2Horizontal.toFixed(2)}mm<sup>2</sup>`;
            document.getElementById('ref_minHor').innerHTML = `(${ash1Horizontal.toFixed(2)}mm<sup>2</sup>; ${ash2Horizontal.toFixed(2)}mm<sup>2</sup>) = ${ashHorizontal.toFixed(2)}mm<sup>2</sup>`;
            document.getElementById('noEstribsHor').innerHTML = `${noEstribosHor} und`;

            let numeroEstribosHorizontal;
            if (cantidadVarillas == 4) {
                numeroEstribosHorizontal = 2;
            } else if (cantidadVarillas == 6 || cantidadVarillas == 8 || cantidadVarillas == 10) {
                numeroEstribosHorizontal = 3;
            } else {
                numeroEstribosHorizontal = 4;
            }
            if (cantidadVarillas == 4 || cantidadVarillas == 6 || cantidadVarillas == 8 || cantidadVarillas == 10 || cantidadVarillas == 12) {
                document.getElementById("refMinHor1").innerHTML = `<img src="./img/refHorizontal_${numeroEstribosHorizontal}_${cantidadVarillas}.png" alt="" width="250">`;
                document.getElementById("refMinHor2").innerHTML = `<img src="./img/refHorizontal_${numeroEstribosHorizontal}_${cantidadVarillas}.png" alt="" width="250">`;
            }
            if (noEstribosHor != numeroEstribosHorizontal) {
                // ///se debe disminuir la separacion
                document.getElementById('reducir_separacionHor').style.display = 'block';
                reducirSeparacionHor(separacion, b, Fc, Fy, h, ach, areaBarraEstribo, numeroEstribosHorizontal, cantidadVarillas);

            } else {
                //se muestra resultados
                if (cantidadVarillas == 4 || cantidadVarillas == 6 || cantidadVarillas == 8 || cantidadVarillas == 10 || cantidadVarillas == 12) {
                    document.getElementById("refMinHor1").innerHTML = `<img src="./img/refHorizontal_${noEstribosHor}_${cantidadVarillas}.png" alt="" width="250">`;
                }
                document.getElementById('reducir_separacionHor').style.display = 'none';
                document.getElementById('cumple_estribosHor').innerHTML = `<b class="green">El Número de estribos es suficiente</b>`;

                // Mostrar tabla de resumen final
                // document.getElementById('tabla_resultado_cortante_cols').style.display = 'block';
                document.getElementById("separacion_vars").innerHTML = separacion;
                // document.getElementById("area_conf").innerHTML = ach;
                document.getElementById("ref_min_horizontal").innerHTML = ashHorizontal.toFixed(2);
                document.getElementById("no_est_horizontal").innerHTML = noEstribosHor;
            }
            console.log(`Horiz: ${noEstribosHor} de ${numeroEstribosHorizontal}. Vert: ${noEstribosVert} de ${numeroEstribosVertical}`);

            document.getElementById("refFinal").innerHTML = `<div class="text-center">
                <h3>Por lo tanto, el refuerzo final debe ser:</h3><br><br><img src="./img/refFinal_${numeroEstribosHorizontal}_${numeroEstribosVertical}.png" alt=""
                   style="width: 300px;">
             </div>`;
            if (noEstribosHor == numeroEstribosHorizontal && noEstribosVert == numeroEstribosVertical) {
                document.getElementById("refFinal").innerHTML = `<div class="text-center">
                <h3>Por lo tanto, el refuerzo final debe ser:</h3><br><br><img src="./img/refFinal_${noEstribosHor}_${noEstribosVert}.png" alt=""
                   style="width: 300px;">
             </div>`;
            }

            document.getElementById("area_conf").innerHTML = ach;
            document.getElementById("separacion_vars").innerHTML = separacion;
            // 
            document.getElementById('tabla_resultado_cortante_cols').style.display = 'block';




            //////////Resistencia Vu
            let d=h-recubrimiento-diametroVarLong/2-diametroBarraEstribo;
            let acero_suministrado=142;
            let resistenciaOVn = ((0.75 * acero_suministrado * Fy * d) / separacion)/1000;
            console.log("resistenciaOVn => " + resistenciaOVn);
            document.getElementById('res_OVN').innerHTML = resistenciaOVn.toFixed(2);


            document.getElementById('cortante_fin').innerHTML = `${resistenciaOVn.toFixed(2)}kN`;


            document.getElementById('resSep').innerHTML = '';
            //document.getElementById('sep_Long').innerHTML = '';
            //document.getElementById('res_OVN').innerHTML = '';
            document.getElementById('cambioValores').innerHTML = '';

            // Vu = 81.49;
            if (resistenciaOVn <= Vu) {
                //Disminuir maximo hasta 50mm la separacion longitudinal y recalcular resistencia
                document.getElementById('condicion_resistencia').innerHTML = `Para este caso <b class="red">no se cumple</b> que la resistencia ϕVn>Vu( ${resistenciaOVn.toFixed(2)}kN <= ${Vu}kN ).`;
                chequearResistencia(separacion, resistenciaOVn, Vu, Fy, d);

            } else {
                //si
                document.getElementById('condicion_resistencia').innerHTML = `Para este caso <b class="green">si se cumple</b> que la resistencia ϕVn>Vu. ${resistenciaOVn.toFixed(2)}kN > ${Vu}kN`;
            }


        }
    }
}

function chequearResistencia(separacion_longitudinal, resistenciaOVn, Vu, Fy, d) {
    document.getElementById('res_OVN').innerHTML = resistenciaOVn.toFixed(2);

    document.getElementById('resSep').innerHTML = '';
    //document.getElementById('separacion_vars').innerHTML = '';
    //document.getElementById('res_OVN').innerHTML = '';
    document.getElementById('cambioValores').innerHTML = '';

    separacion_longitudinal -= 5;

    document.getElementById('resSep').innerHTML = `Se disminuye la separación hasta ${separacion_longitudinal}mm y se volvió a calcular.`;

    console.log("Separacion en: ", separacion_longitudinal);
    // document.getElementById('separacion_vars').innerHTML = separacion_longitudinal;

    let acero_suministrado = 142;//av_suministrado
    console.log("acero_suministrado => " + acero_suministrado);

    resistenciaOVn = ((0.75 * acero_suministrado * Fy * d) / separacion_longitudinal)/1000;
    console.log("y la resistenciaOVn => " + resistenciaOVn);
    document.getElementById('res_OVN').innerHTML = resistenciaOVn.toFixed(2);

    if (resistenciaOVn <= Vu) {
        console.log("Aun No cumple resistencia");
        if (separacion_longitudinal >= 50) {
            chequearResistencia(separacion_longitudinal, resistenciaOVn, Vu, Fy, d);
        } else {
            document.getElementById('cambioValores').innerHTML = `Se recomineda cambiar de valores. Se obtiene la resistencia: ${resistenciaOVn.toFixed(2)}kN y la separación es menor a 50mm`;
        }
    }
    else {
        console.log("Ya cumple resistencia");
        if (separacion_longitudinal < 50) {
            document.getElementById('cambioValores').innerHTML = `Se recomienda cambiar valores. Se obtiene la resistencia: ${resistenciaOVn.toFixed(2)}kN > ${Vu}kN, pero la separación es menor a 50mm`;
        } else {
            document.getElementById('cambioValores').innerHTML = `Se obtiene la resistencia: ${resistenciaOVn.toFixed(2)}kN > ${Vu}kN`;
        }
    }
}




function reducirSeparacionVert(separacion, b, Fc, Fy, h, ach, areaBarraEstribo, numeroEstribosVertical, cantidadVarillas) {
    ///se debe disminuir la separacion maximo hasta 50mm
    //Volver a colocar los nuevos valores
    // document.getElementById("separacion_vars").innerHTML = separacion;

    // document.getElementById('reducir_separacion').style.display = 'block';
    document.getElementById('NOcumple_estribos').innerHTML = `<b class="text-warning">La cantidad de estribos sobrepasa la cantidad de las varillas a amarrar. Se debe disminuir la separación máximo hasta 50mm</b>`;
    separacion -= 5;

    document.getElementById("sep2").innerHTML = separacion;
    //refuerzo minimo (vertical)
    let ash1Vertical = ((0.3 * separacion * b * Fc) / Fy) * (((b * h) / (ach)) - 1);
    let ash2Vertical = ((0.09 * separacion * b * Fc) / Fy);
    let ashVertical = Math.max(ash1Vertical, ash2Vertical);
    let noEstribosVert = Math.max(2, Math.floor(ashVertical / areaBarraEstribo));
    document.getElementById("ref_min_vertical").innerHTML = ashVertical.toFixed(2);
    document.getElementById("no_est_vertical").innerHTML = noEstribosVert;

    console.log(`Separacion en: ${separacion} - NoEstribosVert: ${noEstribosVert}`);

    document.getElementById('ash1CortR').innerHTML = `${ash1Vertical.toFixed(2)}mm<sup>2</sup>`;
    document.getElementById('ash2CortR').innerHTML = `${ash2Vertical.toFixed(2)}mm<sup>2</sup>`;

    document.getElementById('ashReduc').innerHTML = `(${ash1Vertical.toFixed(2)}mm<sup>2</sup>; ${ash2Vertical.toFixed(2)}mm<sup>2</sup>) = ${ashVertical.toFixed(2)}mm<sup>2</sup>`;
    document.getElementById('NoEstribsRed').innerHTML = `${noEstribosVert} und`;

    if (noEstribosVert != numeroEstribosVertical) {
        if (separacion >= 50) {
            reducirSeparacionVert(separacion, b, Fc, Fy, h, ach, areaBarraEstribo, numeroEstribosVertical, cantidadVarillas);
        } else {
            //se debe cambiar la barra longitudinal
            document.getElementById('NoEstribsRed').innerHTML = `${noEstribosVert} und`;
            document.getElementById('NOcumple_estribos2').innerHTML = `<b class="text-warning">Se recomienda cambiar de valores para tener un número de estribos suficiente.</b>
        
    `;
        }
    } else {
        //se muestra resultados
        if (cantidadVarillas == 4 || cantidadVarillas == 6 || cantidadVarillas == 8 || cantidadVarillas == 10 || cantidadVarillas == 12) {
            document.getElementById("refMinVert2").innerHTML = `<img src="./img/refVertical_${noEstribosVert}_${cantidadVarillas}.png" alt="" width="250">`;
        }
        document.getElementById('cumple_estribos2').innerHTML = `<b class="green">El Número de estribos es suficiente</b>`;

    }



}

function reducirSeparacionHor(separacion, b, Fc, Fy, h, ach, areaBarraEstribo, numeroEstribosHorizontal, cantidadVarillas) {
    ///se debe disminuir la separacion maximo hasta 50mm
    //Volver a colocar los valores
    // document.getElementById("separacion_vars").innerHTML = separacion;

    // document.getElementById('reducir_separacionHor').style.display = 'block';
    document.getElementById('NOcumple_estribosHor').innerHTML = `<b class="text-warning">La cantidad de estribos sobrepasa la cantidad de las varillas a amarrar. Se debe disminuir la separación máximo hasta 50mm.</b>`;
    separacion -= 5;
    document.getElementById("sep2Hor").innerHTML = separacion;

    //refuerzo minimo (vertical)
    let ash1Horizontal = ((0.3 * separacion * h * Fc) / Fy) * (((b * h) / (ach)) - 1);
    let ash2Horizontal = ((0.09 * separacion * h * Fc) / Fy);
    let ashHorizontal = Math.max(ash1Horizontal, ash2Horizontal);
    let noEstribosHor = Math.max(2, Math.floor(ashHorizontal / areaBarraEstribo));
    document.getElementById("ref_min_horizontal").innerHTML = ashHorizontal.toFixed(2);
    document.getElementById("no_est_horizontal").innerHTML = noEstribosHor;
    console.log(`Separacion en: ${separacion} - NoEstribosHor: ${noEstribosHor}`);

    document.getElementById('ash1CortRHor').innerHTML = `${ash1Horizontal.toFixed(2)}mm<sup>2</sup>`;
    document.getElementById('ash2CortRHor').innerHTML = `${ash2Horizontal.toFixed(2)}mm<sup>2</sup>`;

    document.getElementById('ashReducHor').innerHTML = `(${ash1Horizontal.toFixed(2)}mm<sup>2</sup>; ${ash2Horizontal.toFixed(2)}mm<sup>2</sup>) = ${ashHorizontal.toFixed(2)}mm<sup>2</sup>`;
    document.getElementById('NoEstribsRedHor').innerHTML = `${noEstribosHor} und`;

    if (noEstribosHor != numeroEstribosHorizontal) {
        if (separacion >= 50) {
            reducirSeparacionHor(separacion, b, Fc, Fy, h, ach, areaBarraEstribo, numeroEstribosHorizontal, cantidadVarillas);
        } else {
            //se debe cambiar la barra longitudinal
            document.getElementById('NoEstribsRedHor').innerHTML = `${noEstribosHor} und`;
            document.getElementById('NOcumple_estribos2Hor').innerHTML = `<b class="text-warning">Se recomienda cambiar de valores para tener un número de estribos suficiente.</b>
    `;
        }

    } else {
        //se muestra resultados
        if (cantidadVarillas == 4 || cantidadVarillas == 6 || cantidadVarillas == 8 || cantidadVarillas == 10 || cantidadVarillas == 12) {
            document.getElementById("refMinHor2").innerHTML = `<img src="./img/refHorizontal_${noEstribosHor}_${cantidadVarillas}.png" alt="" width="250">`;
        }
        document.getElementById('cumple_estribos2Hor').innerHTML = `<b class="green">El Número de estribos es suficiente</b>`;

    }

}

function calcularLongEst() {
    document.getElementById('zonConf').style.display = 'none';

    document.getElementById("TXTluzLibreLong").textContent = '';
    // document.getElementById("TXTalturaCol").textContent = '';
    document.getElementById("TXTluzLibre").textContent = '';
    let b = Number(document.getElementById("b").value); //
    let h = Number(document.getElementById("h").value); //
    let diametro = Number(document.getElementById("diametro").value);

    let luzLibreLong = Number(document.getElementById("luzLibreLong").value);
    // let alturaCol = Number(document.getElementById("alturaCol").value);
    if (b == '' || h == '') {
        console.log("Hay campos vacíos");
        document.getElementById("bh").innerHTML = '<h3 class="text-danger">Debe ingresar base y altura</h3>';
        document.getElementById("base").textContent = '(*) Complete los campos vacios';
        document.getElementById("TXTluzLibre").innerHTML = '<h3 class="text-danger">Verifique los datos de base y altura iniciales</h3>';
    }
    else if (luzLibreLong == '') {
        console.log("Hay campos vacíos");
        document.getElementById("TXTluzLibre").innerHTML = '<h3 class="text-danger">Debe ingresar los datos</h3>';
    } else if (luzLibreLong < 0) {
        console.log("Hay campos incorrectos");
        document.getElementById("TXTluzLibre").innerHTML = '<h3 class="text-danger">Debe ingresar valores correctos</h3>';
    } else {
        document.getElementById('zonConf').style.display = 'block';
        let h2mm = luzLibreLong / 2;
        document.getElementById("h2mm").innerHTML = `<h3>Por lo tanto: H/2 = ${h2mm}mm</h3>`;

        let minDimCol = Math.min(b, h);
        document.getElementById("minDimCol").innerHTML = minDimCol;

        let sextoCol = 1 / 6 * luzLibreLong;
        document.getElementById("sextoCol").innerHTML = sextoCol.toFixed(2);

        let minDimColSep = 1 / 4 * Math.min(b, h);
        document.getElementById("minDimColSep").innerHTML = minDimColSep;

        let ochoDiametro = 8 * diametro;
        document.getElementById("ochoDiametro").innerHTML = ochoDiametro;
    }

}