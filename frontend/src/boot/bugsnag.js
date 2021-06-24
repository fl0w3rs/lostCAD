import { boot } from 'quasar/wrappers';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginVue from '@bugsnag/plugin-vue';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }/* { app, router, ... } */) => {
  Bugsnag.start({
    apiKey: 'YOUR_BUGSNAG_API_KEY',
    plugins: [new BugsnagPluginVue()],
  });

  const bugsnagVue = Bugsnag.getPlugin('vue');
  app.use(bugsnagVue);
});
