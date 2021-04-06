'use strict';

const { di } = require('@iondv/core');
const config = require('../config');
const ionAdmin = require('../IonAdmin');
const accessResources = require('../access-resources');
const moduleName = require('../module-name');
const respond = require('../backend/respond');
const onError = require('../backend/error');
const {t} = require('@iondv/i18n');

module.exports = function (req, res, next) {
  ionAdmin.can(req, res, accessResources.dashboard.id).then(()=> {
    respond(res, scope => {
      try {
        let params = {
          req, res,
          title: t('Control panel'),
          modules: [],
          currentModule: req.cookies ? req.cookies['ionadmin-dashboard-module'] : '',
          currentApp: req.moduleName,
          dashboardContent: ''
        };
        const TEMPLATE = 'dashboard/default';
        let conf = config.dashboard;
        let modules = conf && conf.modules ? conf.modules : {};
        let selModule, selModuleData;
        for (let module in modules) {
          let id = module;
          params.modules.push(id);
          if (!params.currentModule || params.currentModule === id) {
            selModule = module;
            selModuleData = modules[module];
            params.currentModule = id;
            break;
          }
        }
        if (selModule) {
          try {
            let module = require(`@iondv/${selModule}/Manager`);
            module.configurate(selModuleData.config, err => {
              if (err) {
                return onError(scope, err, res);
              }
              module.render(params, (err, result)=> {
                if (err) {
                  onError(scope, err, res);
                } else {
                  params.dashboardContent = result;
                }
                ionAdmin.render(TEMPLATE, params);
              });
            });
          } catch (err) {
            params.error = `${selModule} module not installed`;
            ionAdmin.render(TEMPLATE, params);
          }
        } else {
          ionAdmin.render(TEMPLATE, params);
        }
      } catch (err) {
        onError(scope, err, res, true);
      }
    });
  }).catch(err => {
    ionAdmin.renderError(req, res, err);
  });
};
