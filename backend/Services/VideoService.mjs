// src/utils/videoCreator.js
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import say from "say";

const video = async (imagePaths, subtitles, prompt = "video", callback, progressCallback) => {
  // Add default value for prompt and handle undefined case
  const sanitizedPrompt = (prompt || "video")
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase();

  const audioFolder = path.resolve("public/audio");
  const segmentFolder = path.resolve("public/segments");
  const outputVideoPath = path.resolve(
    `public/${sanitizedPrompt}_${Date.now()}.mp4`
  );

  [audioFolder, segmentFolder].forEach((folder) => {
    if (!fs.existsSync(folder)) {
      try {
        fs.mkdirSync(folder, { recursive: true });
        console.log(`✅ Created directory: ${folder}`);
      } catch (err) {
        console.error(`❌ Failed to create directory ${folder}:`, err);
      }
    }
  });

  // Create unique temporary directory for this video creation process
  const uniqueId = Date.now();
  const tempSegmentFolder = path.resolve(`public/segments/temp_${uniqueId}`);
  const tempAudioFolder = path.resolve(`public/audio/temp_${uniqueId}`);

  try {
    fs.mkdirSync(tempSegmentFolder, { recursive: true });
    fs.mkdirSync(tempAudioFolder, { recursive: true });
    console.log(`✅ Created temporary directories for this video generation`);
  } catch (err) {
    console.error(`❌ Failed to create temporary directories:`, err);
    return;
  }

  // Function to send progress updates to frontend
  const sendProgress = (type, data) => {
    if (progressCallback && typeof progressCallback === 'function') {
      progressCallback({
        type,
        data,
        timestamp: Date.now()
      });
    }
  };

  // Validate image paths and send each image URL to frontend
  for (let i = 0; i < imagePaths.length; i++) {
    const imgPath = imagePaths[i];
    if (!fs.existsSync(imgPath)) {
      console.error(`❌ Image file not found: ${imgPath}`);
      return;
    }
    
    // Convert absolute path to relative URL for frontend
    const imageUrl = imgPath.replace(path.resolve("public"), "");
    const frontendUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    
    // Send each image URL to frontend as it's being processed
    sendProgress('image_generated', {
      imageUrl: frontendUrl,
      index: i,
      total: imagePaths.length,
      message: `Processing image ${i + 1} of ${imagePaths.length}`
    });
    
    console.log(`📸 Sent image URL to frontend: ${frontendUrl}`);
  }

  // Send audio generation start notification
  sendProgress('audio_generation_start', {
    message: 'Starting audio generation for subtitles',
    totalSubtitles: subtitles.length
  });

  // Generate audio files
  const createAudioFiles = async () => {
    const audioFiles = [];
    for (let i = 0; i < subtitles.length; i++) {
      const text = subtitles[i];
      const audioPath = path.resolve(tempAudioFolder, `audio${i}.wav`);

      // Send progress for each audio file being generated
      sendProgress('audio_generation_progress', {
        index: i,
        total: subtitles.length,
        text: text,
        message: `Generating audio ${i + 1} of ${subtitles.length}`
      });

      try {
        await new Promise((resolve, reject) => {
          say.export(text, null, 1.0, audioPath, (err) => {
            if (err) reject(`❌ Error generating audio for "${text}": ${err}`);
            else {
              console.log(`✅ Generated audio: ${audioPath}`);
              audioFiles.push(audioPath);
              
              // Send progress update for completed audio
              sendProgress('audio_generated', {
                index: i,
                total: subtitles.length,
                audioPath: audioPath,
                message: `Audio generated for: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`
              });
              
              resolve();
            }
          });
        });
      } catch (error) {
        console.error(error);
        sendProgress('error', {
          message: `Failed to generate audio: ${error}`,
          step: 'audio_generation'
        });
        return [];
      }
    }
    return audioFiles;
  };

  const audioFiles = await createAudioFiles();
  if (audioFiles.length !== subtitles.length) {
    console.error("❌ Mismatch in subtitles and audio files. Aborting...");
    sendProgress('error', {
      message: 'Mismatch in subtitles and audio files',
      step: 'audio_validation'
    });
    return;
  }

  // Send video processing start notification
  sendProgress('video_processing_start', {
    message: 'Starting video segment creation',
    totalSegments: subtitles.length
  });

  // Get audio durations
  const getAudioDurations = async () => {
    return Promise.all(
      audioFiles.map(
        (audioPath) =>
          new Promise((resolve, reject) => {
            ffmpeg.ffprobe(audioPath, (err, metadata) => {
              if (err)
                reject(`❌ Error retrieving duration for ${audioPath}: ${err}`);
              else resolve(metadata.format.duration);
            });
          })
      )
    );
  };

  const durations = await getAudioDurations();

  // First, determine target dimensions by examining all images
  const getImageDimensions = async () => {
    return Promise.all(
      imagePaths.map(
        (imagePath) =>
          new Promise((resolve, reject) => {
            ffmpeg.ffprobe(imagePath, (err, metadata) => {
              if (err)
                reject(
                  `❌ Error retrieving dimensions for ${imagePath}: ${err}`
                );
              else {
                const stream = metadata.streams.find(
                  (s) => s.codec_type === "video"
                );
                if (!stream) {
                  reject(`❌ No video stream found in ${imagePath}`);
                  return;
                }
                resolve({
                  width: stream.width || 1280, // Fallback to 1280 if undefined
                  height: stream.height || 720, // Fallback to 720 if undefined
                });
              }
            });
          })
      )
    );
  };

  try {
    const dimensions = await getImageDimensions();
    console.log("📏 Image dimensions:", dimensions);

    // Create video segments with individual processing
    const segmentPaths = [];
    for (let i = 0; i < subtitles.length; i++) {
      const segmentPath = path.resolve(tempSegmentFolder, `segment${i}.mp4`);
      console.log(`📼 Creating segment: ${segmentPath}`);

      // Send progress for segment creation
      sendProgress('segment_creation_start', {
        index: i,
        total: subtitles.length,
        message: `Creating video segment ${i + 1} of ${subtitles.length}`
      });

      try {
        await new Promise((resolve, reject) => {
          // Force even dimensions with the scale filter
          ffmpeg()
            .input(imagePaths[i])
            .inputOptions(["-loop", "1"]) // loop image
            .input(audioFiles[i])
            .outputOptions([
              `-t ${durations[i]}`, // total duration of the segment
              "-c:v libx264",
              "-pix_fmt yuv420p",
              "-c:a aac",
              "-shortest",
            ])
            .videoFilters([
              "zoompan=z='zoom+0.001':d=125:s=1280x720",
              "scale=trunc(iw/2)*2:trunc(ih/2)*2"
            ])            
            .on("start", (commandLine) => {
              console.log(`🚀 FFmpeg command: ${commandLine}`);
            })
            .on("progress", (progress) => {
              // Send FFmpeg progress updates
              sendProgress('segment_progress', {
                segmentIndex: i,
                total: subtitles.length,
                percent: progress.percent || 0,
                timemark: progress.timemark,
                message: `Processing segment ${i + 1}: ${Math.round(progress.percent || 0)}%`
              });
            })
            .on("end", () => {
              console.log(`✅ Created segment: ${segmentPath}`);
              segmentPaths.push(segmentPath);
              
              // Send segment completion update
              sendProgress('segment_created', {
                index: i,
                total: subtitles.length,
                segmentPath: segmentPath,
                message: `Segment ${i + 1} of ${subtitles.length} completed`
              });
              
              resolve();
            })
            .on("error", (err, stdout, stderr) => {
              console.error(`❌ Error during segment creation: ${err.message}`);
              if (stderr) console.error(`FFmpeg stderr: ${stderr}`);
              
              sendProgress('error', {
                message: `Error creating segment ${i + 1}: ${err.message}`,
                step: 'segment_creation',
                segmentIndex: i
              });
              
              reject(err);
            })
            .save(segmentPath);
        });
      } catch (error) {
        console.error(`❌ Error creating segment ${i}:`, error);
        return;
      }
    }

    // Check if segments were successfully created
    if (segmentPaths.length !== subtitles.length) {
      console.error(
        "❌ Not all segments were created. Aborting final video creation."
      );
      sendProgress('error', {
        message: 'Not all segments were created',
        step: 'segment_validation'
      });
      return;
    }

    // Send final video assembly start notification
    sendProgress('final_assembly_start', {
      message: 'Assembling final video from segments',
      totalSegments: segmentPaths.length
    });

    // Create a file with the list of segments for concatenation
    const listFilePath = path.resolve(tempSegmentFolder, "segments.txt");
    const fileContent = segmentPaths.map((p) => `file '${p}'`).join("\n");
    fs.writeFileSync(listFilePath, fileContent);
    console.log(`📝 Created segment list: ${listFilePath}`);

    // Use concat demuxer for more reliable concatenation
    ffmpeg()
      .input(listFilePath)
      .inputOptions(["-f", "concat", "-safe", "0"])
      .outputOptions(["-c:v", "copy", "-c:a", "copy"])
      .on("start", (command) =>
        console.log("🔄 FFmpeg concatenation command:", command)
      )
      .on("progress", (progress) => {
        // Send final assembly progress
        sendProgress('final_assembly_progress', {
          percent: progress.percent || 0,
          timemark: progress.timemark,
          message: `Assembling final video: ${Math.round(progress.percent || 0)}%`
        });
      })
      .on("end", () => {
        console.log(
          `🎉 Final video created successfully at: ${outputVideoPath}`
        );

        // Send completion notification with final video URL
        const videoUrl = outputVideoPath.replace(path.resolve("public"), "");
        const frontendVideoUrl = videoUrl.startsWith('/') ? videoUrl : `/${videoUrl}`;
        
        sendProgress('video_completed', {
          videoUrl: frontendVideoUrl,
          message: 'Video creation completed successfully!',
          outputPath: outputVideoPath
        });

        // Clean up temporary folders after successful video creation
        try {
          // Keep this commented if you want to preserve temp files for debugging
          // fs.rmSync(tempSegmentFolder, { recursive: true, force: true });
          // fs.rmSync(tempAudioFolder, { recursive: true, force: true });
          console.log(`🧹 Cleanup step (optional)`);
        } catch (err) {
          console.error(
            `⚠️ Warning: Could not clean up temporary folders:`,
            err
          );
        }

        if (callback) callback(outputVideoPath);
      })
      .on("error", (err, stdout, stderr) => {
        console.error("❌ Error creating final video:", err.message);
        if (stderr) console.error(`FFmpeg stderr: ${stderr}`);
        
        sendProgress('error', {
          message: `Error creating final video: ${err.message}`,
          step: 'final_assembly'
        });
      })
      .save(outputVideoPath);

    // Always return generated relative path:
    const publicPath = outputVideoPath.replace(path.resolve("public"), "");
    return `/public${publicPath}`;
  } catch (error) {
    console.error(`❌ Error during processing: ${error}`);
    sendProgress('error', {
      message: `Error during processing: ${error}`,
      step: 'general_processing'
    });
  }
};

export default video;