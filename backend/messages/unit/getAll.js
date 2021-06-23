module.exports = {
    message: 'unit/getAll',
    callback: ({ socket, io }) => {
        socket.updateAllUnits();
        // io.updateAllUnits();
    },
}