module.exports = {
  message: 'tenCodes:get',
  callback: async ({ utils, socket, emitReturn }) => {
    if (!socket.isAuthenticated) return;

    const data = await utils.getTenCodes();

    emitReturn(data);
  },
};
