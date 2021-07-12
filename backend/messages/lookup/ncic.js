const { Op } = require('sequelize')

module.exports = {
    message: 'ncic/request',
    callback: async ({ socket, Validator, data, db, emitMessage }) => {
        if(!socket.isAuthenticated) return

        if(
            !await socket.isDepartmentTypeAvailable('police') &&
            !await socket.isDepartmentTypeAvailable('dispatch') &&
            !await socket.isDepartmentTypeAvailable('fire')
        ) return

        let payload = data
        
        let validation = new Validator(payload, {
            'data.first': 'present|string|max:32',
            'data.last': 'present|string|max:32',
            'data.dob': 'present|string|max:16',
        });
          
        if(validation.fails()) {
            socket.emit('errorNotifyUnescaped', Object.values(validation.errors.all()).join('<br/>'))
            return
        }

        if(payload.data.first.length < 3 && payload.data.last.length < 3 && payload.data.dob.length < 3) {
            socket.emit('errorNotifyUnescaped', 'Одно из полей должно быть заполнено.')
            return
        }

        const conditions = [];

        const { first, last, dob } = payload.data;
        if(first) conditions.push({ name: { [Op.like]: `%${first}%` } })
        if(last) conditions.push({ surname: { [Op.like]: `%${last}%` } })
        if(dob) conditions.push({ dob })

        let characters = await db.cad.Character.findAll({
            where: {
                [Op.and]: conditions,
            }, limit: 10
        }) || []

        const vehicles = [];
        const weapons = [];

        for(let i = 0; i < characters.length; i += 1) {
            const lVehicles = await characters[i].getVehicles();
            const lWeapons = await characters[i].getWeapons();

            for(let j = 0; j < lVehicles.length; j += 1) {
                vehicles.push({ ...lVehicles[j].dataValues, charName: characters[i].dataValues.name, charSurname: characters[i].dataValues.surname })
            }

            for(let j = 0; j < lWeapons.length; j += 1) {
                weapons.push({ ...lWeapons[j].dataValues, charName: characters[i].dataValues.name, charSurname: characters[i].dataValues.surname })
            }
        }

        emitMessage('ncic/response', { characters, vehicles, weapons })
    }
}