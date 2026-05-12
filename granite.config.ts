import { router } from '@granite-js/plugin-router';
import { hermes } from '@granite-js/plugin-hermes';
import { defineConfig } from '@granite-js/react-native/config';
import { appsInToss } from '@apps-in-toss/plugins';

export default defineConfig({
  appName: 'salary-survival-test',
  scheme: 'intoss',
  plugins: [
    router(),
    hermes(),
    ...appsInToss({
      appType: 'general',
      brand: {
        displayName: '내 월급으로 생존하기',
        primaryColor: '#3182F6',
        icon: 'https://static.toss.im/appsintoss/33837/34bd8247-a932-4de9-9db4-157618c746b2.png',
      },
      permissions: [],
    }),
  ],
});
