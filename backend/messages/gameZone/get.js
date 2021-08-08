module.exports = {
  message: 'gameZone/get',
  callback: async ({ socket }) => {
    if (!socket.isAuthenticated) return;
    socket.updateGameZone();
  },
};
