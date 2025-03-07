document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("products-container");
    const buttons = document.querySelectorAll(".categories button");
    const priceFilter = document.getElementById("price-filter");
    const nameFilter = document.getElementById("name-filter");
    const hideDescriptionButton = document.getElementById("hide-description");
    const hidePriceButton = document.getElementById("hide-price");

    let hideDescription = false;
    let hidePrice = false;

    // Функция запроса товаров через GraphQL с фильтрами
    async function fetchProducts(filter = {}) {
        const query = `
            query {
                products(filter: { name: "${filter.name || ""}", minPrice: ${filter.minPrice || 0}, maxPrice: ${filter.maxPrice || 10000}, category: "${filter.category || ""}" }) {
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
    async function loadProducts(filter = {}) {
        try {
            const products = await fetchProducts(filter);
            container.innerHTML = "";
            products.forEach(product => {
                const card = document.createElement("div");
                card.className = "product-card";
                card.innerHTML = `
                    <h2>${product.name}</h2>
                    ${!hidePrice ? `<p><strong>Цена:</strong> ${product.price} ₽</p>` : ""}
                    ${!hideDescription ? `<p>${product.description}</p>` : ""}
                `;
                container.appendChild(card);
            });
        } catch (error) {
            console.error("Ошибка загрузки товаров:", error);
        }
    }

    // Обработчики фильтров
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            loadProducts({ category: button.getAttribute("data-category") });
        });
    });

    priceFilter.addEventListener("input", () => {
        const minPrice = parseFloat(priceFilter.value.split("-")[0]);
        const maxPrice = parseFloat(priceFilter.value.split("-")[1]);
        loadProducts({ minPrice, maxPrice });
    });

    nameFilter.addEventListener("input", () => {
        loadProducts({ name: nameFilter.value });
    });

    hideDescriptionButton.addEventListener("click", () => {
        hideDescription = !hideDescription;
        loadProducts({}); // Перезагружаем товары с учетом фильтра
    });

    hidePriceButton.addEventListener("click", () => {
        hidePrice = !hidePrice;
        loadProducts({}); // Перезагружаем товары с учетом фильтра
    });

    // Загружаем все товары при старте
    loadProducts();

    // WebSocket для чата
    const chatMessages = document.getElementById("chat-messages");
    const chatInput = document.getElementById("chat-input");
    const chatSend = document.getElementById("chat-send");

    const ws = new WebSocket('ws://localhost:3001?role=user'); // Обрати внимание на порт 3001!

    ws.onopen = () => console.log("✅ Покупатель подключен к WebSocket");

    ws.onmessage = (event) => {
        // Это обработчик для получения сообщений WebSocket
        const message = String(event.data); // Явное преобразование в строку
        console.log('📨 Новое сообщение:', message);
        const messageElement = document.createElement("div");
        messageElement.textContent = message;// Отображаем полученное сообщение
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
            messageElement.textContent = `Вы: ${message}`;// Отображаем полученное сообщение
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
});
