import { useState, useEffect } from "react";

function App() {
  const endpoint = "http://192.168.1.2:3000/postValue";

  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);
  const [target, setTarget] = useState(0);

  const fetchData = async () => {
    const response = await fetch("http://192.168.1.2:3000/getData");
    const data = await response.json();
    setData(data);
    // Check if data is not null before accessing its value
    if (data && data.value !== undefined) {
      setCount(data.value);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch immediately on mount
    const interval = setInterval(fetchData, 10); // Poll every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleAdd = () => {
    const newCount = count + 1;
    setCount(newCount);
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: newCount }), // Use newCount to ensure the correct value is sent
    })
      .then(() => {
        console.log("Value sent to the server");
      })
      .catch((err) => {
        console.error("Error sending value to the server: ", err);
      });
  };

  const handleMinus = () => {
    const newCount = count - 1;
    setCount(newCount);
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: newCount }), // Use newCount to ensure the correct value is sent
    })
      .then(() => {
        console.log("Value sent to the server");
      })
      .catch((err) => {
        console.error("Error sending value to the server: ", err);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const targetValue = parseInt(target, 10); // Assuming 'target' is a string that can be converted to an integer
      if (isNaN(targetValue)) {
        throw new Error("Target value is not a valid number");
      }

      const response = await fetch("http://192.168.1.2:3000/postTarget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ target: target }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const responseBody = await response.json();
      console.log("Success:", responseBody);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="app">
      <h1>push up counter</h1>
      <h2>{count}</h2>
      <button onClick={() => handleAdd()}>+</button>
      <button onClick={() => handleMinus()}>-</button>

      <div className="form">
        <form onSubmit={handleSubmit}>
          <label htmlFor="target">Target:</label>
          <br />
          <input
            type="text"
            id="target"
            name="target"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
          <br />
          <button type="submit">Set Target</button>
        </form>
      </div>
      <div className="alert">
        {data && data.target !== 0 && data.value >= data.target ? (
          <p>Target reached!</p>
        ) : data && data.target !== 0 ? (
          <p>Keep going!</p>
        ) : null}
      </div>
    </div>
  );
}

export default App;
