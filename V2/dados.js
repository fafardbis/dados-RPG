// Definir una semilla
function srand(seed) {
    Math.seed = seed;
}

// Generar números aleatorios con semilla
function rand() {
    var $semilla = Math.random(10000);
    Math.seed = (Math.seed * 9301 + 49297) % $semilla;
    return Math.floor(Math.seed / ($semilla / 6)) + 1;
}

// Función para lanzar dados a mayores
function lanzarDados(dados, recortar, tipologia) {
    var resultados = [];
    // Usar la semilla
    srand(Math.floor(Math.random())); // Establecer una nueva semilla en cada tirada

    // Lanzar los n dados
    for (var i = 0; i < dados; i++) {
        resultados.push(rand());
    }

    // Ordenar los resultados en función del tipo de tirada
    resultados.sort(function(a, b) {
        if ( tipologia == "menor") {
            return a - b;
        } else {
            return b - a;
        }
    });

    // Quedarse con los "X" resultados más altos
    var mejoresResultados = resultados.slice(0, recortar);

    // Quedarse con el resto de los resultados    
    var peoresResultados = resultados.slice(recortar, dados);

    // Sumar los valores obtenidos
    var suma = mejoresResultados.reduce(function(acumulador, elemento) {
        return acumulador + elemento;
    }, 0);

    // Devolver los valores
    return [mejoresResultados, suma, peoresResultados];
}

function pintardado(valor){
    switch (valor) {
        case 1:
            var dado = "<div class='dice'><div class='dot' id='center'></div></div>";
          break;
        case 2:
            var dado = "<div class='dice'><div class='dot' id='top-left'></div><div class='dot' id='bottom-right'></div></div>";
          break;
        case 3:
            var dado = "<div class='dice'><div class='dot' id='center'></div><div class='dot' id='top-left'></div><div class='dot' id='bottom-right'></div></div>";
          break;
        case 4:
            var dado = "<div class='dice'><div class='dot' id='top-left'></div><div class='dot' id='top-right'></div><div class='dot' id='bottom-left'></div><div class='dot' id='bottom-right'></div></div>";
          break;
        case 5:
            var dado = "<div class='dice'><div class='dot' id='center'></div><div class='dot' id='top-left'></div><div class='dot' id='top-right'></div><div class='dot' id='bottom-left'></div><div class='dot' id='bottom-right'></div></div>";
          break;
        case 6:
            var dado = "<div class='dice'><div class='dot' id='top-left'></div><div class='dot' id='top-right'></div><div class='dot' id='bottom-left'></div><div class='dot' id='bottom-right'></div><div class='dot' id='middle-left'></div><div class='dot' id='middle-right'></div></div>";
          break;
        default:
          // Código a ejecutar si la expresion no coincide con ninguno de los valores anteriores
          var dado = "";
      }
    return dado;
}

function Tirardados(dados, recorte, tipologia) {
    var mejoresTresResultados = lanzarDados(dados, recorte, tipologia);

    // Leer la dificultad establecida
    var selectedValue = parseInt(slider.value);

    // var resultadoHTML = "<p>Los resultados obtenidos son: " + mejoresTresResultados[0].join(", ") + "</p>";
    var cantidadrecorte = dados - recorte;
    
    // Recorremos el rray de valores obtenidos para pasarlo a la función de pintado de dados
    dadoPintado_sel = "";   
    mejoresTresResultados[0].forEach(function(elemento) {
        dadoPintado_sel = dadoPintado_sel + pintardado(elemento);
    });

    if (mejoresTresResultados[2] == 0){
        var dadoPintado_rech = "";
    } else {
        dadoPintado_rech = "";   
        mejoresTresResultados[2].forEach(function(elemento) {
            dadoPintado_rech = dadoPintado_rech + pintardado(elemento);
        });
    }
    var porcentaje = calcularProbabilidad(dados,mejoresTresResultados[1]);
    var resultadosSuma = "<div class='row'><div class='resultado col-auto' ><span class='resultadonumero'>El valor obtenido es: </span><span class='valorresultado'>" + mejoresTresResultados[1] + "</span></div><div class='porcentaje col-auto'><span>" + porcentaje + "% </span></div></div>";

    // Pintamos valores al HTML
    document.getElementById("resultado").innerHTML = "<div class='row'><div class='seleccionat col'>" + dadoPintado_sel + "</div><div class='rebutjat col'>" + dadoPintado_rech + "</div></div>" + resultadosSuma;
  
    // Pintamos el título de la modal
    if (cantidadrecorte == 0){
        document.getElementById("ModalLabel").innerHTML = "Tirada normal";
    } else {
        document.getElementById("ModalLabel").innerHTML = "Tirada a " + cantidadrecorte + " dados a " + tipologia + "es";
    }

    // Asignamos dinámicamente la función de relanzar el dados: onclick="Tirardados(6,3,'mayor')
    // Obtén el elemento botón por su ID
    var miBoton = document.getElementById("relanzar");
    function relanzardados() {
        Tirardados(dados, recorte, tipologia);
    }
    miBoton.onclick = relanzardados;

    // Guardamos los resultados en un JSON
    // Crear un objeto con los datos
    var datos = {
        numDados: dados,
        valorDificultad: selectedValue,
        valorDeseado: mejoresTresResultados[0],
        valorRechazado: mejoresTresResultados[2],
        valorObtenido: mejoresTresResultados[1],
        TipologiaTirada: tipologia + "es"
    };

    // Convertir el objeto a formato JSON
    // var jsonDatos = JSON.stringify(datos);

    // Guardar los datos en el JSon
    guardarEnArchivoJson(datos);

    // Llamar a la función para pintar los datos cuando sea necesario
    pintarDatosEnHTML();
}

function calcularProbabilidad(numDados, valorDeseado) {
    // Número total de combinaciones posibles
    var totalCombinaciones = Math.pow(6, numDados);

    // Contador para las combinaciones favorables
    var combinacionesFavorables = 0;

    // Función recursiva para generar combinaciones y contar las favorables
    function generarCombinaciones(dadoActual, sumaActual, valoresSeleccionados) {
        // Si ya hemos seleccionado tres valores

        if (valoresSeleccionados.length === 3) {
            // Ordenamos los valores seleccionados de forma descendente
            valoresSeleccionados.sort(function(a, b) {
                return b - a;
            });
            // Sumamos los tres valores más altos
            var sumaTresMasAltos = valoresSeleccionados[0] + valoresSeleccionados[1] + valoresSeleccionados[2];
            // Verificamos si la suma es igual al valor deseado
            if (sumaTresMasAltos === valorDeseado) {
                combinacionesFavorables++;
            }
            return;
        }
        // Si aún quedan dados por lanzar
        if (dadoActual < numDados) {
            // Lanzamos cada dado y generamos las combinaciones recursivamente
            for (var i = 1; i <= 6; i++) {
                generarCombinaciones(dadoActual + 1, sumaActual + i, [...valoresSeleccionados, i]);
            }
        }
    }

    // Iniciamos la generación de combinaciones
    generarCombinaciones(0, 0, []);

    // Calculamos la probabilidad
    var probabilidad = ((combinacionesFavorables / totalCombinaciones)*100).toFixed(2);

    // Devolvemos la probabilidad
    return probabilidad;
}

function guardarEnArchivoJson(nuevosDatos) {
    // Obtener los datos existentes del archivo JSON si hay alguno
    var jsonDatosExistente = localStorage.getItem('datos_json');
    var datosExistente = jsonDatosExistente ? JSON.parse(jsonDatosExistente) : [];

    // Verificar si hay datos existentes
    if (datosExistente && Array.isArray(datosExistente)) {
        // Agregar los nuevos datos a los datos existentes
        datosExistente.push(nuevosDatos);

        // Convertir los datos combinados en formato JSON
        var jsonDatosNuevo = JSON.stringify(datosExistente);

        // Guardar los datos en el archivo JSON
        localStorage.setItem('datos_json', jsonDatosNuevo);
    } else {
        // Si no hay datos existentes, guardar los nuevos datos directamente
        var jsonDatosNuevo = JSON.stringify([nuevosDatos]);
        localStorage.setItem('datos_json', jsonDatosNuevo);
    }
}

function pintarDatosEnHTML() {
    // Obtener los datos del archivo JSON almacenado en localStorage
    var jsonDatos = localStorage.getItem('datos_json');
    var datos = jsonDatos ? JSON.parse(jsonDatos) : [];

    // Obtener el elemento de la tabla en el HTML
    var tabla = document.getElementById('tabla');

    // Limpiar el contenido existente de la tabla
    tabla.innerHTML = '';

    // Crear la fila de cabecera
    var cabecera = tabla.createTHead();
    var filaCabecera = cabecera.insertRow();

    // Añadir las cabeceras
    var cabeceras = ['Resultado', 'Dificultad', 'Valores obtenidos', 'Valores rechazados', 'Tirada', 'Acción'];

    cabeceras.forEach(function(cabeceraTexto) {
        var th = document.createElement('th');
        th.textContent = cabeceraTexto;
        filaCabecera.appendChild(th);
    });

    // Iterar sobre los datos y crear filas y celdas en la tabla para cada uno
    datos.forEach(function(item) {
        // Crear una nueva fila
        var fila = tabla.insertRow();

        // Crear celdas para cada propiedad del objeto
        var celdaValorObtenido = fila.insertCell();
        celdaValorObtenido.textContent = item.valorObtenido;

        var celdaNivelDificultad = fila.insertCell();
        celdaNivelDificultad.textContent = item.valorDificultad;

        var celdaValorDeseado = fila.insertCell();
        celdaValorDeseado.textContent = item.valorDeseado.join(', '); // Supongamos que 'valorDeseado' es un array

        var celdavalorRechazado = fila.insertCell();
        celdavalorRechazado.textContent = item.valorRechazado.join(', '); // Supongamos que 'valorRechazado' es un array
        var longitud = item.valorRechazado.length;

        var celdaTipologiaTirada = fila.insertCell();
        celdaTipologiaTirada.textContent = capitalizarTexto(item.TipologiaTirada) + " [" + longitud + "]";

        // Crear el botón de eliminar
        var botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.addEventListener('click', function() {
            // Obtener el índice del elemento que se va a eliminar
            var index = datos.findIndex(function(elemento) {
                return elemento.valorDeseado.join(', ') === item.valorDeseado.join(', '); // Comparar los arrays de valorDeseado
            });
            if (index !== -1) {
                // Eliminar el elemento del array de datos
                datos.splice(index, 1);
                // Eliminar la fila de la tabla
                tabla.deleteRow(fila.rowIndex);
                eliminarRegistro(index);
            }
        });

        // Agregar el botón de eliminar como una celda en la fila
        var celdaBoton = fila.insertCell();
        celdaBoton.appendChild(botonEliminar);
    });
}

function eliminarRegistro(index) {
    // Obtener el JSON almacenado en localStorage
    var jsonDatosExistente = localStorage.getItem('datos_json');
    var datosExistente = jsonDatosExistente ? JSON.parse(jsonDatosExistente) : [];

    // Verificar si el índice está dentro del rango de los datos existentes
    if (index >= 0 && index < datosExistente.length) {
        // Eliminar el registro específico del JSON
        datosExistente.splice(index, 1);

        // Guardar el nuevo JSON en el LocalStorage
        localStorage.setItem('datos_json', JSON.stringify(datosExistente));

        console.log('Registro eliminado con éxito.');
    } else {
        console.log('Índice fuera de rango o JSON vacío. No se puede eliminar el registro.');
    }
}

// Capitalizar texto
function capitalizarTexto(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

function generarPDF() {
    // Obtener los datos del almacenamiento local
    var jsonDatos = localStorage.getItem('datos_json');
    var datos = jsonDatos ? JSON.parse(jsonDatos) : [];

    // Crear un contenedor HTML para el contenido del PDF
    var contenidoHTML = '<h1>Datos almacenados en el LocalStorage</h1>';

    // Iterar sobre los datos y agregarlos al contenido HTML
    datos.forEach(function(item) {
        contenidoHTML += '<p><strong>Valor Deseado:</strong> ' + item.valorDeseado.join(', ') + '</p>';
        contenidoHTML += '<p><strong>Valor Obtenido:</strong> ' + item.valorObtenido + '</p>';
        contenidoHTML += '<p><strong>Tipologia Tirada:</strong> ' + item.TipologiaTirada + '</p>';
        contenidoHTML += '<hr>'; // Separador entre registros
    });

    // Opciones para la creación del PDF
    var opciones = {
        margin: 1,
        filename: 'datos_localstorage.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Generar el PDF
    html2pdf().from(contenidoHTML).set(opciones).save();
}

function datosGrafica() {
    // Obtener los datos del archivo JSON almacenado en localStorage
    var jsonDatos = localStorage.getItem('datos_json');
    var datos = jsonDatos ? JSON.parse(jsonDatos) : [];

    var valoresGrafica = [];

    // Iterar sobre los datos y guardar los valores deseados en el array
    datos.forEach(function(item) {
        // Aquí debes acceder al valor específico que deseas guardar en el array
        // Supongamos que quieres guardar el valor obtenido de cada objeto en el array
        valoresGrafica.push(item.valorObtenido);
    });

    // Devolver el array con los valores de la gráfica
    return valoresGrafica;
}

function datosDificultad() {
    // Obtener los datos del archivo JSON almacenado en localStorage
    var jsonDatos = localStorage.getItem('datos_json');
    var datos = jsonDatos ? JSON.parse(jsonDatos) : [];

    var valoresDificultad = [];

    // Iterar sobre los datos y guardar los valores deseados en el array
    datos.forEach(function(item) {
        // Aquí debes acceder al valor específico que deseas guardar en el array
        // Supongamos que quieres guardar el valor obtenido de cada objeto en el array
        valoresDificultad.push(item.valorDificultad);
    });

    // Devolver el array con los valores de la gráfica
    return valoresDificultad;
}


// Definir la variable graficoTiradas fuera de la función
var graficoTiradas;

function pintarGrafico() {    
    // Datos de las tiradas y valores objetivos
    var tiradas = datosGrafica();
    var valoresObjetivo = datosDificultad();
  
    // Calcular la cantidad de tiradas pasadas
    var cantidadTiradas = tiradas.length;
    console.log(cantidadTiradas);
  
    // Generar los labels dinámicamente
    var etiquetas = [];
    for (var i = 1; i <= cantidadTiradas; i++) {
      etiquetas.push('Tirada ' + i);
    }
  
    // Preparar los datos para el gráfico
    var data = {
      labels: etiquetas,
      datasets: [
        {
          label: 'Tiradas',
          data: tiradas,
          type: 'line', // Tipo de gráfico: línea
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          pointRadius: 5,
          pointBackgroundColor: [],
        },
        {
          label: 'Dificultad',
          data: valoresObjetivo,
          type: 'bar', // Tipo de gráfico: barras
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          pointRadius: 5,
          pointBackgroundColor: [],
        }
      ]
    };
  
    // Configuración del gráfico
    var options = {
        scales: {
            y: {
              beginAtZero: false,
              min: 3,
              max: 18,
              ticks: {
                stepSize: 3
            }
            }
          }
    };
  
    // Obtener el contexto del gráfico
    var ctx = document.getElementById('graficoTiradas').getContext('2d');
  
    // Verificar si hay un gráfico previo y destruirlo si es necesario
    if (graficoTiradas) {
        graficoTiradas.destroy();
    }
  
    // Crear el gráfico de líneas
    graficoTiradas = new Chart(ctx, {
      type: 'line',
      data: data,
      options: options
    });
  }
  
// Función para actualizar el valor seleccionado
function updateSliderValue() {
    var selectedValue = parseInt(slider.value);
    if (selectedValue >= 3 && selectedValue <= 6) {
        sliderValue.innerHTML = "Valor seleccionado: Básico [" + selectedValue + "]";
    } else if (selectedValue >= 7 && selectedValue <= 9) {
        sliderValue.innerHTML = "Valor seleccionado: Normal [" + selectedValue + "]";
    } else if (selectedValue >= 10 && selectedValue <= 12) {
        sliderValue.innerHTML = "Valor seleccionado: Moderado [" + selectedValue + "]";
    } else if (selectedValue >= 13 && selectedValue <= 15) {
        sliderValue.innerHTML = "Valor seleccionado: Difícil [" + selectedValue + "]";
    } else if (selectedValue >= 16 && selectedValue <= 17) {
        sliderValue.innerHTML = "Valor seleccionado: Muy difícil [" + selectedValue + "]";
    } else if (selectedValue >= 18 && selectedValue <= 18) {
        sliderValue.innerHTML = "Valor seleccionado: Extremo [" + selectedValue + "]";
    }
}

function descargarLocalStorage() {
    var datos = JSON.stringify(localStorage);
    var blob = new Blob([datos], { type: 'application/json' });
    var url = URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.href = url;
    a.download = 'localStorage.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

window.addEventListener('load', function() {
    // Llama a la función pintarDatosEnHTML al finalizar la carga completa de la página
    pintarDatosEnHTML();

    // Obtener el elemento del slider
    var slider = document.getElementById("slider");

    // Obtener el elemento donde se mostrará el valor seleccionado
    var sliderValue = document.getElementById("sliderValue");
    
    // Mostrar el valor inicial del slider
    updateSliderValue();

    // Actualizar el valor seleccionado cuando el usuario mueve el slider
    slider.oninput = function() {
        updateSliderValue();
    }
});