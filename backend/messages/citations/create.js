module.exports = {
  message: 'citations:create',
  callback: async ({
    socket, data, db, emitReturn,
  }) => {
    if (!socket.isAuthenticated) return;

    if (
      !await socket.isDepartmentTypeAvailable('police')
      && !await socket.isDepartmentTypeAvailable('dispatch')
    ) return;

    if (!data?.characterId) return;
    if (!data?.reasons?.length) return;

    const character = await db.cad.Character.findOne({
      where: {
        id: data.characterId,
      },
    });
    if (!character) return;

    if (data?.data?.confiscation?.driverLicense) character.driverLicense = 'Отозвана';
    if (data?.data?.confiscation?.hiddenGunLicense) character.hiddenGunLicense = 'Отозвана';
    if (data?.data?.confiscation?.gunLicense) character.gunLicense = 'Отозвана';
    if (data?.data?.confiscation?.pilotLicense) character.pilotLicense = 'Отозвана';
    if (data?.data?.confiscation?.boatLicense) character.boatLicense = 'Отозвана';

    await character.save();

    const citation = await db.cad.Citation.create({
      characterId: data.characterId,
      reasons: data.reasons,
      data: data?.data || {},
    });

    await citation.save();

    emitReturn(true);
  },
};
