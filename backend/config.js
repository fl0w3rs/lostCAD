const { env } = process;

const dbConfig = (prefix) => ({
  host: env[`${prefix}_DB_HOST`] || 'localhost',
  username: env[`${prefix}_DB_USER`],
  database: env[`${prefix}_DB_NAME`],
  password: env[`${prefix}_DB_PASSWORD`],
});

module.exports = {
  port: Number(env.PORT || 9669),
  // create missing CAD tables on start (for a fresh database)
  dbSync: env.DB_SYNC === '1',
  languageId: Number(env.FORUM_LANGUAGE_ID || 1),
  adminGroups: (env.ADMIN_GROUPS || '4').split(',').map(Number),
  loginKeyCookieName: env.LOGIN_COOKIE_NAME || 'ips4_login_key',
  db: {
    cad: dbConfig('CAD'),
    forum: dbConfig('FORUM'),
  },
};
