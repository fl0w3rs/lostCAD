module.exports = {
    message: 'user/civilian/characters/vehicles/create',
    callback: async ({ socket, db, data, Validator, vtemplates, emitMessage }) => {
        if(!socket.isAuthenticated) return

        if(!await socket.isDepartmentTypeAvailable('civilian')) return

        let validation = new Validator(data, {
            ...vtemplates.rules.vehicle,
            'character_owner': 'required',
        });

        validation.setAttributeNames({
            ...vtemplates.names.vehicle
        });
          
        if(validation.fails()) {
            socket.emit('errorNotifyUnescaped', Object.values(validation.errors.all()).join('<br/>'))
            return
        }

        const { mark, model, numberplate, vin, regStatus, insStatus, dor, color, type, character_owner } = data;

        let char = await db.cad.Character.findOne({ where: { id: character_owner, userId: socket.userId } })
        if(!char) {
            return
        }

        await db.cad.Vehicle.create({
            mark, model, numberplate, vin, regStatus, insStatus, dor, color, type,
            userId: socket.userId, characterId: character_owner
        })

        emitMessage('user/civilian/characters/vehicles/createSuccess');

        socket.updateVehicles();
    }
}