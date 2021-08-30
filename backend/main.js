/* eslint-disable import/extensions */
/* eslint-disable no-continue */
import 'validatorjs/dist/lang/ru.js';

import cookieParser from 'cookie-parser';
import express from 'express';
import * as Sequelize from 'sequelize';
import createCacheInstance from './helpers/cache.js';
import db from './db/index';
import vtemplates from './helpers/vtemplates.js';

// eslint-disable-next-line import/no-unresolved
import * as messages from './messages/**/*';

const Validator = require('validatorjs');

Validator.useLang('ru');

const adminGroups = [4];

const globalCache = createCacheInstance();

const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const http = require('http').Server(app);

app.use(cookieParser());

if (process.env.NODE_ENV == 'dev') {
  // app.use(createProxyMiddleware('/', { target: 'http://127.0.0.1:9110/', changeOrigin: true }));
  app.all(
    '/', createProxyMiddleware('/', { target: 'http://127.0.0.1:9110/', changeOrigin: true }),
  );
}

const io = require('socket.io')(http, {
  path: '/socket',
  serveClient: false,

  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,

  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.get('/api/getAuthKey', (req, res) => {
  res.append('Access-Control-Allow-Origin', req.get('origin'));
  res.json({ status: req.cookies.ips4_login_key ? 'success' : 'fail', auth_key: req.cookies.ips4_login_key });
});

app.get('/api/getUnitLoad', (req, res) => {
  res.append('Access-Control-Allow-Origin', req.get('origin'));
  res.json({ status: 'fail' });
});

// -+
Date.now = () => new Date().getTime() / 1000 | 0;

// eslint-disable-next-line no-extend-native
Array.prototype.intersects = function (arr) {
  if (!Array.isArray(arr)) return false;
  return this.filter((x) => arr.includes(x));
};
// -+

const utils = {
  async getAllDepartments() {
    const cached = globalCache.get('allDepartments');

    if (!cached) {
      const depts = await db.cad.Department.findAll();
      globalCache.set('allDepartments', depts, 60);
      return depts;
    }

    return cached;
  },
  async getBolos() {
    const bolos = await db.cad.Bolo.findAll();
    const bolosMapped = [];

    for (let i = 0; i < bolos.length; i += 1) {
      const bolo = utils.convertToPlainObject(bolos[i]);
      if (bolo.type == 'character' && bolo?.data?.characterId) {
        bolo.characterData = await db.cad.Character.findOne({
          where: { id: bolo?.data?.characterId },
        });
      } else if (bolo.type == 'vehicle' && bolo?.data?.vehicleId) {
        bolo.vehicleData = await db.cad.Vehicle.findOne({
          where: { id: bolo?.data?.vehicleId },
        });
      }
      bolosMapped.push(bolo);
    }

    return bolosMapped;
  },
  async getTenCodes() {
    const data = await this.settings.get('tenCodes');
    return data;
  },
  async getPenalCode() {
    const data = await this.settings.get('penalCode');
    return data;
  },
  async getCalls(archived = false) {
    const calls = await db.cad.Call.findAll({
      where: {
        archived,
      },
      include: db.cad.Unit,
    });

    return calls;
  },
  async getDispatcherList() {
    const list = await db.cad.User.findAll({
      where: { dispatchStatus: { [Sequelize.Op.not]: 'off' } },
      include: [{
        model: db.cad.Identifier,
        required: false,
        where: {
          id: {
            [Sequelize.Op.eq]: db.cad.sequelize.col('user.currentIdentifier'),
          },
        },
      }],
    });

    const forumIds = list.map((val) => val.fid);
    const forumUsers = await db.forum.core_members.findAll({
      where: { member_id: { [Sequelize.Op.or]: forumIds } },
    });

    const forumUsersMapped = {};
    for (let i = 0; i < forumUsers.length; i += 1) {
      forumUsersMapped[forumUsers[i].member_id] = utils.convertToPlainObject(forumUsers[i]);
    }

    const listMapped = {};
    for (let i = 0; i < list.length; i += 1) {
      const user = list[i];

      const listObject = {
        id: user.id,
        name: user?.identifiers[0]?.name || forumUsersMapped[user.fid]?.name || user.id,
        callsign: user?.identifiers[0]?.callsign || null,
      };

      if (!listMapped[user.dispatchStatus]) listMapped[user.dispatchStatus] = [];
      listMapped[user.dispatchStatus].push(listObject);
    }

    return listMapped;
  },
  async getAllUnits() {
    const units = utils.convertToPlainObject(
      await db.cad.Unit.findAll({
        include: [{
          model: db.cad.User,
          include: {
            model: db.cad.Identifier,
            where: {
              id: {
                [Sequelize.Op.eq]: db.cad.sequelize.col('users.currentIdentifier'),
              },
            },
          },
        }, {
          model: db.cad.Call,
        }],
      }),
    );

    for (let i = 0; i < units.length; i += 1) {
      units[i].members = [];
      for (let j = 0; j < units[i].users.length; j += 1) {
        units[i].members.push(units[i].users[j].identifiers[0]);
      }
      units[i].users = null;
    }

    return units;
  },
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };

    return text.replace(/[&<>"']/g, (m) => map[m]);
  },
  convertToPlainObject(obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  getTimeString: () => new Date().toLocaleTimeString('ru-RU', { timeZone: 'Europe/Moscow' }),
  settings: {
    async get(name) {
      const cacheVar = `setting_${name}`;

      const cached = globalCache.get(cacheVar);

      if (!cached) {
        const data = await db.cad.Setting.findOne({ where: { name } });
        globalCache.set(cacheVar, data.dataValues.value, 60);
        return data.dataValues.value;
      }

      return cached;
    },
    async set(name, value) {
      globalCache.clear(`setting_${name}`);

      await db.cad.Setting.update({ value }, { where: { name } });

      return true;
    },
  },
  clearCache(name) {
    globalCache.clear(name);
  },
};

const messageModules = [];
for (let i = 0; i < messages.default.length; i += 1) {
  messageModules.push(messages.default[i].default);
}

// db hooks
db.cad.User.addHook('afterUpdate', async (user) => {
  const sockets = await io.fetchSockets();

  sockets.forEach((sock) => {
    if (sock.userId == user.fid) {
      sock.cache.clear('cadUser');
    }
  });
});
// ===

io.updateAllUnits = async () => {
  const units = await utils.getAllUnits();

  io.emit('updateAllUnits', units);
};

io.updateActiveCalls = async () => {
  const calls = await utils.getCalls();

  io.emit('updateActiveCalls', calls);
};

io.sendDispatchLogMessage = async (message) => {
  const log = await utils.settings.get('dispatchLog');

  const newlog = `[color=#9e9e9e][${utils.getTimeString()}][/color] ${utils.escapeHtml(message)}[br]` + log;

  await utils.settings.set('dispatchLog', newlog);

  io.emit('updateDispatchLog', newlog);
};

io.sendLogMessageToUnit = async (id, message, { sendToDispatch = true } = {}) => {
  const unit = await db.cad.Unit.findOne({ where: { id } });
  if (!unit) return;

  unit.log = `[${utils.getTimeString()}] ${utils.escapeHtml(message)}\n` + unit.log;
  await unit.save();

  if (sendToDispatch) {
    await io.sendDispatchLogMessage(`[b]Юнит ${unit.callsign}[/b]: ${message}`);
  }

  io.updateAllUnits();

  (await io.fetchSockets()).forEach((sock) => {
    if (sock.unitId == id) {
      sock.emit('unitLogMessage', message);
    }
  });
};

io.on('connection', (socket) => {
  socket.isAuthenticated = false;

  setTimeout(() => {
    if (socket.isAuthenticated == false) socket.disconnect();
  }, 5000);

  socket.cache = createCacheInstance();

  socket.getForumUser = async () => {
    const cached = socket.cache.get('forumUser');

    if (!cached) {
      const data = await db.forum.core_members.findOne({ where: { member_id: socket.userId } });
      socket.cache.set('forumUser', data, 20);
      return data;
    }

    return cached;
  };

  socket.getUser = async ({ skipCache = false, clearCache = false } = {}) => {
    if (clearCache) socket.cache.clear('cadUser');
    const cached = socket.cache.get('cadUser');

    if (skipCache || !cached) {
      const data = await db.cad.User.findOne({
        where: { fid: socket.userId },
        include: [
          { model: db.cad.Unit },
        ],
      }) || await db.cad.User.create({ fid: socket.userId });
      socket.cache.set('cadUser', data, 20);
      return data;
    }

    return cached;
  };

  socket.getUnit = async () => {
    const user = await socket.getUser();
    return user?.unit;
  };

  socket.getCurrentIdentifier = async () => {
    const user = await socket.getUser();
    const identifier = await db.cad.Identifier.findOne({
      where: { id: user.currentIdentifier },
    });
    return identifier;
  };

  socket.getForumUserGroups = async () => {
    const cached = socket.cache.get('groups');

    if (!cached) {
      const user = await socket.getForumUser();

      let groups = [user.dataValues.member_group_id];
      groups = groups.concat(user.dataValues.mgroup_others.split(','));

      for (let i = 0; i < groups.length; i += 1) {
        if (groups[i] == '') groups.splice(i, 1);
        groups[i] = parseInt(groups[i], 10);
      }

      socket.cache.set('groups', groups, 20);
      return groups;
    }

    return cached;
  };

  socket.getAllCharacters = async () => {
    const cached = socket.cache.get('characters');

    if (!cached) {
      const user = await socket.getUser();
      const data = await user.getCharacters();
      socket.cache.set('cadUser', data, 20);
      return data;
    }

    return cached;
  };

  socket.getDisplayName = async ({ unitPrefix = false, dispatchPrefix = false } = {}) => {
    const identifier = await socket.getCurrentIdentifier();
    const forumUser = await socket.getForumUser();

    let name = `${identifier?.name || forumUser?.name}`;

    if (unitPrefix) {
      const unit = await socket.getUnit();
      if (unit) {
        name += ` [${unit?.callsign}]`;
      }
    }

    if (dispatchPrefix) {
      name += ' [ДИСПЕТЧЕР]';
    }

    return name;
  };

  socket.getAvailableDepartments = async () => {
    const cached = socket.cache.get('availableDepartments');

    if (!cached) {
      const userGroups = await socket.getForumUserGroups();

      const allDepartments = await utils.getAllDepartments();
      const availabeDepartments = [];

      const isAdmin = await socket.isAdmin();

      for (let i = 0; i < allDepartments.length; i += 1) {
        if (isAdmin) {
          availabeDepartments.push(allDepartments[i].dataValues);
          continue;
        }

        const groups = allDepartments[i].dataValues.groups.split(',').map(Number);

        if (userGroups.intersects(groups).length > 0) {
          availabeDepartments.push(allDepartments[i].dataValues);
        }
      }

      socket.cache.set('availableDepartments', availabeDepartments, 20);
      return availabeDepartments;
    }

    return cached;
  };

  socket.isDepartmentTypeAvailable = async (type) => {
    const availableDepartments = await socket.getAvailableDepartments();
    for (let i = 0; i < availableDepartments.length; i += 1) {
      if (availableDepartments[i].type == type) return true;
    }

    return false;
  };

  socket.areDepartmentTypesAvailable = async (types) => {
    const availTypes = {};
    for (let i = 0; i < types.length; i += 1) {
      availTypes[types[i]] = await socket.isDepartmentTypeAvailable(types[i]);
    }
    return availTypes;
  };

  socket.isAdmin = async () => {
    const groups = await socket.getForumUserGroups();
    return groups.intersects(adminGroups).length > 0;
  };

  socket.sendAllCharacters = async (cached = true) => {
    if (!cached) socket.cache.clear('characters');

    const chars = await socket.getAllCharacters();
    socket.emit('updateCharacters', chars);
  };

  socket.updateIdentifiers = async () => {
    const identifiers = await db.cad.Identifier.findAll({
      where: {
        userId: socket.userId,
      },
      limit: 10,
    }) || [];

    socket.emit('updateIdentifiers', { list: identifiers });
  };

  socket.updateVehicles = async () => {
    const vehicles = await db.cad.Vehicle.findAll({
      where: {
        userId: socket.userId,
      },
    });

    socket.emit('updateVehicles', vehicles);
  };

  socket.updateWeapons = async () => {
    const weapons = await db.cad.Weapon.findAll({
      where: {
        userId: socket.userId,
      },
    });

    socket.emit('updateWeapons', weapons);
  };

  socket.updateGameZone = async () => {
    const gz = await utils.settings.get('gamezone');
    socket.emit('gameZone:update', gz);
  };

  socket.updateAllUnits = async () => {
    const units = await utils.getAllUnits();
    socket.emit('updateAllUnits', units);
  };

  for (let i = 0; i < messageModules.length; i += 1) {
    socket.on(messageModules[i].message, (data) => {
      const ctx = {
        db,
        socket,
        Validator,
        io,
        utils,
        vtemplates,
        emitMessage: (evt, payload = {}) => {
          socket.emit(evt, { wrapperId: data?.wrapperId || -1, data: payload });
        },
        emitReturn: (payload = {}) => {
          socket.emit(`return_${data?.requestId}`, { wrapperId: data?.wrapperId || -1, data: payload });
        },
      };

      ctx.data = data?.wrapperId ? data.payload : data;

      messageModules[i].callback(ctx);
    });
  }
});

http.listen(9669);
