module.exports = {
  message: 'units:getAll',
  callback: ({ socket }) => {
    socket.updateAllUnits();
    // io.updateAllUnits();
  },
};
