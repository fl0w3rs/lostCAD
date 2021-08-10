module.exports = {
  message: 'characters:weapons:get',
  callback: async ({ socket }) => {
    if (!socket.isAuthenticated) return;

    if (!await socket.isDepartmentTypeAvailable('civilian')) return;

    socket.updateWeapons();
  },
};
