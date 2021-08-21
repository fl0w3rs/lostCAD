import { LocalStorage } from 'quasar';
import { boot } from 'quasar/wrappers';
import { Howler } from 'howler';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  // something to do
  const actualVolume = LocalStorage.getItem('volume');
  if (!actualVolume) {
    LocalStorage.set('volume', 0.2);
    Howler.volume(0.2);
    return;
  }
  Howler.volume(actualVolume);
});
