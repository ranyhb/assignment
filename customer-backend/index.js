const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const moment = require('moment');
const { Kafka } = require('kafkajs');

const clearMetadataCache = async () => await cluster.clearMetadataCache();
const app = express();
const port = 6555;

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(cors());

// Kafka configuration
const kafka = new Kafka({
  clientId: 'my-app1',
  brokers: ['mykafka:9092'] // Replace with your Kafka broker(s)
});

const topic = 'Purchases'
const producer = kafka.producer({
  allowAutoTopicCreation: true,
  transactionTimeout: 30000
})


// Connect to Kafka
const connectProducer = async () => {
  try {
    await producer.connect();
    console.log('Kafka producer connected successfully');
  } catch (error) {
    console.error('Error connecting Kafka producer:', error);
  }
};
connectProducer().catch(console.error);

// Route to handle data submission
app.post('/buy', async (req, res) => {
  const { username, userid, price } = req.body;
  const timestamp = moment().format(); // Current timestamp

  // Append timestamp to the message
  const messageWithTimestamp = {
    username,
    userid,
    price,
    timestamp,
  };
  console.log(messageWithTimestamp)
  if (!messageWithTimestamp) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const payloads = [
    { topic: topic, messages: JSON.stringify(messageWithTimestamp) }
  ];

  try {
    await producer.send({ topic: topic, messages: [{ key: 'key1', value: JSON.stringify(messageWithTimestamp)  }] });
    console.log('Message sent to Kafka:', payloads);
    res.status(200).json({ success: 'Message sent successfully', data: payloads });
  } catch (error) {
    console.error('Error sending message to Kafka:', error);
    res.status(500).json({ error: 'Failed to send message' });
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
        console.log(req.query)
        const { username, userid } = req.query;
        const response = await axios.get(`http://api-managment-service:6000/getAllUserBuys?username=${username}&userid=${userid}`);
        //const data1 = await collection.find({}).toArray();
        console.log(response.data)
        //console.log(data1)
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
  });


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://'0.0.0.0':${port}`);
});
