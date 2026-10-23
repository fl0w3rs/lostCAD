module.exports = {
  message: 'admin/tenCodes/edit',
  callback: async ({
    socket, Validator, data, emitReturn, utils,
  }) => {
    if (!socket.isAuthenticated) return;
    if (!(await socket.isAdmin())) return;

    const tmp = {};
    tmp.data = data;

    const validation = new Validator(tmp, {
      'data.*.code': 'required|string|min:1|max:16',
      'data.*.desc': 'required|string|min:1|max:256',
    });

    if (validation.fails()) {
      socket.emit('errorNotifyUnescaped', Object.values(validation.errors.all()).join('<br/>'));
      emitReturn('error');
      return;
    }

    const jsonString = JSON.stringify(data);
    await utils.settings.set('tenCodes', jsonString);

    emitReturn('success');
  },
};
