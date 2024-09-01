let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function agregarAlCarrito(producto) {
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
}

function quitarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
}

function calcularTotalCarrito() {
    let total = carrito.reduce((sum, producto) => sum + producto.precio, 0);
    if (total > 200) {
        total *= 0.90;
    }
    return total % 1 === 0 ? total : total.toFixed(2); 
}

function renderizarCarrito() {
    const carritoContainer = document.getElementById("carrito-items");
    carritoContainer.innerHTML = "";
    carrito.forEach((producto, index) => {
        carritoContainer.innerHTML += `
            <p>
                ${producto.nombre} - $${producto.precio}
                <button onclick="quitarDelCarrito(${index})">Quitar</button>
            </p>`;
    });
    const total = calcularTotalCarrito();
    document.getElementById("total-carrito").textContent = `Total: $${total}`;
}

function crearCard(producto) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
        <h2>${producto.nombre}</h2>
        <p>Precio: $${producto.precio}</p>
        <button data-id="${producto.id}">Agregar al carrito</button>
    `;

    const btnAgregar = card.querySelector("button");
    btnAgregar.addEventListener("click", () => {
        agregarAlCarrito(producto);
    });

    return card;
}

async function obtenerProductos() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Error al obtener productos');
        }
        const productos = await response.json();
        return productos;
    } catch (error) {
        console.error('Hubo un problema con la petición Fetch:', error);
        return []; 
    }
}
async function mostrarProductos() {
    const productos = await obtenerProductos();
    const container = document.getElementById("productos-container");
    container.innerHTML = "";
    productos.forEach(producto => {
        const card = crearCard(producto);
        container.appendChild(card);
    });
}
async function finalizarCompra() {
    if (carrito.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Carrito vacío',
            text: 'Tu carrito está vacío.',
            confirmButtonText: 'OK'
        });
    } else {
        try {
            const simulatedResponse = new Promise((resolve) => {
                setTimeout(() => resolve({ success: true }), 1000); 
            });

            const result = await simulatedResponse;
            if (result.success) {
                localStorage.removeItem("carrito");
                carrito = [];
                renderizarCarrito();

                Swal.fire({
                    icon: 'success',
                    title: '¡Compra realizada!',
                    text: '¡Gracias por tu compra!',
                    confirmButtonText: 'OK'
                });
            } else {
                throw new Error('Error en la compra');
            }

        } catch (error) {
            console.error('Error al procesar la compra:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al procesar tu compra. Inténtalo nuevamente.',
                confirmButtonText: 'OK'
            });
        }
    }
}

document.getElementById("finalizar-compra").addEventListener("click", finalizarCompra);

mostrarProductos();
renderizarCarrito();
