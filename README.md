# 📘 Smart Bookmark App

A secure, real-time bookmark manager built using **Next.js (App
Router)** and **Supabase**.

Users can sign in with Google, manage private bookmarks, and see updates
instantly across multiple tabs --- fully deployed on Vercel.

------------------------------------------------------------------------

## 🚀 Live Demo

🌐 **Live App:** 
https://smart-bookmark-app-wheat-iota.vercel.app/ \
📂 **GitHub Repository:**
https://github.com/Anudeep2244/smart-bookmark-app

------------------------------------------------------------------------

## 🛠️ Tech Stack

-   **Frontend:** Next.js 14 (App Router)
-   **Styling:** Tailwind CSS
-   **Authentication:** Supabase Auth (Google OAuth)
-   **Database:** Supabase PostgreSQL
-   **Realtime:** Supabase Realtime (WebSockets)
-   **Deployment:** Vercel

------------------------------------------------------------------------

## ✨ Features

-   🔐 Google OAuth login (No email/password)
-   ➕ Add bookmarks (Title + URL)
-   👤 Bookmarks are private per user
-   🔄 Real-time updates across browser tabs
-   ❌ Delete bookmarks
-   🌐 Fully deployed on Vercel

------------------------------------------------------------------------

## 🧠 Architecture Overview

    User
      ↓
    Next.js Frontend (App Router)
      ↓
    Supabase Client SDK
      ↓
    Supabase Services:
       - Auth (Google OAuth)
       - PostgreSQL Database
       - Realtime WebSocket
      ↓
    Row Level Security (RLS)

------------------------------------------------------------------------

## 🔐 Security Model (Row Level Security - RLS)

Row Level Security ensures:

``` sql
auth.uid() = user_id
```

This guarantees:

-   User A cannot see User B's bookmarks
-   Users cannot delete or insert bookmarks for others
-   Security is enforced at the database level

Even if the frontend is modified, the database still blocks unauthorized
access.

------------------------------------------------------------------------

## 🗄️ Database Schema

### `bookmarks` Table

  Column       Type          Description
  ------------ ------------- ---------------------------
  id           uuid          Primary key
  title        text          Bookmark title
  url          text          Bookmark link
  user_id      uuid          Foreign key to auth.users
  created_at   timestamptz   Auto timestamp

------------------------------------------------------------------------

## 🔄 Realtime Implementation

Supabase Realtime listens to:

-   INSERT
-   DELETE
-   UPDATE

Whenever the database changes:

1.  WebSocket event is triggered
2.  Frontend refetches bookmarks
3.  UI updates instantly

This enables real-time synchronization across multiple tabs.

------------------------------------------------------------------------

# 🚧 Problems Faced & How I Solved Them

## 1️⃣ OAuth Redirect Mismatch Error

**Problem:**\
Google login failed after deployment due to incorrect redirect URL.

**Solution:**\
- Added production URL in Supabase → Authentication → Site URL\
- Verified Supabase callback URL in Google Cloud Console

------------------------------------------------------------------------

## 2️⃣ Row Level Security Blocking Insert

**Problem:**\
Insert operation failed with an RLS error.

**Cause:**\
`user_id` was not being attached during insert.

**Solution:**\
Explicitly attached authenticated user ID:

``` ts
user_id: user.id
```

Now the RLS condition `auth.uid() = user_id` passes successfully.

------------------------------------------------------------------------

## 3️⃣ Realtime Not Triggering

**Problem:**\
Bookmarks did not update across tabs.

**Cause:**\
Realtime replication was not enabled for the table.

**Solution:**\
Enabled replication in:

Supabase → Database → Replication → bookmarks table

---------------------------------------------------------------------

## 4️⃣ Deployment Environment Variables

**Problem:**\
Build failed due to missing Supabase keys.

**Solution:**\
Added environment variables in:

Vercel → Project Settings → Environment Variables

------------------------------------------------------------------------

# 📈 What I Learned

-   Importance of database-level security (RLS)
-   How OAuth works with third-party providers
-   CI/CD workflow using Vercel + GitHub
-   Real-time architecture using WebSockets
-   Debugging production deployment issues

------------------------------------------------------------------------

# 💡 Future Improvements

-   Add bookmark editing
-   Add URL metadata preview (favicon + title auto-fetch)
-   Implement optimistic UI updates
-   Add search & filtering
-   Add unit testing (Jest + React Testing Library)
-   Add AI-based bookmark categorization using embeddings

------------------------------------------------------------------------

# 🧑‍💻 How to Run Locally

Clone repository:

git clone https://github.com/Anudeep2244/smart-bookmark-app.git\
cd smart-bookmark-app

Install dependencies:

npm install

Create `.env.local` file:

NEXT_PUBLIC_SUPABASE_URL=your_project_url\
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

Run development server:

npm run dev

------------------------------------------------------------------------

# 🎯 Project Status

✅ Fully functional\
✅ Secure\
✅ Real-time enabled\
✅ Production deployed\
✅ Interview-ready

------------------------------------------------------------------------

Built with ❤️ as part of a Fullstack / GenAI role assessment.
