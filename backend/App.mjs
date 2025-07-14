import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import routes from './Routes/routes.mjs'
import videoRoutes from './Routes/videoRoutes.mjs'
import video from './Services/VideoService.mjs' // Import your video creator
import { connectDB } from './config/db.mjs';
import authRoutes from './Routes/authRoutes.mjs';
import dotenv from 'dotenv';
dotenv.config();
const app = express()
await connectDB();
app.use(cors())
app.use(bodyParser.json())
app.use("/public", express.static("public"));
app.use('/api', routes);
app.use('/api/video', videoRoutes);
app.use('/api/auth', authRoutes)
// Global clients array to store SSE connections
const clients = [];

// SSE endpoint for progress updates
app.get("/api/video/progress", (req, res) => {
    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control"
    });
    
    res.flushHeaders();
    
    // Add client to the list
    clients.push(res);
    console.log(`🟢 SSE client connected (${clients.length} total)`);
    
    // Send initial connection message
    res.write(`data: ${JSON.stringify({ 
      type: "connection_established", 
      data: { message: "SSE connection established" } 
    })}\n\n`);
    
    // Handle client disconnect
    req.on("close", () => {
      const index = clients.indexOf(res);
      if (index !== -1) {
        clients.splice(index, 1);
        console.log(`🔴 SSE client disconnected (${clients.length} remaining)`);
      }
    });
    
    // Keep connection alive
    const keepAlive = setInterval(() => {
      if (res.finished) {
        clearInterval(keepAlive);
        return;
      }
      res.write(`: keep-alive\n\n`);
    }, 30000); // Send keep-alive every 30 seconds
});

// Function to send progress updates to all connected clients
const sendProgressToClients = (progressData) => {
  const { type, data } = progressData;
  const payload = `data: ${JSON.stringify({ type, data })}\n\n`;
  
  console.log(`📡 Broadcasting to ${clients.length} clients:`, { type, data });
  
  // Send to all connected clients
  clients.forEach((client, index) => {
    try {
      if (!client.finished) {
        client.write(payload);
      } else {
        console.log(`⚠️ Client ${index} connection is finished, removing...`);
        clients.splice(index, 1);
      }
    } catch (error) {
      console.error(`❌ Error sending to client ${index}:`, error);
      clients.splice(index, 1);
    }
  });
};

// Video generation endpoint
app.post("/api/video/generate-video", async (req, res) => {
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }
  
  console.log(`🎬 Starting video generation for prompt: "${prompt}"`);
  
  try {
    // Send initial status
    sendProgressToClients({
      type: "video_generation_start",
      data: { 
        message: "Starting video generation...", 
        prompt: prompt 
      }
    });
    
    // Example image paths - replace with your actual image generation logic
    const imagePaths = [
      "public/images/1.jpg", 
      "public/images/2.jpg",
      "public/images/3.jpg" // Add more as needed
    ];
    
    // Example subtitles - replace with your actual subtitle generation logic
    const subtitles = [
      "First frame subtitle", 
      "Second frame subtitle",
      "Third frame subtitle"
    ];
    
    // Call video creation with progress callback
    const outputPath = await video(
      imagePaths,
      subtitles,
      prompt,
      (finalVideoPath) => {
        console.log(`✅ Video generation completed: ${finalVideoPath}`);
      },
      sendProgressToClients // Pass the progress callback
    );
    
    console.log(`🎉 Video generated successfully: ${outputPath}`);
    
    // Send final response
    res.json({ 
      success: true,
      videoUrl: outputPath,
      message: "Video generated successfully"
    });
    
  } catch (error) {
    console.error("❌ Video generation failed:", error);
    
    // Send error to SSE clients
    sendProgressToClients({
      type: "error",
      data: { 
        message: "Video generation failed", 
        error: error.message 
      }
    });
    
    res.status(500).json({ 
      success: false,
      error: "Video generation failed", 
      details: error.message 
    });
  }
});

// Test endpoint to manually send image data (for debugging)
app.post("/api/video/test-images", (req, res) => {
  console.log("🧪 Testing image broadcast...");
  
  // Send test images
  const testImages = [
    {
      imageUrl: "/images/1.jpg",
      index: 0,
      total: 3,
      message: "Test image 1 of 3"
    },
    {
      imageUrl: "/images/2.jpg", 
      index: 1,
      total: 3,
      message: "Test image 2 of 3"
    },
    {
      imageUrl: "/images/3.jpg",
      index: 2, 
      total: 3,
      message: "Test image 3 of 3"
    }
  ];
  
  testImages.forEach((imgData, index) => {
    setTimeout(() => {
      sendProgressToClients({
        type: "image_generated",
        data: imgData
      });
    }, index * 1000); // Send each image with 1 second delay
  });
  
  res.json({ message: "Test images sent via SSE" });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    sseClients: clients.length,
    timestamp: new Date().toISOString()
  });
});

app.listen(5000, () => {
    console.log('🚀 Server running on port 5000')
    console.log('📡 SSE endpoint: http://localhost:5000/api/video/progress')
    console.log('🎬 Video generation: POST http://localhost:5000/api/video/generate-video')
    console.log('🧪 Test images: POST http://localhost:5000/api/video/test-images')
})