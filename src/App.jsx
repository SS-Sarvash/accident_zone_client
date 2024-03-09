import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [state, setState] = useState(false);
  const [message, setMessage] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (state) {
      const intervalId = setInterval(() => {
        navigator.geolocation.getCurrentPosition(handle, handleError, { enableHighAccuracy: true });
      }, 2000);
      return () => {
        clearInterval(intervalId);
        const mess= "Data logging is halted";
        setMessage(mess);
        setLastUpdated(new Date());
      };
    }
  }, [state]);

  const postData = async (details) =>{    //function to POST the card details to json
    const res = await fetch('http://localhost:5000/poster',{
      method: 'POST',
      headers: {
        'Content-type' : 'application/json'
      },
      body: JSON.stringify(details)
    })
    res();
    // const resp = await res.json()
    // setData([...data, resp])
    
  }

  const handle = (position) => {
    var long = position.coords.longitude;
    var lat = position.coords.latitude;
    var accuracy = position.coords.accuracy;
    postData({ lat, long, accuracy });
    const newMessage = "Your coordinate is: Lat: " + lat + " Long: " + long + " Accuracy: " + accuracy;
    
    setMessage(newMessage);
    setLastUpdated(new Date());

  };

  const handleError = (error) => {
    setMessage("Location service down: " + error);
    setLastUpdated(new Date());
  };

  return (
    <>
      <div className="buttons">
        <button style={{ margin: "5px" }} onClick={() => setState(true)} id="start">Start</button><br></br>
        <button style={{ margin: "5px" }} onClick={() => setState(false)} id="stop">Stop</button>
      </div>
      <div className="message-box">
        <p>Last Updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : "N/A"}</p>
        <p>{message}</p>
      </div>
    </>
  );
}

export default App;
