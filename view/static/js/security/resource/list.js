(function ($) {

  var dt = {
    aoColumns: [
      {
        "mData": "id",
        "sTitle": "Identifier"
      },
      {
        "mData": "name",
        "sTitle": "Name"
      }
    ],
    order: [[0, "asc"]]
  };

  listManager("security/resource", {
    dt: dt
  });

})(jQuery);
