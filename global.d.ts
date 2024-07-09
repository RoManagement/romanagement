// global.d.ts

interface Window {
    chatwootSDK: {
      run: (options: { websiteToken: string; baseUrl: string }) => void;
    };
  }
  