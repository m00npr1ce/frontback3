const express = require('express');
const path = require('path');
const fs = require('fs');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const port = 3000;
const wsPort = 3001;

app.use(cors());

// Статичные файлы (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Функция загрузки товаров из JSON-файла
const loadProducts = () => {
    const data = fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8');
    return JSON.parse(data);
};

// Определяем схему GraphQL
const schema = buildSchema(`
    type Product {       
        name: String!
        price: Float!
        description: String
        categories: [String]
    }

    type Query {
        products: [Product]
        product(id: ID!): Product
        productNamesAndPrices: [Product]
    }
`);

// Реализуем резолверы GraphQL
const root = {
    products: () => loadProducts(),
    product: ({ id }) => loadProducts().find(product => product.id === id),
    productNamesAndPrices: () => loadProducts().map(({ id, name, price }) => ({ id, name, price })),
};

// Подключаем GraphQL API
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true // Включаем GraphiQL UI
}));

// REST API для получения всех товаров (оставляем для совместимости)
// app.get('/api/products', (req, res) => {
//     fs.readFile(path.join(__dirname, 'products.json'), 'utf8', (err, data) => {
//         if (err) {
//             res.status(500).send('Ошибка чтения данных');
//             return;
//         }
//         res.json(JSON.parse(data));
//     });
// });

// Создаем HTTP-сервер отдельно
const server = require('http').createServer(app);

// WebSocket сервер


server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});



// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер работает на http://localhost:${port}`);
    console.log(`GraphQL API: http://localhost:${port}/graphql`);
});

// WebSocket сервер (отдельный порт)
const wss = new WebSocket.Server({ port: wsPort });

wss.on('connection', (ws) => {
    console.log('🔗 Новый WebSocket клиент подключен');

    ws.on('message', (message) => {
        console.log(`📩 Сообщение от клиента:`, message, typeof message);

        let textMessage;
        if (message instanceof Buffer) {
            // Если данные пришли в виде Buffer, преобразуем их в строку
            textMessage = message.toString('utf-8');
        } else {
            // Если данные уже строка, используем их как есть
            textMessage = message;
        }

        console.log('📩 Сообщение от клиента (строка):', textMessage, typeof textMessage);

        if (typeof textMessage === 'string') {
            // Рассылка всем клиентам
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(textMessage);
                }
            });
        } else {
            console.error("Ошибка: ожидается строка, а получен объект.");
        }
    });

    ws.on('close', () => console.log('❌ Клиент отключился'));
});

console.log(`📡 WebSocket-сервер запущен на ws://localhost:${wsPort}`);
