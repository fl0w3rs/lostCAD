const { Op } = require('sequelize');

module.exports = {
  message: 'lookup:ncic',
  callback: async ({
    socket, Validator, data, db, emitReturn, utils,
  }) => {
    if (!socket.isAuthenticated) return;

    if (
      !await socket.isDepartmentTypeAvailable('police')
      && !await socket.isDepartmentTypeAvailable('dispatch')
      && !await socket.isDepartmentTypeAvailable('fire')
    ) return;

    const payload = data;

    const validation = new Validator(payload, {
      'data.first': 'present|string|max:32',
      'data.last': 'present|string|max:32',
      'data.dob': 'present|string|max:16',
    });

    if (validation.fails()) {
      socket.emit('errorNotifyUnescaped', Object.values(validation.errors.all()).join('<br/>'));
      return;
    }

    if (payload.data.first.length < 3
      && payload.data.last.length < 3
      && payload.data.dob.length < 3) {
      socket.emit('errorNotifyUnescaped', 'Одно из полей должно быть заполнено.');
      return;
    }

    const conditions = [];

    const { first, last, dob } = payload.data;
    if (first) conditions.push({ name: { [Op.like]: `%${first}%` } });
    if (last) conditions.push({ surname: { [Op.like]: `%${last}%` } });
    if (dob) conditions.push({ dob });

    const characters = await db.cad.Character.findAll({
      where: {
        [Op.and]: conditions,
      },
      limit: 10,
      include: [
        {
          model: db.cad.Vehicle,
        },
        {
          model: db.cad.Weapon,
        },
        {
          model: db.cad.Arrest,
        },
        {
          model: db.cad.Citation,
        },
      ],
    }) || [];
    const characterIds = characters.map((val) => val.id);

    const vehicles = [];
    const weapons = [];
    const citations = [];
    const arrests = [];

    const bolos = await db.cad.Bolo.findAll({ where: { type: 'character', 'data.characterId': { [Op.in]: characterIds } } });
    const boloMappedCharacterIds = bolos.map((val) => parseInt(val.data.characterId, 10));

    for (let i = 0; i < characters.length; i += 1) {
      const lVehicles = characters[i].vehicles;
      const lWeapons = characters[i].weapons;
      const lCitations = characters[i].citations;
      const lArrests = characters[i].arrests;

      characters[i] = utils.convertToPlainObject(characters[i]);

      characters[i].bolo = boloMappedCharacterIds.includes(characters[i].id);

      for (let j = 0; j < lVehicles.length; j += 1) {
        vehicles.push({
          ...lVehicles[j].dataValues,
          charName: characters[i].name,
          charSurname: characters[i].surname,
        });
      }

      for (let j = 0; j < lWeapons.length; j += 1) {
        weapons.push({
          ...lWeapons[j].dataValues,
          charName: characters[i].name,
          charSurname: characters[i].surname,
        });
      }

      for (let j = 0; j < lCitations.length; j += 1) {
        citations.push({
          ...lCitations[j].dataValues,
          character: characters[i],
        });
      }

      for (let j = 0; j < lArrests.length; j += 1) {
        arrests.push({
          ...lArrests[j].dataValues,
          character: characters[i],
        });
      }
    }

    emitReturn({
      characters, vehicles, weapons, arrests, citations,
    });
  },
};
