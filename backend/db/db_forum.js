const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('db_name', 'db_user', 'db_password', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    timestamps: false,
  },
});

const core_members_known_devices = sequelize.define('core_members_known_devices',
  {
    device_key: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    member_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    login_key: {
      type: DataTypes.STRING(32),
    },
  },
  {
    tableName: 'core_members_known_devices',
  });

const core_members = sequelize.define('core_members',
  {
    member_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
    },
    member_group_id: {
      type: DataTypes.SMALLINT,
    },
    mgroup_others: {
      type: DataTypes.STRING(245),
    },
  },
  {
    tableName: 'core_members',
  });

exports.sequelize = sequelize;
exports.core_members_known_devices = core_members_known_devices;
exports.core_members = core_members;
