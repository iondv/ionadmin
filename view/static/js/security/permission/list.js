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
        "mData": "description",
        "sTitle": "Описание"
      }
    ],
    order: [[1, "asc"]]
  };

  listManager("security/permission", {
    dt: dt
  });

})(jQuery);
