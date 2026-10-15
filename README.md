# 🧭 AI Compass

### Find the Right AI for the Job.

AI Compass is a curated directory that helps you discover, explore, and compare AI tools based on your needs. Whether you're coding, studying, researching, creating content, or building a business, AI Compass helps you find tools that fit your workflow.

Discover useful AI products, explore categories, compare capabilities, and save your favorite tools in one place.

## ✨ Features

- **Discover AI Tools** — Explore a growing catalog of AI products across multiple categories.
- **Find My AI** — Answer a few questions to discover tools suited to your tasks and preferences.
- **Compare Tools** — Compare AI tools side by side to understand their features, pricing, and capabilities.
- **Explore Categories** — Browse tools by purpose, including coding, research, writing, design, education, and more.
- **Save Favorites** — Bookmark tools and access your personal collection after signing in.
- **Submit AI Tools** — Suggest new tools for review and possible inclusion in the directory.
- **Tool Profiles** — Explore descriptions, features, supported platforms, pricing information, and official websites.
- **Admin Dashboard** — Manage the catalog, categories, featured tools, and user submissions.
- **Google Sign-In** — Sign in securely and conveniently using your Google account.
- **Dark & Light Mode** — Choose the appearance that works best for you.
- **Responsive Design** — Enjoy a consistent experience across mobile phones, tablets, and desktops.

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Framework | TanStack Start |
| Frontend | React 19 |
| Styling | Tailwind CSS v4 |
| Authentication | Firebase Authentication |
| Database | Cloud Firestore |
| File Storage | Firebase Storage |
| Charts | Recharts |
| Icons | Lucide React |
| Deployment | Vercel |

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or later recommended
- npm
- A Firebase project

### 1. Clone the repository

```bash
git clone https://github.com/usamaawol/phase-2-ai-compass.git
cd phase-2-ai-compass
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Configure environment variables

Create a local environment file using the project's example:

```bash
cp .env.example .env
```

Add the required Firebase web configuration values to `.env`. Refer to the Firebase documentation and the project's environment variable template for the required names.

**Important:** Keep private credentials and secrets out of source control. Never commit your `.env` file.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL printed in your terminal. The default development URL is `http://localhost:8080`.

## 🔥 Firebase Configuration

AI Compass uses Firebase for authentication, database operations, and file storage.

To run the application with your own Firebase project:

1. Create or select a project in the [Firebase Console](https://console.firebase.google.com/).
2. Register a web application and configure its environment variables.
3. Enable Google sign-in under Firebase Authentication.
4. Create a Cloud Firestore database.
5. Configure Firebase Storage if required by your deployment.
6. Deploy and test the project's Firestore and Storage security rules.
7. Add your development and production domains to Firebase Authentication's authorized domains.

Use restrictive security rules appropriate for your application. Administrator privileges must be assigned through a trusted process and must never be granted by an ordinary client.

### Admin dashboard access

To grant an administrator access, first sign in with that account and copy its UID from Firebase Authentication → Users. In Firestore, create `admin_users/{UID}` with the string field `role` set to `admin`. Do not grant this role from the client application.

The account must be able to read its own role document for the app to verify admin access. Deploy the current rules after setup or after updating them:

```bash
firebase deploy --only firestore:rules
```

Then sign in with the same Firebase account and open `/admin`.

For detailed configuration instructions, see the [Firebase documentation](https://firebase.google.com/docs).

## ☁️ Deployment

AI Compass can be deployed to [Vercel](https://vercel.com/).

1. Push your project to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables in your Vercel project settings.
4. Deploy the application using the project's configured build settings.
5. Add your production domain to Firebase Authentication's authorized domains.
6. Test authentication, database permissions, navigation, and responsive layouts after deployment.

Never include private credentials in your repository or public documentation.

## 📁 Project Structure

```text
src/
├── components/
│   ├── compass/       # Shared application components
│   └── ui/            # Reusable interface components
├── hooks/             # Authentication and application hooks
├── lib/               # Firebase, catalog, and data utilities
├── routes/            # Application pages and routes
└── styles.css         # Global styles and design tokens
```

The project uses TanStack's file-based routing architecture. Individual files and responsibilities may evolve as the application grows.

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run code quality checks |
| `npm run format` | Format the codebase |
| `npm run test` | Run the test suite |

## 🔐 Security

AI Compass is designed to use Firebase Authentication and security rules to protect account-specific and administrative functionality.

- Keep secrets and private credentials out of Git.
- Restrict access to user data and administrative operations.
- Validate submitted information.
- Review security rules before deployment.
- Do not rely on hidden routes or frontend checks as the only form of authorization.

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a branch for your changes.
3. Make and test your changes.
4. Submit a pull request describing your improvements.

Please keep changes focused, maintain consistent code style, and avoid committing credentials or other sensitive information.

## 📄 License

Add your chosen license before distributing the project publicly. If no license has been selected, the project remains subject to the applicable copyright rules.

---

**AI Compass — Find the Right AI for the Job.**
