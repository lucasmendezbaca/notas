class Tarea {
    static tareas = [];

    constructor (titulo, prioridad = 'low', estado = 'pendiente', fecha = new Date()) {
        this.titulo = titulo
        this.prioridad = prioridad
        this.estado = estado
        this.fecha = fecha 
    }

    guardar() {
        Tarea.tareas.push(this);
        localStorage.setItem('tareas', JSON.stringify(Tarea.tareas));
    }

    static getTiempo(titulo) {
        let tarea = Tarea.tareas.find(tarea => tarea.titulo === titulo);
        let fechaActual = new Date();
        let tiempo = fechaActual - tarea.fecha;
        let minutos = Math.floor(tiempo / 60000)

        return minutos;
    }

    static actualizarPrioridadTarea(titulo, prioridad) {
        let tarea = Tarea.tareas.find(tarea => tarea.titulo === titulo);
        tarea.prioridad = prioridad;
        localStorage.setItem('tareas', JSON.stringify(Tarea.tareas));
    }

    static ordenarPorPrioridad() {
        Tarea.tareas.sort((a, b) => {
            if (a.prioridad === 'high' && b.prioridad === 'normal') {
                return -1
            } else if (a.prioridad === 'high' && b.prioridad === 'low') {
                return -1
            } else if (a.prioridad === 'normal' && b.prioridad === 'low') {
                return -1
            } else if (a.prioridad === 'normal' && b.prioridad === 'high') {
                return 1
            } else if (a.prioridad === 'low' && b.prioridad === 'high') {
                return 1
            } else if (a.prioridad === 'low' && b.prioridad === 'normal') {
                return 1
            } else {
                return 0
            }
        });

        localStorage.setItem('tareas', JSON.stringify(Tarea.tareas));
    }


    static borrarTarea(titulo) {
        Tarea.tareas = Tarea.tareas.filter(tarea => tarea.titulo !== titulo);
        localStorage.setItem('tareas', JSON.stringify(Tarea.tareas));
    }

    static actualizarEstadoTarea(titulo, estado) {
        let tarea = Tarea.tareas.find(tarea => tarea.titulo === titulo);
        tarea.estado = estado;
        localStorage.setItem('tareas', JSON.stringify(Tarea.tareas));
    }

    static obtenerPorTitulo(titulo) {
        return Tarea.tareas.find(tarea => tarea.titulo === titulo);
    }

    static borrarCompletadas() {
        Tarea.tareas = Tarea.tareas.filter(tarea => tarea.estado === 'pendiente');
        localStorage.setItem('tareas', JSON.stringify(Tarea.tareas));
    }

    static numTareas() {
        return Tarea.tareas.length;
    }

    static numTareasPendientes() {
        return Tarea.tareas.filter(tarea => tarea.estado === 'pendiente').length;
    }

}

export {Tarea};