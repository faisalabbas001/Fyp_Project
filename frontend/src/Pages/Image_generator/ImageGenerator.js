import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Image_generator.css";

export default function ImageGenerator() {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [prompt, setPrompt] = useState("");

    const handleGenerateContent = async () => {
        try {
            setLoading(true);
            setError(null);
            setImageUrl(null);

            const res = await axios.post("http://localhost:5000/api/image", { prompt });

            if (res.data.imageUrl) {
                setImageUrl(`http://localhost:5000${res.data.imageUrl}`);
            } else {
                setError("Failed to generate image.");
            }

            setPrompt(""); // Clear the prompt input field after submission
        } catch (err) {
            setError("Error generating content: " + err.message);
            console.error("Error generating content:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="image_generator">
            <div className="form form-group">
                <button className="btn btn-dark m-2">
                    <Link to="/home" className="text-white">Home</Link>
                </button>
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

            {loading && (
                <div className="loading">
                    <img className="shape" src="img/shape.svg" alt="Loading" width="100px" height="100px" />
                </div>
            )}

            {error && <p className="error-text">{error}</p>}

            {!loading && !error && !imageUrl && <p>No image available</p>}

            {imageUrl && (
                <div className="img">
                    <img src={imageUrl} className="generated_img" alt="Generated" />
                </div>
            )}
        </div>
    );
}
