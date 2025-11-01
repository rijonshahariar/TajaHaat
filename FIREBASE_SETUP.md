# Firebase Phone Authentication Setup Guide

## Quick Fix for "Failed to send OTP" Error

### 1. Check Firebase Console Settings

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `তাজা হাট-ca880`
3. Navigate to **Authentication** > **Sign-in method**
4. Make sure **Phone** authentication is **ENABLED**
5. Go to **Settings** tab in Authentication
6. In **Authorized domains**, make sure you have:
   - `localhost`
   - `127.0.0.1`
   - `তাজা হাট-ca880.firebaseapp.com`

### 2. Add Your Domain to Authorized Domains

**THIS IS THE MOST COMMON ISSUE**

1. In Firebase Console > Authentication > Settings
2. Scroll down to "Authorized domains"
3. Click "Add domain"
4. Add `localhost` if not already there
5. Save changes

### 3. Check Phone Number Format

Make sure your phone number is in international format:
- ✅ Correct: `+8801712345678`
- ❌ Wrong: `01712345678`
- ❌ Wrong: `8801712345678`

### 4. Test Steps

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Try sending OTP
4. Check for error messages in console

### 5. Common Error Messages and Fixes

| Error | Solution |
|-------|----------|
| `auth/unauthorized-domain` | Add your domain to authorized domains |
| `auth/invalid-phone-number` | Use international format (+880...) |
| `auth/too-many-requests` | Wait and try again later |
| `auth/captcha-check-failed` | reCAPTCHA verification failed, try again |

### 6. Quick Test

Use these test phone numbers in Firebase Console for testing:
1. Go to Authentication > Settings
2. Scroll to "Phone numbers for testing"
3. Add: `+8801700000000` with verification code: `123456`
4. This bypasses SMS sending for testing

## If Still Having Issues

1. Check browser console for exact error message
2. Verify all Firebase environment variables are correct
3. Make sure you're on the correct Firebase project
4. Try with a different phone number
5. Check Firebase project billing status (free tier has SMS limits)

1. Click on the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click on the "Web" icon (</>) to add a web app
5. Enter an app nickname (e.g., "তাজা হাট Web")
6. Check "Also set up Firebase Hosting" (optional)
7. Click "Register app"
8. Copy the Firebase configuration object

## Step 4: Configure the App

1. Open `client/lib/firebase.ts`
2. Replace the placeholder configuration with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012345678"
};
```

## Step 5: Set up Authentication Domain

1. In Firebase Console, go to Authentication > Settings
2. In the "Authorized domains" section, add your development domains:
   - `localhost`
   - Your production domain (when deployed)

## Step 6: Testing

1. Make sure you have a valid phone number for testing
2. Firebase requires reCAPTCHA for phone authentication in development
3. In production, you may want to configure test phone numbers in Firebase Console

## Important Notes

- Phone authentication requires a valid phone number
- SMS charges may apply based on your Firebase plan
- For production, consider setting up phone authentication quotas and monitoring
- Test thoroughly with different phone number formats

## Bangladesh Phone Number Format

The app is configured for Bangladesh phone numbers:
- Format: +880 1XXXXXXXXX
- The PhoneInput component automatically formats numbers
- Examples: +880 1712345678, +880 1912345678

## Troubleshooting

1. **reCAPTCHA Issues**: Make sure your domain is authorized in Firebase
2. **SMS Not Received**: Check if the phone number is correctly formatted
3. **Too Many Requests**: Firebase has rate limits for SMS
4. **Invalid Phone Number**: Ensure the number follows international format

For more detailed setup instructions, visit the [Firebase Documentation](https://firebase.google.com/docs/auth/web/phone-auth).
