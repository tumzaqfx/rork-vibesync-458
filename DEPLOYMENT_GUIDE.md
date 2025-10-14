# VibeSync Backend Deployment Guide (Vercel)

This guide will walk you through deploying your VibeSync backend to Vercel. The project is already configured for this, making it the most straightforward option.

**This process involves manual steps that you must perform.** I cannot do them for you, but I will guide you.

---

## Prerequisites

1.  **A Git Repository:** Your project code needs to be on GitHub, GitLab, or Bitbucket.
2.  **A Vercel Account:** Sign up for a free account at [vercel.com](https://vercel.com).

---

## Step 1: Set Up Your PostgreSQL Database

Your app needs a production-ready database. The easiest option is to use Vercel's own serverless database.

1.  **Choose a Provider:**
    *   **Recommended:** **Vercel Postgres**. You can add this directly when creating your project in the next step.
    *   **Alternatives:** You can also use a free-tier database from [Neon](https://neon.tech), [Supabase](https://supabase.com), or Railway.
2.  **Get the Connection String:** After creating your database, you will be given a **Connection String** (also called a "connection URI" or "DATABASE_URL"). It will look something like this:
    ```
    postgres://user:password@host:port/database
    ```
3.  **Copy this connection string.** You will need it in Step 3.

---

## Step 2: Deploy the Project on Vercel

1.  Go to your Vercel Dashboard and click **"Add New... > Project"**.
2.  **Import the Git Repository** that contains your project's code.
3.  Vercel will automatically detect the `vercel.json` file. The "Framework Preset" should be automatically set to "Other".

---

## Step 3: Configure Environment Variables

This is the most important step. Before you deploy, you must provide the necessary secrets.

1.  In the "Configure Project" screen, expand the **"Environment Variables"** section.
2.  Add the following two variables:

    *   **Name:** `DATABASE_URL`
        *   **Value:** Paste the **Connection String** you copied in Step 1.

    *   **Name:** `JWT_SECRET`
        *   **Value:** You need a long, random, and secret string for security. You can generate a strong one by running this command in your local terminal: `openssl rand -hex 32`

3.  Ensure these variables are set for all environments (Production, Preview, and Development).

---

## Step 4: Deploy and Set Up the Database Schema

1.  Click the **"Deploy"** button. Vercel will now build and deploy your backend service.
2.  After deployment is complete, Vercel will provide you with a production URL (e.g., `https://your-project-name.vercel.app`).
3.  **CRITICAL:** Your database is currently empty. You must set up the tables using the `schema.sql` file.
    *   Connect to your new PostgreSQL database using a database management tool (like TablePlus, DBeaver, or the `psql` command-line tool).
    *   Open the `backend/db/schema.sql` file from your project.
    *   **Copy the entire content** of this SQL file.
    *   **Run the copied SQL query** in your database tool. This will create all the tables your application needs to function.

---

## Step 5: Verify Your Deployment

1.  Open your browser and navigate to the health check URL of your new deployment. You can find this on your Vercel project page, or just add `/health` to the end of your production URL:
    `https://your-project-name.vercel.app/health`
2.  You should see a JSON response like this:
    ```json
    {
      "status": "ok",
      "database": "connected",
      ...
    }
    ```
If you see this, your backend is successfully deployed and connected to the database!

---

## ✅ NEXT STEPS

Once you have successfully deployed the backend, please let me know.

I will then provide you with the next set of instructions to:
1.  Configure the frontend app to use your new live backend.
2.  Build the production-ready APK file.
