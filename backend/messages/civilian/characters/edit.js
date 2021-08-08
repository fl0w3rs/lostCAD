module.exports = {
  message: 'user/civilian/characters/edit',
  callback: async ({
    socket, Validator, db, data, vtemplates, emitMessage,
  }) => {
    if (!socket.isAuthenticated) return;

    if (!await socket.isDepartmentTypeAvailable('civilian')) return;

    const validation = new Validator(data, {
      id: 'required|numeric',
      ...vtemplates.rules.character,
    });
    validation.setAttributeNames({
      ...vtemplates.names.character,
    });

    if (validation.fails()) {
      socket.emit('errorNotifyUnescaped', Object.values(validation.errors.all()).join('<br/>'));
      return;
    }

    const user = await socket.getForumUser();

    const character = await db.cad.Character.findOne({
      where: { id: data.id, userId: user.member_id },
    });
    if (!character) return;

    const {
      name, surname, sex, dob, placeOfWork, residenceAddress, blockNumber, height, weight,
      race, eyeColor, hairColor, bloodType, rhesusFactor, invalidity, chronicDiseases,
      description, image, gunLicense, hiddenGunLicense, driverLicense, pilotLicense, boatLicense,
      id,
    } = data;

    await db.cad.Character.update({
      name,
      surname,
      sex,
      dob,
      placeOfWork,
      residenceAddress,
      blockNumber,
      height,
      weight,
      race,
      eyeColor,
      hairColor,
      bloodType,
      rhesusFactor,
      invalidity,
      chronicDiseases,
      image,
      gunLicense,
      hiddenGunLicense,
      driverLicense,
      pilotLicense,
      boatLicense,
      description,
    }, {
      where: { id },
    });

    socket.sendAllCharacters(false);

    emitMessage('user/civilian/characters/editSuccess');
  },
};
