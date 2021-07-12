module.exports = {
  message: 'dispatch/switchPriority',
  callback: async ({ utils, socket, io }) => {
      if(!socket.isAuthenticated) return
      if(!await socket.isDepartmentTypeAvailable('dispatch')) return

      const state = await utils.settings.get('priority');
      
      const newstate = state == 0 ? 1 : 0;
      await utils.settings.set('priority', newstate)

      io.emit('updatePriority', newstate)
  }
}