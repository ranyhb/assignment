import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [form1, setForm1] = useState({ username: '', userid: '', price: '' });
  const [form2, setForm2] = useState({ username: '', userid: '' });
  const [result, setResult] = useState('');

  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    setForm1((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    setForm2((prev) => ({ ...prev, [name]: value }));
  };

  const handleButtonClick1 = async () => {
    console.log('Form 1 data:', form1);
    setResult(JSON.stringify(form1));
    const jsonString = JSON.stringify(form1);
    const parsedObject = JSON.parse(jsonString);
    const username = parsedObject.username;
    const userid = parsedObject.userid;
    const price = parsedObject.price;
    const data = {username: username, userid: userid, price: price}
    try {
      const response = await axios.post('http://customer-backend-service:6555/buy', data );
      console.log('Response from backend:', response.data);
      setResult(JSON.stringify(form1));
    } catch (error) {
      console.error('Error sending data:', error);
      //setResult("server is down");
    }
  };

  const handleButtonClick2 = async () => {
    console.log('Form 2 data:', form2);
    setResult(JSON.stringify(form2));
    
    try {
      const jsonString = JSON.stringify(form2);
      const parsedObject = JSON.parse(jsonString);
      const username = parsedObject.username;
      const userid = parsedObject.userid;
      const response = await axios.get(`http://customer-backend-service:6555/getAllUserBuys?username=${username}&userid=${userid}`);
      console.log('Response from backend:', response.data.data);
      setResult(JSON.stringify(response.data.data));
    } catch (error) {
      console.error('Error getting data:', error.message);
      setResult("cant fetch data");
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="frame">
          <h2>BUY new item</h2>
          <div className="form-group">
            <label>
              Username:
              <input
                type="text"
                name="username"
                value={form1.username}
                onChange={handleInputChange1}
              />
            </label>
            <label>
              UserID:
              <input
                type="text"
                name="userid"
                value={form1.userid}
                onChange={handleInputChange1}
              />
            </label>
            <label>
              Price:
              <input
                type="text"
                name="price"
                value={form1.price}
                onChange={handleInputChange1}
              />
            </label>
          </div>
          <button onClick={handleButtonClick1}>Submit Purchase</button>
        </div>

        <div className="frame">
          <h2>GET all items</h2>
          <div className="form-group">
            <label>
              Username:
              <input
                type="text"
                name="username"
                value={form2.username}
                onChange={handleInputChange2}
              />
            </label>
            <label>
              UserID:
              <input
                type="text"
                name="userid"
                value={form2.userid}
                onChange={handleInputChange2}
              />
            </label>
          </div>
          <button onClick={handleButtonClick2}>Submit Get All Items</button>
        </div>
      </div>

      <div className="result">
        <h3>Result:</h3>
        <p>{result}</p>
      </div>
    </div>
  );
}

export default App;
