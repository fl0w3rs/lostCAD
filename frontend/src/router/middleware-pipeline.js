// router/middleware-pipeline.js

/**
 * A stack of different middlewares ran in series
 * Link: https://blog.logrocket.com/vue-middleware-pipelines/
 */
function middlewarePipeline(
  context, middlewares, index,
) {
  const middleware = middlewares[index];
  if (!middleware) return context.next;
  return (input = null) => {
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

export default middlewarePipeline;
