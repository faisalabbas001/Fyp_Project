import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Generator.css';
import axios from 'axios';

export default function Generator() {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState([]);
  const [typingEntryIndex, setTypingEntryIndex] = useState(null);
  const [displayText, setDisplayText] = useState('');

  const handleGenerateContent = async () => {
    if (!prompt.trim()) return;

    const currentIndex = history.length;
    setHistory(prev => [...prev, { prompt, response: '', fullResponse: '', isTyping: true }]);
    setPrompt('');

    try {
      const res = await axios.post('http://localhost:5000/api/generate', { prompt });
      const fullText = res.data.generatedContent || 'No response received.';

      setTypingEntryIndex(currentIndex);
      setDisplayText('');
      typeText(fullText, currentIndex);
    } catch (error) {
      console.error('Error generating content:', error);
      updateEntry(currentIndex, 'Error generating content.');
    }
  };

  const updateEntry = (index, fullText) => {
    setHistory(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        response: fullText,
        fullResponse: fullText,
        isTyping: false
      };
      return updated;
    });
  };

  const typeText = (fullText, index) => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      const sliced = fullText.slice(0, i);
      setDisplayText(sliced);

      setHistory(prev => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index].response = sliced;
        }
        return updated;
      });

      if (i >= fullText.length) {
        clearInterval(interval);
        updateEntry(index, fullText);
      }
    }, 30); // typing speed
  };

  return (
    <div className="main">
      <div className="sidebar">
        <Link to='/home' className='text-white'><button className="home-btn">Home</button></Link>
      </div>
      <div className="Generator">
        <div className="form form-group">
          <input
            type="text"
            className="text-field form-control m-3"
            placeholder="Enter Prompt Here"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button className="send home-btn m-2 btn-G" onClick={handleGenerateContent}>
            Generate
          </button>
        </div>
        <div className="text-output scroll-container">
          {history.map((entry, index) => (
            <div key={index}>
              <p className='console-prompt'>$ {entry.prompt}</p>
              <p className='console-response'>{entry.response}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
