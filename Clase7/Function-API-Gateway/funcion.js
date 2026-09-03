let myTeam = [
    "Pepito - 2121212121",
    "Pepito2 - 2121212122",
    "Pepito3 - 2121212123"
];

module.exports = async function (context, req) {
    context.log("Hola mundo desde Azure Functions!");

    if (req.method === "GET") {
        context.res = {
            status: 200,
            body: { estudiantes: myTeam },
            headers: { 'Content-Type': 'application/json' }
        };
    } 
    else if (req.method === "PUT") {
        const NuevoIntegrante = req.body && req.body.estudiante;

        if (NuevoIntegrante) {
            myTeam.push(NuevoIntegrante);
            context.res = {
                status: 200,
                body: { 
                    mensaje: "Estudiante agregado con éxito",
                    listaActualizada: myTeam 
                }
            };
        } else {
            context.res = {
                status: 400,
                body: "Falta el nombre del estudiante"
            };
        }
    }
};