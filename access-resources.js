'use strict';

const {t} = require('core/i18n');

module.exports = {
  dashboard: {
    id: 'ionadmin:::dashboard',
    name: t('Control panel')
  },
  securityUsers: {
    id: 'ionadmin:::security-users',
    name: t('Security Users')
  },
  securityRoles: {
    id: 'ionadmin:::security-roles',
    name: t('Security Roles')
  },
  securityResources: {
    id: 'ionadmin:::security-resources',
    name: t('Security Resources')
  },
  securitySync: {
    id: 'ionadmin:::security-sync',
    name: t('Security Sync')
  },
  profilingSlowQuery: {
    id: 'ionadmin:::profiling-slow-query',
    name: t('Profiling Slow queries')
  },
  activity: {
    id: 'ionadmin:::activity',
    name: t('Activity')
  },
  changelog: {
    id: 'ionadmin:::changelog',
    name: t('Changelog')
  },
  accesslog: {
    id: 'ionadmin:::accesslog',
    name: t('Access log')
  },
  authlog: {
    id: 'ionadmin:::authlog',
    name: t('Auth log')
  },
  token: {
    id: 'ionadmin:::token',
    name: t('Security token generator')
  },
  backup: {
    id: 'ionadmin:::backup',
    name: t('Backups')
  },
  schedule: {
    id: 'ionadmin:::schedule',
    name: t('Scheduling')
  },
  wstoken: {
    id: 'ws:::gen-ws-token',
    name: t('Web service security token generation')
  },
  recache: {
    id: 'ionadmin:::recache',
    name: t('Semantics cache recalculation')
  },
  notify: {
    id: 'ionadmin:::notify',
    name: t('Notifications')
  }
};
