Date.now = function() { return new Date().getTime() / 1000 | 0; }

module.exports = () => ({
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
            existsUntil: Date.now() + time,
            value,
        };

        return true;
    },

    clear(name) {
        if (typeof this.list[name] !== 'object') return false;

        delete this.list[name];

        return true;
    }
});
