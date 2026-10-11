# 🧭 AI Compass

**Find the right AI. For the job.**

AI Compass is a curated directory of AI tools — search, filter, compare, and bookmark the AI products that actually fit your workflow. Sign in with Google (no passwords) to save tools and submit new ones for review.

Built with **TanStack Start**, **React 19**, **Firebase** (Auth + Firestore), and **Tailwind CSS**.

---

## ✨ Features

- **Discover** — browse 50+ curated AI tools with categories, pricing, and skill levels
- **Find my AI** — answer a few questions and get matched to the right tool
- **Compare** — side-by-side feature comparison between two tools
- **Saved tools** — bookmark tools to your personal library (sign-in required)
- **Submit a tool** — suggest new AI tools for admin review
- **Admin dashboard** — manage tools, categories, submissions, users, and analytics
- **Google sign-in** — one-click authentication, no passwords
- **Dark / light mode** — persisted theme preference
- **Fully responsive** — works on mobile, tablet, and desktop

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Framework | TanStack Start (Vite + SSR) |
| UI | React 19 + Tailwind CSS v4 |
| Auth | Firebase Auth (Google OAuth) |
| Database | Firebase Firestore |
| Storage | Firebase Storage |
| Charts | Recharts |
| Icons | Lucide React |
| Deployment | Vercel (Nitro serverless) |

---

## 🚀 Quick Start

### Prerequisites

- Node.js **18+** (20+ recommended)
- npm
- A [Firebase](https://console.firebase.google.com) account

### 1. Clone & install

```bash
git clone https://github.com/usamaawol/phase-2-ai-compass.git
cd phase-2-ai-compass
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is required because some dependencies (recharts, eslint) have peer version ranges that overlap. This is expected and does not affect the build.

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in your Firebase web app config (see [Firebase setup](#firebase-setup) below).

### 3. Start the dev server

```bash
npm run dev
```

The app runs at **http://localhost:8080**.

---

## 🔥 Firebase Setup

Google sign-in, Firestore, and Storage all require a Firebase project.

### Step 1 — Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** and follow the wizard
3. (Optional) Enable Google Analytics during setup

### Step 2 — Register a Web App

1. In the Firebase Console, click **⚙️** → **Project settings** → **Your apps**
2. Click **Add app** → **Web** (`</>` icon)
3. Give it a nickname (e.g. "AI Compass Web") → **Register app**
4. Copy the `firebaseConfig` values into your `.env`:

```env
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789012"
VITE_FIREBASE_APP_ID="1:123456789012:web:abcdef1234567890"
VITE_FIREBASE_MEASUREMENT_ID=""  # optional
```

### Step 3 — Enable Google sign-in

1. Go to **Authentication** → **Sign-in method**
2. Click **Google** → toggle **Enable**
3. Select a support email → **Save**

### Step 4 — Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in production mode**
3. Select a location → **Enable**

### Step 5 — (Optional) Create Storage

1. Go to **Storage** → **Get started**
2. Start in **production mode** → **Next** → **Done**

### Step 6 — Deploy security rules

The project ships with `firebase.rules` (Firestore) and `firebase.storage.rules` (Storage). Deploy them:

```bash
npm install -g firebase-tools
firebase login
firebase use YOUR_PROJECT_ID
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
firebase deploy --only firestore:indexes
```

### Step 7 — Authorize your domains

Firebase automatically allows `localhost`. For production, add your Vercel/custom domain:

1. **Authentication** → **Settings** → **Authorized domains**
2. Click **Add domain** → enter your production URL (e.g. `aicompass.vercel.app`)

---

## 👑 Make Yourself an Admin

The admin dashboard (`/admin`) is protected. To become an admin:

1. Sign in to the app with your Google account once (this creates your user record)
2. Go to **Firebase Console** → **Firestore Database**
3. Create collection `admin_users`
4. Add document with:
   - **Document ID** = your Firebase Auth UID (find it in **Authentication** → **Users**)
   - **Field** `role` = `"admin"` (string)

You'll now see the **Admin** link in the sidebar.

---

## ☁️ Deploy to Vercel

1. Push your code to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Set the **Environment Variables** (all `VITE_FIREBASE_*` from `.env`).
4. The `vercel.json` in this repo already configures:
   - Install command: `npm install --legacy-peer-deps`
   - Build command: `NITRO_PRESET=vercel npm run build`
5. Click **Deploy**.

After the first deploy, add your Vercel domain to Firebase **Authorized domains** (Step 7 above) so Google sign-in works in production.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── compass/          # Sidebar, shared UI, feedback button
│   └── ui/               # Reusable primitives (Button, etc.)
├── hooks/
│   ├── use-auth.tsx      # Auth context (Google sign-in, state)
│   ├── use-admin.tsx     # Admin role check
│   └── use-bookmarks.tsx # Saved tools
├── lib/
│   ├── catalog.ts        # Typed tool/category catalog (demo data)
│   ├── firebase.ts       # Firebase init + auth + Firestore helpers
│   └── admin-db.ts       # Firestore operations for admin panel
├── routes/               # TanStack file-based routes
│   ├── index.tsx         # Home / hero
│   ├── discover.tsx      # Tool catalog + filters
│   ├── find.tsx          # "Find my AI" quiz
│   ├── compare.tsx       # Side-by-side comparison
│   ├── categories.tsx    # Category list
│   ├── category.$slug.tsx  # Single category
│   ├── tool.$slug.tsx    # Tool detail page
│   ├── saved.tsx         # Bookmarked tools
│   ├── submit.tsx        # Suggest a tool
│   ├── account.tsx       # User profile
│   ├── admin.tsx         # Admin dashboard layout
│   ├── about.tsx, faq.tsx, terms.tsx, privacy.tsx, changelog.tsx
│   └── __root.tsx        # Root layout, theme, auth gate
└── styles.css            # Global semantic design system
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server (http://localhost:8080) |
| `npm run build` | Production build (Vite + Nitro) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format all files with Prettier |
| `npm run test` | Run Vitest tests |

---

## ❓ Troubleshooting

### Google sign-in doesn't work

The most common causes and fixes:

| Symptom / Error | Fix |
|---|---|
| `auth/operation-not-allowed` | Enable **Google** in Firebase Console → Authentication → Sign-in method |
| `auth/unauthorized-domain` | Add your domain to Authentication → Settings → Authorized domains (localhost is auto-allowed) |
| `auth/api-key-not-valid` | Check `VITE_FIREBASE_API_KEY` matches the value in Project settings → Your apps |
| `Firebase is not configured` | Set all `VITE_FIREBASE_*` env vars (and redeploy on Vercel if you changed them) |
| Pop-up blocked / nothing happens | The app automatically falls back to redirect sign-in. If still failing, allow pop-ups for the site |
| `auth/web-storage-unsupported` | Third-party cookies / storage are blocked. Enable them or use redirect sign-in |
| Sign-in works locally but not on Vercel | Make sure your Vercel domain is in **Authorized domains** and all env vars are set in Vercel project settings |

### Build fails on Vercel

- The `vercel.json` uses `NITRO_PRESET=vercel` so Nitro emits the correct serverless function directory.
- If you see `Cannot find package 'vite-tsconfig-paths'` — make sure it's in `devDependencies` (it's required by `@lovable.dev/vite-tanstack-config`).
- Always use `npm install --legacy-peer-deps` (already set in `vercel.json`).

---

## 📄 License

MIT
