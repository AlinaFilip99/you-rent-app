import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'you-rent-app',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
