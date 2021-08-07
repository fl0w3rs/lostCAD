export interface IWindow {
  id?: number;
  zIndex?: number;

  title?: string;
  type: 'draggable' | 'dialog';
  component: string;

  initialWidth?: string;
  initialHeight?: string;
}

export function windowWrapper(window: IWindow): IWindow {
  return window;
}
