# DFlex — AI-Powered Personalized Diet & Nutrition Planner

**DFlex** is an AI-powered, full-stack MERN health and fitness application designed with a high-energy, dark neon aesthetic for athletes, bodybuilders, and fitness enthusiasts. It dynamically calculates user-specific health metrics (BMI, BMR, TDEE, Macros, Water) and leverages Google's **Gemini AI (`gemini-2.5-flash`)** to generate hyper-personalized daily meal plans tailored to body goals, dietary preferences, budget, and lifestyle.

---

## 🚀 Features & Functional Requirements

### 🔑 1. Authentication & User Management
* **Custom MERN Authentication**: Full authentication system built without third-party user management lock-in.
* **Email & Password Auth**: Secure user registration and login with `bcrypt` password hashing.
* **JWT Session Management**: Stateless authentication using JSON Web Tokens stored securely in `localStorage` with automated HTTP header injection via Axios interceptors.
* **Google OAuth 2.0 Integration**: One-click "Continue with Google" sign-in using `@react-oauth/google` and server-side token verification via `google-auth-library`.
* **Protected Routes**: Client-side protected route wrappers (`<ProtectedRoute />`) ensuring unauthorized users are directed to authentication views.

### 📋 2. Comprehensive Fitness & Health Assessment Wizard
* **Multi-Step Onboarding**:
  * **Step 1: Physical Profile** — Age, Gender, Height, Weight (with live `kg/lbs` and `cm/ft` unit conversions).
  * **Step 2: Training & Activity** — Primary workout style (Gym, Home, CrossFit, Running, etc.), Activity Level (Sedentary to Athlete), Workout Frequency, Meals per day preference, Budget allocation.
  * **Step 3: Goals & Dietary Rules** — Fitness Goal selection (*Lean Bulk, Dirty Bulk, Lean Cut, Fat Loss, Maintenance, Body Recomposition*), Diet Type (*Veg, Non-Veg, Both*), Cuisine preferences, Food likes & avoids, Supplements.
  * **Step 4: Lifestyle & Medical Audit** — Allergies, Medical conditions, Hydration goals, Sleep duration, Cooking time limits, Spice preferences, Daily step averages, Stress level.
* **Real-time Metric Calculation Preview**: Calculates BMR, BMI, TDEE, Target Daily Calories, and Macro distribution (Protein, Carbs, Fat) dynamically before sending requests to the AI engine.

### 🧠 3. AI-Powered Diet Generation Protocol
* **Single-Pass AI Orchestration**: Seamless backend pipeline that processes health calculations, formats a structured prompt, and queries Google Gemini AI (`gemini-2.5-flash`).
* **Structured Daily Meal Breakdown**:
  * Breakfast, Morning Snack, Lunch, Evening Snack, Dinner.
  * Detailed item names, portion sizes/quantities, calorie counts, and macro splits per meal.
* **Smart Shopping Suggestions**: Automated grocery list generation based on user budget and food likes.
* **Healthy Alternatives & Nutrition Tips**: Actionable food swap suggestions and scientific nutrition advice generated specifically for the user's goals.
* **Protocol Regeneration**: One-click option to recalculate metrics and generate a fresh diet protocol at any time.

### 📊 4. Dashboard & Adherence Trackers
* **Daily Adherence Checklist**: Interactive meal completion checkboxes calculating real-time daily adherence percentages.
* **Caloric & Macro Target Meters**: Visual breakdown of target vs. consumed calories, protein, carbs, and fats.
* **Water Intake Tracker**: Hydration logging with interactive water additions, visual progress towards recommended liters, and daily reset capabilities.
* **Body Weight & Activity Logs**: Record weight changes over time and track daily step counts.
* **Data Visualization**: Interactive progress charts powered by `Recharts`.

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Description |
| :--- | :--- |
| **React 18** | UI Framework |
| **TypeScript** | Type-safe application logic |
| **Vite** | Next-generation frontend build tool |
| **Tailwind CSS** | Utility-first dark neon styling |
| **React Router DOM v6** | Client-side Single Page Application routing |
| **React Hook Form & Zod** | Schema-validated form handling |
| **Axios** | HTTP client with request/response interceptors |
| **@react-oauth/google** | Google OAuth client library |
| **Framer Motion** | High-performance UI animations |
| **Lucide React** | Icon library |
| **React Hot Toast** | Toast notifications |
| **Recharts** | Data visualization & charts |

### **Backend**
| Technology | Description |
| :--- | :--- |
| **Node.js & Express.js** | Server-side runtime & web API framework |
| **TypeScript** | Type-safe backend architecture |
| **MongoDB Atlas & Mongoose** | Cloud NoSQL database & Object Data Modeling |
| **JSONWebToken (`jsonwebtoken`)** | Token-based authentication |
| **Bcrypt (`bcrypt`)** | Password hashing |
| **Google Auth Library** | Server-side Google ID/Access token verification |
| **Google Generative AI SDK** | `@google/generative-ai` (`gemini-2.5-flash`) integration |
| **Zod Middleware** | Server-side request body and query parameter validation |

### **Deployment & Infrastructure**
* **Frontend**: Vercel (configured with `vercel.json` SPA rewrites)
* **Backend**: Render (Node.js web service)
* **Database**: MongoDB Atlas
* **Source Control**: Git & GitHub

---

## 📁 Repository Structure

```text
DFlex/
├── backend/
│   ├── src/
│   │   ├── config/         # Database connection setup
│   │   ├── controllers/    # Request handlers (auth, diet)
│   │   ├── middlewares/    # JWT auth & Zod validation middlewares
│   │   ├── models/         # Mongoose User & DietPlan schemas
│   │   ├── routes/         # Express API route endpoints
│   │   ├── services/       # Business logic & Gemini AI service
│   │   ├── utils/          # Calculations (BMI, BMR, TDEE) & response formatters
│   │   ├── validators/     # Zod validation schemas
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── src/
│   ├── components/         # Layout, Navbar, UI Components, Protected Route
│   ├── context/            # Global AuthContext (JWT & Google Auth)
│   ├── lib/                # Axios API instance & global AppStore context
│   ├── pages/              # Landing, Onboarding, Wizard, AI Loading, Dashboard, Diet, Progress, Water, Auth
│   ├── App.tsx             # Application router & provider wrapper
│   └── main.tsx            # React entry point
├── public/                 # Favicon assets & static icons
├── index.html              # HTML template
├── vercel.json             # Vercel rewrite configuration for SPA routes
├── package.json
└── README.md
```

---

## ⚡ Getting Started Locally

### 1. Prerequisites
* **Node.js** (v18 or higher)
* **MongoDB** connection string (Local or MongoDB Atlas)
* **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/app/apikey))
* **Google OAuth Client ID** (from [Google Cloud Console](https://console.cloud.google.com/))

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_custom_jwt_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate back to the root directory:
   ```bash
   cd ..
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

---

## 🌐 Environment Variables for Production

### **Vercel (Frontend)**
* `VITE_API_URL` — `https://your-backend-service.onrender.com/api`
* `VITE_GOOGLE_CLIENT_ID` — `your_google_client_id.apps.googleusercontent.com`

### **Render (Backend)**
* `PORT` — `5000`
* `MONGO_URI` — `mongodb+srv://...`
* `JWT_SECRET` — `your_custom_jwt_secret_key`
* `GEMINI_API_KEY` — `your_gemini_api_key`
* `GOOGLE_CLIENT_ID` — `your_google_client_id.apps.googleusercontent.com`

---

## 📜 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

Copyright (c) 2026 Vijay Yarlagadda
