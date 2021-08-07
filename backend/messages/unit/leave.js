module.exports = {
    message: 'unit/leave',
    callback: async ({ socket, io, db }) => {
        const user = await socket.getUser();
        const unit = await user.getUnit();
        const unitId = unit.dataValues.id;
        user.unitId = null;
        await user.save();

        const members = await unit.getUsers();

        socket.unitId = undefined;

        const identifier = await db.cad.Identifier.findOne({ where: { id: user.dataValues.currentIdentifier } });
        if (identifier) {
            await io.sendLogMessageToUnit(unitId, `${identifier.dataValues.name} покинул(-а) юнит.`)
        }

        if (members.length === 0) {
            await io.sendLogMessageToUnit(unitId, `юнит расформирован из-за отсутствия участников.`)
            await unit.destroy();
        }

        await io.updateAllUnits();
    },
}