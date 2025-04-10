
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ac91c8ef20864dbca28bf5daa84816ab',
  appName: 'MindWell',
  webDir: 'dist',
  server: {
    url: 'https://ac91c8ef-2086-4dbc-a28b-f5daa84816ab.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    backgroundColor: "#D2EDD4",
    allowMixedContent: true,
    splash: {
      backgroundColor: "#D2EDD4",
    },
    navigationBarColor: "#9b87f5",
    windowSoftInputMode: "adjustResize"
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      showSpinner: true,
      spinnerColor: "#9b87f5",
      androidSpinnerStyle: "large"
    },
    Keyboard: {
      resize: "body",
      style: "dark",
      resizeOnFullScreen: true
    }
  }
};

export default config;
