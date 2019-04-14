'use strict';

const moment = require('moment');
const ionAdmin = require('../../../index');
const accessResources = require('../../../access-resources');

exports.list = function (req, res) {
  ionAdmin.can(req, res, accessResources.changelog.id)
    /**
     * @param scope
     * @param ChangeLogger scope.changelogFactory
     */
  .then(()=> {
    let params = req.body;
    let scope = ionAdmin.getScope();
    let logger = scope.changelogFactory.logger();

    return logger.getChanges(
      {
        className: params.filter.class,
        id: params.filter.id,
        since: moment(params.filter.since).toDate(),
        till: moment(params.filter.till).toDate(),
        author: params.filter.author,
        type: params.filter.type,
        count: parseInt(params.length) || 20,
        offset: parseInt(params.start) || 0,
        total: true
      }
    ).then((result) => {
      let list = [];
      for(let i = 0; i < result.length; i++) {
        list[i] = result[i];
        let meta = scope.metaRepo.getMeta(list[i].className, list[i].classVersion);
        if (meta) {
          list[i].className = `${meta.getCaption()} [${meta.getName()}]`;
        }
      }

      res.json({
        draw: parseInt(params.draw),
        recordsTotal: result.total,
        recordsFiltered: result.length,
        data: list
      });
    }).catch((err) => {
      return ionAdmin.error(err, {req, res});
    });
  }).catch(err => {
    return ionAdmin.error(err, {req, res});
  });
};