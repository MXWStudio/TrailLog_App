import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.traillog',
  appName: 'TrailLog',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    Geolocation: {
      ios: {
        plist: {
          NSLocationWhenInUseUsageDescription: '需要访问您的位置来记录徒步路线和导航',
          NSLocationAlwaysUsageDescription: '需要在后台访问您的位置来持续记录徒步路线'
        }
      }
    }
  }
};

export default config;
