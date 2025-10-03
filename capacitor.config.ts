import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.9cdc8fb8661b49ca969c84aa279105d2',
  appName: 'gmail-spark-insights',
  webDir: 'dist',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: 'PASTE_YOUR_ACTUAL_WEB_CLIENT_ID_HERE.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
