# LeadMan AI 🚀

LeadMan AI is a production-ready full-stack web application designed for intelligent lead management. It features a Next.js frontend and a Django backend, utilizing Google Gemini AI for automatic lead classification and Resend for tracked email communications.

## 🌟 Features
- **Modern Landing Page**: Built with Next.js 15 and Tailwind CSS.
- **AI Lead Classification**: Automatically categorizes and prioritizes leads using Google Gemini AI.
- **Automated Tracking Emails**: Sends personalized emails with invisible 1x1 tracking pixels and tracked links.
- **Admin Dashboard**: Real-time KPI cards, Lead tables, and Chart.js analytics.
- **Secure API**: JWT Authentication with Django REST Framework.

## 🛠 Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Axios, React Hook Form, Zod.
- **Backend**: Django 5, Django REST Framework, Simple JWT, Gunicorn, WhiteNoise.
- **Database**: PostgreSQL (or local SQLite for dev).
- **AI Integration**: Google Gemini API.
- **Email Service**: Resend (SMTP).

## 🚀 Getting Started

### 1. Backend Setup
1. Navigate to the `backend/` directory.
2. Copy `.env.example` to `.env` and fill in your `GEMINI_API_KEY` and `RESEND_API_KEY`.
3. Set up a virtual environment and install dependencies:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
4. Run migrations and create a superuser:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```
5. Start the backend server:
   ```bash
   python manage.py runserver
   ```

### 2. Frontend Setup
1. Navigate to the `frontend/` directory.
2. Copy `.env.example` to `.env`.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## 🌍 Deployment Guide

### Deploying Frontend to Vercel
1. Push your code to GitHub.
2. Import the `frontend` directory as a new project in Vercel.
3. Add the `NEXT_PUBLIC_API_URL` environment variable (e.g., `https://your-backend-url.onrender.com/api`).
4. Deploy!

### Deploying Backend to Render
1. Create a New Web Service on Render, connected to your repository.
2. Set the Root Directory to `backend`.
3. Build Command: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
4. Start Command: `gunicorn config.wsgi:application`
5. Add the necessary Environment Variables from your `.env` (including `DATABASE_URL` which can be provided by a Render PostgreSQL database).
