import { LocalStorage } from 'quasar';

export default function () {
  return {
    gameZone: 'Игровая зона',
    dispatchLog: '',
    signal: 0,
    soundMuted: LocalStorage.getItem('soundMuted') || false,
    dispatcherList: {},
  };
}
