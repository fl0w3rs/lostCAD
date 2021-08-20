module.exports = {
  message: 'calls:addNote',
  callback: async ({
    utils, socket, data, db, io,
  }) => {
    if (!socket.isAuthenticated) return;

    if (!data?.callId || !data?.text) return;

    const call = await db.cad.Call.findOne({ where: { id: data?.callId } });
    if (!call) return;

    if (!call.notes) call.notes = '';
    call.notes = `[color=#9e9e9e][${utils.getTimeString()}][/color] [b]${utils.escapeHtml(await socket.getDisplayName({ dispatchPrefix: !!data?.dispatcher, unitPrefix: !data?.dispatcher }))}[/b]: ${utils.escapeHtml(data?.text)}[br]` + call.notes;

    await call.save();

    const calls = await utils.getCalls();
    io.emit('updateActiveCalls', calls);
  },
};
