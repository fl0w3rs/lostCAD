module.exports = {
    message: 'dispatch/requestLog',
    callback: async ({ utils, socket }) => {
        if(!socket.isAuthenticated) return
        if(!await socket.isDepartmentTypeAvailable('dispatch')) return

        const log = await utils.settings.get('dispatchLog');

        socket.emit('updateDispatchLog', log)
    }
}