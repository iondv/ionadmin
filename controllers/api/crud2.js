const Permissions = require('core/Permissions');
const IonError = require('core/IonError');

const FORM_ATTR_PREFIX = 'obj-';

module.exports = function (model, scopeGetter, accessChecker, errorHandler) {
  /**
   * @param {{}} data
   */
  function parseBody(data) {
    const result = {};
    Object.keys(data).forEach((key) => {
      if (key.startsWith(FORM_ATTR_PREFIX))
        result[key.substring(FORM_ATTR_PREFIX.length)] = data[key];
    });
    return result;
  }

  function wrapper(req, res, cb, permissions) {
    return accessChecker(req, res, permissions)
      .then(scopeGetter)
      .then(cb)
      .catch(err => errorHandler(req, res, err));
  }

  return {
    wrapper,

    list: (req, res) => wrapper(req, res, 
        scope => model.findAll(scope.auth.getUser(req)).then(result => res.json(result)),
      Permissions.READ),

    get: (req, res) => wrapper(req, res,
      scope => model.findOne(req.params.id, scope.auth.getUser(req))
        .then((result) => {
          if (result)
            return res.json(result);
          throw new IonError(404);
        }),
      Permissions.READ),

    create: (req, res) => wrapper(req, res,
      scope => model.insert(parseBody(req.body), scope.auth.getUser(req))
        .then(result => res.json(result)),
      Permissions.WRITE),

    update: (req, res) => wrapper(req, res,
      scope => model.update(req.params.id, parseBody(req.body), scope.auth.getUser(req))
        .then(result => res.json(result)),
      Permissions.WRITE),

    'delete': (req, res) => wrapper(req, res,
      scope => model.remove(req.params.id, scope.auth.getUser(req))
        .then((result) => {
          if (result)
            return res.json(result);
          throw new IonError(404);
        }),
      Permissions.DELETE),

    deleteList: (req, res) => wrapper(req, res,
      scope => model.removeList(req.body.ids, scope.auth.getUser(req))
        .then(result => res.json(result)),
      Permissions.DELETE)
  };
};
