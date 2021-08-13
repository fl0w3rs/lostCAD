module.exports = {
  message: 'calls:getActive',
  callback: async ({ utils, socket }) => {
    const calls = await utils.getCalls();

    socket.emit('updateActiveCalls', calls);
  },
};
