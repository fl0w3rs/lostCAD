module.exports = {
  message: 'unit/getAll',
  callback: ({ socket }) => {
    socket.updateAllUnits();
    // io.updateAllUnits();
  },
};
