import config from '../config.js';

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  config.db.cad.database,
  config.db.cad.username,
  config.db.cad.password,
  {
    host: config.db.cad.host,
    dialect: 'mysql',
    define: {
      timestamps: false,
    },
  },
);

const User = sequelize.define('user',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fid: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    currentIdentifier: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dispatchStatus: {
      type: DataTypes.STRING,
      defaultValue: 'off',
    },
    lastLogin: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: 'users',
  });

const Department = sequelize.define('department',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING(64),
    type: DataTypes.STRING(16),
    groups: DataTypes.STRING(256),
    divisions: DataTypes.TEXT,
    ranks: DataTypes.TEXT,
  },
  {
    tableName: 'departments',
  });

const Character = sequelize.define('character',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING(24),
    surname: DataTypes.STRING(24),
    sex: DataTypes.STRING(8),
    dob: DataTypes.STRING(16),
    description: DataTypes.STRING(24),
    placeOfWork: DataTypes.STRING(64),
    residenceAddress: DataTypes.STRING(64),
    blockNumber: DataTypes.INTEGER,
    height: DataTypes.STRING(16),
    weight: DataTypes.STRING(16),
    race: DataTypes.STRING(16),
    eyeColor: DataTypes.STRING(16),
    hairColor: DataTypes.STRING(16),
    bloodType: DataTypes.STRING(8),
    rhesusFactor: DataTypes.STRING(16),
    invalidity: DataTypes.STRING(16),
    chronicDiseases: DataTypes.STRING(64),

    gunLicense: DataTypes.STRING(16),
    hiddenGunLicense: DataTypes.STRING(16),
    driverLicense: DataTypes.STRING(16),
    pilotLicense: DataTypes.STRING(16),
    boatLicense: DataTypes.STRING(16),

    image: DataTypes.STRING(128),
  },
  {
    tableName: 'characters',
  });

const Identifier = sequelize.define('identifier',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    callsign: DataTypes.STRING(48),
    name: DataTypes.STRING(64),
    rank: DataTypes.STRING(48),
    department: DataTypes.STRING(64),
    division: DataTypes.STRING(64),
  },
  {
    tableName: 'identifiers',
  });

const Vehicle = sequelize.define('vehicle',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    mark: DataTypes.STRING(48),
    model: DataTypes.STRING(48),
    numberplate: {
      type: DataTypes.STRING(16),
      unique: true,
    },
    vin: {
      type: DataTypes.STRING(18),
      unique: true,
    },
    dor: DataTypes.STRING(16),
    regStatus: DataTypes.STRING(16),
    insStatus: DataTypes.STRING(16),
    color: DataTypes.STRING(24),
    type: DataTypes.STRING(24),
  },
  {
    tableName: 'vehicles',
  });

const Weapon = sequelize.define('weapon',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    regStatus: DataTypes.STRING(16),
    model: DataTypes.STRING(48),
    serial: {
      type: DataTypes.STRING(16),
      unique: true,
    },
  },
  {
    tableName: 'weapons',
  });

const Unit = sequelize.define('unit',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: DataTypes.STRING(16),
    callsign: DataTypes.STRING(32),
    panic: DataTypes.BOOLEAN,
    log: DataTypes.TEXT,
  },
  {
    tableName: 'units',
  });

const Setting = sequelize.define('setting',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(32),
      unique: true,
    },
    value: DataTypes.TEXT('medium'),
  },
  {
    tableName: 'settings',
  });

const Call = sequelize.define('call',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.STRING(64),
      defaultValue: 'processing',
    },
    type: {
      type: DataTypes.STRING(96),
      defaultValue: 'Не определён',
    },
    priority: {
      type: DataTypes.STRING(64),
      defaultValue: 'Не установлен',
    },
    archived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isVoice: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    notes: DataTypes.TEXT,
    log: DataTypes.TEXT,
    caller: DataTypes.STRING(64),
    location: DataTypes.STRING(64),
    blockNumber: DataTypes.INTEGER,
    description: DataTypes.TEXT,

  },
  {
    tableName: 'calls',
  });

const getTimeString = () => new Date().toLocaleTimeString('ru-RU', { timeZone: 'Europe/Moscow' });

Call.prototype.addLog = async function ({ text }) {
  this.log = `[color=#9e9e9e][${getTimeString()}][/color] ${text}[br] ${this.log || ''}`;
};

const Bolo = sequelize.define('bolo',
  {
    type: DataTypes.STRING(64),
    data: DataTypes.JSON,
    priority: DataTypes.STRING(64),
    reasons: DataTypes.JSON,
  },
  {
    tableName: 'bolos',
  });

const Citation = sequelize.define('citation',
  {
    data: DataTypes.JSON,
    reasons: DataTypes.JSON,
  },
  {
    tableName: 'citations',
  });

const Arrest = sequelize.define('arrest',
  {
    data: DataTypes.JSON,
    reasons: DataTypes.JSON,
  },
  {
    tableName: 'arrests',
  });

const VehicleImpoundment = sequelize.define('vehicleImpoundment',
  {
    data: DataTypes.JSON,
  },
  {
    tableName: 'vehicleImpoundments',
  });

const Log = sequelize.define('log',
  {
    text: DataTypes.STRING(256),
    additional: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
  },
  { tableName: 'logs' });

User.prototype.addLog = function ({ text, data, socket }) {
  this.createLog({
    text: text || '',
    additional: {
      data: data || {},
      ip: socket?.getIp() || 'Не определён',
      time: Date.now(),
    },
  });
};

// unit

Unit.hasMany(User);
User.belongsTo(Unit);

// vehicle

User.hasMany(Vehicle, { sourceKey: 'fid' });
Vehicle.belongsTo(User);

Character.hasMany(Vehicle);
Vehicle.belongsTo(Character);

// weapon

User.hasMany(Weapon, { sourceKey: 'fid' });
Weapon.belongsTo(User);

Character.hasMany(Weapon);
Weapon.belongsTo(Character);

// identifier

User.hasMany(Identifier, { sourceKey: 'fid' });
Identifier.belongsTo(User);

// char

User.hasMany(Character, { sourceKey: 'fid' });
Character.belongsTo(User);

// call

Call.hasMany(Unit);
Unit.belongsTo(Call);

// citation n arr

Character.hasMany(Citation);
Citation.belongsTo(Character);

Character.hasMany(Arrest);
Arrest.belongsTo(Character);

Vehicle.hasMany(VehicleImpoundment);
VehicleImpoundment.belongsTo(Vehicle);

// logs

User.hasMany(Log);
Log.belongsTo(User);

// Setting.sync({ alter: true });
// Citation.sync({ alter: true });
// Arrest.sync({ alter: true });
// VehicleImpoundment.sync({ alter: true });
// Call.sync({ alter: true });
// User.sync({ alter: true });
// Log.sync({ alter: true });

exports.sequelize = sequelize;
exports.User = User;
exports.Department = Department;
exports.Character = Character;
exports.Identifier = Identifier;
exports.Vehicle = Vehicle;
exports.Weapon = Weapon;
exports.Unit = Unit;
exports.Setting = Setting;
exports.Call = Call;
exports.Bolo = Bolo;
exports.Arrest = Arrest;
exports.Citation = Citation;
exports.VehicleImpoundment = VehicleImpoundment;
exports.Log = Log;

// const createTables = async () => {
//   const keys = Object.keys(exports);
//   for (let i = 0; i < keys.length; i += 1) {
//     const obj = exports[keys[i]];

//     if (typeof obj !== 'function') continue;

//     await obj.sync();
//   }
// };
