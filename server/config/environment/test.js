'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/rss-dev'
  },

  // Postgres connection options
  postgres: {
    uri: process.env.POSTGRES_URL ||
         'postgres://saulman:saulman@localhost:5432/rss-feeds'
  },
  database: 'rss-feeds',
  username: 'saulman',
  password: 'saulman',
  seedDB: true
};
