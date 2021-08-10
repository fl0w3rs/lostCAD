module.exports = {
  message: 'identifiers:request',
  callback: async ({ socket }) => {
    if (!socket.isAuthenticated) return;

    if (
      !await socket.isDepartmentTypeAvailable('police')
      && !await socket.isDepartmentTypeAvailable('dispatch')
      && !await socket.isDepartmentTypeAvailable('fire')
    ) return;

    socket.updateIdentifiers();
  },
};
