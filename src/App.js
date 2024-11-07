import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faYoutube, faGoogle } from '@fortawesome/free-brands-svg-icons';
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

  const handleInstagramClick = (japanese) => {
    const hashtag = encodeURIComponent(japanese.replace(/\s+/g, ''));
    window.open(`https://www.instagram.com/explore/tags/${hashtag}/`, '_blank');
  };

  const handleYouTubeClick = (japanese) => {
    const query = encodeURIComponent(japanese + " 奈良");
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };

  const handleGoogleMapsClick = (japanese) => {
    const query = encodeURIComponent(japanese);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="App">
      <h1>奈良のラーメン屋</h1>
      <div className="search-box">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter text in English"
        />
      </div>
      <div className="results">
        <ul>
          {results.map(([english, japanese], index) => (
            <li key={index} className="result-item">
              <div className="text">
                {english} - {japanese}
              </div>
              <div className="icon-group">
                <FontAwesomeIcon
                  icon={faInstagram}
                  onClick={() => handleInstagramClick(japanese)}
                  className="icon"
                />
                <FontAwesomeIcon
                  icon={faYoutube}
                  onClick={() => handleYouTubeClick(japanese)}
                  className="icon"
                />
                <FontAwesomeIcon
                  icon={faGoogle}
                  onClick={() => handleGoogleMapsClick(japanese)}
                  className="icon"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
