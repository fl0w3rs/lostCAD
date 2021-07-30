import { middlewareWrapper } from './_main';

export default middlewareWrapper(({ next }) => {
  // setTimeout(() => next(), 1);
  next();
});
