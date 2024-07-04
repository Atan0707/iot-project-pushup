import { useState, useEffect } from "react";

function App() {
  const endpoint = "http://192.168.1.2:3000/postValue";
  const getDataEndpoint = "http://192.168.1.2:3000/getData";
  const postTargetEndpoint = "http://192.168.1.2:3000/postTarget";

  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);
  const [target, setTarget] = useState(0);
  const [seconds, setSeconds] = useState(20); // Start from 20 seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [highest, setHighest] = useState(0);

  const fetchData = async () => {
    const response = await fetch(getDataEndpoint);
    const data = await response.json();
    setData(data);
    // Check if data is not null before accessing its value
    if (data && data.value !== undefined) {
      setCount(data.value);
    }
  };

  useEffect(() => {
    //to get data each time you refresh the page
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

      const response = await fetch(postTargetEndpoint, {
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

  const handleReset = () => {
    setTarget(9999);
    fetch(postTargetEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ target: 9999 }),
    })
      .then(() => {
        console.log("Target set to 9999");
      })
      .catch((err) => {
        console.error("Error setting target to 9999: ", err);
      });
  };

  //start timer function
  const startTimer = () => {
    setIsTimerRunning(true);
    setCount(0); // Reset count to 0 at the start of the game
    setSeconds(20); // Reset timer to 20 seconds
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: 0 }), // Set push up value to 0
    })
      .then(() => {
        console.log("Set push up value to 0");
      })
      .catch((err) => {
        console.error("Error sending value to the server: ", err);
      });
  };

  //timer
  useEffect(() => {
    let interval = null;

    if (isTimerRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsTimerRunning(false);
      alert("Time is up!");
      // Update the highest score if the current count is greater
      setHighest((prevHighest) => (count > prevHighest ? count : prevHighest));
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, seconds, count]);

  return (
    <div className=" flex flex-col justify-center items-center h-screen mt-60">
      <div className="border-2 border-gray-300 p-4 shadow-lg rounded-lg m-4 w-96">
        <div className="app max-w-md mx-auto text-center py-10 ">
          <h1 className="text-4xl font-bold mb-4">Push Up Counter</h1>
          <h2 className="text-2xl font-semibold mb-6">{count}</h2>

          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => handleAdd()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              +
            </button>
            <button
              onClick={() => handleMinus()}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              -
            </button>
          </div>

          <div className="form mb-8">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center"
            >
              <label htmlFor="target" className="font-medium">
                Target:
              </label>
              <input
                type="text"
                id="target"
                name="target"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="mt-2 mb-4 px-3 py-2 border rounded"
              />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Set Target
              </button>
            </form>
            <button
              onClick={() => handleReset()}
              className="bg-green-500 hover:bg-green-700 text-white font-bold mt-4 py-2 px-4 rounded"
            >
              Reset
            </button>
          </div>
          <div className="alert">
            {data && data.target !== 0 && data.value >= data.target ? (
              <>
                <p className="text-lg font-semibold">Target reached!</p>
                <img
                  src="https://i.pinimg.com/736x/85/9f/d2/859fd2c3116e860af15923cf1450432d.jpg"
                  alt="Nice!"
                  className="mx-auto mt-4 w-36"
                />
              </>
            ) : data && data.target !== 0 ? (
              <>
                <p className="text-lg">Keep going!</p>
                <img
                  src="https://i.pinimg.com/564x/d8/a6/4c/d8a64cdb93731e2c9cabcb6bc80428c0.jpg"
                  alt="muftimenk<3"
                  className="mx-auto mt-4 w-36"
                />
              </>
            ) : null}
          </div>
        </div>
      </div>
      <div className="pt-20 border-2 border-gray-300 p-4 shadow-lg rounded-lg m-4 w-96">
        <div className="app max-w-md mx-auto text-center py-10">
          <p className="font-mono text-4xl font-bold">MINIGAMES!</p>
          <p className="font-mono">
            How many push up can you do in 20 seconds?
          </p>
          <div className="pt-4">
            <button
              onClick={startTimer}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Start
            </button>
          </div>
          <div>
            <p className="font-mono pt-4">Time: {seconds} seconds</p>
            <p className="font-mono pt-10">Your record: {highest}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
