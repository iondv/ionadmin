(function ($) {

  var fields = {
    "_id": {},
    "id": {
      validators: [
        {
          type: 'required'
        }
      ]
    },
    "name": {
    },
    "access": {
      format: {
        type: "resourceAccess",
        options: {
          resourceUrl: "ionadmin/api/security/role/resources"
        }
      }
    }

  };
  objectManager("security/role", fields);
})(jQuery);
