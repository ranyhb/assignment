const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const uri = 'mongodb://mymongo-mongodb:27017';
const cors = require('cors');
const { Kafka } = require('kafkajs');
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
const port = 6000;
// Middleware to parse JSON
app.use(bodyParser.json());
app.use(cors());

const kafka = new Kafka({
  clientId: 'my-consumer',
  brokers: ['mykafka:9092'], // Ensure these match your broker addresses
  retry: {
    retries: 8,
    initialRetryTime: 300,
    factor: 0.2,
    multiplier: 2,
    maxRetryTime: 30000,
  },
});


const topic = 'Purchases'
const consumer = kafka.consumer({ groupId: 'test-group1aa' })


const run = async () => {
  // Connect the consumer
  await consumer.connect();

  // Subscribe to a topic
  await consumer.subscribe({ topic: topic, fromBeginning: true });

  // Handle incoming messages
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
      // parse the object and save it to mongo
      const parsedObject = JSON.parse(value);
      const username = parsedObject.username;
      const userid = parsedObject.userid;
      const price = parsedObject.price;
      try{
        const result = await collection.insertOne({ username: username, userid: userid, price: price, timestamp: new Date() });
      }catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
        console.log('Document inserted with _id:', result.insertedId);
      }
      
    },
  });

  console.log('Consumer is running...');
};
run().catch(async (error) => {
  console.error('Error starting consumer', error);
  await consumer.disconnect();
});


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
    console.log(`Server is running on http://'0.0.0.0':${port}`);
    connectToMongoDB();
});
