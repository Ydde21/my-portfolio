# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Security Configuration

Copy `.env.example` to `.env` and configure:

- `RESEND_API_KEY`: API key used by the contact email endpoint.
- `GEMINI_API_KEY`: API key used by the scoped portfolio chatbot endpoint.
- `GEMINI_MODEL`: Gemini model name (default: `gemini-3-flash-preview`).
- `GEMINI_FALLBACK_MODELS`: Comma-separated backup models used if the primary model is unavailable/quota-limited.
- `GEMINI_API_BASE_URL`: Gemini API base URL (default: `https://generativelanguage.googleapis.com/v1beta`).
- `ALLOWED_ORIGINS`: Comma-separated list of trusted browser origins that may call `/api/send` and `/api/chat`.
- `CONTACT_RATE_LIMIT_WINDOW_MS`: Rate-limit window in milliseconds.
- `CONTACT_RATE_LIMIT_MAX_REQUESTS`: Max accepted requests per client IP per window.
- `CONTACT_RATE_LIMIT_BLOCK_MS`: Temporary block duration after exceeding the limit.
- `CHAT_RATE_LIMIT_WINDOW_MS`: Chatbot rate-limit window in milliseconds.
- `CHAT_RATE_LIMIT_MAX_REQUESTS`: Max chatbot requests per client IP per window.
- `CHAT_RATE_LIMIT_BLOCK_MS`: Temporary chatbot block duration after exceeding the limit.
