module.exports = {
    message: 'user/civilian/characters/weapons/edit',
    callback: async ({ socket, db, data, Validator, vtemplates, emitMessage }) => {
        if(!socket.isAuthenticated) return

        if(!await socket.isDepartmentTypeAvailable('civilian')) return

        let validation = new Validator(data, {
            ...vtemplates.rules.weapon
        });

        validation.setAttributeNames({
            ...vtemplates.names.weapon
        });
          
        if(validation.fails()) {
            socket.emit('errorNotifyUnescaped', Object.values(validation.errors.all()).join('<br/>'))
            return
        }

        const { regStatus, model, serial, id } = data;

        let weap = await db.cad.Weapon.findOne({ where: { id, userId: socket.userId } })
        if(!weap) {
            return
        }

        await db.cad.Weapon.update({
            regStatus, model, serial,
        }, { where: { id } })

        emitMessage('user/civilian/characters/weapons/editSuccess');

        socket.updateWeapons();
    }
}