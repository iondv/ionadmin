'use strict';

const async = require('async');
const ionAdmin = require('../../../index');
const accessResources = require('../../../access-resources');
const Permissions = require('core/Permissions');
const respond = require('../../../backend/respond');
const moduleName = require('../../../module-name');

exports.syncAcl = function (req, res) {
  ionAdmin.can(req, res, accessResources.securitySync.id, Permissions.WRITE).then(() => {
    async.series(
      [],
      (err) => {
        if (err) {
          return res.status(400).send(err.toString());
        }
        res.send('Синхронизация прав доступа успешно проведена');
      }
    );
  }).catch((err) => {
    ionAdmin.renderError(req, res, err);
  });
};

exports.importResources = function (req, res) {
  ionAdmin.can(req, res, accessResources.securitySync.id, Permissions.WRITE).then(() => {
    respond(res, (scope) => {
      try {
        let params = scope.settings.get(`${moduleName}.securityParams`) || {};
        let resTypes = params.resourceTypes || {};
        let resources = {};
        async.series(
          [
            cb => resTypes['n:::'] ? importNav(scope, cb) : cb(),
            cb => resTypes['c:::'] ? importMeta(scope, cb, resTypes) : cb(),
            cb => resTypes['i:::'] ? importObjects(scope, cb) : cb()
          ],
          (err) => {
            if (err) {
              console.error(err);
              return res.status(400).send(err.toString());
            }
            res.send('Импорт ресурсов успешно проведен');
          }
        );
      } catch (err) {
        console.error(err);
        ionAdmin.renderError(req, res, err);
      }
    });
  }).catch((err) => {
    ionAdmin.renderError(req, res, err);
  });
};

function processNavNode(n, dest) {
  dest.push(n);
  if (Array.isArray(n.children)) {
    n.children.forEach(sn => processNavNode(sn, dest));
  }
}

function importNav(scope, cb) {
  try {
    let result = [];
    let sects = scope.metaRepo.getNavigationSections();
    Object.values(sects).forEach((s) => {
      let nodes = scope.metaRepo.getNodes(s.namespace + '@' + s.name);
      nodes.forEach(n => processNavNode(n, result));
    });

    let updates = Promise.resolve();
    result.forEach((doc) => {
      if (doc.code && doc.namespace) {
        let id = `n:::${doc.namespace}@${doc.code}`;
        let cls = doc.classname ? scope.metaRepo.getMeta(doc.classname, null, doc.namespace) : null;
        updates = updates.then(() => scope.roleAccessManager.defineResource(id, doc.caption + (cls ? ' [' + cls.getCaption() + ']' : '')));
      }
    });
    updates.then(() => cb()).catch(cb);
  } catch (err) {
    cb(err);
  }
}

function importMeta(scope, cb, resTypes) {
  try {
    let classes = scope.metaRepo.listMeta();
    let updates = Promise.resolve();
    classes.forEach((doc) => {
      let id = `c:::${doc.getCanonicalName()}`;
      updates = updates.then(() => scope.roleAccessManager.defineResource(id, doc.getCaption()));
      if (resTypes['a:::']) {
        let props = doc.getPropertyMetas();
        Object.values(props).forEach((p) => {
          let id = `a:::${doc.getCanonicalName()}.${p.name}`;
          updates = updates.then(() => scope.roleAccessManager.defineResource(id, doc.getCaption() + '.' + p.caption));
        });
      }

    });
    updates.then(() => cb()).catch(cb);
  } catch (err) {
    cb(err);
  }
}

function importObjects(scope, cb) {
  cb();
}
