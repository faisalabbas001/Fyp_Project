import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Skeleton } from "@mui/material";

const GeneratedContent = ({ generatedText, imageUrl, loading, progress }) => {
  const [typedText, setTypedText] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!loading && generatedText) {
      setTypedText("");
      setTypingIndex(0);
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setTypedText(generatedText.slice(0, i));
        setTypingIndex(i);
        if (i >= generatedText.length) clearInterval(interval);
      }, 15);
      return () => clearInterval(interval);
    }
  }, [generatedText, loading]);

  return (
    <>
      {loading && (
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <CircularProgress
              variant="determinate"
              value={progress}
              size={100}
              thickness={4}
              color="secondary"
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                component="div"
                color="text.secondary"
              >
                {`${Math.round(progress)}%`}
              </Typography>
            </Box>
          </Box>
          <Box mt={2}>
            <Typography variant="h5" color="primary" fontWeight="bold">
              Creating your video...
            </Typography>
            <Typography variant="body1" color="textSecondary">
              This may take a moment as we transform your words into visuals.
            </Typography>
          </Box>
        </Box>
      )}

      {(typedText || imageUrl) && (
        <Box mb={4}>
          {typedText && (
            <Box mb={2}>
            <Typography variant="h6" fontWeight="bold" mb={1} sx={{color:'white', textAlign:'center'}}>
              Generated Text
            </Typography>
          
            <Box
              sx={{
                width: '100%',
                backgroundColor: "#111",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  fontFamily: "Courier New, monospace",
                  color: "#0f0",
                  padding: 2,
                  whiteSpace: "pre-wrap",
                  minHeight: 100,
                  height: "100%",
                  width: "100%",
                  display: "block",
                  boxSizing: "border-box",
                }}
              >
                <Box sx={{ visibility: "hidden", height: 0, overflow: "hidden" }}>
                  {/* Force layout to pre-allocate space */}
                  {generatedText}
                </Box>
                <Box component="span">{typedText}</Box>
                {typingIndex < generatedText.length && <span className="cursor">|</span>}
              </Box>
            </Box>
          </Box>
          
          )}

          {imageUrl && (
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Generated Image
              </Typography>
              {!imageLoaded && (
                <Skeleton variant="rectangular" width="100%" height={250} />
              )}
              <img
                src={imageUrl}
                alt="Generated Visual"
                style={{
                  maxWidth: "100%",
                  borderRadius: 8,
                  display: imageLoaded ? "block" : "none",
                }}
                onLoad={() => setImageLoaded(true)}
              />
            </Box>
          )}
        </Box>
      )}

      <style>{`
        .cursor {
          display: inline-block;
          width: 10px;
          background-color: #0f0;
          animation: blink 1s step-end infinite;
          margin-left: 2px;
        }

        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default GeneratedContent;
