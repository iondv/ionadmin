```
"ionadmin": {
      "globals": {
        "defaultPath": "ionadmin",
        "securityParams": {
          "resourceTypes": {
            "*": {
              "title": "Общие"
            },
            "n:::": {
              "title": "Навигация"
            },
            "c:::": {
              "title": "Классы"
            },
            "ionadmin:::": {
              "title": "Модуль администрирования"
            },
            "sys:::url": {
              "title": "Пути"
            }
          },
          "hiddenRoles": [
            "^PROJ_DEPART_EMPLOYEE",
            "^PROJ_DEPART_MANAGER",
            "^PROJ_DEPART_OPERATOR",
            "^PROJECT_ADMIN",
            "^PROJECT_BENEFITIAR",
            "^PROJECT_CURATOR",
            "^PROJECT_MANAGER",
            "^PROJECT_RESPONSIBLE"
          ]
        }
      },
      "statics": {
        "common-static": "applications/sakh-pm/templates/static"
      },
      "logo": "common-static/logo.png"
    }   
  }
```