module.exports = {
  message: 'doPriority',
  callback: async ({ socket, io }) => {
    if (!socket.isAuthenticated) return;

    if (
      !await socket.isDepartmentTypeAvailable('police')
      && !await socket.isDepartmentTypeAvailable('dispatch')
      && !await socket.isDepartmentTypeAvailable('fire')
    ) return;

    io.sendDispatchLogMessage(`[b]${await socket.getDisplayName()}[/b]: нажат приоритет.`);

    io.emit('doPriority', []);
  },
};
