module.exports = {
  message: 'units:switchPanic',
  callback: async ({
    socket, io, data, db, utils,
  }) => {
    if (!socket.isAuthenticated) return;

    const addSignals = async () => {
      const signal = (await utils.settings.get('signal')).split(', ').filter((o) => o);
      signal.push(99, 100);

      const signalWithoutDuplicates = [...new Set(signal)];
      const newSignal = signalWithoutDuplicates.join(', ');

      await utils.settings.set('signal', newSignal);
      io.emit('updateSignal', newSignal);
    };

    if (data?.dispatch) {
      if (
        !await socket.isDepartmentTypeAvailable('dispatch')
      ) return;

      const unit = await db.cad.Unit.findOne({ where: { id: data?.unitId } });
      if (!unit) return;

      unit.panic = !unit.dataValues.panic;
      await unit.save();

      if (unit.panic) {
        addSignals();

        io.emit('panic:sound');
      }
    } else {
      if (
        !await socket.isDepartmentTypeAvailable('police')
        && !await socket.isDepartmentTypeAvailable('fire')
      ) return;

      const unit = await socket.getUnit();
      if (!unit) return;

      unit.panic = !unit.panic;
      await unit.save();

      if (unit.panic) {
        addSignals();
        io.emit('panic:sound');
      }

      io.sendDispatchLogMessage(`[b]Юнит ${unit.callsign}[/b]: ${unit.panic ? 'включена' : 'выключена'} кнопка паники.`);
    }

    io.updateAllUnits();
  },
};
