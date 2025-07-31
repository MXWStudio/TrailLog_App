import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.traillog',
  appName: 'TrailLog',
  webDir: 'dist',
  bundledWebRuntime: false,
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: false,
    scrollEnabled: true,
    backgroundColor: '#ffffff'
  },
  plugins: {
    StatusBar: {
      style: 'light',
      backgroundColor: '#ffffff',
      overlaysWebView: false,
      iosStyle: 'default'
    },
    Geolocation: {
      ios: {
        plist: {
          NSLocationWhenInUseUsageDescription: '需要访问您的位置来记录徒步路线和导航',
          NSLocationAlwaysUsageDescription: '需要在后台访问您的位置来持续记录徒步路线',
          NSLocationAlwaysAndWhenInUseUsageDescription: '需要访问您的位置来提供精确的徒步导航和路线记录'
        }
      }
    },
    Camera: {
      ios: {
        plist: {
          NSCameraUsageDescription: '需要访问相机来拍摄徒步照片和记录路线',
          NSPhotoLibraryUsageDescription: '需要访问相册来选择和保存徒步照片',
          NSMicrophoneUsageDescription: '需要访问麦克风来录制徒步视频'
        }
      }
    },
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#ffffff',
      showSpinner: true,
      spinnerColor: '#999999'
    },
    App: {
      ios: {
        backgroundColor: '#ffffff'
      }
    }
  }
};

export default config;
