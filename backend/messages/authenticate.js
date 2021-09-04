module.exports = {
  desc: 'Авторизация',
  message: 'authenticate',
  callback: async ({
    socket, data, db, Validator, emitReturn,
  }) => {
    const validation = new Validator(data, {
      key: 'required|string|max:32|min:32',
    });

    if (validation.fails()) {
      return;
    }

    const session = await db.forum.core_members_known_devices.findOne({ attributes: ['member_id'], where: { login_key: data.key } });
    if (typeof session !== 'object') {
      emitReturn({ status: 'unauthenticated' });
      socket.disconnect();
      return;
    }

    const user = await db.forum.core_members.findOne({ attributes: ['member_id', 'member_group_id', 'name'], where: { member_id: session.dataValues.member_id } });
    if (typeof user !== 'object') {
      emitReturn({ status: 'unauthenticated' });
      socket.disconnect();
      return;
    }

    if (user.dataValues.member_group_id == 3) {
      emitReturn({ status: 'unauthenticated' });
      socket.disconnect();
      return;
    }

    socket.userId = user.dataValues.member_id;
    socket.isAuthenticated = true;

    const cadUser = await socket.getUser();
    socket.unitId = cadUser?.unit?.id || undefined;

    cadUser.lastLogin = Date.now();
    await cadUser.save();

    cadUser.addLog({ text: 'Успешная авторизация.', socket });

    emitReturn({
      status: 'authenticated',
      userdata: {
        name: user.name,
        isAdmin: await socket.isAdmin(),
        departments: await socket.areDepartmentTypesAvailable(['police', 'fire', 'dispatch', 'civilian']),
      },
    });
  },
};
