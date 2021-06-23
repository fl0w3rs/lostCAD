module.exports = {
    message: 'user/civilian/characters/weapons/create',
    callback: async ({ socket, db, data, Validator, vtemplates, emitMessage }) => {
        if(!socket.isAuthenticated) return

        if(!await socket.isDepartmentTypeAvailable('civilian')) return

        let validation = new Validator(data, {
            ...vtemplates.rules.weapon,
            'character_owner': 'required',
        });

        validation.setAttributeNames({
            ...vtemplates.names.weapon
        });
          
        if(validation.fails()) {
            socket.emit('errorNotifyUnescaped', Object.values(validation.errors.all()).join('<br/>'))
            return
        }

        const { regStatus, model, serial, character_owner } = data;

        let char = await db.cad.Character.findOne({ where: { id: character_owner, userId: socket.userId } })
        if(!char) {
            return
        }

        await db.cad.Weapon.create({
            regStatus, model, serial,
            userId: socket.userId, characterId: character_owner
        })

        emitMessage('user/civilian/characters/weapons/createSuccess');

        socket.updateWeapons();
    }
}