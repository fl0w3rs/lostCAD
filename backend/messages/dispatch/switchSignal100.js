module.exports = {
    message: 'dispatch/switchSignal100',
    callback: async ({ utils, socket, io }) => {
        if(!socket.isAuthenticated) return
        if(!await socket.isDepartmentTypeAvailable('dispatch')) return

        const state = await utils.settings.get('signal100');
        
        const newstate = state == 0 ? 1 : 0;
        await utils.settings.set('signal100', newstate)

        io.emit('updateSignal100', newstate)
    }
}