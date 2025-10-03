import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.gmailinsights',
  appName: 'gmail-spark-insights',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '775297343977-l6k6f1sah7q52f3t9oam1lvlognrt892.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
