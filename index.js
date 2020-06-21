const express = require('express');
const finnhub = require('finnhub');
require('dotenv').config();

const app = express();

app.use(express.static('static'));

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.API_KEY;
const finnhubClient = new finnhub.DefaultApi();

// create API to get quotes
app.get('/api/quote', async (req, res) => {
    const symbols = req.query.symbols.split(',');
    Promise.all(symbols.map(symbol => new Promise((resolve, reject) => {
        finnhubClient.quote(symbol, (error, data, response) => {
            resolve({
                symbol,
                ...data
            });
        });
    }))).then(data => {
        res.send(data);
    });
});

// start server
const port = 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));