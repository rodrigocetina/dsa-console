# DSA Compliance Console — Setup & Deployment Guide

## Project structure

```
dsa-console/
├── src/
│   ├── DSAConsole.jsx   ← the main component (edit this to update data)
│   ├── App.jsx          ← just imports DSAConsole, nothing to touch
│   ├── main.jsx         ← Vite entry point, nothing to touch
│   └── index.css        ← Tailwind directives, nothing to touch
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .gitignore
```

---

## Option A — Run locally (preview on your machine)

**Requirements:** Node.js installed (https://nodejs.org — download the LTS version)

```bash
# 1. Open a terminal and navigate to this folder
cd path/to/dsa-console

# 2. Install dependencies (only needed once)
npm install

# 3. Start the dev server
npm run dev
```

Open your browser at **http://localhost:5173** — it hot-reloads whenever you save DSAConsole.jsx.

---

## Option B — GitHub + Vercel (shareable live URL, auto-deploys on every push)

### Step 1 — Push to GitHub

```bash
# Inside the dsa-console folder:
git init
git add .
git commit -m "Initial DSA Console"

# Create a new repo on github.com (call it dsa-console or anything you like)
# Then link and push:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 2 — Connect to Vercel

1. Go to **vercel.com** and sign in with your GitHub account
2. Click **"Add New Project"**
3. Import your `dsa-console` repository
4. Vercel auto-detects Vite — leave all settings as default
5. Click **Deploy**

That's it. Vercel gives you a live URL like `https://dsa-console-xyz.vercel.app`.

Every time you push an update to GitHub, Vercel redeploys automatically within ~30 seconds.

---

## Updating the console data

All data lives in `src/DSAConsole.jsx`. The datasets are at the top of the file:

| Dataset | What it controls |
|---------|-----------------|
| `matrix1A` | Matrix 1A: Risk Map tab |
| `matrix1B` | Matrix 1B: Audit Findings tab |
| `synthesis` | Thematic Synthesis tab |
| `disconnect` | Scope vs Substance tab |
| `auditBenchmarks` | Audit Benchmarks tab (one object per platform) |

To add a deepened analysis for a new platform:
1. Update that platform's rows in each dataset with primary document findings
2. Find the platform's object in `auditBenchmarks` and fill in the benchmark dimensions
3. Change `primaryDocStatus` from `'Pending...'` to `'Fully reviewed — X documents, ~Y pages'`
4. Save the file — the browser refreshes instantly if running locally, or push to GitHub for Vercel

---

## Note on the benchmark tab

The **Audit Benchmarks** tab is the analysis template. TikTok is fully populated.
The other five platforms show `[Pending — documents available in folder]` on the fields
that require primary document review. Fill these in as each platform is analysed.
