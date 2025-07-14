import React, { useState } from 'react';
import './Image_analyzer.css';
import { Link } from 'react-router-dom';

function ImageAnalyzer() {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [results, setResults] = useState([]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/detect-landmark', {
        method: 'POST',
        body: formData,
      });

      console.log('Fetched response:', response);

      if (response.ok) {
        const textResponse = await response.text();
        console.log('Response text:', textResponse);

        let data;
        try {
          data = JSON.parse(textResponse);
        } catch (e) {
          console.error('Error parsing JSON:', e);
          data = { result: 'Invalid JSON response' };
        }

        console.log('Parsed data:', data);
        setResults(data.result || []);
      } else {
        console.error('Response Error:', response.statusText);
        setResults(['Error: ' + response.statusText]);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setResults(['Error: ' + error.message]);
    }
  };

  return (
    <>
    <div className='analyzer-header'>
    <button className='btn btn-dark m-2'><Link to='/home' className='text-white'>Home</Link></button>
    <center><h1>Image Object Detection</h1></center>
    </div>
      <div className='analyzer'>
    
      <div className="analyzer-body">
        <form onSubmit={handleSubmit}>
          <input className="custom-file-input" type="file" accept="image/*" onChange={handleFileChange} />
          {filePreview && (
            <div className='uploaded-image'>
              <h2>Uploaded Image:</h2>
              <img src={filePreview} alt="Uploaded Preview" style={{ maxWidth: '100%', height: 'auto' }}/>
            </div>
          )}

          <button className="btn btn-success" type="submit">Upload and Detect</button>
        </form>

        {results.length > 0 && (
          <div className='result'>
            <h2>Detection Results:</h2>
            <ul>
              {results.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default ImageAnalyzer;
