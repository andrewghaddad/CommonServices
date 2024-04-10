const express = require('express');
const axios = require('axios');
const cors = require('cors');
const config = require('./config');


const corsOptions = {
    origin: config.ORIGIN_DOMAIN,
    optionsSuccessStatus: 200
}

const app = express();

app.use(cors(corsOptions))

app.get('/', (req, res) => {
    res.send('Hello From Common Services!');
});

app.post('/mileageCalc/data', async (req, res) => {
    try {
        const requestData = req;
        const headers  = {
            'Content-Type': 'application/json',
            'api-key': config.API_KEY,
            'Accept': 'application/json'
        }
        const response = await axios.post('https://us-east-1.aws.data.mongodb-api.com/app/data-ihtif/endpoint/data/v1/action/find', requestData , { headers });

        const responseData = response.data;

        res.json(responseData);
    } catch (error) {
        console.error('Error calling POST API:', error);
        res.status(500).json({ error: 'An error occurred while calling the POST API' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});