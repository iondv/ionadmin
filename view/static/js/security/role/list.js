(function ($) {

  var dt = {
    aoColumns: [
      {
        "mData": "id",
        "sTitle": "Идентификатор"
      },
      {
        "mData": "name",
        "sTitle": "Название"
      },
      {
        "mData": "users",
        "sTitle": "Пользователи",
        "mRender": dataTableFormatter["list"]
      }
    ],
    order: [[0, "asc"]]
  };

  listManager("security/role", {
    dt: dt
  });

})(jQuery);
