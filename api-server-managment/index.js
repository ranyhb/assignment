const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const uri = 'mongodb://127.0.0.1:27017';
const cors = require('cors');
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
const port = 5000;
// Middleware to parse JSON
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the application if the connection fails
  }
}

// insert 1 purchase for the collection in mongo 
app.post('/buy', async (req, res) => {
    try {
      const database = client.db('bad'); // Replace with your database name
      const collection = database.collection('myCollection1'); // Replace with your collection name
      const { username, userid, price } = req.body;

      if (username && userid && price) {
        // Process the data (for demonstration, just send it back in the response)
        console.log('Received data:', { username, userid, price });
        
        const result = await collection.insertOne({ username: username, userid: userid, price: price, timestamp: new Date() });
        console.log('Document inserted with _id:', result.insertedId);
        // Send a response
        res.json({
          success: true,
          message: 'Data received successfully!',
          data: { username, userid, price },
        });
      } else {
        // Handle missing fields
        res.status(400).json({
          success: false,
          message: 'Missing required fields: username, userid, and price',
        });
      }
  
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Internal Server Error');
    }
  });

/**
 * returns all buys for a user.
 * @param {username}  - The first arg.
 * @param {userid} - The second arg.
 * @returns {array of buys} An array that includes all buys .
 */
app.get('/getAllUserBuys', async (req, res) => {
    try {
        const database = client.db('bad'); // Replace with your database name
        const collection = database.collection('myCollection1'); // Replace with your collection name
        const { username, userid } = req.query;
        console.log(username,userid);
        console.log(typeof(username),typeof(userid));

        const query = {
          username: username,
          userid: Number(userid),
        };
        

        const data = await collection.find(query).toArray();
        //const data1 = await collection.find({}).toArray();
        console.log(data)
        //console.log(data1)
        res.send({data: data});
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
  });


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    connectToMongoDB();
});
