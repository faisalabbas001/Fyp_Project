import React, { useState, useEffect, useRef } from 'react';

const VideoGenerator = () => {
  const [sessionId, setSessionId] = useState(null);
  const [script, setScript] = useState([]);
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState({ step: '', message: '', progress: 0 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(30);
  const eventSourceRef = useRef(null);

  // Initialize progress tracking
  const initializeProgressTracking = (sessionId) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource(`/api/videos/progress/${sessionId}`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'progress') {
        setProgress({
          step: data.step,
          message: data.message,
          progress: data.progress
        });

        if (data.progress === 100 && data.videoPath) {
          setIsGenerating(false);
          alert(`Video created successfully! Path: ${data.videoPath}`);
        }
      } else if (data.type === 'error') {
        console.error('Video generation error:', data.error);
        setIsGenerating(false);
        alert(`Error: ${data.error}`);
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      setIsGenerating(false);
    };
  };

  // Generate script
  const generateScript = async () => {
    try {
      setIsGenerating(true);
      const response = await fetch('/api/videos/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, duration })
      });

      const result = await response.json();
      if (result.success) {
        setScript(result.data.script);
        setSessionId(result.data.sessionId);
      }
    } catch (error) {
      console.error('Error generating script:', error);
      setIsGenerating(false);
    }
  };

  // Generate images
  const generateImages = async () => {
    if (!sessionId || script.length === 0) return;

    try {
      const response = await fetch('/api/videos/generate-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, sessionId })
      });

      const result = await response.json();
      if (result.success) {
        setImages(result.data.images);
      }
    } catch (error) {
      console.error('Error generating images:', error);
      setIsGenerating(false);
    }
  };

  // Create video
  const createVideo = async () => {
    if (!sessionId || images.length === 0 || script.length === 0) return;

    try {
      // Initialize progress tracking
      initializeProgressTracking(sessionId);

      const imagePaths = images.map(img => img.localPath);
      
      const response = await fetch('/api/videos/create-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId, 
          imagePaths, 
          subtitles: script, 
          prompt 
        })
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error creating video:', error);
      setIsGenerating(false);
    }
  };

  // Full generation process
  const generateFullVideo = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setProgress({ step: 'starting', message: 'Starting generation...', progress: 0 });

    try {
      // Step 1: Generate script
      await generateScript();
      // Steps 2-3 will be called automatically after script generation
    } catch (error) {
      console.error('Error in full video generation:', error);
      setIsGenerating(false);
    }
  };

  // Auto-progress through steps
  useEffect(() => {
    if (script.length > 0 && images.length === 0 && isGenerating) {
      generateImages();
    }
  }, [script]);

  useEffect(() => {
    if (images.length > 0 && script.length > 0 && isGenerating) {
      createVideo();
    }
  }, [images]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">AI Video Generator</h1>
      
      {/* Input Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your video description..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              disabled={isGenerating}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (seconds)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min="10"
              max="300"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isGenerating}
            />
          </div>
        </div>
        
        <button
          onClick={generateFullVideo}
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isGenerating ? 'Generating Video...' : 'Generate Video'}
        </button>
      </div>

      {/* Progress Display */}
      {isGenerating && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Generation Progress</h2>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span className="capitalize">{progress.step.replace('_', ' ')}</span>
              <span>{Math.round(progress.progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.progress}%` }}
              ></div>
            </div>
          </div>
          <p className="text-gray-700">{progress.message}</p>
        </div>
      )}

      {/* Generated Content Display */}
      {script.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Generated Script</h2>
          <div className="space-y-2">
            {script.map((line, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                <span className="text-sm text-gray-500">Segment {index + 1}:</span>
                <p className="text-gray-800">{line}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Generated Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <img 
                  src={image.url} 
                  alt={`Generated image ${index + 1}`}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/300/200';
                  }}
                />
                <div className="p-3">
                  <p className="text-sm text-gray-600 truncate">{image.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGenerator;