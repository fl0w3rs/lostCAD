module.exports = {
  message: 'bolos:get',
  callback: async ({ utils, socket }) => {
    if (!socket.isAuthenticated) return;

    if (
      !await socket.isDepartmentTypeAvailable('police')
      && !await socket.isDepartmentTypeAvailable('dispatch')
      && !await socket.isDepartmentTypeAvailable('fire')
    ) return;

    const bolos = await utils.getBolos();

    socket.emit('bolos:update', bolos);
  },
};
