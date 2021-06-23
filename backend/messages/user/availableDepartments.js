module.exports = {
    message: 'user/getAvailableDepartments',
    callback: async ({ socket, emitMessage, }) => {
        if(!socket.isAuthenticated) return
        
        emitMessage('user/responseDepartments', { list: await socket.getAvailableDepartments() });
    }
}