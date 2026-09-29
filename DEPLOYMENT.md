# 🚀 Production Deployment & Cloud Configuration Guide

This runbook provides complete, step-by-step instructions to deploy **AI Interview Prep** to industry-standard free cloud tiers:
- **Database:** MongoDB Atlas (Cloud NoSQL Cluster)
- **Backend:** Render (Node.js Web Service)
- **Frontend:** Vercel (Fast Global Edge CDN)

---

## 🏗️ Cloud Architecture Overview

```mermaid
flowchart LR
    User["Student Browser"]
    Vercel["Frontend (Vercel CDN)\nhttps://ai-interview-prep.vercel.app"]
    Render["Backend API (Render)\nhttps://ai-interview-prep-api.onrender.com"]
    Atlas[("Database (MongoDB Atlas)\nShared M0 Free Cluster")]
    Gemini["Google Gemini 1.5 Flash API\n(Or Offline Mock Engine)"]

    User -- "HTTPS / HTML / React SPA" --> Vercel
    User -- "REST API / Bearer Token" --> Render
    Render <--> Atlas
    Render --> Gemini
```

---

## 🗄️ Step 1: MongoDB Atlas Cloud Setup

1. **Create Free Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up for a free account.
2. **Deploy Free Cluster:**
   - Select the **Shared (M0)** free tier.
   - Choose a cloud provider (AWS recommended) and region closest to your users (e.g. `ap-south-1` Mumbai or `us-east-1`).
   - Cluster Name: `Cluster0` (default). Click **Create Deployment**.
3. **Configure Database Credentials:**
   - Under **Database Access**, click **Add New Database User**.
   - Authentication Method: **Password**.
   - Username: `app_admin`
   - Password: Generate a secure password and save it safely.
   - Database User Privileges: **Read and write to any database**.
4. **Configure Network Access (Crucial for Cloud Hosting):**
   - In Atlas left sidebar, go to **Network Access**.
   - Click **Add IP Address**.
   - Choose **Allow Access from Anywhere** (`0.0.0.0/0`).
   - *(Note: Render dynamic instances do not have a fixed IP, so 0.0.0.0/0 allows Render to communicate with Atlas).*
5. **Get Connection String:**
   - Go to **Database** -> Click **Connect** -> Choose **Drivers** (Node.js).
   - Copy your connection string format:
     ```
     mongodb+srv://<username>:<password>@cluster0.xyz.mongodb.net/ai_interview_prep?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your database user credentials.
6. **Seed Questions directly into Cloud Atlas:**
   - In your local terminal, run the seeder against your Atlas connection string:
     ```bash
     cd server
     MONGO_URI="mongodb+srv://app_admin:YOUR_PASSWORD@cluster0.xyz.mongodb.net/ai_interview_prep?retryWrites=true&w=majority" npm run seed
     ```
   - You should see `🎉 Successfully seeded 15 questions into Question Bank!`.

---

## ⚙️ Step 2: Backend Deployment on Render

1. **Sign Up & Link GitHub:**
   - Go to [Render.com](https://render.com/) and sign in with your GitHub account.
2. **Create New Web Service:**
   - Click **New +** -> **Web Service**.
   - Select your `ai-interview-prep` repository.
3. **Configure Build Settings:**
   - **Name:** `ai-interview-prep-backend`
   - **Region:** Closest to your MongoDB Atlas region (e.g. Frankfurt / Singapore / Oregon).
   - **Branch:** `master` (or `main`)
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js`
   - **Instance Type:** `Free`
4. **Configure Environment Variables on Render:**
   Under **Environment Variables**, click **Add Environment Variable** for each:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production security & logging |
   | `PORT` | `10000` | Render sets PORT automatically |
   | `MONGO_URI` | `mongodb+srv://app_admin:YOUR_PASS@cluster0.../ai_interview_prep?retryWrites=true&w=majority` | Atlas connection string |
   | `JWT_SECRET` | `generate_a_random_64_character_string` | Random cryptographic secret |
   | `JWT_EXPIRES_IN` | `7d` | Token validity |
   | `CLIENT_URL` | `https://ai-interview-prep.vercel.app` | Will update after deploying frontend |
   | `GEMINI_API_KEY` | `mock` (or your Gemini API key) | Google AI Studio key |

5. **Deploy:**
   - Click **Create Web Service**.
   - Render will build dependencies and start the listener.
   - Once deployed, note your service URL: `https://ai-interview-prep-backend.onrender.com`.
   - Test health check in browser: `https://ai-interview-prep-backend.onrender.com/api/health`.

> [!NOTE]
> **Render Free Tier Spin-Down Notice:**
> Free tier services on Render spin down after 15 minutes of inactivity. When a new request arrives, it may take 30–50 seconds to wake up (cold start). For portfolio presentations, trigger a request to `/api/health` 1 minute before your interview starts.

---

## 🎨 Step 3: Frontend Deployment on Vercel

1. **Sign Up & Link GitHub:**
   - Go to [Vercel.com](https://vercel.com/) and sign in with GitHub.
2. **Import Project:**
   - Click **Add New...** -> **Project**.
   - Select the `ai-interview-prep` repository.
3. **Configure Project Settings:**
   - **Project Name:** `ai-interview-prep`
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click **Edit** and select `client`.
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Configure Environment Variables on Vercel:**
   Under **Environment Variables**, add:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://ai-interview-prep-backend.onrender.com/api` |
5. **Verify SPA Routing (`vercel.json`):**
   - Our repository already includes [client/vercel.json](file:///C:/Users/ujjaw/.gemini/antigravity/scratch/ai-interview-prep/client/vercel.json) with:
     ```json
     {
       "rewrites": [
         { "source": "/(.*)", "destination": "/index.html" }
       ]
     }
     ```
   - This ensures that refreshing deep paths like `/interview` or `/dashboard` does not return a 404.
6. **Deploy:**
   - Click **Deploy**.
   - In ~45 seconds, your site will be live at `https://ai-interview-prep.vercel.app`.

---

## 🔗 Step 4: Final CORS Sync Between Vercel and Render

1. Copy your final Vercel URL (e.g. `https://ai-interview-prep.vercel.app`).
2. Go back to **Render Dashboard** -> `ai-interview-prep-backend` -> **Environment**.
3. Update `CLIENT_URL` to your exact Vercel URL without trailing slash:
   ```env
   CLIENT_URL=https://ai-interview-prep.vercel.app
   ```
4. Render will automatically redeploy with the updated CORS origin whitelist.

---

## ✅ Step 5: Post-Deployment Smoke Test Checklist

- [ ] **Health Check:** `https://your-backend.onrender.com/api/health` returns `200 OK` and `"database": { "connected": true }`.
- [ ] **Registration:** Register a new user on `https://your-frontend.vercel.app/register`.
- [ ] **Session Persistence:** Refresh the browser on `/dashboard` and verify user stays logged in.
- [ ] **Question Bank:** Visit `/questions` and verify 15 questions render with role filters.
- [ ] **Mock Interview Runner:** Start a session, answer questions, observe timer countdown, and complete.
- [ ] **AI Rubric Scoring:** Verify the AI Scorecard populates with scores and feedback.
- [ ] **Resume Analyzer:** Upload a sample PDF resume and check the ATS percentage match.

---

## 🛡️ Production Troubleshooting FAQ

| Problem | Root Cause | Solution |
| :--- | :--- | :--- |
| **CORS policy error in browser console** | `CLIENT_URL` on Render doesn't match Vercel URL | Verify `CLIENT_URL` on Render matches Vercel URL exactly (no trailing slash). |
| **404 Not Found on browser refresh** | Client SPA routing not handled by CDN | Ensure `client/vercel.json` is present in the deployment. |
| **Database connection timeout on Render** | Atlas IP whitelist does not allow Render | In MongoDB Atlas -> Network Access, ensure `0.0.0.0/0` is active. |
| **Login fails or 401 across domains** | Third-party cookie blocked by browser | Our dual authentication system sends `Authorization: Bearer <token>` automatically, bypassing third-party cookie restrictions. |
