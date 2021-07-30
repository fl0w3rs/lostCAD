import { Window } from './types';

export interface WindowStateInterface {
  list: Array<Window>;
}

function state(): WindowStateInterface {
  return {
    list: [],
  };
}

export default state;
