class Nota {
    constructor (titulo, prioridad = 'low', estado = 'pendiente', fecha = new Date()) {
        this.titulo = titulo
        this.prioridad = prioridad
        this.estado = estado
        this.fecha = fecha 
    }

    static getTiempo (titulo) {
        let nota = this.obtenerPorTitulo(titulo)
        let fecha = nota.fecha
        let fechaActual = new Date()
        let tiempo = fechaActual - fecha
        let minutos = Math.floor(tiempo / 60000)
        return minutos
    }

    static getPrioridad (titulo) {
        let nota = this.obtenerPorTitulo(titulo)
        return nota.prioridad
    }

    guardar () {
        localStorage.setItem(this.titulo, JSON.stringify(this))
    }

    static eliminar (titulo) {
        localStorage.removeItem(titulo)
    }

    static obtenerPorPrioridad () {
        let notas = this.obtener()
        this.ordenar(notas)
        return notas
    }

    static obtener () {
        let notas = []
        for (let i = 0; i < localStorage.length; i++) {
            let clave = localStorage.key(i)
            let valor = JSON.parse(localStorage.getItem(clave))
            notas.push(valor)
        }
        return notas
    }

    static numeroNotas () {
        return localStorage.length
    }

    static numeroNotasPendientes () {
        let notas = this.obtener()
        let numeroNotasPendientes = 0
        notas.forEach(nota => {
            if (nota.estado === 'pendiente') {
                numeroNotasPendientes++
            }
        })
        return numeroNotasPendientes
    }

    static ordenar (notas) {
        notas.sort((nota1, nota2) => {
            if (nota1.prioridad === 'high' && nota2.prioridad === 'normal') {
                return -1
            } else if (nota1.prioridad === 'high' && nota2.prioridad === 'low') {
                return -1
            } else if (nota1.prioridad === 'normal' && nota2.prioridad === 'low') {
                return -1
            } else if (nota1.prioridad === 'normal' && nota2.prioridad === 'high') {
                return 1
            } else if (nota1.prioridad === 'low' && nota2.prioridad === 'high') {
                return 1
            } else if (nota1.prioridad === 'low' && nota2.prioridad === 'normal') {
                return 1
            } else {
                return 0
            }
        })
    }

    static eliminarCompletadas () {
        let notas = this.obtener()
        notas.forEach(nota => {
            if (nota.estado === 'completada') {
                this.eliminar(nota.titulo)
            }
        })
    }

    static obtenerPorTitulo (titulo) {
        let datosNota = JSON.parse(localStorage.getItem(titulo))
        let fecha = new Date(datosNota.fecha)
        let nota = new Nota(datosNota.titulo, datosNota.prioridad, datosNota.estado, fecha)
        return nota;
    }

    static actualizarEstado (titulo, estado) {
        let nota = this.obtenerPorTitulo(titulo)
        nota.estado = estado
        nota.guardar()
    }

    static actualizarPrioridad (titulo, prioridad) {
        let nota = this.obtenerPorTitulo(titulo)
        nota.prioridad = prioridad
        nota.guardar()
    }
}

export {Nota};