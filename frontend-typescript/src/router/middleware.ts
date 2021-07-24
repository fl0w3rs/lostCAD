export interface MiddlewareContext {
  to: unknown;
  from: unknown;
  next: unknown;
  store: unknown;
}

// eslint-disable-next-line no-unused-vars
export type MiddlewareFunction = (context: MiddlewareContext) => void;

export function middlewarePipeline(
  context: MiddlewareContext, middlewares: Array<MiddlewareFunction>, index: number,
): void | unknown {
  const middleware: MiddlewareFunction = middlewares[index];
  if (!middleware) return context.next;
  return (): void => {
    const nextMiddleware = middlewarePipeline(
      context, middlewares, index + 1,
    );
    middleware({ ...context, next: nextMiddleware });
  };
}
