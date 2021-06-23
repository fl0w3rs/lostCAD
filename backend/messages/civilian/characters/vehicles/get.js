module.exports = {
    message: 'user/civilian/characters/vehicles/get',
    callback: async ({ socket, db }) => {
        if(!socket.isAuthenticated) return

        if(!await socket.isDepartmentTypeAvailable('civilian')) return

        socket.updateVehicles();
    }
}