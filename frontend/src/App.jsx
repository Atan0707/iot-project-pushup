import { useState, useEffect} from 'react'

function App() {
  const endpoint = 'http://192.168.1.2:3000/postValue'

  const [count, setCount] = useState(0)

  var test = 0;

  const handleAdd = () => {
    setCount(count + 1);
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ value: count })
    }).then (() => {
      console.log('Value sent to the server');
    }).catch(err => {
      console.error('Error sending value to the server: ', err);
    })
  }

  const handleMinus = () => {
    setCount(count - 1);
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ test })
    }).then (() => {
      console.log('Value sent to the server');
    }).catch(err => {
      console.error('Error sending value to the server: ', err);
    })
  }


  return (
    <div className="app">
      <h1>push up counter</h1>
      <h2>{count}</h2>
      <button onClick={() => handleAdd()}>+</button>
      <button onClick={() => handleMinus()}>-</button>
    </div>
  )
}

export default App
