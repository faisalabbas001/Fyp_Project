import React, { useEffect } from "react";
import { Box, Button, Typography, Card, CardContent } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

const VideoPreview = ({ videoUrl, prompt, uniqueId, getFullVideoUrl }) => {
  useEffect(() => {
    if (videoUrl) {
      const videoElement = document.getElementById("generated-video");
      if (videoElement) videoElement.load();
    }
  }, [videoUrl]);

  if (!videoUrl) return null;

  return (
    <Card elevation={6} sx={{ mt: 4, overflow: "hidden", borderRadius: 4, border: `1px solid rgba(98, 0, 234, 0.3)` }}>
      <Box
        position="relative"
        sx={{
          backgroundColor: "#000",
          borderRadius: "12px",
          overflow: "hidden",
          "&::before": {
            content: '""',
            display: "block",
            paddingTop: "56.25%",
          },
        }}
      >
        <Box position="absolute" top={0} left={0} right={0} bottom={0} display="flex" alignItems="center" justifyContent="center">
          <video
            id="generated-video"
            controls
            width="100%"
            height="100%"
            key={uniqueId}
            style={{ objectFit: "contain", maxHeight: "100%", maxWidth: "100%", backgroundColor: "#000", margin: "auto" }}
            controlsList="nodownload"
            preload="metadata"
          >
            <source src={getFullVideoUrl(videoUrl)} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
      </Box>

      <CardContent>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Generated Video
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          {prompt ? `Your video has been created based on: "${prompt}"` : "Selected from video library"}
        </Typography>
        <Box mt={2} display="flex" gap={2}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<CloudUpload />}
            href={getFullVideoUrl(videoUrl)}
            target="_blank"
            download
            sx={{ textTransform: "none" }}
          >
            Download Video
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              const videoElement = document.getElementById("generated-video");
              if (videoElement) {
                videoElement.currentTime = 0;
                videoElement.load();
                videoElement.play();
              }
            }}
            sx={{ textTransform: "none" }}
          >
            Reload Video
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VideoPreview;
