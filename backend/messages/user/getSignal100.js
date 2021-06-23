module.exports = {
    message: 'getSignal100',
    callback: async ({ utils, socket }) => {
        if(!socket.isAuthenticated) return

        const state = await utils.settings.get('signal100');

        socket.emit('updateSignal100', state)
    }
}