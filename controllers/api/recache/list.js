const ionAdmin = require('../../../index');
const access = require('../../../access-resources').recache;
const respond = require('../../../backend/respond');
const onError = require('../../../backend/error');

module.exports = function (req, res) {
  ionAdmin.can(req, res, access.id)
    .then(() => respond(res, (scope) => {
      let result = [];
      try {
        let metas = scope.metaRepo.listMeta(null, null, false);
        for (let cm of metas) {
          if (cm.isSemanticCached()) {
            result.push({
              caption: cm.getCaption(),
              cname: cm.getCanonicalName()
            });
          } else {
            for (let pm of Object.values(cm.getPropertyMetas())) {
              if (pm.cached) {
                result.push({
                  caption: cm.getCaption(),
                  cname: cm.getCanonicalName()
                });
                break;
              }
            }
          }
        }
      } catch (e) {
        return onError(scope, e, res, true);
      }
      return res.status(200).send(result);
    }), ['dataRepo', 'metaRepo'])
    .catch(err => ionAdmin.renderError(req, res, err));
};

