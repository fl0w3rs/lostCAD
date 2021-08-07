/* eslint-disable no-unused-vars */
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { onBeforeMount, onBeforeUnmount } from 'vue';

export const socketInstance = io('https://lostcad.fl0w3rs.dev', { path: '/socket' });

interface SocketMessage {
  wrapperId: string;
  data: unknown;
}

interface Listener {
  event: string;
  // eslint-disable-next-line no-unused-vars
  handler: (data: unknown) => void;
  isAttached: boolean;
}

interface SocketWrapperOptions {
  hookComponentLifeCycle: boolean;
}

// eslint-disable-next-line no-unused-vars
type EmitReturnCallback = (pl: unknown) => void;

export class SocketWrapper {
  public instance: Socket;

  private readonly wrapperId: string;

  private listeners: Array<Listener>;

  private readonly options: SocketWrapperOptions;

  constructor(options: SocketWrapperOptions = { hookComponentLifeCycle: true }) {
    this.instance = socketInstance;
    this.wrapperId = uuidv4();
    this.listeners = [];
    this.options = options;

    if (this.options.hookComponentLifeCycle) {
      onBeforeMount(() => { this.attachListeners(); });
      onBeforeUnmount(() => { this.detachListeners(); });
    }
  }

  // eslint-disable-next-line no-unused-vars
  emit(event: string, payload: unknown): { onReturn: (handler: EmitReturnCallback) => void } {
    const requestId = uuidv4();

    this.instance.emit(event, { requestId, wrapperId: this.wrapperId, payload });

    return {
      onReturn: (handler: EmitReturnCallback) => {
        this.instance.once(`return_${requestId}`, (rPayload) => {
          const pl = rPayload as SocketMessage;
          handler(pl.data);
        });
      },
    };
  }

  listen(
    event: string,
    handler: (payload: unknown) => void,
    options: { ignoreWrapperID: boolean } = { ignoreWrapperID: false },
  ): void {
    const handlerWrapper = (payload: any) => {
      if (!options.ignoreWrapperID && payload.wrapperId !== this.wrapperId) return;
      const data = payload.wrapperId ? payload.data : payload;
      handler(data);
    };

    this.listeners.push({ event, handler: handlerWrapper, isAttached: false });
    if (!this.options.hookComponentLifeCycle) this.attachListeners();
  }

  attachListeners() {
    for (let i = 0; i < this.listeners.length; i += 1) {
      // eslint-disable-next-line no-continue
      if (this.listeners[i].isAttached) continue;

      const { event, handler } = this.listeners[i];
      socketInstance.on(event, handler);
      this.listeners[i].isAttached = true;
    }
  }

  detachListeners() {
    for (let i = 0; i < this.listeners.length; i += 1) {
      // eslint-disable-next-line no-continue
      if (!this.listeners[i].isAttached) continue;

      const { event, handler } = this.listeners[i];
      socketInstance.off(event, handler);
      this.listeners[i].isAttached = false;
    }
  }
}
