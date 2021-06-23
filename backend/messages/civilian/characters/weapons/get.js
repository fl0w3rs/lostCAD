module.exports = {
    message: 'user/civilian/characters/weapons/get',
    callback: async ({ socket, db }) => {
        if(!socket.isAuthenticated) return

        if(!await socket.isDepartmentTypeAvailable('civilian')) return

        socket.updateWeapons();
    }
}