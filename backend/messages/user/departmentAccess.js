module.exports = {
  message: 'user/getDepartmentAccess',
  callback: async ({ socket, emitResponse }) => {
    if (!socket.isAuthenticated) return;

    emitResponse({ list: await socket.getAvailableDepartments() });
  },
};
