let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const productos = [
    { id: 1, nombre: "PANTALONES", precio: 50 },
    { id: 2, nombre: "BUZOS", precio: 40 },
    { id: 3, nombre: "REMERAS", precio: 20 },
    { id: 4, nombre: "VESTIDOS", precio: 70 },
    { id: 5, nombre: "CARTERAS", precio: 100 },
    { id: 6, nombre: "CALZADO", precio: 60 }
];

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

function mostrarProductos() {
    const container = document.getElementById("productos-container");
    container.innerHTML = "";
    productos.forEach(producto => {
        const card = crearCard(producto);
        container.appendChild(card);
    });
}

function finalizarCompra() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
    } else {
        localStorage.removeItem("carrito");
        carrito = [];
        renderizarCarrito();
        alert("¡Gracias por tu compra!");
    }
}

document.getElementById("finalizar-compra").addEventListener("click", finalizarCompra);

mostrarProductos();
renderizarCarrito();
