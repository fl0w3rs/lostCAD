export const createCacheInstance = () => ({
  list: {
    // example: {
    //   existsUntil: Date.now(),
    //   value: 'lol',
    // },
  },

  get(name) {
    if (typeof this.list[name] !== 'object') return undefined;

    if (Date.now() > this.list[name].existsUntil) {
      delete this.list[name];
      return undefined;
    }

    return this.list[name].value;
  },

  set(name, value, time) {
    if (this.get(name) !== undefined) return false;

    this.list[name] = {
      existsUntil: Date.now() + (time * 1000),
      value,
    };

    return true;
  },
});
