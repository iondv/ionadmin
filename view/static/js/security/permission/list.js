(function ($) {

  var dt = {
    aoColumns: [
      {
        "mData": "id",
        "sTitle": "ID"
      },
      {
        "mData": "name",
        "sTitle": "Name"
      },
      {
        "mData": "description",
        "sTitle": "Description"
      }
    ],
    order: [[1, "asc"]]
  };

  listManager("security/permission", {
    dt: dt
  });

})(jQuery);
