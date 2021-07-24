const adminGroups = [4]

const vtemplates = require('./vtemplates.js');
const db = require('./db.js');
const createCacheInstance = require('./cache.js');
const globalCache = createCacheInstance();

let Validator = require('validatorjs');
Validator.useLang('ru');

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
var cookieParser = require('cookie-parser')

const app = express();
const http = require('http').Server(app);
app.use(cookieParser());

if (process.env.NODE_ENV == 'dev') {
    // app.use(createProxyMiddleware('/', { target: 'http://127.0.0.1:9110/', changeOrigin: true }));
    app.all(
        '/', createProxyMiddleware('/', { target: 'http://127.0.0.1:9110/', changeOrigin: true })
    );
}

const io = require('socket.io')(http, {
    path: '/socket',
    serveClient: false,

    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false,

    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.get('/api/getAuthKey', (req, res) => {
    res.append('Access-Control-Allow-Origin', req.get('origin'))
    res.json({ status: req.cookies['ips4_login_key'] ? 'success' : 'fail', auth_key: req.cookies['ips4_login_key'] });
})

// -+
Date.now = function () { return new Date().getTime() / 1000 | 0; }

Array.prototype.intersects = function (arr) {
    if (!Array.isArray(arr)) return false;
    return this.filter(x => arr.includes(x));
}
// -+

const utils = {
    getAllDepartments: async function () {
        const cached = globalCache.get('allDepartments')

        if (!cached) {
            const depts = await db.cad.Department.findAll();
            globalCache.set('allDepartments', depts, 60);
            return depts;
        }

        return cached;
    },
    getTenCodes: async function () {
        const data = await this.settings.get('tenCodes');
        return data;
    },
    getPenalCode: async function () {
        const data = await this.settings.get('penalCode');
        return data;
    },
    getAllUnits: async function () {
        const units = await db.cad.Unit.findAll();
        for (let i = 0; i < units.length; i += 1) {
            const members = await units[i].getUsers();
            units[i] = units[i].dataValues;
            units[i].members = members;
            for (let j = 0; j < units[i].members.length; j += 1) {
                units[i].members[j] = (await db.cad.Identifier.findOne({ where: { id: units[i].members[j].dataValues.currentIdentifier } }))?.dataValues || undefined;
            }
        }
        return units;
    },
    settings: {
        get: async function (name) {
            const cacheVar = 'setting_' + name;

            const cached = globalCache.get(cacheVar);

            if (!cached) {
                const data = await db.cad.Setting.findOne({ where: { name } });
                globalCache.set(cacheVar, data.dataValues.value, 60);
                return data.dataValues.value;
            }

            return cached;
        },
        set: async function (name, value) {
            globalCache.clear('setting_' + name);

            await db.cad.Setting.update({ value }, { where: { name } })

            return true;
        },
    },
    clearCache(name) {
        globalCache.clear(name);
    }
}

import * as messages from './messages/**/*';
let messageModules = [];
for (let i = 0; i < messages.default.length; i += 1) {
    messageModules.push(messages.default[i].default);
}

io.updateAllUnits = async () => {
    const units = await utils.getAllUnits();

    io.emit('updateAllUnits', units);
};

io.sendDispatchLogMessage = async (message) => {
    const log = await utils.settings.get('dispatchLog');

    const time = new Date().toLocaleTimeString('ru-RU', { timeZone: 'Europe/Moscow' });

    const newlog = `[${time}] ${message}\n${log}`;

    await utils.settings.set('dispatchLog', newlog)

    io.emit('updateDispatchLog', newlog)
}

io.sendLogMessageToUnit = async (id, message, { sendToDispatch = true } = {}) => {
    const unit = await db.cad.Unit.findOne({ where: { id } })
    if (!unit) return;

    const time = new Date().toLocaleTimeString('ru-RU', { timeZone: 'Europe/Moscow' });

    unit.log = `[${time}] ${message}\n${unit.dataValues.log}`;
    await unit.save();

    if (sendToDispatch) {
        io.sendDispatchLogMessage(`UNIT ${unit.dataValues.callsign}: ${message}`)
    }

    io.updateAllUnits();

    (await io.fetchSockets()).forEach((sock) => {
        if (sock.unitId == id) {
            sock.emit('unitLogMessage', message)
        }
    });
}

io.on('connection', (socket) => {
    socket.isAuthenticated = false

    setTimeout(() => {
        if (socket.isAuthenticated == false) socket.disconnect()
    }, 5000);

    socket.cache = createCacheInstance();

    socket.getForumUser = async () => {
        const cached = socket.cache.get('forumUser')

        if (!cached) {
            const data = await db.forum.core_members.findOne({ where: { member_id: socket.userId } });
            socket.cache.set('forumUser', data, 20);
            return data;
        }

        return cached;
    }

    socket.getUser = async () => {
        const cached = socket.cache.get('cadUser')

        if (!cached) {
            const data = await db.cad.User.findOne({ where: { fid: socket.userId } }) || await db.cad.User.create({ fid: socket.userId });
            socket.cache.set('cadUser', data, 20);
            return data;
        }

        return cached;
    }

    socket.getForumUserGroups = async () => {
        const cached = socket.cache.get('groups')

        if (!cached) {
            const user = await socket.getForumUser()

            let groups = [user.dataValues.member_group_id]
            groups = groups.concat(user.dataValues.mgroup_others.split(','))

            for (let i = 0; i < groups.length; i += 1) {
                if (groups[i] == '') groups.splice(i, 1)
                groups[i] = parseInt(groups[i])
            }

            socket.cache.set('groups', groups, 20);
            return groups;
        }

        return cached;
    }

    socket.getAllCharacters = async () => {
        const cached = socket.cache.get('characters')

        if (!cached) {
            const user = await socket.getUser();
            const data = await user.getCharacters();
            socket.cache.set('cadUser', data, 20);
            return data;
        }

        return cached;

    }

    socket.getAvailableDepartments = async () => {
        const cached = socket.cache.get('availableDepartments')

        if (!cached) {
            let userGroups = await socket.getForumUserGroups();

            let allDepartments = await utils.getAllDepartments()
            let availabeDepartments = []

            let isAdmin = await socket.isAdmin()

            for (let i = 0; i < allDepartments.length; i += 1) {
                if (isAdmin) {
                    availabeDepartments.push(allDepartments[i].dataValues);
                    continue;
                }

                let groups = allDepartments[i].dataValues.groups.split(',').map(Number)

                if (userGroups.intersects(groups).length > 0) availabeDepartments.push(allDepartments[i].dataValues)

            }

            socket.cache.set('availableDepartments', availabeDepartments, 20);
            return availabeDepartments;
        }

        return cached;
    }

    socket.isDepartmentTypeAvailable = async (type) => {
        let availableDepartments = await socket.getAvailableDepartments();
        for (let i = 0; i < availableDepartments.length; i += 1) {
            if (availableDepartments[i].type == type) return true;
        }

        return false;
    }

    socket.areDepartmentTypesAvailable = async (types) => {
        let availTypes = {}
        for (let i = 0; i < types.length; i += 1) {
            availTypes[types[i]] = await socket.isDepartmentTypeAvailable(types[i]);
        }
        return availTypes;
    }

    socket.isAdmin = async () => {
        let groups = await socket.getForumUserGroups();
        return groups.intersects(adminGroups).length > 0
    }

    socket.sendAllCharacters = async (cached = true) => {
        if (!cached) socket.cache.clear('characters')

        let chars = await socket.getAllCharacters()
        socket.emit('updateCharacters', chars)
    }

    socket.updateIdentifiers = async () => {
        let identifiers = await db.cad.Identifier.findAll({
            where: {
                userId: socket.userId
            }, limit: 10
        }) || []

        socket.emit('updateIdentifiers', { list: identifiers })
    }

    socket.updateVehicles = async () => {
        let vehicles = await db.cad.Vehicle.findAll({
            where: {
                userId: socket.userId,
            }
        })

        socket.emit('updateVehicles', vehicles);
    }

    socket.updateWeapons = async () => {
        let weapons = await db.cad.Weapon.findAll({
            where: {
                userId: socket.userId,
            }
        })

        socket.emit('updateWeapons', weapons);
    }

    socket.updateGameZone = async () => {
        const gz = await utils.settings.get('gamezone');
        socket.emit('gameZoneUpdate', gz);
    }

    socket.updateAllUnits = async () => {
        const units = await utils.getAllUnits();
        socket.emit('updateAllUnits', units);
    }

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
                    socket.emit(evt, { wrapperId: data?.wrapperId || -1, data: payload })
                },
                emitReturn: (payload = {}) => {
                    socket.emit('return_' + data?.requestId, { wrapperId: data?.wrapperId || -1, data: payload })
                }
            }

            ctx.data = data?.wrapperId ? data.payload : data;

            messageModules[i].callback(ctx)
        })
    }
});

http.listen(9669);