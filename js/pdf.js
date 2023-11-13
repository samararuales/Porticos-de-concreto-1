window.jsPDF = window.jspdf.jsPDF;
function generarPDF() {
    const doc = new jsPDF('p','mm','letter');

    let table = document.getElementById('tabla_varillas');
    doc.text('Reporte de resultados', 10, 10);
    
    doc.html(table,{
        callback: function (doc) {
            window.open(doc.output('bloburl'),'_blank');
        },
        margin:[30,5,15,30],
        x:0,
        y:0,
        width:150,
        windowWidth:675
    });
}

function generarPDFVigas(){
    const doc = new jsPDF('p','mm','letter');

    let table_superior = document.getElementById('superior');
    let table_medio = document.getElementById('inferior');
    let table_inferior = document.getElementById('resultado_cortante');

    // Agregar estilos CSS al encabezado del documento HTML
    let style = '<style>h1 { font-size: 24px; font-weight: bold; text-align: center; font-family: Arial, Helvetica, sans-serif; color: black;}h2 { font-size: 20px; font-weight: bold; text-align: center;}table { text-align: center; }</style>';

    // Crear un elemento HTML que contenga las tres tablas con títulos y subtítulos
    let content = '<h1>REPORTE DE RESULTADOS: CÁLCULO DE VIGAS</h1><hr><br><br><h1>DISEÑO A FLEXIÓN</h1><div><br><br><h2>Datos fibra superior</h2>';
    content += table_superior.innerHTML;
    content += '</div><div><br><br><br><h2>Datos fibra inferior</h2>';
    content += table_medio.innerHTML;
    content += '</div><br><br><br><br><br><br><br><div><h1>CÁLCULOS CORTANTE</h1><br>';
    content += table_inferior.innerHTML;
    content += '</div>';

    // Agregar contenido HTML con estilos CSS al PDF utilizando el método doc.html()
    doc.html(content+style,{
        callback: function (doc) {
            //doc.output('dataurlnewwindow',{filename:'reporte.pdf'});
            //window.open(doc.output('bloburl'),'_blank');
            doc.save('calculo_vigas.pdf');
        },
        margin:[30,5,30,25],
        x:0,
        y:0,
        width:150,
        windowWidth:675
    });
}


function generarPDFColumnas2(){
    const doc = new jsPDF('p','mm','letter');

    let table_superior = document.getElementById('resultado');
    let table_medio = document.getElementById('myChart');
    let table_inferior = document.getElementById('resultado_cortante_cols');

    // Agregar estilos CSS al encabezado del documento HTML
    let style = '<style>h1 { font-size: 24px; font-weight: bold; text-align: center; font-family: Arial, Helvetica, sans-serif; color: black;}h2 { font-size: 20px; font-weight: bold; text-align: center;}table { text-align: center; }</style>';

    // Crear un elemento HTML que contenga las tres tablas con títulos y subtítulos
    let content = '<h1>REPORTE RESULTADOS: CÁLCULO DE COLUMNAS</h1><hr><br><br><h1>DISEÑO A FLEXIÓN</h1><div><br><br>';
    content += table_superior.innerHTML;
    content += '</div><div><br><br><br><h2>Gráfico</h2>';
    content += table_medio;
    content += '</div><br><br><br><br><br><br><br><div><h1>CÁLCULOS CORTANTE</h1><br>';
    content += table_inferior.innerHTML;
    content += '</div>';

    // Agregar contenido HTML con estilos CSS al PDF utilizando el método doc.html()
    doc.html(content+style,{
        callback: function (doc) {
            //doc.output('dataurlnewwindow',{filename:'reporte.pdf'});
            //window.open(doc.output('bloburl'),'_blank');
            doc.save('calculo_columnas.pdf');
        },
        margin:[30,5,30,25],
        x:0,
        y:0,
        width:150,
        windowWidth:675
    });
}

function generarPDFColumnas(){
    const doc = new jsPDF('p','mm','letter');

    let table_superior = document.getElementById('resultado');
    let table_medio = document.getElementById('myChart');
    let table_inferior = document.getElementById('resultado_cortante_cols');
    let table_inferior2 = document.getElementById('zona_confinamiento_resultado');

    // Agregar estilos CSS al encabezado del documento HTML
    let style = '<style>h1 { font-size: 24px; font-weight: bold; text-align: center; font-family: Arial, Helvetica, sans-serif; color: black;}h2 { font-size: 20px; font-weight: bold; text-align: center;}table { text-align: center; } </style>';

    // Crear un elemento HTML que contenga las tres tablas con títulos y subtítulos
    let content = '<h1>REPORTE RESULTADOS: CÁLCULO DE COLUMNAS</h1><hr><br><br><h1>DISEÑO A FLEXIÓN</h1><br><div>';
    content += table_superior.innerHTML;


    // Agregar la imagen del gráfico al contenido HTML utilizando la etiqueta <img>
    let imgData = table_medio.toDataURL('image/png');
    if(imgData!=''){

        content += '</div><br><br><div><h2>Gráfico</h2>';

        content += '<img src="' + imgData + '" width="800px">';
    
    }
    content += '</div><br><br><br><br><div><h1>CÁLCULOS CORTANTE</h1>';
    content += table_inferior.innerHTML;
    content += '</div><br><br>';
    content += table_inferior2.innerHTML;


    // Agregar contenido HTML con estilos CSS al PDF utilizando el método doc.html()
    doc.html(content+style,{
        callback: function () {
            // Abrir el archivo PDF en una nueva pestaña
            doc.save('calculo_columnas.pdf');
        },
        margin:[20,5,20,25],
        x:0,
        y:0,
        width:150,
        windowWidth:675
    });
}

function generarPDFColumnas3(){
    const doc = new jsPDF('p','mm','letter');

    let table_superior = document.getElementById('resultado');
    let table_medio = document.getElementById('grafico');
    let table_inferior = document.getElementById('resultado_cortante_cols');

    // Agregar estilos CSS al encabezado del documento HTML
    let style = '<style>h1 { font-size: 24px; font-weight: bold; text-align: center; font-family: Arial, Helvetica, sans-serif; color: black;}h2 { font-size: 20px; font-weight: bold; text-align: center;}table { text-align: center; }</style>';

    // Crear un elemento HTML que contenga las tres tablas con títulos y subtítulos
    let content = '<h1>REPORTE RESULTADOS: CÁLCULO DE COLUMNAS</h1><hr><br><br><h1>DISEÑO A FLEXIÓN</h1><div><br><br>';
    content += table_superior.innerHTML;
    content += '</div><div><br><br><br><h2>Gráfico</h2>';

    // Capturar una imagen del gráfico utilizando html2canvas
    html2canvas(table_medio).then(function(canvas) {
        let imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 0, 120, 170, 80); // Agregar la imagen al PDF
    });

    content += '</div><br><br><br><br><br><br><br><div><h1>CÁLCULOS CORTANTE</h1><br>';
    content += table_inferior.innerHTML;
    content += '</div>';

    // Agregar contenido HTML con estilos CSS al PDF utilizando el método doc.html()
    doc.html(content+style,{
        callback: function () {
            // Abrir el archivo PDF en una nueva pestaña
            doc.save('calculo_columnas.pdf');
        },
        margin:[30,5,30,25],
        x:0,
        y:0,
        width:150,
        windowWidth:675
    });
}