import React from "react";
import { Box, Button, TextField, Typography, CircularProgress } from "@mui/material";
import { Send, Refresh } from "@mui/icons-material";

const PromptInput = ({ prompt, setPrompt, loading, handleGenerateVideo, resetForm }) => {
  return (
    <Box>
      

      <Box mb={4}>
        <TextField
          fullWidth
          rows={4}
          variant="outlined"
          label="Enter your text prompt"
          placeholder="Describe the video you want to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          sx={{
            input: { color: "#ffffff" }, /* Makes text inside the input white */
            label: { color: "#ffffff" }, /* Makes the label white */
            "& .MuiOutlinedInput-root": { 
              "& fieldset": { borderColor: "#666" }, /* Adjusts border color */
              "&:hover fieldset": { borderColor: "#999" }, /* Lighter border on hover */
              "&.Mui-focused fieldset": { borderColor: "#ffffff" } /* White border on focus */
            }
          }}
          InputProps={{
            style: { color: "#ffffff" }, /* Ensures input text stays visible */
            placeholder: "Describe the video you want to generate...",
          }}
        />  
      </Box>

      <Box display="flex" justifyContent="center" mb={4} gap={2}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleGenerateVideo}
          disabled={loading || !prompt.trim()}
          startIcon={loading ? null : <Send />}
          sx={{
            backgroundColor: "#ffffff", /* White button background */
            color: "#000000", /* Black text */
            "&:hover": { backgroundColor: "#cccccc" }, /* Lighter hover effect */
            "&.Mui-disabled": { backgroundColor: "#777", color: "#444" } /* Styled disabled state */
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Generate Video"}
        </Button>

        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={resetForm}
          startIcon={<Refresh />}
          disabled={loading || (!prompt && !prompt.trim())}
          sx={{
            borderColor: "#ffffff", /* White border */
            color: "#ffffff", /* White text */
            "&:hover": { backgroundColor: "#555" }, /* Subtle hover effect */
            "&.Mui-disabled": { borderColor: "#777", color: "#444" } /* Styled disabled state */
          }}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default PromptInput;