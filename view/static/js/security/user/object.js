(function ($) {

  var fields = {
    "type": {
      validators: [
        {
          type: 'required'
        }
      ]
    },
    "login": {
      validators: [
        {
          type: 'required'
        }
      ]
    },
    "psw": {
      validators: []
    },
    "name": {
      validators: [
        {
          type: 'required'
        }
      ]
    },
    "disabled": {
      format: {
        type: "checkbox"
      }
    },
    "roles": {
      format: {
        type: "checkboxList",
        options: {
          url: "ionadmin/api/security/role-list",
          value: "id",
          label: "name"
        }
      }
    }
  };

  objectManager("security/user", fields);

})(jQuery);
