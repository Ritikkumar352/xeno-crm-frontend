# xeno-crm-frontend

## Vite + React + ShadCN + TypeScript Starter

This project is a frontend starter template using Vite, React, TypeScript, Tailwind CSS, and ShadCN UI components. It is pre-configured with Radix UI primitives, React Router, React Hook Form, Zod, Firebase, and other commonly used libraries for building modern web applications.

---

## Update
-- Updated with different model of gemini -- `Gemini 1.5 Flash` 

## Getting Started

### 1. Clone the Repository

```git clone https://github.com/Ritikkumar352/xeno-crm-frontend.git```
- cd xeno-crm-frontend


### 2. Install Dependencies

```npm install```


### 3. Environment Variables

Create a `.env` file in the root of the project and configure the required environment variables.

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
# Add other variables as needed


### 4. Run the Development Server

npm run dev


This will start the Vite development server at `http://localhost:5173`.

---


---

## Tech Stack

- Vite (build tool)  
- React 18  
- TypeScript  
- Tailwind CSS  
- ShadCN UI (based on Radix UI primitives)  
- React Router DOM  
- React Hook Form and Zod (for forms and validation)  
- Firebase SDK (for authentication and other services)  
- Lucide React (icon set)  


---

## Deployment

This app is deployed on AWS Amplify:  
https://main.d3pha96ypv251i.amplifyapp.com/  

---

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