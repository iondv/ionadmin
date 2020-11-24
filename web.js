

const path = require('path');
const express = require('express');
const router = express.Router();
const di = require('core/di');
const {load} = require('core/i18n');
const config = require('./config');
const moduleName = require('./module-name');
const controllers = require('./controllers');
const {api} = controllers;
const ionAdmin = require('./index');

const extendDi = require('core/extendModuleDi');
const staticRouter = require('lib/util/staticRouter');
const extViews = require('lib/util/extViews');
const accessResources = require('./access-resources');

router.get('/', controllers.dashboard);
router.get('/dashboard', controllers.dashboard);

router.get('/changelog', controllers.changelog.index);
router.post('/api/changelog/list', api.changelog.list);
router.get('/accesslog', controllers.accesslog.index);
router.post('/api/accesslog/list', api.accesslog.list);
router.get('/authlog', controllers.authlog.index);
router.post('/api/authlog/list', api.authlog.list);

router.get('/activity', controllers.activity.index);
router.post('/api/activity/list', api.activity.list);

router.get('/token', controllers.token);
router.post('/token', controllers.token);

router.get('/backup', controllers.backup.db.index);
router.get('/api/backup/db/list', api.backup.db.list);
router.post('/api/backup/db/create', api.backup.db.create);
router.get('/api/backup/db/status', api.backup.db.status);
router.get('/api/backup/db/download', api.backup.db.download);
router.post('/api/backup/db/delete', api.backup.db.delete);

attachModelRoutes('profiling/slow-query', controllers.profiling.slowQuery, api.profiling.slowQuery);
router.post('/api/profiling/slow-query/import-new', api.profiling.slowQuery.importNew);
router.post('/api/profiling/slow-query/import-all', api.profiling.slowQuery.importAll);
router.get('/api/profiling/slow-query/get-level', api.profiling.slowQuery.getLevel);
router.post('/api/profiling/slow-query/set-level', api.profiling.slowQuery.setLevel);

attachModelRoutes('security/resource', controllers.security.resource, api.security.resource);
router.get('/api/security/role/resources', api.security.role.resources);
attachModelRoutes('security/role', controllers.security.role, api.security.role);
router.get('/api/security/role-list', api.security.role.listDefault);
attachModelRoutes('security/user', controllers.security.user, api.security.user);
router.get('/security/sync', controllers.security.index.sync);
router.post('/api/security/sync/sync-acl', api.security.sync.syncAcl);
router.post('/api/security/sync/import-resources', api.security.sync.importResources);

router.get('/schedule', controllers.schedule.list);
router.get('/schedule/new', controllers.schedule.new);
router.get('/schedule/:job', controllers.schedule.job);
router.post('/api/schedule/save', api.schedule.save);
router.post('/api/schedule/remove', api.schedule.remove);
router.post('/api/schedule/start', api.schedule.start);
router.post('/api/schedule/manually', api.schedule.manually);
router.post('/api/schedule/runningMode', api.schedule.runningMode);
router.post('/api/schedule/stop', api.schedule.stop);
router.post('/api/schedule/startAll', api.schedule.startAll);
router.post('/api/schedule/stopAll', api.schedule.stopAll);
router.post('/api/schedule/restartAll', api.schedule.restartAll);

router.get('/recache', controllers.recache);
router.get('/api/recache/list', api.recache.list);
router.get('/api/recache/start', api.recache.start);

router.get('/notifications', controllers.notifications.index);
router.get('/notifications/create', controllers.notifications.create);
router.get('/notifications/:id', controllers.notifications.update);
router.get('/api/notifications/userSearch', api.notifications.userSearch);
router.get('/api/notifications', api.notifications.list);
router.get('/api/notifications/:id', api.notifications.get);
router.post('/api/notifications', api.notifications.create);
// Router.put('/api/notifications/:id', api.notifications.update);
router.delete('/api/notifications/:id', api.notifications.delete);
router.post('/api/delete-list/notifications', api.notifications.deleteList);

const app = express();
app.use(`/${moduleName}`, express.static(path.join(__dirname, 'view/static')));
app.engine('ejs', require('ejs-locals'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view/templates'));

app._init = () => 
  load(path.join(__dirname, 'i18n'))
    .then(() => di(
      moduleName,
      extendDi(moduleName, config.di),
      {module: app}, 'app', [], `modules/${moduleName}`
    ))
    .then(scope => {
      extViews(app, scope.settings.get(`${moduleName}.templates`));
      app.use(`/${moduleName}`, router);
      const statics = staticRouter(scope.settings.get(`${moduleName}.statics`));
      if (statics)
        app.use(`/${moduleName}`, statics);

      scope.auth.bindAuth(app, moduleName);
      for (const key of Object.keys(accessResources))
        scope.roleAccessManager.defineResource(accessResources[key].id, accessResources[key].name);

      app.locals.pageTitle = scope.settings.get(`${moduleName}.pageTitle`) ||
        scope.settings.get('pageTitle') ||
        `ION ${config.sysTitle}`;
      app.locals.pageEndContent = scope.settings.get(`${moduleName}.pageEndContent`) || scope.settings.get('pageEndContent') || '';
      ionAdmin.scope = scope;
    });

function attachModelRoutes(name, controller, api) {
  if (controller) {
    controller.index && router.get(`/${name}`, controller.index);
    controller.create && router.get(`/${name}/create`, controller.create);
    controller.update && router.get(`/${name}/:id`, controller.update);
  }
  if (api) {
    api.list && router.get(`/api/${name}`, api.list);
    api.get && router.get(`/api/${name}/:id`, api.get);
    api.create && router.post(`/api/${name}`, api.create);
    api.update && router.put(`/api/${name}/:id`, api.update);
    api.delete && router.delete(`/api/${name}/:id`, api.delete);
    api.deleteList && router.post(`/api/delete-list/${name}`, api.deleteList);
  }
}

module.exports = app;
