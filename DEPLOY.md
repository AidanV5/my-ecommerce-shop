# Deployment Guide (Free Hosting on Render)

This guide explains how to deploy your E-commerce app for free using **Render**.
We will deploy it as a "Monolith" (Server serves the Client) to keep it within the free tier limits (1 service).

## Prerequisites
1.  **GitHub Account**: You need to push this code to a GitHub repository.
2.  **Render Account**: Sign up at [render.com](https://render.com).

## Step 1: Push to GitHub
1.  Initialize git in your project folder:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  Create a new repository on GitHub.
3.  Push your code:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
    git push -u origin master
    ```

## Step 2: Configure Render
1.  Go to your Render Dashboard and click **New +** -> **Web Service**.
2.  Connect your GitHub repository.
3.  Configure the settings:
    *   **Name**: `my-ecommerce-shop` (or similar)
    *   **Runtime**: `Node`
    *   **Build Command**: `npm run build`
        *   *This runs the script we added to root package.json: installs deps and builds react.*
    *   **Start Command**: `node server/src/app.js`
    *   **Instance Type**: Free

4.  **Environment Variables**:
    *   Click "Advanced" or "Environment".
    *   Add Key: `NODE_ENV`, Value: `production`
    *   Add Key: `JWT_SECRET`, Value: `(generate a random secure string)`

5.  Click **Create Web Service**.

## Important Notes regarding Database (SQLite)
> [!WARNING]
> **Data Persistence**: Render's free tier has an "ephemeral" file system. This means **every time your app restarts (or you deploy new code), your SQLite database file (`ecommerce.db`) will be reset/deleted.**

For a real production app with persistent data, you should:
1.  Use a hosted Database like **Neon** (Free Postgres) or **Turso** (Free SQLite).
2.  Update `database.js` to connect to that external database URL.

## Step 3: Verify
Once the deploy finishes, Render will give you a URL (e.g., `https://my-shop.onrender.com`).
*   Open it to see your React app.
*   Login as Admin (you'll need to create the admin user again because the DB reset!).
*   *Note*: Since you can't run the CLI script on Render easily, you might want to add a temporary route to seed the admin user, or connect to a real database.
