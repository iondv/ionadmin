(function ($) {

  var dt = {
    aoColumns: [
      {
        "mData": "type",
        "sTitle": "Тип"
      },
      {
        "mData": "login",
        "sTitle": "Логин"
      },
      {
        "mData": "name",
        "sTitle": "Имя"
      },
      {
        "mData": "roles",
        "sTitle": "Назначенные роли",
        "mRender": dataTableFormatter["userRoles"]
      }
    ],
    order: [[1, "asc"]]
  };

  listManager("security/user", {
    dt: dt
  });

})(jQuery);
