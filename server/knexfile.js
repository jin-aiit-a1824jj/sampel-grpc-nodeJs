const path = require('path');

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: '172.20.0.30',
      user: 'postgres',
      password: 'root',
      port: '5432',
      database: 'blogs-db',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.join(__dirname, 'db', 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'db', 'seeds'),
    },
  },
};
