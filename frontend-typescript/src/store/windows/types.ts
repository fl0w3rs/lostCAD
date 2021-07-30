export interface Window {
  title?: string;
  type: 'draggable' | 'dialog';
}

export function windowWrapper(window: Window): Window {
  return window;
}
