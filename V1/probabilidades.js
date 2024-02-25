function calcularProbabilidad(valorDeseado) {
    // Número total de combinaciones posibles (A ** B) A elevado a B.
    var totalCombinaciones = 6 ** 6;

    // Contador para las combinaciones favorables
    var combinacionesFavorables = 0;

    // Comprobar todas las combinaciones posibles
    for (var dado1 = 1; dado1 <= 6; dado1++) {
        for (var dado2 = 1; dado2 <= 6; dado2++) {
            for (var dado3 = 1; dado3 <= 6; dado3++) {
                for (var dado4 = 1; dado4 <= 6; dado4++) {
                    for (var dado5 = 1; dado5 <= 6; dado5++) {
                        for (var dado6 = 1; dado6 <= 6; dado6++) {
                            // Crear un array con los valores de los dados
                            var valoresDados = [dado1, dado2, dado3, dado4, dado5, dado6];
                            // Ordenar los valores de los dados de forma descendente
                            valoresDados.sort(function(a, b) {
                                return b - a;
                            });
                            // Sumar los tres valores más altos
                            var sumaTresMasAltos = valoresDados[0] + valoresDados[1] + valoresDados[2];
                            // Si la suma de los tres valores más altos es igual al valor deseado, incrementamos el contador
                            if (sumaTresMasAltos === valorDeseado) {
                                combinacionesFavorables++;
                            }
                        }
                    }
                }
            }
        }
    }

    // Calcular la probabilidad
    var probabilidad = combinacionesFavorables / totalCombinaciones;

    // Devolver la probabilidad
    return probabilidad;
}

// Ejemplo de uso: Calcular la probabilidad de obtener un total de 15 con los 3 valores más altos de 6 dados.
for (i=3;i<=18; i++){
    var valorDeseado = i;
    var probabilidad = calcularProbabilidad(valorDeseado)*100;
    console.log("La probabilidad de obtener un total de " + valorDeseado + " es: " + probabilidad.toFixed(4) + "%");
}