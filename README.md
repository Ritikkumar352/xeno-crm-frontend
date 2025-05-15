# xeno-crm-frontend

Here’s a basic, human-style README.md for a React project that uses:

    Google OAuth 2.0

    Gemini API (for AI integration)

    .env setup for storing sensitive variables like API keys and secrets

✅ README.md (looks human-written)

# ✨ Mini CRM Frontend (React)

Hi! 👋  
This is a simple React-based frontend app made for experimenting with campaign delivery, Google OAuth 2.0 login, and Gemini AI API integration. This is not production-grade — more of a learning + demo project, but works well for basic use cases.  

## 🧰 Tech Stack

- React (via Create React App)
- MUI (for UI components)
- Google OAuth 2.0 (Login)
- Gemini AI API (for generating responses)
- Axios (for API calls)

---

## 🔧 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/mini-crm-frontend.git
cd mini-crm-frontend

2. Install dependencies

npm install

3. Setup .env file

Create a .env file in the root directory and add the following:

REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
REACT_APP_GOOGLE_CLIENT_SECRET=your-google-client-secret
REACT_APP_GEMINI_API_KEY=your-gemini-api-key

    

4. Start the app

npm start

It’ll run on http://localhost:3000
🧠 Notes

    Make sure the OAuth Client ID is set up correctly in the Google Developer Console.

    If Gemini API fails, check if the key is still active or if the quota is exhausted.

    This project uses REACT_APP_ prefix for all env vars (required by CRA).