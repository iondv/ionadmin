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
      }
    ],
    order: [[0, "asc"]]
  };

  listManager("security/resource", {
    dt: dt
  });

})(jQuery);
