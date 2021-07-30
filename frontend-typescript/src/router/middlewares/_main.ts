import type { Store } from 'vuex';
import { StateInterface } from 'src/store/index';
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';

type MiddlewarePipeline = () => (void | unknown);

export interface MiddlewareContext {
  to: RouteLocationNormalized;
  from: RouteLocationNormalized;
  next: MiddlewarePipeline | NavigationGuardNext;
  store: Store<StateInterface>;
}

// eslint-disable-next-line no-unused-vars
export type MiddlewareFunction = (context: MiddlewareContext) => void;

export function middlewarePipeline(
  context: MiddlewareContext, middlewares: Array<MiddlewareFunction>, index: number,
): MiddlewarePipeline {
  const middleware: MiddlewareFunction = middlewares[index];
  if (!middleware) return context.next;
  return (input: NavigationGuardNext | null = null): void => {
    if (input !== null) {
      context.next(input);
      return;
    }

    const nextMiddleware = middlewarePipeline(
      context, middlewares, index + 1,
    );
    middleware({ ...context, next: nextMiddleware });
  };
}

export function middlewareWrapper(fn: MiddlewareFunction): MiddlewareFunction {
  return fn;
}
