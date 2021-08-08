module.exports = {
  message: 'user/getAvailableDepartments',
  callback: async ({ socket, emitReturn }) => {
    if (!socket.isAuthenticated) return;

    emitReturn({ list: await socket.getAvailableDepartments() });
  },
};
