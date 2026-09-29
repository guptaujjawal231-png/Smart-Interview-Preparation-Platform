# 🎓 Master Campus Placement & Technical Interview Guide
## Project: AI Interview Prep — Smart Placement Preparation Platform

> Designed specifically for **Final-Year Engineering Students (B.Tech / BE)** presenting to campus placement interviewers for **Software Developer (SDE)**, **Data Analyst**, and **ECE / Core Electronics** roles.

---

## 📑 Table of Contents
1. [Placement Resume Bullet Points (Ready to Copy-Paste)](#1-placement-resume-bullet-points)
2. [Spoken Interview Presentation Scripts](#2-spoken-interview-presentation-scripts)
   - [30-Second Quick Pitch](#30-second-quick-pitch)
   - [60-Second Standard Introduction](#60-second-standard-introduction)
   - [3-Minute Architecture & Deep-Dive Script](#3-minute-technical-architecture-walkthrough)
3. [30 Technical Interview Questions & Answers on this Project](#3-30-technical-interview-questions--answers)
   - [Category 1: System Architecture & Design (Q1 - Q5)](#category-1-system-architecture--design)
   - [Category 2: Frontend Engineering & React (Q6 - Q10)](#category-2-frontend-engineering--react)
   - [Category 3: Backend Engineering & Node.js (Q11 - Q15)](#category-3-backend-engineering--nodejs)
   - [Category 4: Database & Mongoose (Q16 - Q20)](#category-4-database--mongoose)
   - [Category 5: AI Prompt Engineering & Resilience (Q21 - Q25)](#category-5-ai-prompt-engineering--resilience)
   - [Category 6: Security, Auth & Deployment (Q26 - Q30)](#category-6-security-auth--deployment)
4. [Tricky Edge Cases Interviewers Will Test You On](#4-tricky-edge-cases-interviewers-will-test-you-on)

---

## 1. Placement Resume Bullet Points

Choose the set that aligns best with the job role you are interviewing for:

### Option A: For Software Developer (SDE / Full-Stack) Profile
- **AI Interview Prep — Smart Full-Stack Placement Platform** `(React, Node.js, Express, MongoDB, Google Gemini, Tailwind CSS)`
  - Architected a decoupled three-tier placement preparation platform supporting 3 specialized career tracks (SDE, Data Analyst, ECE Core) with authenticated student sessions and real-time analytics.
  - Engineered an interactive mock interview simulator featuring live countdown timers, background answer autosaving, and an intelligent **Dual-Engine AI Evaluator** (Google Gemini 1.5 Flash with offline rule-based fallback).
  - Implemented an in-memory ATS Resume Analyzer utilizing `multer` memory storage and `pdf-parse`, extracting technical skill taxonomy across 60+ frameworks and matching against job descriptions without disk I/O.
  - Hardened backend security with Helmet HTTP headers, multi-tier IP rate limiting (`express-rate-limit`), recursive in-place NoSQL injection sanitizers, and dual-layer auth (HTTP-only cookies + Bearer token fallback).
  - Visualized candidate performance metrics using Recharts, computing dynamic topic proficiency and identifying weak areas.

### Option B: For Data Analyst / Business Analyst Profile
- **AI Interview Prep & Analytics Platform** `(Python/Node.js, MongoDB Aggregations, Recharts, React)`
  - Developed a data-driven interview readiness web application aggregating performance metrics across SQL, Statistics, and Data Warehousing technical rounds.
  - Built custom MongoDB aggregation pipelines calculating candidate average rubric scores, question attempt ratios, and real-time proficiency distributions.
  - Implemented an ATS Resume Keyword Matcher that normalizes text and calculates skill-match percentages and missing qualification gaps across job descriptions.
  - Designed interactive analytics dashboard visualizations using Recharts to highlight low-performing technical topics and guide targeted revision.

### Option C: For ECE / Embedded Systems / Core Electronics Profile
- **AI Placement Engine for Core Electronics & Embedded Systems** `(Full-Stack MERN, AI Evaluation)`
  - Engineered a specialized technical evaluation platform addressing the lack of core hardware interview tools (Digital Electronics, Embedded C, Microcontrollers 8051/ARM, Setup/Hold time, and VLSI).
  - Created a domain-specific evaluation engine that analyzes student explanations for essential embedded concepts (ISR, volatile keywords, memory mapping, interrupt latency).
  - Deployed full-stack architecture with REST APIs, secure authentication, and cloud database persistence on MongoDB Atlas.

---

## 2. Spoken Interview Presentation Scripts

### 30-Second Quick Pitch
*(Use when asked: "Briefly tell me about your projects" during round 1)*

> *"Sir/Ma'am, during placement preparation, I noticed that most interview platforms only offer generic DSA questions and lack support for Core Electronics (ECE) or Data Analyst roles. Additionally, candidates rarely get instant feedback on their written explanations. To solve this, I built **AI Interview Prep** — a full-stack platform with dedicated tracks for SDE, Data Analysts, and ECE Core. It features a timed mock interview simulator, an automated AI evaluation engine providing rubric scores and missing concept pills, an ATS Resume Matcher, and real-time performance analytics. It is fully responsive, secure, and deployed live on Vercel and Render."*

---

### 60-Second Standard Introduction
*(Use when asked: "Walk me through the best project on your resume")*

> *"The standout project on my resume is **AI Interview Prep**, an intelligent full-stack web application designed to prepare engineering students for campus technical rounds.
> 
> The core problem it solves is the feedback gap: when students practice writing technical explanations — like explaining Virtual Memory in OS or Setup/Hold time in ECE — they don't know whether their answer is technically complete.
> 
> I built the frontend using React, Vite, and Tailwind CSS with Recharts for visual progress analytics. The backend is an Express and Node.js REST API connected to MongoDB.
> 
> The platform has three key technical highlights:
> 1. **Dual-Engine AI Evaluator:** It leverages Google Gemini 1.5 Flash to score answers out of 10, calculate technical correctness %, and list missing concepts. If offline or if rate limits are reached, an intelligent rule-based mock engine takes over seamlessly so the user experience never breaks.
> 2. **In-Memory Resume Parser:** Candidates upload their PDF resume, which is parsed directly in RAM using `pdf-parse` without saving files to disk, matching skills against job descriptions.
> 3. **Defensive Engineering:** The API is hardened with Helmet security headers, rate limiting, and in-place NoSQL injection sanitizers.
> 
> I also have it deployed live with clean Git version control."*

---

### 3-Minute Technical Architecture Walkthrough
*(Use when interviewing with a Senior Architect or Tech Lead who asks: "Explain the architecture and technical challenges you faced")*

> *"I structured **AI Interview Prep** using a **Decoupled Three-Tier Architecture**:
> 
> 1. **Presentation Tier (React + Vite SPA):**
>    - The client uses modular functional components, React Router v6 for client-side routing, and an `AuthContext` managing authentication state.
>    - To make the UI resilient, the entire router is wrapped inside a custom React `ErrorBoundary` component that intercepts any runtime render errors and displays an intuitive recovery UI with a 1-click reload instead of a blank white screen.
>    - All API interactions go through a centralized Axios instance configured with dynamic environment variables (`VITE_API_URL`) and request interceptors.
> 
> 2. **Application Tier (Node.js & Express 5):**
>    - The server acts as a secured gateway. It implements a layered Controller-Service-Model design.
>    - Security was architected from day one: we use `helmet` for HTTP defense headers (`X-Frame-Options: SAMEORIGIN` and `X-Content-Type-Options: nosniff`), strict CORS whitelisting, and multi-tier rate limiting using `express-rate-limit` (200 requests/15min for general API, 15 attempts for auth endpoints to block brute-forcing, and 20 for AI evaluations).
>    - For authentication, we use a **Dual-Layer Strategy**: we issue signed JWTs both in HTTP-only cookies and in JSON response payloads. In modern browsers where third-party cross-domain cookies are blocked (such as between Vercel and Render), our Axios interceptor attaches the token as `Authorization: Bearer <token>` in headers, ensuring 100% authorization reliability.
> 
> 3. **Data Tier (MongoDB & Mongoose):**
>    - We model Users, Questions, InterviewSessions, and ResumeAnalyses with strict Mongoose schemas.
>    - The Question model includes compound text indexes across `questionText`, `topic`, and `keyConcepts` for high-speed keyword searching.
>    - To protect against NoSQL injection (where attackers inject operators like `{"$gt": ""}`), I engineered an in-place recursive sanitizer that deletes operator keys without triggering read-only getter issues, coupled with explicit runtime type checking in controllers.
> 
> 4. **Key Technical Challenge Solved (Resilient AI & In-Memory Uploads):**
>    - A critical design decision was making the AI evaluation pipeline zero-failure. If an external LLM API has a network outage or exhausted quota, the backend falls back to an offline rule-based concept coverage engine that calculates mathematical coverage against the question's expected key concepts.
>    - For resume uploads, instead of writing uploaded PDFs to local disk (which introduces disk storage leaks and security vulnerabilities), we utilized Multer's memory storage to buffer the PDF in RAM, pass it to `pdf-parse`, compare it against our 60+ skill taxonomy, and garbage-collect the buffer immediately."*

---

## 3. 30 Technical Interview Questions & Answers

### Category 1: System Architecture & Design

#### Q1: What is a Decoupled Three-Tier Architecture, and why did you choose it over server-side rendering (like EJS/Pug)?
- **Answer:** A decoupled three-tier architecture separates the application into:
  1. Presentation Layer (React SPA on Vite)
  2. Logic/Application Layer (Node.js Express REST API)
  3. Data Layer (MongoDB database)
- **Why we chose it:** It provides clear **Separation of Concerns**. The React frontend only handles UI rendering and user experience, while the Express API handles business logic, security, and AI communication. This allows us to scale, deploy, and update the frontend (on Vercel edge CDN) and backend (on Render) independently. If we decide to build a mobile app in the future, the exact same REST API can be reused without changing a single line of backend code.

#### Q2: Why did you route AI requests through your backend instead of calling the Gemini API directly from the React frontend?
- **Answer:** Calling an AI model directly from the client is a critical security vulnerability:
  1. **API Key Exposure:** Any API key included in frontend client JavaScript can be extracted by inspecting network requests or browser sources.
  2. **Cost & Quota Abuse:** Malicious users could hijack the key and rack up bills or exhaust quotas.
  3. **Data Validation:** By routing requests through our Express backend, we enforce student authentication (`protect` middleware), rate limiting (20 evaluations / 15 mins), input sanitization, and fallback to the offline evaluator if the external service fails.

#### Q3: What is the purpose of an Error Boundary in React?
- **Answer:** In standard React, an unhandled JavaScript error during rendering unmounts the entire component tree, causing the infamous "White Screen of Death". An `ErrorBoundary` is a class component that implements `static getDerivedStateFromError()` and `componentDidCatch()`. It catches render errors anywhere in its child component tree, logs the error, and renders a fallback recovery UI with a reload button, keeping the rest of the application stable.

#### Q4: How does your application support cross-domain deployments between Vercel and Render?
- **Answer:** The frontend is hosted on `*.vercel.app` and the backend on `*.onrender.com`. Because they reside on different domains:
  1. **CORS:** The Express server configures `cors({ origin: process.env.CLIENT_URL, credentials: true })`.
  2. **Dual Auth:** Standard cookies are often blocked by browsers under third-party tracking prevention. We solve this by having the client store the token in `localStorage` and transmit it via `Authorization: Bearer <token>` in the Axios request interceptor, alongside the cookie.

#### Q5: What is Single-Page Application (SPA) routing, and why was `vercel.json` necessary?
- **Answer:** In an SPA, HTML is only served once (`index.html`). React Router handles URL changes on the client using the browser's History API. When a user directly visits or refreshes a URL like `/interview` on Vercel, Vercel's static file server looks for a physical file named `interview.html` on the server and returns a 404 error. The `client/vercel.json` file adds a rewrite rule: `"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]`, instructing Vercel to route all paths to `index.html` so React Router can render the correct component.

---

### Category 2: Frontend Engineering & React

#### Q6: How do React Context and Hooks manage authentication state in your app?
- **Answer:** We implemented `AuthContext` using `createContext()`. An `AuthProvider` component maintains `user`, `loading`, and `error` state. On initial load, a `useEffect` hook invokes `authService.getMe()`. If a valid token exists, the user's profile is hydrated into state. We exposed a custom hook `useAuth()` that wraps `useContext(AuthContext)`, giving components like `Navbar`, `DashboardPage`, and `ProtectedRoute` instant access to the logged-in user without prop drilling.

#### Q7: How does your `ProtectedRoute` component prevent unauthorized access?
- **Answer:** `ProtectedRoute.jsx` checks the state from `useAuth()`.
  1. While `loading` is true (verifying token), it renders a centered `LoadingSpinner`.
  2. If `user` is null (not authenticated), it renders `<Navigate to="/login" replace state={{ from: location }} />`, safely redirecting the visitor to the login page while remembering their intended destination.
  3. If `user` is authenticated, it renders `children`.

#### Q8: How did you implement the countdown timer in `MockInterviewPage.jsx`?
- **Answer:** We use a `useState` variable `timeRemainingSeconds` initialized to `timerMinutes * 60`. A `useEffect` hook sets up a `setInterval` that decrements the timer by 1 every second. To prevent memory leaks, the `useEffect` returns a cleanup function `clearInterval(interval)`. When the timer hits 0, it automatically triggers `finishSession()` to auto-submit the student's exam.

#### Q9: Why did you choose Recharts for the Analytics dashboard?
- **Answer:** Recharts is built specifically for React, using declarative SVG components (`<ResponsiveContainer>`, `<BarChart>`, `<XAxis>`, `<Tooltip>`). It renders smoothly, scales responsively across mobile and desktop viewports, and binds directly to React state arrays without requiring manual DOM manipulation or bulky D3 canvas setups.

#### Q10: How does your UI handle autosaving answers without interrupting typing?
- **Answer:** As the student types their answer in the textarea, local component state updates instantly for zero typing lag. When the student clicks "Next Question" or "Previous Question", or when navigating between questions, `saveAnswer()` is fired in the background via Axios, updating the specific `questionIndex` in MongoDB without reloading the page.

---

### Category 3: Backend Engineering & Node.js

#### Q11: Explain the difference between CommonJS and ES Modules in Node.js, and why did you use ES Modules (`"type": "module"`)?
- **Answer:**
  - **CommonJS:** Uses `require()` and `module.exports`. Loading is synchronous.
  - **ES Modules:** Standard ECMAScript specification using `import` and `export`. Loading is asynchronous and supports static analysis and tree-shaking.
  - We used `"type": "module"` in `package.json` because modern JavaScript and Vite frontend code use ES Modules, ensuring consistency across both sides of the full-stack codebase.

#### Q12: How did you handle CommonJS packages like `pdf-parse` in an ES Module project?
- **Answer:** In Node.js ES Modules, `require` is not defined globally. We created a local require function using Node's built-in `module` package:
  ```javascript
  import { createRequire } from 'module';
  const require = createRequire(import.meta.url);
  const pdfModule = require('pdf-parse');
  ```
  Additionally, `pdf-parse` v2 exports a class `{ PDFParse }`. We handled this dynamically by instantiating `new pdfModule.PDFParse({ data: pdfBuffer })` and awaiting `parser.getText()`, followed by `parser.destroy()` to prevent memory leaks.

#### Q13: What is Express middleware, and what sequence do your middlewares run in?
- **Answer:** Middleware functions have access to `req`, `res`, and `next()`. They execute sequentially in the order defined by `app.use()`:
  1. `helmet()` — Injects HTTP security headers.
  2. `cors()` — Validates origin header against whitelist.
  3. `express.json({ limit: '5mb' })` & `cookieParser()` — Parses JSON bodies and cookies.
  4. `sanitizeNoSql` — Cleans `$` operators from body, query, and params.
  5. `apiLimiter` — Rate limits requests.
  6. **Route Handlers** — `/api/auth`, `/api/questions`, `/api/interviews`, etc.
  7. `notFound` — Catches unmapped routes and returns 404 JSON.
  8. `errorHandler` — Global centralized error catcher.

#### Q14: How does centralized error handling work in Express?
- **Answer:** Instead of scattering `res.status(500).json(...)` throughout every controller, controllers catch errors with `try/catch` and pass them to `next(error)`. Express recognizes functions with four parameters `(err, req, res, next)` as error handling middleware. Our `errorMiddleware.js` intercepts all errors, sets appropriate status codes (defaulting to 500 if status is 200), logs the error, and formats a consistent JSON response: `{ success: false, message: err.message, stack: ... }` (stack trace hidden in production).

#### Q15: How does in-memory file upload with Multer work, and why is it superior to disk storage for resumes?
- **Answer:** We configured `multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })`.
  - When a student uploads a resume, Multer holds the file buffer in `req.file.buffer` in RAM.
  - **Why it's superior:**
    1. Disk storage leaves orphaned PDF files on the server that accumulate and exhaust storage over time.
    2. Saving resumes to disk creates potential privacy/security compliance issues.
    3. Memory storage processes the PDF immediately and frees the buffer to Node's Garbage Collector as soon as the request ends.

---

### Category 4: Database & Mongoose

#### Q16: How did you design the schema for `InterviewSession` to capture individual question answers and evaluations?
- **Answer:** We used **Mongoose Subdocument Schemas**:
  - `answerEvaluationSchema` contains `score`, `technicalCorrectness`, `clarity`, `feedback`, `missingConcepts`, `strengths`, and `modelAnswer`.
  - `sessionQuestionSchema` stores references to the `Question` model, along with snapshots of `questionText`, `topic`, `hints`, `userAnswer`, `isAnswered`, and the embedded `evaluation` subdocument.
  - `interviewSessionSchema` contains an array `questions: [sessionQuestionSchema]`, alongside `user`, `role`, `status`, `timerMinutes`, and `overallScore`.
  - This embedded approach guarantees that each interview session is a self-contained snapshot that remains historically accurate even if the original question in the bank is updated or edited later.

#### Q17: What are Mongoose Compound Indexes and how do they benefit the Question Bank?
- **Answer:** In `Question.js`, we defined:
  ```javascript
  questionSchema.index({ role: 1, difficulty: 1, topic: 1 });
  questionSchema.index({ questionText: 'text', topic: 'text', keyConcepts: 'text' });
  ```
  - Without indexes, MongoDB performs a full collection scan ($O(N)$), inspecting every document.
  - Compound indexes create an ordered B-Tree index across `role`, `difficulty`, and `topic`, allowing MongoDB to filter queries like `role = "Software Developer" AND difficulty = "Intermediate"` in $O(\log N)$ time.
  - Text indexes enable rapid full-text keyword searches across questions.

#### Q18: What is password salting and hashing, and how is it implemented in your User model?
- **Answer:**
  - **Hashing:** A one-way cryptographic transformation (SHA/bcrypt) that turns a password into a fixed-length string that cannot be decrypted.
  - **Salting:** Appending a unique random string (salt) to the password before hashing so identical passwords produce completely different hashes, defeating Rainbow Table attacks.
  - In `User.js`, we used a Mongoose pre-save hook:
    ```javascript
    userSchema.pre('save', async function () {
      if (!this.isModified('password')) return;
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    });
    ```

#### Q19: Why does `User.js` use `select: false` on the password field?
- **Answer:** In `User.js`, the `password` field is defined with `{ select: false }`. Whenever queries like `User.find()` or `User.findById()` are executed, Mongoose automatically omits the password hash from the returned document. This prevents accidental leakage of password hashes in API responses or logs. When password verification is required during login, we explicitly opt-in using `.select('+password')`.

#### Q20: How does your dashboard calculate aggregated metrics without performance bottlenecks?
- **Answer:** In `dashboardController.js`, `getDashboardStats` queries only the completed sessions for the logged-in student (`{ user: req.user._id, status: 'completed' }`). It iterates over the sessions to compute total questions answered, calculates average scores, and constructs a topic-level score map (`topicScoresMap`). It then maps this into a format tailored for Recharts while identifying topics where average score is below 6.5 as "Weak Areas".

---

### Category 5: AI Prompt Engineering & Resilience

#### Q21: How does your application evaluate technical answers?
- **Answer:** It uses a structured prompt engineered for campus placement evaluation. The prompt injects:
  - Role (`Software Developer`, `Data Analyst`, or `ECE`)
  - Topic (e.g. `Embedded C`)
  - Question text
  - Expected key concepts list
  - Reference model answer
  - Student's submitted text
- It instructs the LLM to act as a senior technical interviewer and return strict JSON conforming to our rubric schema: `score` (0-10), `technicalCorrectness` (0-100%), `clarity`, `missingConcepts`, `strengths`, and `feedback`.

#### Q22: What is your Dual-Engine AI Fallback strategy?
- **Answer:** External LLM APIs can fail due to network outages, invalid API keys, rate limits, or exhausted quotas. In our system:
  1. If `GEMINI_API_KEY` is `'mock'`, missing, or invalid, it immediately invokes `mockAiService.js`.
  2. If an active API call to Gemini fails or times out (10s AbortController timeout), a `catch` block intercepts the error and seamlessly routes the payload to `mockAiService.js`.
  3. The mock evaluator compares the user's answer against the question's `keyConcepts`, evaluates technical keyword density, assesses answer word count, and computes objective scores. The student receives their scorecard without ever seeing a broken screen.

#### Q23: How do you prevent JSON parsing errors from LLM responses?
- **Answer:** LLMs sometimes wrap JSON in markdown code blocks (` ```json ... ``` `). In our Gemini call:
  1. We configure `generationConfig: { responseMimeType: "application/json", temperature: 0.2 }` to enforce valid JSON output from the model.
  2. We defensively clean and parse the response with `JSON.parse(rawText.trim())`.
  3. We validate each returned property with fallbacks (e.g. `typeof parsed.score === 'number' ? parsed.score : 7.0`) so missing keys never cause unhandled exceptions.

#### Q24: How does the ATS Resume Analyzer algorithm work?
- **Answer:** In `pdfParserService.js`:
  1. Extracts raw text from the PDF buffer.
  2. Normalizes both the resume text and the pasted Job Description to lowercase.
  3. Matches skills against our curated 60+ technical skill taxonomy covering SDE (React, Node, DSA, SQL), Data (Pandas, BigQuery, Statistics), and ECE (Embedded C, 8051, ARM Cortex, Verilog, I2C, SPI).
  4. Identifies `matchedSkills` and `missingSkills` gaps.
  5. Computes `matchScore = Math.round((matchedSkills.length / jdSkills.length) * 100)`.
  6. Generates placement advice (keyword inclusion, quantifying impact with metrics).

#### Q25: Why is `temperature: 0.2` used for AI evaluations?
- **Answer:** Temperature controls the randomness of LLM text generation. A high temperature (0.8 - 1.0) is suitable for creative writing. For evaluating technical interview answers, we require **deterministic, objective, and consistent rubric scoring**. Setting `temperature: 0.2` ensures the model focuses on technical correctness and adheres strictly to the required JSON schema.

---

### Category 6: Security, Auth & Deployment

#### Q26: What is NoSQL Injection, and how does your application prevent it?
- **Answer:**
  - **The Attack:** In MongoDB, if client input is passed directly to queries like `User.findOne({ email: req.body.email })`, an attacker can send JSON like `{"email": {"$gt": ""}}`. Since every email is lexicographically greater than empty string, the query evaluates to true and bypasses authentication.
  - **Our Defense:**
    1. **In-Place Sanitizer:** `securityMiddleware.js` contains `sanitizeNoSql` which recursively inspects request `body`, `query`, and `params`, deleting any key starting with `$` or containing `.`.
    2. **Strict Type Validation:** In `authController.js`, we explicitly verify `typeof email === 'string' && typeof password === 'string'`. If an attacker passes an object, it is rejected immediately with a `400 Bad Request`.

#### Q27: What is Rate Limiting, and why did you use different limits for different routes?
- **Answer:** Rate limiting restricts the number of requests an IP address can make within a specified window, preventing Denial of Service (DoS) and brute-force attacks:
  - **Global API (`/api`):** 200 requests / 15 minutes (protects server resources).
  - **Auth Routes (`/api/auth/login`, `/register`):** 15 attempts / 15 minutes (prevents credential-stuffing and password brute-forcing).
  - **AI Evaluation (`/api/interviews/:id/evaluate`):** 20 requests / 15 minutes (safeguards LLM API quotas and prevents spam).

#### Q28: What security protections does Helmet provide?
- **Answer:** Helmet sets critical HTTP security headers automatically:
  - `X-Content-Type-Options: nosniff` — Prevents browsers from MIME-sniffing a response away from the declared content-type.
  - `X-Frame-Options: SAMEORIGIN` — Prevents Clickjacking by disallowing malicious sites from embedding our application in an `<iframe>`.
  - `Cross-Origin-Resource-Policy: cross-origin` — Restricts cross-origin resource reads while allowing legitimate asset sharing.

#### Q29: What is the difference between storing JWT in `localStorage` vs. `HTTP-only` cookies?
- **Answer:**
  - **`localStorage`:** Vulnerable to Cross-Site Scripting (XSS). If malicious JavaScript runs on the page, it can read `localStorage.getItem('token')`.
  - **`HTTP-only` Cookie:** Cannot be accessed by JavaScript (`document.cookie`), mitigating XSS token theft.
  - **Our Production Architecture:** We use `httpOnly: true`, `secure: true`, and `sameSite: 'none'` cookies as the primary mechanism, but also allow the client to send `Authorization: Bearer <token>` as a fallback for cross-domain hosting where browsers block third-party cookies.

#### Q30: How do you manage secrets between development and production?
- **Answer:**
  - In local development, secrets reside in `server/.env` (which is excluded from Git via `.gitignore`).
  - A template `server/.env.example` is committed to Git with dummy placeholder values.
  - In production, secrets are injected as encrypted environment variables directly in the hosting dashboard (Render / Vercel), ensuring zero hardcoded credentials exist in source control.

---

## 4. Tricky Edge Cases Interviewers Will Test You On

| Edge Case | Interviewer's Question | How You Solved It |
| :--- | :--- | :--- |
| **Interrupted Interview** | *"What happens if the student accidentally refreshes or closes their browser tab mid-interview?"* | The session state is persisted in MongoDB (`in_progress`). When returning, `getSessionById` rehydrates the answered questions, current question index, and remaining timer. |
| **Random Question Duplication** | *"How do you ensure random questions selected for a mock interview are not duplicated?"* | In `interviewController.js`, questions are sampled using unique `_id` tracking via a Set or randomized slice without replacement. |
| **AI LLM Outage** | *"What if Google Gemini servers go down during a student's mock interview?"* | The 10-second `AbortController` triggers a timeout catch block that seamlessly switches to `mockAiService.js`. The student gets a full rubric breakdown without any UI crash. |
| **Memory Leak in Timers** | *"How do you prevent memory leaks with `setInterval` in React?"* | In `useEffect`, the timer interval returns a cleanup arrow function `() => clearInterval(timer)` that runs on component unmount. |
| **PDF Extraction Failures** | *"What if an uploaded PDF is password-protected or scanned as an image?"* | `extractPdfText` catches errors and verifies that extracted text length is $\ge 20$ characters. If unreadable, it returns a clean `400 Bad Request` explaining that scanned PDFs without selectable text cannot be processed. |

---

## 🏆 Final Words for Placement Candidates
When you sit in your placement interview:
1. **Be confident:** You built a real, working, full-stack application with genuine database persistence, AI orchestration, and defensive security.
2. **Offer the live demo:** Encourage the interviewer to open the deployed URL on their phone or laptop.
3. **Emphasize problem solving:** Explain *why* you built this (solving the placement preparation gap for ECE and Data students) and *how* you engineered resilience (offline AI fallback and in-memory uploads).
