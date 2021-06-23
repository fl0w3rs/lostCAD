module.exports = {
    message: 'user/tenCodes/get',
    callback: async ({ utils, socket, emitReturn, }) => {
        if(!socket.isAuthenticated) return

        const data = await utils.getTenCodes();

        emitReturn(data);
    },
}