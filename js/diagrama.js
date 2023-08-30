

function diagramaInteraccion() {

    let b = Number(document.getElementById("b").value);
    let h = Number(document.getElementById("h").value);
    let fc = Number(document.getElementById("fc").value);
    let Fc1 = Number(document.getElementById("fc1").value); //
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
    else if (fc <= 0 && fc != '') {
        console.log("Hay campos incorrectos");
        document.getElementById("val_fc").innerHTML = '<h3 class="text-danger">La resistencia a la compresión no puede ser negativa o cero</h3>';
        document.getElementById("base").textContent = '(*) Hay campos incorrectos';
    } else {
        if (fc == '') {
            fc = Fc1;
            console.log("Valor de FC: ", fc);
            document.getElementById("fc").value = fc;
            // console.log("Hay campos vacíos");
            // document.getElementById("val_fc").innerHTML = '<h3 class="text-danger">Se necesita la resistencia a la compresión</h3>';
            // document.getElementById("base").textContent = '(*) Complete los campos vacios';
        }

        ////Datos para concreto
        let numFibras = Math.round(b / 20);
        let longFibra = h / numFibras;
        let es_concreto = esConcreto(fc);

        console.log(`Datos de concreto: #Fibras:${numFibras}, longFibra:${longFibra},esConcreto:${es_concreto}`);

        ////Datos para acero
        let es_acero = 200000;
        let recubrimiento = Number(document.getElementById("recubrimiento").value);
        let numeroVarillaLong = Number(document.getElementById("numeroVarilla").value);
        let diametroBarraLong = Number(document.getElementById("diametro").value); //
        let areaBarraLong = Number(document.getElementById("area").value); //
        let numeroBarraEstribo = Number(document.getElementById("numeroVarillaEstribo").value);
        let areaBarraEstribo = Number(document.getElementById("area_estribo").value);
        let diametroBarraEstribo = Number(document.getElementById("diametro_estribo").value);
        console.log(`Datos de acero: es_acero:${es_acero},recubrimiento:${recubrimiento},diametroLong:${diametroBarraLong},areaLong:${areaBarraLong},diamEstribo:${diametroBarraEstribo}`);



        let Ac = b * h;
        let Ai_concreto = ai_Concreto(Ac, numFibras);
        let Asmin = 0.01 * Ac;
        let cantidadVarillas = cantidadBarras(Asmin, areaBarraLong);




        let listaMn = [];//Para guardar los Mn de  la tabla general
        let listaPn = [];//Para guardar los Pn de  la tabla general
        let listaPhiMn = [];//Para guardar los phi*Mn de  la tabla general
        let listaPhiPn = [];//Para guardar los phi*Pn de  la tabla general
        for (let i = h; i >= 0; i -= longFibra) {

            ///Tablas de concreto
            let c;

            if (i == 0) {
                c = 1;
            } else {
                c = i;
            }
            console.log("C en este momento es:", c);
            let Fi = fi_Concreto(c);
            let listaYi_Concreto = [];
            let listaEi_Concreto = [];
            let listaGi_Concreto = [];
            let listaPi_Concreto = [];
            let listaMi_Concreto = [];
            for (let nF = 1; nF <= 20; nF += 1) {
                // console.log(nF);
                // let Ai = ai_Concreto(Ac, numFibras);
                let Yi_Concreto = yi_Concreto(h, longFibra, nF);
                let Ei_Concreto = ei_ConcretoAcero(Fi, c, h, Yi_Concreto);
                let Gi_Concreto = gi_Concreto(Ei_Concreto, es_concreto);
                listaYi_Concreto.push(Yi_Concreto);
                listaEi_Concreto.push(Ei_Concreto);
                listaGi_Concreto.push(Gi_Concreto);
                let Pi_Concreto = pi_ConcretoAcero(Ai_concreto, Gi_Concreto);
                listaPi_Concreto.push(Pi_Concreto);
                let Mi_Concreto = mi_ConcretoAcero(Pi_Concreto, Yi_Concreto);
                listaMi_Concreto.push(Mi_Concreto);

            }
            console.log("Ai", Ai_concreto);
            console.log("Yi", listaYi_Concreto);
            console.log("Ei CONCRETO:", listaEi_Concreto);
            console.log("Gi", listaGi_Concreto);
            console.log("Pi", listaPi_Concreto);
            console.log("Mi", listaMi_Concreto);

            let sumaMniConcreto = sumar_total_lista(listaMi_Concreto);

            let sumaPniConcreto = sumar_total_lista(listaPi_Concreto);
            console.log("SumaMniConcreto", sumaMniConcreto);
            console.log("SumaPniConcreto", sumaPniConcreto);

            ///Tablas de acero
            let x = x_Acero(recubrimiento, diametroBarraEstribo, diametroBarraLong);
            let separacionEntreVarillas = 130;
            let distribucionFibras = distribucionVarillas(cantidadVarillas);
            let listaAi_Acero = [];
            let listaYi_Acero = [];
            let listaEi_Acero = [];
            let listaGi_Acero = [];
            let listaPi_Acero = [];
            let listaMi_Acero = [];
            if (distribucionFibras.length == 2) {
                let Yi_acero1 = yi_Acero(h, x, 0);
                let Yi_acero2 = -Yi_acero1
                listaYi_Acero.push(Yi_acero1);
                listaYi_Acero.push(Yi_acero2);

            } else if (distribucionFibras.length == 3) {
                let Yi_acero1 = yi_Acero(h, x, 0);
                let Yi_acero2 = yi_Acero(h, x, separacionEntreVarillas);
                let Yi_acero3 = -Yi_acero1
                listaYi_Acero.push(Yi_acero1);
                listaYi_Acero.push(Yi_acero2);
                listaYi_Acero.push(Yi_acero3);

            } else {
                let Yi_acero1 = yi_Acero(h, x, 0);
                let Yi_acero2 = yi_Acero(h, x, separacionEntreVarillas);
                let Yi_acero3 = -Yi_acero2
                let Yi_acero4 = -Yi_acero1
                listaYi_Acero.push(Yi_acero1);
                listaYi_Acero.push(Yi_acero2);
                listaYi_Acero.push(Yi_acero3);
                listaYi_Acero.push(Yi_acero4);
            }
            for (let i = 0; i < distribucionFibras.length; i++) {
                let Ai_acero = distribucionFibras[i] * areaBarraLong;
                listaAi_Acero.push(Ai_acero);

                let Ei_acero = ei_ConcretoAcero(Fi, c, h, listaYi_Acero[i]);
                listaEi_Acero.push(Ei_acero);

                let Gi_acero = gi_Acero(Ei_acero, es_acero);
                listaGi_Acero.push(Gi_acero);

                let Pi_acero = pi_ConcretoAcero(Ai_acero, Gi_acero);
                listaPi_Acero.push(Pi_acero);

                let Mi_acero = pi_ConcretoAcero(Pi_acero, listaYi_Acero[i]);
                listaMi_Acero.push(Mi_acero);

            }
            console.log("Aceroooo");
            console.log("Ai", listaAi_Acero);
            console.log("Yi", listaYi_Acero);
            console.log("Ei ACERO", listaEi_Acero);
            console.log("Gi", listaGi_Acero);
            console.log("pi", listaPi_Acero);
            console.log("mi", listaMi_Acero);

            let sumaMniAcero = sumar_total_lista(listaMi_Acero);
            let sumapniAcero = sumar_total_lista(listaPi_Acero);
            console.log("SumaMniAcero", sumaMniAcero);
            console.log("SumaPniAcero", sumapniAcero);

            let sumaMniTotal = sumaMniAcero + sumaMniConcreto;
            let sumaPniTotal = sumapniAcero + sumaPniConcreto;

            listaMn.push(sumaMniTotal.toFixed(2));
            listaPn.push(sumaPniTotal.toFixed(2));

            let phi = Intercepto(listaEi_Acero[listaEi_Acero.length - 1]);
            console.log("Intercepto: ", phi);
            let phiPni = phi * sumaPniTotal;
            listaPhiPn.push(phiPni.toFixed(2));
            let phiMni = phi * sumaMniTotal;
            listaPhiMn.push(phiMni.toFixed(2));
            // for(let i=0;i<listaYi_Acero.length;i++){


            // }
        }
        let c = 1;
        console.log(c);///Para calcular el ultimo para c=1

        console.log("Lista Mn");
        console.log(listaMn);
        console.log("Lista Pn");
        console.log(listaPn);
        console.log("Lista phiMn");
        console.log(listaPhiMn);
        console.log("Lista phiPn");
        console.log(listaPhiPn);

        /////Llenar la tabla
        llenarTabla(listaMn, listaPn, listaPhiMn, listaPhiPn, h, longFibra);
        graficar(listaMn, listaPn, listaPhiMn, listaPhiPn);

        
    }
}


function llenarTabla(listaMn, listaPn, listaPhiMn, listaPhiPn, h, longFibra) {
    document.getElementById('tablagrafico').innerHTML = '';
    document.getElementById('tabla_diagrama').style = 'block';
    let table = document.getElementById('tablagrafico');
    table.innerHTML = `<tr>
    <td>&nbsp;</td>
    <td>0</td>
    <td id="pn1"></td>
    <td>0</td>
    <td id="phiPn1"></td>
 </tr>`;
    document.getElementById('pn1').innerHTML = listaPn[0];
    document.getElementById('phiPn1').innerHTML = listaPhiPn[0];
    let c = h;
    // Iterar sobre la lista y crear las filas y celdas
    for (let i = 0; i < listaMn.length; i++) {
        // Crear un elemento <tr> para cada objeto en la lista
        const fila = document.createElement('tr');

        // Crear un elemento <td> para cada propiedad del objeto
        const celdaC = document.createElement('td');
        if (c == 0) {
            celdaC.textContent = 1;
        }
        else {
            celdaC.textContent = c.toFixed(0);
        }
        const celdaMn = document.createElement('td');
        celdaMn.textContent = listaMn[i];

        const celdaPn = document.createElement('td');
        celdaPn.textContent = listaPn[i];

        const celdaPhiMn = document.createElement('td');
        celdaPhiMn.textContent = listaPhiMn[i];

        const celdaPhiPn = document.createElement('td');
        celdaPhiPn.textContent = listaPhiPn[i];


        // Agregar las celdas a la fila
        fila.appendChild(celdaC);
        fila.appendChild(celdaMn);
        fila.appendChild(celdaPn);
        fila.appendChild(celdaPhiMn);
        fila.appendChild(celdaPhiPn);

        // Agregar la fila al tbody
        table.appendChild(fila);
        c -= longFibra;
    }

}

let myChart = null;
function graficar(listaMn, listaPn, listaPhiMn, listaPhiPn) {
    if (myChart !== null) {
        myChart.destroy();
    }
    const x2=Math.ceil(Math.max(...listaMn)/10+1)*10;
    const x = [0, x2];
    const y1 = 0.75 * listaPhiPn[0];
    const y = [y1, y1];

    listaMn.unshift(0);
    listaPn.unshift(listaPn[0]);
    listaPhiMn.unshift(0);
    listaPhiPn.unshift(listaPhiPn[0]);

    let ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Pn vs Mn',
                    data: listaMn.map((value, index) => ({ x: value, y: listaPn[index] })),
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1,
                    backgroundColor: 'rgba(255, 159, 64, 1)'
                },
                {
                    label: 'ΦPn vs ΦMn',
                    data: listaPhiMn.map((value, index) => ({ x: value, y: listaPhiPn[index] })),
                    borderColor: 'blue',
                    borderWidth: 1,
                    backgroundColor: 'blue',
                    // pointStyle: false
                },
                {
                    label: '0.75 ΦPn',
                    data: x.map((value, index) => ({ x: value, y: y[index] })),
                    borderColor: 'red',
                    borderWidth: 1,
                    backgroundColor: 'red',
                    borderDash: [5, 5] // Esto hace que la línea sea punteada (5 pixeles de línea, 5 pixeles de espacio)

                }
            ]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true,
                    offset: true,
                    type: 'linear',
                    // position: 'bottom',
                    title: {
                        display: true,
                        text: 'Momento M (KN-m)' // Etiqueta para el eje horizontal
                    }
                },
                y: {
                    beginAtZero: true,
                    offset: true,

                    title: {
                        display: true,
                        text: 'Axial P (KN)' // Etiqueta para el eje vertical
                    }
                }
            }
        }
    });
}