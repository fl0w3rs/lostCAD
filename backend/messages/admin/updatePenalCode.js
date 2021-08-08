module.exports = {
  message: 'admin/penalCode/edit',
  callback: async ({
    socket, Validator, data, emitReturn, utils,
  }) => {
    if (!socket.isAuthenticated) return;

    const tmp = {};
    tmp.data = data;

    const validation = new Validator(tmp, {
      'data.*.article': 'required|string|min:1|max:10',
      'data.*.title': 'required|string|min:1|max:128',
      'data.*.chargeType': 'required|string|min:1|max:24',
      'data.*.punishmentType': 'required|string|min:1|max:24',
      'data.*.ticketAmount': 'present|numeric',
      'data.*.imprisonmentTime': 'present|string|max:16',
      'data.*.desc': 'present|string|max:1024',
    });

    if (validation.fails()) {
      socket.emit('errorNotifyUnescaped', Object.values(validation.errors.all()).join('<br/>'));
      emitReturn('error');
      return;
    }

    const jsonString = JSON.stringify(data);
    await utils.settings.set('penalCode', jsonString);

    emitReturn('success');
  },
};
