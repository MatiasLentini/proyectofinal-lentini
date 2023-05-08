class Producto {
    constructor(id, nombre, precio, stock, img, alt) {
        this.id = id
        this.nombre = nombre
        this.cantidad = 1
        this.precio = precio
        this.stock = stock
        this.img = img
        this.alt = alt
    }
}

class ProductoController {
    constructor() {
        this.listaProductos = []
        this.contenedor_productos = document.getElementById("contenedor_productos")
    }

    async levantarYMostrar(controladorCarrito) {
        const resp = await fetch("productos.json")
        this.listaProductos = await resp.json()

        this.mostrarEnDOM()
        this.darEventoClickAProductos(controladorCarrito)
    }

    mostrarEnDOM() {
        this.listaProductos.forEach(producto => {
            this.contenedor_productos.innerHTML += `
            <div class="card" style="width: 18rem;">
                <img src="${producto.img}" class="card-img-top" alt="${producto.alt}">
                <div class="card-body">
                    <h5 class="card-title text-center">${producto.nombre}</h5>
                    <p class="card-text text-center">$${producto.precio}</p>
                    <a href="#" id="zapatilla-${producto.id}" class="btn btn-primary d-flex justify-content-center">Agregar al carrito</a>
                </div>
            </div>`
        })
    }

    darEventoClickAProductos(controladorCarrito) {
        this.listaProductos.forEach(producto => {
            const btnAP = document.getElementById(`zapatilla-${producto.id}`)
            btnAP.addEventListener("click", () => {

                controladorCarrito.agregar(producto)
                controladorCarrito.guardarEnStorage()
                controladorCarrito.mostrarEnDOM(contenedor_carrito)
            })
        })
    }
}

class CarritoController {
    constructor() {
        this.precio_total = document.getElementById("precio_total")
        this.listaCarrito = []
        this.contenedor_carrito = document.getElementById("contenedor_carrito")
    }

    calcularTotalYmostrarEnDOM() {
        let total = 0;
        total = this.listaCarrito.reduce((total, producto) => total + producto.cantidad * producto.precio, 0)
        this.precio_total.innerHTML = `Total a pagar: $${total}`;
    }

    borrarTotalEnDOM() {
        this.precio_total.innerHTML = "";
    }

    verificarSiExisteElProducto(producto) {
        return this.listaCarrito.find((elproducto) => elproducto.id == producto.id)
    }

    agregar(producto) {

        let objeto = this.verificarSiExisteElProducto(producto)

        if (objeto) {
            objeto.cantidad += 1;
        } else {
            {
                this.listaCarrito.push(producto)
            }
        }
    }

    limpiarCarritoEnStorage() {
        localStorage.removeItem("listaCarrito")
    }

    guardarEnStorage() {
        let listaCarritoJSON = JSON.stringify(this.listaCarrito)
        localStorage.setItem("listaCarrito", listaCarritoJSON)
    }

    verificarExistenciaEnStorage() {
        this.listaCarrito = JSON.parse(localStorage.getItem('listaCarrito')) || []
        if (this.listaCarrito.length > 0) {
            this.mostrarEnDOM()
        }
    }

    limpiarContenedor_Carrito() {
        this.contenedor_carrito.innerHTML = ""
    }

    borrar(producto) {
        let posicion = this.listaCarrito.findIndex(miProducto => producto.id == miProducto.id)

        if (!(posicion == -1)) {
            this.listaCarrito.splice(posicion, 1)
        }
    }

    mostrarEnDOM() {
        this.limpiarContenedor_Carrito()
        this.listaCarrito.forEach(producto => {
            this.contenedor_carrito.innerHTML +=
                `<div class="card mb-3" style="max-width: 540px;">
                <div class="row g-0">
                    <div class="col-md-4">
                    <img src="${producto.img}" class="img-fluid rounded-start" alt="${producto.alt}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title text-center mb-4">${producto.nombre}</h5>
                            <p class="card-text">Precio: $${producto.precio}</p>
                            <p class="card-text">Cantidad: ${producto.cantidad}</p>
                            <button class="btn btn-primary" id="borrar-${producto.id}"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            </div>`
        })
        this.listaCarrito.forEach(producto => {
            const btnBorrar = document.getElementById(`borrar-${producto.id}`)

            btnBorrar.addEventListener("click", () => {
                this.borrar(producto)
                this.guardarEnStorage()
                this.mostrarEnDOM()
            })
        })
        this.calcularTotalYmostrarEnDOM()
    }
}

const controladorProductos = new ProductoController()
const controladorCarrito = new CarritoController()

controladorProductos.levantarYMostrar(controladorCarrito)

controladorCarrito.verificarExistenciaEnStorage()

const finalizar_compra = document.getElementById("finalizar_compra")

finalizar_compra.addEventListener("click", () => {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Compra realizada con éxito!',
        showConfirmButton: false,
        timer: 2000
    })


    controladorCarrito.limpiarContenedor_Carrito()

    controladorCarrito.limpiarCarritoEnStorage()

    controladorCarrito.listaCarrito = []

    controladorCarrito.borrarTotalEnDOM()
})