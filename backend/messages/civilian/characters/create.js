module.exports = {
  message: 'characters:create',
  callback: async ({
    socket, Validator, db, data, vtemplates, emitMessage,
  }) => {
    if (!socket.isAuthenticated) return;

    if (!await socket.isDepartmentTypeAvailable('civilian')) return;

    const validation = new Validator(data, {
      ...vtemplates.rules.character,
    });

    validation.setAttributeNames({
      ...vtemplates.names.character,
    });

    if (validation.fails()) {
      socket.emit('errorNotifyUnescaped', Object.values(validation.errors.all()).join('<br/>'));
      return;
    }

    const {
      name, surname, sex, dob, placeOfWork, residenceAddress, blockNumber, height, weight,
      race, eyeColor, hairColor, bloodType, rhesusFactor, invalidity, chronicDiseases,
      description, image, gunLicense, hiddenGunLicense, driverLicense, pilotLicense, boatLicense,
    } = data;

    await db.cad.Character.create({
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
      userId: socket.userId,
    });

    socket.sendAllCharacters(false);

    emitMessage('characters:createSuccess');
  },
};
