

function calcular_cortante_columna() {
    document.getElementById('formulas_cortante').style.display = 'block';

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
        let separacion = Math.round(sep / 10) * 10;
        document.getElementById('sep_varillas').innerHTML = `${separacion}mm`;
        if (separacion < 50) {
            console.log(`S=${separacion} es menor a 50. Se debe cambiar de barra Long`);
            msgResistencia = `Para este caso <b class="red">no se cumple</b> que la separación S (${separacion}mm) > 50mm. Por lo tanto, se recomienda que ingrese otros valores.`;
            document.getElementById('condicion_separacion').innerHTML = msgResistencia;

            document.getElementById('seguir_proceso').style.display = 'none';

        } else {

            console.log(`S=${separacion} es mayor a 50`);
            msgResistencia = `Para este caso <b class="green">sí se cumple</b> que la separación S (${separacion}mm) > 50mm`;
            document.getElementById('condicion_separacion').innerHTML = msgResistencia;
            document.getElementById('seguir_proceso').style.display = 'block';


            ///area confinada
            let base = b - (recubrimiento * 2) - (diametroBarraEstribo * 2);
            let altura = h - (recubrimiento * 2) - (diametroBarraEstribo * 2);
            let ach = base * altura;
            document.getElementById('baseCort').innerHTML = `${base}mm`;
            document.getElementById('altCort').innerHTML = `${altura}mm`;
            document.getElementById('a_conf').innerHTML = `${base}mm * ${altura}mm = ${ach}mm<sup>2</sup>`;

            //--refuerzo minimo (vertical)
            let ash1Vertical = ((0.3 * separacion * b * Fc) / Fy) * (((b * h) / (ach)) - 1);
            let ash2Vertical = ((0.09 * separacion * b * Fc) / Fy);
            let ashVertical = Math.max(ash1Vertical, ash2Vertical);
            let noEstribosVert = Math.max(2, Math.floor(ashVertical / areaBarraEstribo));
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
            document.getElementById("refMinVert2").innerHTML = `<img src="./img/refVertical_${numeroEstribosVertical}_${cantidadVarillas}.png" alt="" width="250">`;
            document.getElementById("refMinVert1").innerHTML = `<img src="./img/refVertical_${numeroEstribosVertical}_${cantidadVarillas}.png" alt="" width="250">`;

            if (noEstribosVert != numeroEstribosVertical) {
                // ///se debe disminuir la separacion

                document.getElementById('reducir_separacion').style.display = 'block';
                
                reducirSeparacionVert(separacion, b, Fc, Fy, h, ach, areaBarraEstribo, numeroEstribosVertical, cantidadVarillas);

                // document.getElementById('NOcumple_estribos').innerHTML = `<b class="text-warning">La cantidad de estribos sobrepasa la cantidad de las varillas a amarrar. Se debe disminuir la separación hasta 50mm.</b>`;
                // separacion = 50;
                // //refuerzo minimo (vertical)
                // ash1Vertical = ((0.3 * separacion * b * Fc) / Fy) * (((b * h) / (ach)) - 1);
                // ash2Vertical = ((0.09 * separacion * b * Fc) / Fy);
                // ashVertical = Math.max(ash1Vertical, ash2Vertical);
                // noEstribosVert = Math.max(2, Math.floor(ashVertical / areaBarraEstribo));
                // document.getElementById('ash1CortR').innerHTML = `${ash1Vertical.toFixed(2)}mm<sup>2</sup>`;
                // document.getElementById('ash2CortR').innerHTML = `${ash2Vertical.toFixed(2)}mm<sup>2</sup>`;

                // document.getElementById('ashReduc').innerHTML = `(${ash1Vertical.toFixed(2)}mm<sup>2</sup>; ${ash2Vertical.toFixed(2)}mm<sup>2</sup>) = ${ashVertical.toFixed(2)}mm<sup>2</sup>`;
                // document.getElementById('NoEstribsRed').innerHTML = `${noEstribosVert} und`;

                // if (noEstribosVert != numeroEstribosVertical) {
                //     //se debe cambiar la barra longitudinal
                //     document.getElementById('NoEstribsRed').innerHTML = `${noEstribosVert} und`;
                //     document.getElementById('NOcumple_estribos2').innerHTML = `<b class="text-warning">Se recomienda cambiar de barra longitudinal supuesta para tener un número de estribos suficiente.</b>
                // `;

                // } else {
                //     //se muestra resultados
                //     document.getElementById("refMinVert2").innerHTML = `<img src="./img/refVertical_${noEstribosVert}_${cantidadVarillas}.png" alt="" width="250">`;
                //     document.getElementById('cumple_estribos2').innerHTML = `<b class="green">El Número de estribos es suficiente</b>`;
                // }
            } else {
                //se muestra resultados
                document.getElementById("refMinVert1").innerHTML = `<img src="./img/refVertical_${noEstribosVert}_${cantidadVarillas}.png" alt="" width="250">`;
                document.getElementById('reducir_separacion').style.display = 'none';
                document.getElementById('cumple_estribos').innerHTML = `<b class="green">El Número de estribos es suficiente</b>`;
            }


            /////////////////////////////////////////////
            //--refuerzo minimo (horizontal)
            separacion = Math.round(sep / 10) * 10;
            let ash1Horizontal = ((0.3 * separacion * h * Fc) / Fy) * (((b * h) / (ach)) - 1);
            let ash2Horizontal = ((0.09 * separacion * h * Fc) / Fy);
            let ashHorizontal = Math.max(ash1Horizontal, ash2Horizontal);
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
            document.getElementById("refMinHor1").innerHTML = `<img src="./img/refHorizontal_${numeroEstribosHorizontal}_${cantidadVarillas}.png" alt="" width="250">`;
            document.getElementById("refMinHor2").innerHTML = `<img src="./img/refHorizontal_${numeroEstribosHorizontal}_${cantidadVarillas}.png" alt="" width="250">`;

            if (noEstribosHor != numeroEstribosHorizontal) {
                // ///se debe disminuir la separacion
                document.getElementById('reducir_separacionHor').style.display = 'block';
                reducirSeparacionHor(separacion, b, Fc, Fy, h, ach, areaBarraEstribo, numeroEstribosHorizontal, cantidadVarillas);

                // document.getElementById('NOcumple_estribosHor').innerHTML = `<b class="text-warning">La cantidad de estribos sobrepasa la cantidad de las varillas a amarrar. Se debe disminuir la separación hasta 50mm.</b>`;
                // separacion = 50;
                // //refuerzo minimo (vertical)
                // ash1Horizontal = ((0.3 * separacion * h * Fc) / Fy) * (((b * h) / (ach)) - 1);
                // ash2Horizontal = ((0.09 * separacion * h * Fc) / Fy);
                // ashHorizontal = Math.max(ash1Horizontal, ash2Horizontal);
                // noEstribosHor = Math.max(2, Math.floor(ashHorizontal / areaBarraEstribo));
                // document.getElementById('ash1CortRHor').innerHTML = `${ash1Horizontal.toFixed(2)}mm<sup>2</sup>`;
                // document.getElementById('ash2CortRHor').innerHTML = `${ash2Horizontal.toFixed(2)}mm<sup>2</sup>`;

                // document.getElementById('ashReducHor').innerHTML = `(${ash1Horizontal.toFixed(2)}mm<sup>2</sup>; ${ash2Horizontal.toFixed(2)}mm<sup>2</sup>) = ${ashHorizontal.toFixed(2)}mm<sup>2</sup>`;
                // document.getElementById('NoEstribsRedHor').innerHTML = `${noEstribosHor} und`;

                // if (noEstribosHor != numeroEstribosHorizontal) {
                //     //se debe cambiar la barra longitudinal
                //     document.getElementById('NoEstribsRedHor').innerHTML = `${noEstribosHor} und`;
                //     document.getElementById('NOcumple_estribos2Hor').innerHTML = `<b class="text-warning">Se recomienda cambiar de barra longitudinal supuesta para tener un número de estribos suficiente.</b>
                // `;

                // } else {
                //     //se muestra resultados
                //     document.getElementById("refMinHor2").innerHTML = `<img src="./img/refHorizontal_${noEstribosHor}_${cantidadVarillas}.png" alt="" width="250">`;
                //     document.getElementById('cumple_estribos2Hor').innerHTML = `<b class="green">El Número de estribos es suficiente</b>`;
                // }
            } else {
                //se muestra resultados
                document.getElementById("refMinHor1").innerHTML = `<img src="./img/refHorizontal_${noEstribosHor}_${cantidadVarillas}.png" alt="" width="250">`;
                document.getElementById('reducir_separacionHor').style.display = 'none';
                document.getElementById('cumple_estribosHor').innerHTML = `<b class="green">El Número de estribos es suficiente</b>`;
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
        }
    }
}

function reducirSeparacionVert(separacion, b, Fc, Fy, h, ach, areaBarraEstribo, numeroEstribosVertical, cantidadVarillas) {
    ///se debe disminuir la separacion maximo hasta 50mm

    // document.getElementById('reducir_separacion').style.display = 'block';
    document.getElementById('NOcumple_estribos').innerHTML = `<b class="text-warning">La cantidad de estribos sobrepasa la cantidad de las varillas a amarrar. Se debe disminuir la separación máximo hasta 50mm</b>`;
    separacion -= 5;

    document.getElementById("sep2").innerHTML = separacion;
    //refuerzo minimo (vertical)
    let ash1Vertical = ((0.3 * separacion * b * Fc) / Fy) * (((b * h) / (ach)) - 1);
    let ash2Vertical = ((0.09 * separacion * b * Fc) / Fy);
    let ashVertical = Math.max(ash1Vertical, ash2Vertical);
    let noEstribosVert = Math.max(2, Math.floor(ashVertical / areaBarraEstribo));
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
        document.getElementById("refMinVert2").innerHTML = `<img src="./img/refVertical_${noEstribosVert}_${cantidadVarillas}.png" alt="" width="250">`;
        document.getElementById('cumple_estribos2').innerHTML = `<b class="green">El Número de estribos es suficiente</b>`;
    }
}

function reducirSeparacionHor(separacion, b, Fc, Fy, h, ach, areaBarraEstribo, numeroEstribosHorizontal, cantidadVarillas) {
    ///se debe disminuir la separacion maximo hasta 50mm
    // document.getElementById('reducir_separacionHor').style.display = 'block';
    document.getElementById('NOcumple_estribosHor').innerHTML = `<b class="text-warning">La cantidad de estribos sobrepasa la cantidad de las varillas a amarrar. Se debe disminuir la separación máximo hasta 50mm.</b>`;
    separacion -= 5;
    document.getElementById("sep2Hor").innerHTML = separacion;

    //refuerzo minimo (vertical)
    let ash1Horizontal = ((0.3 * separacion * h * Fc) / Fy) * (((b * h) / (ach)) - 1);
    let ash2Horizontal = ((0.09 * separacion * h * Fc) / Fy);
    let ashHorizontal = Math.max(ash1Horizontal, ash2Horizontal);
    let noEstribosHor = Math.max(2, Math.floor(ashHorizontal / areaBarraEstribo));
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
        document.getElementById("refMinHor2").innerHTML = `<img src="./img/refHorizontal_${noEstribosHor}_${cantidadVarillas}.png" alt="" width="250">`;
        document.getElementById('cumple_estribos2Hor').innerHTML = `<b class="green">El Número de estribos es suficiente</b>`;
    }
}

function calcularLongEst() {
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