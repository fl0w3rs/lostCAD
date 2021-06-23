module.exports = {
    message: 'user/civilian/characters/vehicles/remove',
    callback: async ({ socket, db, data, emitMessage }) => {
        if(!socket.isAuthenticated) return

        if(!await socket.isDepartmentTypeAvailable('civilian')) return

        let vehicle = await db.cad.Vehicle.findOne({
            where: {
                userId: socket.userId,
                id: data.id,
            }
        })

        if(!vehicle) return

        await db.cad.Vehicle.destroy({ where: { id: data.id } })

        emitMessage('user/civilian/characters/vehicles/removeSuccess', []);

        socket.updateVehicles();
    }
}