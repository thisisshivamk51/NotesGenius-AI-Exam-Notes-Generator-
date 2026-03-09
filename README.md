# ExamNotesAI 🧠

> One-click AI exam notes with diagrams, charts, and revision mode.

A production-ready MERN stack SaaS platform that generates structured, exam-oriented notes from any text or PDF using Gemini AI.

---

## Tech Stack

- **Backend**: Node.js + Express.js + MongoDB (Mongoose)
- **Frontend**: React.js (CRA) + React Router v6
- **AI**: Google Gemini 1.5 Flash
- **Payments**: Stripe (one-time credit packs)
- **Auth**: JWT (JSON Web Tokens)
- **Charts**: Recharts
- **Deployment**: Render (backend) + Render Static (frontend)

---

## Features

- ✅ JWT Authentication (register, login, protected routes)
- ✅ Credit-based usage system (50 free on signup)
- ✅ AI Exam Notes Generation (text + PDF upload)
- ✅ Auto Diagrams & Charts from content
- ✅ Revision Mode (ultra-short bullet notes)
- ✅ Important Questions (MCQ + Short + Long answer)
- ✅ Stripe payment integration (credit packs)
- ✅ Export notes as PDF
- ✅ Responsive UI with sidebar layout

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd examnotesai
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env
# Fill in your environment variables in .env
npm install
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:5000/api/v1
npm install
npm start
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `GEMINI_API_KEY` | Google Gemini API key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `CLIENT_URL` | Frontend URL (for CORS + Stripe redirect) |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | Backend API base URL |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

---

## API Endpoints

### Auth
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user

### Notes
- `GET /api/v1/notes` - List all notes (with filters)
- `GET /api/v1/notes/:id` - Get note by ID
- `POST /api/v1/notes/generate` - Generate new notes (10 credits)
- `POST /api/v1/notes/:id/revision` - Generate revision mode (5 credits)
- `POST /api/v1/notes/:id/questions` - Generate questions (5 credits)
- `PUT /api/v1/notes/:id` - Update note metadata
- `DELETE /api/v1/notes/:id` - Delete note

### Payments
- `GET /api/v1/payments/credit-packs` - Get available credit packs
- `POST /api/v1/payments/create-checkout-session` - Create Stripe checkout
- `GET /api/v1/payments/history` - Payment history
- `POST /api/v1/payments/webhook` - Stripe webhook

### Users
- `GET /api/v1/users/profile` - Get profile
- `PUT /api/v1/users/profile` - Update profile
- `PUT /api/v1/users/change-password` - Change password
- `DELETE /api/v1/users/account` - Delete account

---

## Credit Costs

| Action | Credits |
|---|---|
| Generate Exam Notes | 10 |
| Generate Diagrams | 5 |
| Revision Mode | 5 |
| Important Questions | 5 |

## Credit Packs

| Pack | Price |
|---|---|
| 100 credits | $1 |
| 500 credits | $4 |
| 1000 credits | $7 |

---

## Deployment (Render)

### Backend
1. Create a new **Web Service** on Render
2. Set build command: `npm install`
3. Set start command: `node server.js`
4. Add all environment variables

### Frontend
1. Create a new **Static Site** on Render
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Set `REACT_APP_API_URL` to your backend URL

---

## Project Structure

```
examnotesai/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/       # Auth, credits, rate-limit
│   ├── services/        # Gemini, Stripe, PDF services
│   ├── config/          # DB connection, constants
│   └── server.js
│
└── frontend/
    └── src/
        ├── pages/       # Page components
        ├── components/  # Reusable UI
        ├── store/       # Context (Auth, Notes)
        ├── services/    # API client (axios)
        └── App.js
```

---

You can view a demonstration of this project's workflow in the following video.
