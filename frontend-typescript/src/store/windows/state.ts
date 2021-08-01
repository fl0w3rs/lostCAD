import { IWindow } from './types';

export interface WindowStateInterface {
  list: Array<IWindow>;
}

function state(): WindowStateInterface {
  return {
    list: [],
  };
}

export default state;
