const departments = {
  null: 'лобби',
  police: 'панель полицейского',
  dispatch: 'панель диспетчера',
  civilian: 'панель гражданского',
  fire: 'панель спасателя',
  admin: 'панель администратора',
};

module.exports = {
  message: 'user:selectDepartment',
  callback: async ({ socket, data }) => {
    if (!socket.isAuthenticated) return;

    const user = await socket.getUser();

    user.addLog({ socket, text: `Переход в ${departments[data] || 'ERROR'}.` });
  },
};
