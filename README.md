# 🎥 AI Video Generator

An advanced AI-powered platform to generate videos, images, and text from user prompts using machine learning models. This project includes a React frontend and an Express/Node.js backend with secure authentication and file processing.

## 🧠 Features

- ✨ Video, Text & Image generation using AI models
- 🔐 Custom JWT-based authentication
- 🧾 User dashboard with session management
- 📦 Backend built on Express with RESTful APIs
- 🎨 Responsive frontend built with React & Tailwind
- 🔍 Image label detection with Google Cloud Vision API
- ☁️ MongoDB integration for user and asset management

---

## 🧰 Tech Stack

**Frontend**:
- React.js
- React Router
- Tailwind CSS / Styled Components
- Axios

**Backend**:
- Node.js
- Express.js
- MongoDB with Mongoose
- Google Cloud Vision API
- JWT for authentication

---

## 📁 Project Structure



AI-video-generator/
│
├── backend/
│ ├── controllers/
│ ├── routes/
│ ├── middleware/
│ ├── config/
│ └── app.js
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ └── App.js
│
└── README.md

yaml
Copy
Edit

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/faisalabbas001/Fyp_Project.git
cd Fyp_Project
2. Install Dependencies
Backend:

bash
Copy
Edit
cd backend
npm install
Frontend:

bash
Copy
Edit
cd ../frontend
npm install
🔑 Environment Variables
Create a .env file in your backend/ folder:

env
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Google Vision
GOOGLE_CLIENT_EMAIL=your_google_service_email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nABC123...\n-----END PRIVATE KEY-----\n"
Note: Never commit sensitive credentials. Use .gitignore to prevent this.

🚀 Running the Project
Backend:

bash
Copy
Edit
cd backend
npm start
Frontend:

bash
Copy
Edit
cd frontend
npm start
📦 API Endpoints
Auth
POST /api/signup – Register user

POST /api/signin – Login user

Generators
POST /api/generate/video

POST /api/generate/text

POST /api/generate/image

Image Analysis
POST /api/analyze – Detect labels in images

👤 User Profile
Click the username in the top bar to:

View name and email

Access Logout dropdown

Navigate to profile settings

🛡 Security Notes
All API routes are protected using JWT middleware

Secrets are excluded from GitHub using .gitignore

Large file handling is enabled using Git LFS (recommended)

📸 Sample Screenshots
Home Page	Generator

🧑‍💻 Contributing
Contributions are welcome! Please open issues and submit pull requests for improvements and features.

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

markdown
Copy
Edit

---

### ✅ Final Tips

- Add screenshots to `frontend/public/img/` folder.
- Keep `.env` values out of version control.
- Setup a `.gitignore` file to exclude `node_modules`, `.env`, and `build`.

Let me know if you'd like me to generate this file directly for you or customize it further!








Ask ChatGPT

