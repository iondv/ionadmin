'use strict';

module.exports = {

  api: {
    profiling: {
      slowQuery: require('./api/profiling/slow-query')
    },
    security: {
      resource: require('./api/security/resource'),
      role: require('./api/security/role'),
      user: require('./api/security/user'),
      sync: require('./api/security/sync')
    },
    notifications: require('./api/notifications'),
    changelog: require('./api/changelog/list'),
    backup: {
      db: require('./api/backup/db')
    },
    schedule: {
      save: require('./api/schedule/save'),
      remove: require('./api/schedule/remove'),
      start: require('./api/schedule/start'),
      manually: require('./api/schedule/manually'),
      runningMode: require('./api/schedule/runningMode'),
      stop: require('./api/schedule/stop'),
      startAll: require('./api/schedule/startAll'),
      stopAll: require('./api/schedule/stopAll'),
      restartAll: require('./api/schedule/restartAll')
    },
    recache: {
      start: require('./api/recache/start'),
      list: require('./api/recache/list')
    }
  },

  dashboard: require('./dashboard'),
  main: require('./main'),

  profiling: {
    slowQuery: require('./profiling/slow-query')
  },
  security: {
    index: require('./security/index'),
    resource: require('./security/resource'),
    role: require('./security/role'),
    user: require('./security/user')
  },
  notifications: require('./notify/index'),
  token: require('./token/index'),
  changelog: require('./changelog/index'),
  backup: {
    db: require('./backup/db')
  },
  schedule: {
    list: require('./schedule/index'),
    new: require('./schedule/new'),
    job: require('./schedule/job')
  },
  recache: require('./recache/index')
};
