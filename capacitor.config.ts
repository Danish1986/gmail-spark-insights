import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.gmailinsights',
  appName: 'Growi',
  webDir: 'dist',
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
