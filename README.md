# Nuxt.js SSO Authentication with Supabase

This is a boilerplate project for implementing Single Sign-On (SSO) authentication in a Nuxt.js application using Supabase.

## Features

- Email/Password authentication
- Google OAuth authentication
- Protected routes
- User profile display
- Registration with email confirmation
- Responsive design

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Supabase account
- Google Cloud account (for Google OAuth)

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a Supabase project at [https://supabase.com](https://supabase.com)
4. Copy your Supabase URL and anon key from the Supabase dashboard
5. Create a `.env` file in the root directory with the following content:
   ```
   SUPABASE_URL=https://your-project-url.supabase.co
   SUPABASE_KEY=your-supabase-anon-key
   BASE_URL=http://localhost:3000  # or your production URL
   ```
6. Configure OAuth providers in Supabase:
   - For Google OAuth setup, follow the detailed instructions in [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)

## Development

Start the development server:

```bash
npm run dev
```

## Authentication Flow

1. Users can sign in with email/password or Google OAuth
2. New users can register with email/password
3. After successful authentication, users are redirected to the home page
4. Protected routes redirect unauthenticated users to the login page

## Project Structure

- `pages/` - Application pages
  - `index.vue` - Home page (protected)
  - `login.vue` - Login page
  - `register.vue` - Registration page
  - `confirm.vue` - OAuth callback handler
- `components/` - Vue components
  - `AppButton.vue` - Reusable button component
  - `GoogleSignInButton.vue` - Google sign-in button
  - `LoadingSpinner.vue` - Loading spinner component
  - `UserAvatar.vue` - User avatar component
- `layouts/` - Application layouts
  - `default.vue` - Default layout with header and footer
- `middleware/` - Nuxt middleware
  - `auth.ts` - Authentication middleware
- `plugins/` - Nuxt plugins
  - `auth.client.ts` - Authentication state management
- `types/` - TypeScript type definitions
- `nuxt.config.ts` - Nuxt configuration

## Troubleshooting

If you encounter issues with Google OAuth, check the following:

1. Verify that your Google OAuth credentials are correctly set up in the Google Cloud Console
2. Ensure that the redirect URIs match between Google Cloud Console and Supabase
3. Check that the Google provider is enabled in Supabase
4. Look for any error messages in the browser console
5. Verify your environment variables are correctly set

For detailed troubleshooting steps, see [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md).

## Customization

- Update the styling in the component `<style>` sections
- Add additional OAuth providers in Supabase and update the login page
- Extend user profile information by modifying the home page

## Deployment

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## License

MIT
