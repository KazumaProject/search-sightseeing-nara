import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (inputValue) {
        fetchResults(inputValue);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue]);

  const fetchResults = async (value) => {
    const formattedValue = value.charAt(0).toUpperCase() + value.slice(1);

    try {
      const response = await axios.post('http://localhost:8080/henkan', {
        value: formattedValue,
      });
      
      if (response.data && Array.isArray(response.data.result)) {
        setResults(response.data.result);
      } else {
        console.error('Unexpected response format:', response.data);
        setResults([]);
      }
    } catch (error) {
      console.error('Error fetching conversion:', error);
      setResults([]);
    }
  };

  const handleItemClick = (japanese) => {
    // Open Instagram hashtag page with the response data
    const hashtag = encodeURIComponent(japanese); // Encode hashtag for URL
    window.open(`https://www.instagram.com/explore/tags/${hashtag}/`, '_blank');
  };

  return (
    <div className="App">
      <h1> 奈良のラーメン屋</h1>
      <div className="search-box">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter text in English"
        />
      </div>
      <div className="results">
        <h2>Conversion Results:</h2>
        <ul>
          {results.map(([english, japanese], index) => (
            <li key={index} onClick={() => handleItemClick(japanese)}>
              {english} - {japanese}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
