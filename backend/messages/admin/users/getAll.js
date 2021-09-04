import { Op } from 'sequelize';

module.exports = {
  message: 'admin:users:getAll',
  callback: async ({
    socket, db, utils, emitReturn,
  }) => {
    if (!socket.isAuthenticated) return;
    if (!(await socket.isAdmin())) return;

    const users = utils.convertToPlainObject(await db.cad.User.findAll());

    const userForumIds = users.map((val) => val.fid);
    const forumUsers = await db.forum.core_members.findAll({
      where: {
        member_id: {
          [Op.in]: userForumIds,
        },
      },
    });

    const forumUsersObject = {};

    for (let i = 0; i < forumUsers.length; i += 1) {
      forumUsersObject[forumUsers[i].member_id] = forumUsers[i];
    }

    for (let i = 0; i < users.length; i += 1) {
      users[i].name = forumUsersObject[users[i].fid]?.name || 'Не найдено';
    }

    emitReturn(users);
  },
};
