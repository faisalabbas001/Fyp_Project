import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Grid, Paper } from "@mui/material";
import PromptInput from "./PromptInput";
import GeneratedContent from "./GeneratedContent";
import VideoPreview from "./VideoPreview";
import './VideoGenerator.css';

// Enhanced SSE Debugger with more detailed information
const SSEDebugger = ({ sseStatus, generatedImages, sseMessages }) => (
  <div style={{ 
    position: 'fixed', 
    top: 10, 
    right: 10, 
    background: 'rgba(0,0,0,0.9)', 
    color: 'white', 
    padding: 15, 
    borderRadius: 8,
    fontSize: 11,
    zIndex: 1000,
    maxWidth: 350,
    maxHeight: 400,
    overflow: 'auto',
    fontFamily: 'monospace'
  }}>
    <div style={{ marginBottom: 10, fontWeight: 'bold', color: '#4CAF50' }}>
      SSE Debug Panel
    </div>
    <div style={{ marginBottom: 8 }}>
      <strong>Status:</strong> <span style={{ color: sseStatus.includes('Connected') ? '#4CAF50' : '#f44336' }}>
        {sseStatus}
      </span>
    </div>
    <div style={{ marginBottom: 8 }}>
      <strong>Images Received:</strong> {generatedImages.length}
    </div>
    <div style={{ marginBottom: 10 }}>
      <strong>Recent Messages:</strong>
    </div>
    <div style={{ maxHeight: 200, overflow: 'auto', fontSize: 10 }}>
      {sseMessages.slice(-5).map((msg, idx) => (
        <div key={idx} style={{ marginBottom: 5, padding: 5, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
          <div style={{ color: '#888' }}>{msg.timestamp}</div>
          <div style={{ wordBreak: 'break-all' }}>{msg.data}</div>
        </div>
      ))}
    </div>
  </div>
);

// Enhanced Generated Images component with better debugging
const GeneratedImages = ({ images }) => (
  <div style={{ textAlign: "center", padding: 20 }}>
    <h3 style={{ color: "white", marginBottom: 20 }}>
      Generated Images ({images.length})
      {images.length > 0 && (
        <span style={{ fontSize: 14, color: '#4CAF50', marginLeft: 10 }}>
          ✅ Receiving data
        </span>
      )}
    </h3>
    {images.length === 0 ? (
      <div style={{ 
        color: "white", 
        padding: 20, 
        border: "2px dashed #666", 
        borderRadius: 8,
        backgroundColor: "rgba(255,255,255,0.1)"
      }}>
        <p>No images generated yet.</p>
        <p style={{ fontSize: 14, opacity: 0.8 }}>
          Images will appear here when video generation starts
        </p>
        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 10 }}>
          <strong>Troubleshooting:</strong>
          <ul style={{ textAlign: 'left', marginTop: 5 }}>
            <li>Check if server is sending image_generated events</li>
            <li>Verify SSE endpoint is working correctly</li>
            <li>Check server logs for image generation process</li>
          </ul>
        </div>
      </div>
    ) : (
      <div style={{ display: 'grid', gap: 16 }}>
        {images.map((img, idx) => {
          console.log("🖼️ Rendering image:", img);
          const fullImageUrl = `http://localhost:5000${img.imageUrl}`;
          
          return (
            <div key={idx} style={{ 
              marginBottom: 12,
              padding: 16,
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: 8
            }}>
              <div style={{ marginBottom: 8, fontSize: 12, color: '#888' }}>
                <strong>Debug Info:</strong> Index: {img.index}, Total: {img.total}
              </div>
              <img
                src={fullImageUrl}
                alt={`Generated ${idx + 1}`}
                style={{ 
                  width: "100%", 
                  maxWidth: 400,
                  borderRadius: 8,
                  border: "2px solid #4CAF50"
                }}
                onLoad={() => {
                  console.log(`✅ Image ${idx + 1} loaded successfully`);
                  console.log(`✅ URL: ${fullImageUrl}`);
                }}
                onError={(e) => {
                  console.error(`❌ Image ${idx + 1} failed to load:`, e);
                  console.error(`❌ Image URL: ${fullImageUrl}`);
                  console.error(`❌ Original imageUrl from server: ${img.imageUrl}`);
                }}
              />
              <p style={{ color: "white", fontSize: 14, marginTop: 8 }}>
                {img.message || `Image ${idx + 1}`}
              </p>
              <div style={{ fontSize: 11, color: '#888', marginTop: 5 }}>
                <div>Full URL: {fullImageUrl}</div>
                <div>Server Path: {img.imageUrl}</div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

// New placeholder component for Options
const Options = () => (
  <div style={{ textAlign: "center" }}>
    <h3>Options</h3>
    <p>Additional options will go here.</p>
  </div>
);

const VideoGenerator = () => {
  // States
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [uniqueId, setUniqueId] = useState(Date.now());
  const [videoList, setVideoList] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [textLoading, setTextLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [sseStatus, setSseStatus] = useState("Disconnected");
  const [sseMessages, setSseMessages] = useState([]);
  const [showDebugger, setShowDebugger] = useState(true); // Toggle for debug panel

  // Enhanced SSE connection with better error handling
  useEffect(() => {
    console.log("🔌 Attempting to establish SSE connection...");
    setSseStatus("Connecting...");
    
    const eventSource = new EventSource("http://localhost:5000/api/video/progress");
    
    eventSource.onopen = (event) => {
      console.log("✅ SSE connection opened successfully", event);
      setSseStatus("Connected");
    };
    
    eventSource.onmessage = (event) => {
      console.log("📡 Raw SSE message received:", event.data);
      
      // Add to messages log for debugging
      setSseMessages(prev => [...prev.slice(-10), { // Keep last 10 messages
        timestamp: new Date().toLocaleTimeString(),
        data: event.data
      }]);
      
      try {
        const parsed = JSON.parse(event.data);
        const { type, data } = parsed;
        
        console.log("📡 Parsed SSE message:", { type, data });
        
        if (type === "connection_established") {
          console.log("🎉 SSE connection confirmed by server");
          setSseStatus("Connected & Confirmed");
        }
        
        if (type === "image_generated") {
          console.log("📸 Image data received:", data);
          setGeneratedImages((prev) => {
            const newImages = [...prev, data];
            console.log("📸 Updated images array:", newImages);
            return newImages;
          });
        }
        
        if (type === "video_completed") {
          console.log("🎬 Video completed:", data);
        }
        
        if (type === "error") {
          console.error("❌ Server error:", data);
        }
        
        // Log all message types for debugging
        console.log(`📊 Message type received: ${type}`);
        
      } catch (err) {
        console.warn("❌ Failed to parse SSE data:", event.data, err);
      }
    };
    
    eventSource.onerror = (error) => {
      console.error("❌ SSE connection error:", error);
      console.error("❌ EventSource readyState:", eventSource.readyState);
      
      // Provide more specific error information
      switch (eventSource.readyState) {
        case EventSource.CONNECTING:
          setSseStatus("Connecting...");
          break;
        case EventSource.CLOSED:
          setSseStatus("Connection Closed");
          break;
        default:
          setSseStatus("Connection Error");
      }
    };

    // Cleanup function
    return () => {
      console.log("🔌 Closing SSE connection");
      eventSource.close();
      setSseStatus("Disconnected");
    };
  }, []);

  // Fetch existing videos
  const fetchVideoList = async () => {
    setLoadingVideos(true);
    try {
      const response = await axios.get("http://localhost:5000/api/video/list");
      setVideoList(response.data.videos || []);
    } catch (error) {
      console.error("Error fetching video list:", error);
    } finally {
      setLoadingVideos(false);
    }
  };

  useEffect(() => {
    fetchVideoList();
  }, []);

  useEffect(() => {
    if (videoUrl) fetchVideoList();
  }, [videoUrl]);

  // Simulate progress animation
  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 10;
        if (next >= 95) {
          clearInterval(interval);
          return 95;
        }
        return next;
      });
    }, 800);
    return interval;
  };

  // Enhanced video generation with better debugging
  const handleGenerateVideo = async () => {
    if (!prompt.trim()) return alert("Please enter a prompt!");

    console.log("🎬 Starting video generation with prompt:", prompt);
    
    // Clear previous images
    setGeneratedImages([]);
    console.log("🧹 Cleared previous images");

    setLoading(true);
    setTextLoading(true);
    setImageLoading(true);
    setVideoUrl("");
    setGeneratedText("");
    setImageUrl("");

    const progressInterval = simulateProgress();

    const newId = Date.now();
    setUniqueId(newId);

    // Video generation API call with enhanced logging
    console.log("📡 Making video generation API call...");
    axios
      .post("http://localhost:5000/api/video/generate-video", { prompt })
      .then((res) => {
        console.log("✅ Video generation API response:", res.data);
        setVideoUrl(`${res.data.videoUrl}?v=${newId}`);
      })
      .catch((err) => {
        console.error("❌ Video generation failed:", err);
        console.error("❌ Error details:", err.response?.data);
      })
      .finally(() => {
        clearInterval(progressInterval);
        setLoading(false);
      });

    // Text generation API call
    console.log("📡 Making text generation API call...");
    axios
      .post("http://localhost:5000/api/generate", { prompt })
      .then((res) => {
        console.log("✅ Text generation API response:", res.data);
        setGeneratedText(res.data.generatedContent || "");
      })
      .catch((err) => {
        console.warn("⚠️ Text generation failed:", err);
      })
      .finally(() => {
        setTextLoading(false);
      });

    // Image generation API call
    console.log("📡 Making image generation API call...");
    axios
      .post("http://localhost:5000/api/image", { prompt })
      .then((res) => {
        console.log("✅ Image generation API response:", res.data);
        if (res.data?.imageUrl) {
          setImageUrl(`/${res.data.imageUrl}`);
        } else {
          setImageUrl("");
        }
      })
      .catch((err) => {
        console.warn("⚠️ Image generation failed:", err);
        setImageUrl("");
      })
      .finally(() => {
        setImageLoading(false);
      });
  };

  // Reset form fields
  const resetForm = () => {
    setPrompt("");
    setVideoUrl("");
    setGeneratedText("");
    setImageUrl("");
    setProgress(0);
    setGeneratedImages([]);
    console.log("🧹 Form reset completed");
  };

  useEffect(() => {
    if (videoUrl) {
      const videoElement = document.getElementById("generated-video");
      if (videoElement) videoElement.load();
    }
  }, [videoUrl]);

  const getFullVideoUrl = (path) => {
    if (!path) return "";
    const baseUrl = path.split("?")[0];
    return `http://localhost:5000${baseUrl}?v=${uniqueId}`;
  };

  return (
    <div className="parent">
      {/* Debug Panel Toggle */}
      <button
        onClick={() => setShowDebugger(!showDebugger)}
        style={{
          position: 'fixed',
          top: 10,
          left: 10,
          background: '#333',
          color: 'white',
          border: 'none',
          padding: '8px 12px',
          borderRadius: 4,
          fontSize: 12,
          cursor: 'pointer',
          zIndex: 1001
        }}
      >
        {showDebugger ? 'Hide Debug' : 'Show Debug'}
      </button>

      {/* SSE Debugger */}
      {showDebugger && (
        <SSEDebugger 
          sseStatus={sseStatus} 
          generatedImages={generatedImages}
          sseMessages={sseMessages}
        />
      )}

      <div className="div1">
        <GeneratedContent
          generatedText={generatedText}
          progress={progress}
          loading={textLoading}
        />
      </div>

      <div className="div2">
        <VideoPreview
          videoUrl={videoUrl}
          prompt={prompt}
          uniqueId={uniqueId}
          getFullVideoUrl={getFullVideoUrl}
        />
      </div>

      <div className="div3">
        <PromptInput
          prompt={prompt}
          setPrompt={setPrompt}
          loading={loading}
          handleGenerateVideo={handleGenerateVideo}
          resetForm={resetForm}
        />
      </div>

      <div className="div4">
        <Options />
      </div>

      <div className="div5">
        <GeneratedImages images={generatedImages} />
      </div>
    </div>
  );
};

export default VideoGenerator