import { Nota } from './nota.js'

const tareaInput = document.getElementById('tarea_input');
const borrarTareas = document.getElementById('borrarTareas');
const notasContainer = document.getElementById('tareas');
const numTareas = document.getElementById('numTareas');
const numTareasPendientes = document.getElementById('numTareasPendientes');
const colorPrioridad = {"low": "blue", "normal": "orange", "high": "red"};

function mostrarNotas() {
    let notas = Nota.obtenerPorPrioridad();

    notas.forEach(nota => {
        mostrarNota(nota);
    });
}

function actualizarTareasContador() {
    numTareas.textContent = Nota.numeroNotas();
    numTareasPendientes.textContent = Nota.numeroNotasPendientes();
}

function marcaChecks() {
    const cheks = document.querySelectorAll('.check');
    cheks.forEach(check => {
        check.addEventListener('click', function() {
            check.classList.toggle('checked');

            let titulo = check.nextElementSibling;
            titulo.classList.toggle('tarea__info__nombre--checked');

            let estado = check.classList.contains('checked') ? 'completada' : 'pendiente';
            Nota.actualizarEstado(titulo.textContent, estado);
            actualizarTareasContador();
        });
    });
}

function marcarPrioridad() {
    const divPrioridades = document.querySelectorAll('.tarea__prioridad');
    divPrioridades.forEach(div => {
        let titulo = div.previousElementSibling.childElementCount === 2 ? div.previousElementSibling.firstElementChild.textContent : div.previousElementSibling.textContent;
        titulo = titulo.trim();
        let prioridad = Nota.getPrioridad(titulo);
        let prioridades = div.getElementsByClassName('prioridad');
        for (let i = 0; i < prioridades.length; i++) {
            if (prioridades[i].classList.contains(prioridad)) {
                prioridades[i].style.color = 'white';
                prioridades[i].style.backgroundColor = colorPrioridad[prioridad];
            }

            prioridades[i].addEventListener('click', function() {
                let prioridad = this.classList[1];
                Nota.actualizarPrioridad(titulo, prioridad);
                for (let j = 0; j < prioridades.length; j++) {
                    prioridades[j].style.color = '#999999';
                    prioridades[j].style.backgroundColor = '#464545';
                }
                this.style.color = 'white';
                this.style.backgroundColor = colorPrioridad[prioridad];

                notasContainer.innerHTML = '';
                mostrarNotas();
            });
        }
    });
}

function actualizarTiempo() {
    const divPrioridades = document.querySelectorAll('.tarea__prioridad');
    divPrioridades.forEach(div => {
        let titulo = div.previousElementSibling.childElementCount === 2 ? div.previousElementSibling.firstElementChild.textContent : div.previousElementSibling.textContent;
        titulo = titulo.trim();
        let tiempo = Nota.getTiempo(titulo);
        let temporizador = div.getElementsByClassName('tarea__temporizador')[0];
        temporizador.textContent = 'Añadido hace ' + tiempo + ' minutes ago';
    });
}


function borrarTarea() {
    const borrarTarea = document.querySelectorAll('.tarea__borrar');
    borrarTarea.forEach(borrar => {
        borrar.addEventListener('click', function() {
            let titulo = borrar.previousElementSibling.textContent;
            Nota.eliminar(titulo);
            borrar.parentElement.parentElement.remove();
            actualizarTareasContador();
        });
    });
}

borrarTareas.addEventListener('click', function() {
    Nota.eliminarCompletadas();
    notasContainer.innerHTML = '';

    mostrarNotas();
    actualizarTareasContador();
});

// añadir al nota al local storage
tareaInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        let titulo = tareaInput.value;

        let nota = new Nota(titulo);
        nota.guardar();

        tareaInput.value = '';
        mostrarNota(nota);
        actualizarTareasContador();
    }
});

function mostrarNota(nota) {
    notasContainer.innerHTML += `
        <div class="tarea">
            <div class="tarea__info">
                <div class="check ${nota.estado === 'completada' ? 'checked' : ''}"></div>
                <p class="tarea__info__nombre ${nota.estado === 'completada' ? 'tarea__info__nombre--checked' : ''}">${nota.titulo}</p>
                <button class="tarea__borrar"><div class="tarea__borrar__icono"><img src="img/trash.svg" alt=""></div></button>
            </div>
            <div class="tarea__prioridad">
                <p>Prioridad:</p> <p><span class="prioridad low"><img src="img/chevron-down.svg">Low</span> <span class="prioridad normal">Normal</span> <span class="prioridad high">High<img src="img/chevron-up.svg"></span></p> <p class="tarea__temporizador">Añadido hace 6 minutes ago</p>
            </div>
        </div>
    `;

    marcaChecks();
    borrarTarea();
    marcarPrioridad();
    setInterval(actualizarTiempo, 1000);
}

mostrarNotas();
actualizarTareasContador();