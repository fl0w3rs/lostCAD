module.exports = {
  message: 'user/civilian/characters/get',
  callback: async ({ socket }) => {
    if (!socket.isAuthenticated) return;

    if (!await socket.isDepartmentTypeAvailable('civilian')) return;

    socket.sendAllCharacters();
  },
};
