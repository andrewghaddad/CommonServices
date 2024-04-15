const express = require('express');
const cors = require('cors');
const config = require('./config');
const { MongoClient, ObjectId } = require('mongodb');


const corsOptions = {
    origin: config.ORIGIN_DOMAIN,
    optionsSuccessStatus: 200
}

const app = express();

app.use(cors(corsOptions), express.json())
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

app.post('/mileageCalc/update', async (req, res) => {
    try {
        await client.connect();
        console.log('Connected successfully to server');

        const db = client.db(config.dbName);
        const collection = db.collection(config.collection);

        const filter = req.body.filter;
        const update = req.body.update;
        
        // Filter documents and update
        const result = await collection.updateMany(filter, update);

        console.log('Updated document:');
        console.log(result);

        return res.json({ result: result });
    } catch (error) {
        console.error('Error calling UPDATE API:', error);
        res.status(500).json({ error: 'An error occurred while calling the UPDATE API' });
    }
});

app.post('/mileageCalc/insert', async (req, res) => {
    try {
        await client.connect();
        console.log('Connected successfully to server');

        const db = client.db(config.dbName);
        const collection = db.collection(config.collection);

        const document = req.body;

        // Creates and assigns new Object Id to request
        const objectId = new ObjectId()
        document._id = objectId;
        
        // Insert document
        const result = await collection.insertOne(document);

        console.log('Inserted document:');
        console.log(result);
        
        return res.json({ result: result });
    } catch (error) {
        console.error('Error calling INSERT API:', error);
        res.status(500).json({ error: 'An error occurred while calling the INSERT API' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});