const roles = require('./role');

module.exports = (getScope) => {
  const rolesModel = roles(getScope);

  function getManager() {
    return getScope().roleAccessManager;
  }

  return {
    findAll: () => getManager().getResources(),

    findOne: id => getManager().getResource(id),

    insert: data => getManager().defineResource(data.id, data.name),

    update: (id, data, author) => getManager().defineResource(data.id, data.name)
      .then((result) => {
        if (id === data.id)
          return result;
        return getManager().getRoles()
          .then((roles) => {
            let p = Promise.resolve();
            roles.forEach((role) => {
              p = p.then(() => rolesModel.getResourceAccess(role.id)
                .then(access => access[id] ? getManager().grant(role.id, data.id, access[id], author) : null));
            });
            return p;
          })
          .then(() => result);
      }),

    remove: id => getManager().undefineResources([id]).then(() => id),

    removeList: ids => getManager().undefineResources(ids).then(() => ids)
  };
};
