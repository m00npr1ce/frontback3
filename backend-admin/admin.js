document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("productList");
    const form = document.getElementById("addProductForm");

    function loadProducts() {
        fetch("http://localhost:8080/api/products")
            .then(response => response.json())
            .then(products => {
                productList.innerHTML = "";
                products.forEach(product => {
                    const productDiv = document.createElement("div");
                    productDiv.className = "product-item";
                    productDiv.innerHTML = `
                        <p><strong>${product.name}</strong> - ${product.price} ₽</p>
                        <p>${product.description}</p>
                        <p>Категории: ${product.categories.join(", ")}</p>
                        <button onclick="editProduct(${product.id})">Редактировать</button>
                        <button onclick="deleteProduct(${product.id})">Удалить</button>
                    `;
                    productList.appendChild(productDiv);
                });
            })
            .catch(error => console.error("Ошибка загрузки товаров:", error));
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const newProduct = {
            name: document.getElementById("name").value,
            price: document.getElementById("price").value,
            description: document.getElementById("description").value,
            categories: document.getElementById("categories").value.split(",").map(c => c.trim())
        };

        fetch("http://localhost:8080/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProduct)
        })
            .then(response => response.json())
            .then(() => {
                form.reset();
                loadProducts();
            })
            .catch(error => console.error("Ошибка добавления товара:", error));
    });

    window.deleteProduct = (id) => {
        fetch(`http://localhost:8080/api/products/${id}`, { method: "DELETE" })
            .then(() => loadProducts())
            .catch(error => console.error("Ошибка удаления товара:", error));
    };

    window.editProduct = (id) => {
        const newName = prompt("Введите новое название:");
        const newPrice = prompt("Введите новую цену:");
        const newDescription = prompt("Введите новое описание:");
        const newCategories = prompt("Введите новые категории (через запятую):");

        if (newName && newPrice && newDescription && newCategories) {
            const updatedProduct = {
                name: newName,
                price: parseFloat(newPrice),
                description: newDescription,
                categories: newCategories.split(",").map(c => c.trim())
            };

            fetch(`http://localhost:8080/api/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedProduct)
            })
                .then(() => loadProducts())
                .catch(error => console.error("Ошибка редактирования товара:", error));
        }
    };

    loadProducts();
});
// WebSocket для чата
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");



const ws = new WebSocket('ws://localhost:3001?role=admin'); // Обрати внимание на порт 3001!
ws.isAdmin = true;
ws.onopen = () => {
    console.log("✅ Админ подключен к WebSocket");
};

ws.onmessage = (event) => {
    // Это обработчик для получения сообщений WebSocket
    const message = String(event.data); // Явное преобразование в строку
    console.log('📨 Новое сообщение:', message);
    const messageElement = document.createElement("div");
    messageElement.textContent = message; // Отображаем полученное сообщение
    chatMessages.appendChild(messageElement);
};

ws.onerror = (error) => {
    console.error('❌ WebSocket ошибка:', error);
};

ws.onclose = () => {
    console.log('❌ WebSocket соединение закрыто');
};

// Пример отправки сообщения
function sendMessage(message) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
        const messageElement = document.createElement("div");
        messageElement.textContent = `Вы (Админ): ${message}`; // Отображаем полученное сообщение
        chatMessages.appendChild(messageElement);
    } else {
        console.warn('⚠️ WebSocket не открыт');
    }
    console.log("Отправляемое сообщение:", message, typeof message); // Должно быть string
}

chatSend.addEventListener("click", () => {
    if (chatInput.value.trim() !== "") {
        sendMessage(chatInput.value);
        chatInput.value = "";
    }
});

chatInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        chatSend.click();
    }
});
