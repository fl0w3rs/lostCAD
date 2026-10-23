import { boot } from 'quasar/wrappers';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginVue from '@bugsnag/plugin-vue';

export default boot(({ app }) => {
  // error reporting is optional: set BUGSNAG_API_KEY when building to enable it
  if (!process.env.BUGSNAG_API_KEY) return;

  Bugsnag.start({
    apiKey: process.env.BUGSNAG_API_KEY,
    plugins: [new BugsnagPluginVue()],
  });

  const bugsnagVue = Bugsnag.getPlugin('vue');
  app.use(bugsnagVue);
});
