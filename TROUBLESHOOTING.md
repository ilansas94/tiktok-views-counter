# TikTok OAuth Troubleshooting Guide

## Common Issues and Solutions

### 1. "Unable to authenticate — please check your TikTok app configuration"

This error typically occurs when the TikTok API returns an empty response or missing access_token. Here are the most common causes:

#### Environment Variables Not Set
- **Check**: Visit `/api/test-env` to verify environment variables are configured
- **Fix**: Ensure these environment variables are set in your deployment:
  ```
  TIKTOK_CLIENT_KEY=your_actual_client_key
  TIKTOK_CLIENT_SECRET=your_actual_client_secret
  NEXT_PUBLIC_APP_BASE_URL=https://your-domain.vercel.app
  NEXT_PUBLIC_TIKTOK_CLIENT_KEY=your_actual_client_key
  ```

#### TikTok App Configuration Issues
- **Redirect URI Mismatch**: The redirect URI in your TikTok app must exactly match `${NEXT_PUBLIC_APP_BASE_URL}/auth/callback`
- **App Status**: Ensure your TikTok app is not in sandbox mode, or if it is, understand that live data won't be available
- **Scopes**: Verify your app has the required scopes: `user.info.basic,video.list`

#### Sandbox Mode Limitations
If your TikTok app is in sandbox mode:
- Token exchange may fail
- Live video data won't be available
- The app will show sample data instead

### 2. Debugging Steps

1. **Check Environment Variables**:
   ```
   https://your-domain.vercel.app/api/test-env
   ```

2. **Check Console Logs**:
   - Open browser developer tools
   - Look for detailed error messages in the console
   - Check the Network tab for API request/response details

3. **Verify TikTok App Settings**:
   - Login to TikTok for Developers
   - Check your app's redirect URI configuration
   - Verify client key and secret are correct
   - Ensure app has required permissions

### 3. Expected Behavior

- **Success**: Shows live view count from your TikTok videos
- **Sandbox Mode**: Shows sample data with appropriate message
- **Configuration Error**: Shows sample data with error message

### 4. Getting Help

If you're still experiencing issues:
1. Check the browser console for detailed error messages
2. Verify your TikTok app configuration
3. Ensure all environment variables are properly set
4. Contact support with the specific error messages from the console
