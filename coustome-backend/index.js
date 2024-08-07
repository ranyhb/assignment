const kafka = require('kafka-node');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 6555;

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(cors());

// Kafka configuration
const kafkaClient = new kafka.KafkaClient({
  kafkaHost: 'localhost:9092', // Replace with your Kafka broker address
  sasl: {
    mechanism: 'plain',
    username: 'user1',  // Replace with your Kafka username
    password: 'JD4rI9DKm2'   // Replace with your Kafka password
  },
  ssl: true // Use SSL if your Kafka broker requires it
});

const producer = new kafka.Producer(kafkaClient);

producer.on('ready', () => {
  console.log('Kafka Producer is connected and ready.');
});

producer.on('error', (error) => {
  console.error('Error in Kafka producer:', error);
});

// Route to handle data submission
app.post('/buy', (req, res) => {
  const message = req.body.message;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const payloads = [
    { topic: 'test', messages: message, partition: 0 }
  ];

  producer.send(payloads, (error, data) => {
    if (error) {
      console.error('Error sending message to Kafka:', error);
      return res.status(500).json({ error: 'Failed to send message' });
    } else {
      console.log('Message sent to Kafka:', data);
      return res.status(200).json({ success: 'Message sent successfully', data: data });
    }
  });
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
        const response = await axios.get(`http://localhost:5000/getAllUserBuys?username=${username}&userid=${userid}`);
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
    console.log(`Server is running on http://localhost:${port}`);
});
