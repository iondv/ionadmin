
const ionAdmin = require('../../../IonAdmin');
const accessResources = require('../../../access-resources');
const { FunctionCodes: F } = require('@iondv/meta-model-contracts');
const moment = require('moment');

exports.list = (req, res) => {
  const params = req.body;
  const scope = ionAdmin.getScope();

  return ionAdmin.can(req, res, accessResources.activity.id)
    .then(() => {
      const filter = [{[F.EQUAL]: ['$event', 'sign in']}];
      if (params.filter.since)
        filter.push({[F.GREATER_OR_EQUAL]: ['$time', moment(params.filter.since).toDate()]});
      if (params.filter.till)
        filter.push({[F.LESS]: ['$time', moment(params.filter.till).toDate()]});
      if (params.filter.user)
        filter.push({[F.EQUAL]: ['$user', params.filter.user]});
      if (params.filter.disabled)
        filter.push({[F.EQUAL]: ['$user_join.disabled', params.filter.disabled === 'true']});

      return scope.Db.fetch('ion_auth_log', {
        sort: {'lastVisit': -1},
        joins: [{
          alias: 'user_join',
          left: 'user',
          right: 'id',
          table: 'ion_user'
        }],
        filter: filter.length > 1 ? {[F.AND]: filter} : filter[0],
        aggregates: {lastVisit: {[F.MAX]: ['$time']}},
        fields: {
          userName: {[F.IFNULL]: ['$user_join.name', '$user']},
          isDisabled: '$user_join.disabled'
        },
        countTotal: true
      });
    })
    .then((result) => {
      res.json({
        draw: parseInt(params.draw),
        recordsTotal: result.total,
        recordsFiltered: result.total,
        data: result
      });
    })


    /*.then(() => scope.accounts.list(null, true))
    .then((result) => {
      let p = Promise.resolve();
      let list = [];
      result.forEach((user) => {
        const opts = {
          filter: {[F.AND]: [
            {[F.EQUAL]: ['$user', user.id()]},
            {[F.EQUAL]: ['$event', 'sign in']}
          ]}
        };
        p = p.then(() => scope.Db.fetch('ion_auth_log', opts))
          .then(() => {
            list.push({
              lastVisit: 
              userName: user.name(),
              isDisbled: user.isDisbled()
            });
          });
      });
      return p.then(() => res.json({
        draw: parseInt(params.draw),
        recordsTotal: result.total,
        recordsFiltered: result.total,
        data: list
      }));
    })*/
    .catch(err => ionAdmin.error(err, {req, res}));
};
