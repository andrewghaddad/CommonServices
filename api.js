const express = require('express');
const cors = require('cors');
const config = require('./config');
const { MongoClient } = require('mongodb');


const corsOptions = {
    origin: config.ORIGIN_DOMAIN,
    optionsSuccessStatus: 200
}

const app = express();

app.use(cors(corsOptions))
const client = new MongoClient(config.uri);

app.get('/', (req, res) => {
    res.send('Hello From Common Services!');
});

app.get('/mileageCalc/data', async (req, res) => {
    try {
        await client.connect();
        console.log('Connected successfully to server');
    
        const db = client.db(config.dbName);
        const collection = db.collection(config.collection);
    
        // Find all documents
        const docs = await collection.find({}).toArray();
    
        console.log('Found the following documents:');
        console.log(docs);
        return res.json({ documents: docs });
    } catch (error) {
        console.error('Error calling POST API:', error);
        res.status(500).json({ error: 'An error occurred while calling the POST API' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});