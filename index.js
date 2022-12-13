import { Tarea } from './Tarea.js'

const tareaInput = document.getElementById('tarea_input');
const tareaContainer = document.getElementById('tareas');
const borrarTareas = document.getElementById('borrarTareas');
const numTareas = document.getElementById('numTareas');
const numTareasPendientes = document.getElementById('numTareasPendientes');
const colorPrioridades = {low: 'green', normal: 'orange', high: 'red'}

window.onload = () => {
    Tarea.tareas = JSON.parse(localStorage.getItem('tareas')) ? JSON.parse(localStorage.getItem('tareas')) : [];
    numTareas.textContent = Tarea.numTareas();
    numTareasPendientes.textContent = Tarea.numTareasPendientes();
    cargarTareas();
}

tareaInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        let tarea = new Tarea(tareaInput.value);
        tarea.guardar();
        mostrarTarea(tarea);
            

        actualizarNumTareas();
        actualizarTareasPendientes();

        tareaInput.value = '';
    }
});

function actualizarMinutosTareas() {
    tareaContainer.querySelectorAll('.tarea').forEach(tareaElement => {
        let titulo = tareaElement.querySelector('.tarea__info__nombre').textContent;
        tareaElement.querySelector('.tarea__temporizador').textContent = `Añadido hace ${Tarea.getTiempo(titulo)} minutes ago`;
    });
}


borrarTareas.addEventListener('click', () => {
    Tarea.borrarCompletadas();
    tareaContainer.querySelectorAll('.tarea').forEach(tareaElement => {
        if (tareaElement.querySelector('.check').classList.contains('checked')) {
            tareaElement.remove();
            actualizarNumTareas();
            actualizarTareasPendientes();
        }
    });
});

function habilitarBorrado(tarea, tareaElement) {
    tareaElement.querySelector('.tarea__borrar').addEventListener('click', () => {
        tareaElement.remove();
        Tarea.borrarTarea(tarea.titulo);
        actualizarNumTareas();
        actualizarTareasPendientes();
    });
}

function habilitarCambioEstado(tarea, tareaElement) {
    tareaElement.querySelector('.check').addEventListener('click', () => {
        tareaElement.querySelector('.check').classList.toggle('checked');
        tareaElement.querySelector('.tarea__info__nombre').classList.toggle('tarea__info__nombre--checked');
        let tareaLocalStorage = Tarea.obtenerPorTitulo(tarea.titulo);
        let nuevoEstado = tareaLocalStorage.estado === 'pendiente' ? 'completada' : 'pendiente';
        Tarea.actualizarEstadoTarea(tarea.titulo, nuevoEstado);
        actualizarTareasPendientes();
    });
}

function actualizarNumTareas() {
    numTareas.textContent = Tarea.numTareas();
}

function actualizarTareasPendientes() {
    numTareasPendientes.textContent = Tarea.numTareasPendientes();
}

function mostrarTarea(tarea) {
    let tareaElement = document.createElement('div');
    tareaElement.classList.add('tarea');
    tareaElement.innerHTML = `
            <div class="tarea__info">
                <div class="check ${tarea.estado === 'completada' ? 'checked' : ''}"></div>
                <p class="tarea__info__nombre ${tarea.estado === 'completada' ? 'tarea__info__nombre--checked' : ''}">${tarea.titulo}</p>
                <button class="tarea__borrar"><div class="tarea__borrar__icono"><img src="img/trash.svg" alt=""></div></button>
            </div>
            <div class="tarea__prioridad">
                <p>Prioridad:</p> <p><span class="prioridad low"><img src="img/chevron-down.svg">Low</span> <span class="prioridad normal">Normal</span> <span class="prioridad high">High<img src="img/chevron-up.svg"></span></p> <p class="tarea__temporizador">Añadido hace 0 minutes ago</p>
            </div>
    `;

    tareaContainer.appendChild(tareaElement);

    let prioridades = tareaElement.querySelectorAll('.prioridad');
    mostrarPrioridad(tarea, prioridades);

    habilitarBorrado(tarea, tareaElement);
    habilitarCambioEstado(tarea, tareaElement); 
    habilitarCambioPrioridad(tarea, prioridades);
    setInterval(() => {
        actualizarMinutosTareas();
    }, 1000);
}

function mostrarPrioridad(tarea, prioridades) {
    prioridades.forEach(prioridad => {
        if(prioridad.classList.contains(tarea.prioridad)) {
            prioridad.style.backgroundColor = colorPrioridades[tarea.prioridad];
            prioridad.style.color = 'white';
        } else {
            prioridad.style.backgroundColor = '#464545';
            prioridad.style.color = '#999999';
        }
    });
}

function habilitarCambioPrioridad(tarea, prioridades) {
    prioridades.forEach(prioridad => {
        prioridad.addEventListener('click', () => {
            let nuevaPrioridad = prioridad.classList[1];
            Tarea.actualizarPrioridadTarea(tarea.titulo ,nuevaPrioridad);
            let tareaActualizada = Tarea.obtenerPorTitulo(tarea.titulo);
            mostrarPrioridad(tareaActualizada, prioridades);
            tareaContainer.innerHTML = '';
            cargarTareas();
        });
    });
}

function cargarTareas() {
    Tarea.ordenarPorPrioridad();
    let tareas = JSON.parse(localStorage.getItem('tareas'));
    if (tareas) {
        tareas.forEach(tarea => {
            mostrarTarea(tarea);
        });
    }
}
