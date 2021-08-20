import { LocalStorage } from 'quasar';

export default function () {
  return {
    list: [],
    selected: LocalStorage.getItem('selectedIdentifier') || null,
  };
}
