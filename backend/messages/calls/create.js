module.exports = {
  message: 'calls:create',
  callback: async ({
    data, socket, Validator, vtemplates, emitReturn, db, io,
  }) => {
    if (!socket.isAuthenticated) return;

    if (data?.type === 'civilian') { // ! CIVILIAN
      if (!await socket.isDepartmentTypeAvailable('civilian')) return;

      const validation = new Validator(data?.callData, {
        caller: vtemplates.rules.call.caller,
        location: vtemplates.rules.call.location,
        block: vtemplates.rules.call.block,
        description: vtemplates.rules.call.description,
      });

      validation.setAttributeNames({
        caller: vtemplates.names.call.caller,
        location: vtemplates.names.call.location,
        block: vtemplates.names.call.block,
        description: vtemplates.names.call.description,
      });

      if (validation.fails()) {
        socket.emit('errorNotifyUnescaped', Object.values(validation.errors.all()).join('<br/>'));
        emitReturn('error');
        return;
      }

      const {
        caller, location, block, description,
      } = data.callData;

      const call = await db.cad.Call.create({
        caller, location, blockNumber: block, description,
      });

      if (call) {
        socket.emit('successNotify', 'Вызов успешно создан.');
        emitReturn('success');

        io.emit('calls:sound:new');
        io.updateActiveCalls();
      } else {
        socket.emit('errorNotify', 'Произошла непредвиденная ошибка при создании вызова.');
        emitReturn('error');
      }
    } else if (data?.type === 'dispatch') { // ! DISPATCH
      if (!await socket.isDepartmentTypeAvailable('dispatch')) return;
      console.log('lol');
    }
  },
};
