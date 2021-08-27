module.exports = {
  message: 'calls:create',
  callback: async ({
    data, socket, Validator, vtemplates, emitReturn, db, io,
  }) => {
    if (!socket.isAuthenticated) return;

    if (!data?.dispatcher) { // ! CIVILIAN
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
    } else { // ! DISPATCH
      if (!await socket.isDepartmentTypeAvailable('dispatch')) return;

      const validation = new Validator(data?.callData, {
        caller: vtemplates.rules.call.caller,
        location: vtemplates.rules.call.location,
        blockNumber: vtemplates.rules.call.block,
        description: vtemplates.rules.call.description,

        status: vtemplates.rules.call.status,
        priority: vtemplates.rules.call.priority,
        type: vtemplates.rules.call.type,
      });

      validation.setAttributeNames({
        caller: vtemplates.names.call.caller,
        location: vtemplates.names.call.location,
        blockNumber: vtemplates.names.call.block,
        description: vtemplates.names.call.description,

        status: vtemplates.names.call.status,
        priority: vtemplates.names.call.priority,
        type: vtemplates.names.call.type,
      });

      if (validation.fails()) {
        socket.emit('errorNotifyUnescaped', Object.values(validation.errors.all()).join('<br/>'));
        emitReturn('error');
        return;
      }

      const {
        caller, location, blockNumber, description, status, priority, type,
      } = data.callData;

      const call = await db.cad.Call.create({
        caller, location, blockNumber, description, status, priority, type,
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
    }
  },
};
