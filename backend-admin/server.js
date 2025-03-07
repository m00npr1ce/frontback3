const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 8080;
const productsFile = path.join(__dirname, "../backend-shop/products.json");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Получение всех товаров
app.get("/api/products", (req, res) => {
    fs.readFile(productsFile, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Ошибка чтения файла" });
        res.json(JSON.parse(data));
    });
});

// Добавление нового товара
app.post("/api/products", (req, res) => {
    fs.readFile(productsFile, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Ошибка чтения файла" });

        let products = JSON.parse(data);
        let newProduct = req.body;
        newProduct.id = products.length ? products[products.length - 1].id + 1 : 1;

        products.push(newProduct);

        fs.writeFile(productsFile, JSON.stringify(products, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Ошибка записи в файл" });
            res.status(201).json(newProduct);
        });
    });
});

// Редактирование товара по ID
app.put("/api/products/:id", (req, res) => {
    fs.readFile(productsFile, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Ошибка чтения файла" });

        let products = JSON.parse(data);
        let productIndex = products.findIndex(p => p.id === parseInt(req.params.id));

        if (productIndex === -1) return res.status(404).json({ error: "Товар не найден" });

        products[productIndex] = { ...products[productIndex], ...req.body };

        fs.writeFile(productsFile, JSON.stringify(products, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Ошибка записи в файл" });
            res.json(products[productIndex]);
        });
    });
});

// Удаление товара по ID
app.delete("/api/products/:id", (req, res) => {
    fs.readFile(productsFile, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Ошибка чтения файла" });

        let products = JSON.parse(data);
        let newProducts = products.filter(p => p.id !== parseInt(req.params.id));

        if (products.length === newProducts.length) return res.status(404).json({ error: "Товар не найден" });

        fs.writeFile(productsFile, JSON.stringify(newProducts, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Ошибка записи в файл" });
            res.json({ message: "Товар удален" });
        });
    });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Админ-сервер работает на порту ${port}`);
});
