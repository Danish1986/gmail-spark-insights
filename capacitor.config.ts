import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.gmailinsights',
  appName: 'Growi',
  webDir: 'dist',
  server: {
    url: 'https://9cdc8fb8-661b-49ca-969c-84aa279105d2.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
  ios: {
    scheme: 'growi'
  },
  android: {
    scheme: 'growi'
  }
};

export default config;
