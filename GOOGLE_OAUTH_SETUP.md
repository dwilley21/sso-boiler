# Setting Up Google OAuth with Supabase

This guide will walk you through the process of setting up Google OAuth for your Nuxt.js application using Supabase.

## 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a project" at the top of the page
3. Click on "New Project"
4. Enter a name for your project and click "Create"
5. Select your new project from the project selector

## 2. Configure OAuth Consent Screen

1. In the Google Cloud Console, go to "APIs & Services" > "OAuth consent screen"
2. Select "External" as the user type (unless you're using Google Workspace)
3. Click "Create"
4. Fill in the required information:
   - App name
   - User support email
   - Developer contact information
5. Click "Save and Continue"
6. Skip adding scopes for now and click "Save and Continue"
7. Add test users if needed (for testing before verification)
8. Click "Save and Continue"
9. Review your settings and click "Back to Dashboard"

## 3. Create OAuth Credentials

1. In the Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Enter a name for your OAuth client
5. Add authorized JavaScript origins:
   - For development: `http://localhost:3000`
   - For production: `https://your-production-domain.com`
6. Add authorized redirect URIs:
   - For development: `http://localhost:3000/confirm`
   - For production: `https://your-production-domain.com/confirm`
7. Click "Create"
8. Note down the Client ID and Client Secret

## 4. Configure Supabase Auth

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to "Authentication" > "Providers"
4. Find "Google" in the list and click on it
5. Toggle the "Enable" switch to enable Google authentication
6. Enter the Client ID and Client Secret from the Google Cloud Console
7. Set the Redirect URL to match what you configured in Google Cloud:
   - For development: `http://localhost:3000/confirm`
   - For production: `https://your-production-domain.com/confirm`
8. Click "Save"

## 5. Update Your Environment Variables

Make sure your `.env` file has the following variables:

```
SUPABASE_URL=https://your-project-url.supabase.co
SUPABASE_KEY=your-supabase-anon-key
BASE_URL=http://localhost:3000  # or your production URL
```

## 6. Testing the Integration

1. Start your Nuxt.js application
2. Navigate to the login page
3. Click the "Sign in with Google" button
4. You should be redirected to Google's authentication page
5. After authenticating, you should be redirected back to your application

## Troubleshooting

If you encounter issues with Google OAuth:

1. **Check the browser console for errors**
   - Look for any error messages related to OAuth or Supabase

2. **Verify your redirect URIs**
   - Make sure the redirect URIs in Google Cloud Console match those in Supabase
   - Ensure the URI format is correct (no trailing slashes)

3. **Check your environment variables**
   - Ensure SUPABASE_URL and SUPABASE_KEY are correct
   - Verify BASE_URL is set correctly

4. **Inspect network requests**
   - Look for any failed requests to Google or Supabase endpoints
   - Check the response status codes and error messages

5. **Verify Supabase configuration**
   - Make sure the Google provider is enabled in Supabase
   - Check that the Client ID and Client Secret are entered correctly

6. **Check for CORS issues**
   - Ensure your domains are properly configured in both Google Cloud and Supabase

7. **Review Google Cloud Console settings**
   - Make sure the OAuth consent screen is properly configured
   - Verify that the necessary APIs are enabled

If you continue to experience issues, check the Supabase logs in the Supabase dashboard for more detailed error information. 