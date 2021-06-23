module.exports = {
    message: 'user/penalCode/get',
    callback: async ({ utils, socket, emitReturn, }) => {
        if(!socket.isAuthenticated) return

        const data = await utils.getPenalCode();

        emitReturn(data);
    },
}