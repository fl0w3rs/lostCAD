module.exports = {
  message: 'characters:getAll',
  callback: async ({ socket }) => {
    if (!socket.isAuthenticated) return;

    if (!await socket.isDepartmentTypeAvailable('civilian')) return;

    socket.sendAllCharacters();
  },
};
