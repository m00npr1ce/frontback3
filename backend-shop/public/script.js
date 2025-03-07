document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("products-container");
    const buttons = document.querySelectorAll(".categories button");

    // Функция запроса товаров через GraphQL
    async function fetchProducts() {
        const query = `
            {
                products {
                    name
                    price
                    description
                    categories
                }
            }
        `;

        const response = await fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });

        const result = await response.json();
        return result.data.products;
    }

    // Функция загрузки и фильтрации товаров
    async function loadProducts(category = "all") {
        try {
            const products = await fetchProducts();
            container.innerHTML = "";
            products
                .filter(product => category === "all" || product.categories.includes(category))
                .forEach(product => {
                    const card = document.createElement("div");
                    card.className = "product-card";
                    card.innerHTML = `
                        <h2>${product.name}</h2>
                        <p><strong>Цена:</strong> ${product.price} ₽</p>
                        <p>${product.description}</p>
                    `;
                    container.appendChild(card);
                });
        } catch (error) {
            console.error("Ошибка загрузки товаров:", error);
        }
    }

    // Добавляем обработчики кликов на кнопки категорий
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            loadProducts(button.getAttribute("data-category"));
        });
    });

    // Загружаем все товары при старте
    loadProducts();

    // WebSocket для чата
    const chatMessages = document.getElementById("chat-messages");
    const chatInput = document.getElementById("chat-input");
    const chatSend = document.getElementById("chat-send");

    const ws = new WebSocket('ws://localhost:3001'); // Обрати внимание на порт 3001!

    ws.onopen = () => {
        console.log('✅ WebSocket подключен');
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
});
