module.exports = {
  message: 'getPriority',
  callback: async ({ utils, socket }) => {
      if(!socket.isAuthenticated) return

      const state = await utils.settings.get('priority');

      socket.emit('updatePriority', state)
  }
}