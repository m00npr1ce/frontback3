<body>

<h1>🛒 Online Shop</h1>

<p>Этот проект представляет собой систему интернет-магазина с API-управлением товарами.</p>

<h2>📂 Структура проекта</h2>
<pre><code>project-folder/
├── backend-shop/       # Сервер каталога (порт 3000)
│   ├── server.js       # Основной сервер
│   ├── products.json   # JSON с товарами
│   ├── public/         # Статические файлы (index.html, script.js, styles.css)
│   ├── package.json    # Конфигурация Node.js
│
├── backend-admin/      # Сервер админ-панели (порт 8080)
│   ├── server.js       # API для управления товарами
│   ├── swagger.json    # Документация API
│   ├── admin.html      # Интерфейс админки
│   ├── package.json    # Конфигурация Node.js
│
└── README.md           # Документация проекта
</code></pre>

<h2>🚀 Запуск проекта</h2>

<h3>1️⃣ Установите зависимости</h3>
<pre><code>cd backend-shop
npm install
cd ../backend-admin
npm install</code></pre>

<h3>2️⃣ Запустите оба сервера</h3>
<p>В первом терминале:</p>
<pre><code>cd backend-shop
node server.js</code></pre>
<p>Во втором терминале:</p>
<pre><code>cd backend-admin
node server.js</code></pre>

<h3>3️⃣ Откройте в браузере</h3>
<ul>
    <li>📌 <a href="http://localhost:3000">Каталог товаров</a></li>
    <li>📌 <a href="http://localhost:8080/admin.html">Панель администратора</a></li>
    <li>📌 <a href="http://localhost:8080/api-docs">Документация API</a></li>
</ul>

<h2>🛠 API документация</h2>

<h3>📌 Получение списка товаров</h3>
<p><strong>GET</strong> <code>/api/products</code></p>
<p>Ответ: массив товаров.</p>

<h3>📌 Добавление нового товара</h3>
<p><strong>POST</strong> <code>/api/products</code></p>
<p>Тело запроса (JSON):</p>
<pre><code>{
  "name": "Название товара",
  "price": 1000,
  "description": "Описание товара",
  "categories": ["Категория 1", "Категория 2"]
}</code></pre>
<p>Ответ:</p>
<pre><code>{ "message": "Товар добавлен" }</code></pre>

<h3>📌 Обновление товара по ID</h3>
<p><strong>PUT</strong> <code>/api/products/{id}</code></p>
<p>Тело запроса (JSON) аналогично <code>POST</code>.</p>
<p>Ответ:</p>
<pre><code>{ "message": "Товар обновлен" }</code></pre>

<h3>📌 Удаление товара по ID</h3>
<p><strong>DELETE</strong> <code>/api/products/{id}</code></p>
<p>Ответ:</p>
<pre><code>{ "message": "Товар удален" }</code></pre>

<p>Документация доступна в Swagger UI:  
👉 <a href="http://localhost:8080/api-docs">http://localhost:8080/api-docs</a></p>

<h2>🔧 Требования</h2>
<ul>
    <li>Node.js (установить с <a href="https://nodejs.org/">официального сайта</a>)</li>
    <li>Git (для клонирования репозитория)</li>
</ul>

<h2>📥 Установка и запуск с GitHub</h2>

<h3>1. Склонировать репозиторий</h3>
<pre><code>git clone https://github.com/ТВОЙ_ЛОГИН/online-shop.git
cd online-shop</code></pre>

<h3>2. Установить зависимости и запустить серверы</h3>
<pre><code>cd backend-shop
npm install
node server.js</code></pre>
<p>Открыть второй терминал:</p>
<pre><code>cd backend-admin
npm install
node server.js</code></pre>

<h3>3. Открыть в браузере</h3>
<ul>
    <li><a href="http://localhost:3000">Каталог товаров</a></li>
    <li><a href="http://localhost:8080/admin.html">Панель администратора</a></li>
    <li><a href="http://localhost:8080/api-docs">Документация API</a></li>
</ul>

</body>
</html>
