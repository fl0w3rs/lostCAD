import { boot } from 'quasar/wrappers';
import { Notify } from 'quasar';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot((/* { app, router, ... } */) => {
  Notify.setDefaults({
    position: 'top',
    timeout: 2500,
    textColor: 'white',
  });

  Notify.registerType('unit-info', {
    icon: 'fas fa-balance-scale',
    color: 'blue',
    textColor: 'white',
  });
});
