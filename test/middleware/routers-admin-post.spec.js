/** Тестируем модуль информации о загрузке сервера */
'use strict';

// Уточняем параметры jsHint.
// expr - убрать предупреждение для функций без (): expect(...).to.have.been.called или expect(...).to.be.ok
// maxstatements - множественные describe/it/expect одного уровня в одной группе describe или it
// jshint expr: true, maxstatements:20

/**
 * Настройки теста
 * */
var config = require('../../../../app/config/config');

// Корневой путь тестируемому серверу, задается в конфигурационном файле или по умолчанию
var serverURL = config.serverURL || 'http://localhost:3000';
var restURL = serverURL + '/ionadmin/api/post';
// Var restIDURL = serverURL + '/api/services/01e5';

// Данные для авторизации в header, если нужна в запросе - в конфиге, или по умолчанию
var username = config.username || 'testname';
var password = config.password || 'testpsw';
var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');

// Результат запроса присваиваем переменным ниже
var resBody; // Содержит body ответа
var responseOfRest; // Содержит значение переменной res http://expressjs.com/4x/api.html#res

// Задаем схему проверки http://chaijs.com/plugins/chai-json-schema
var postScheme = {
  title: 'Схема данных новостей',
  type: 'array',
  uniqueItems: true,
  items: {
    title: 'Схема данных объекта новости',
    type: 'object',
    required: ['_id', 'type', 'date', 'title',
      'subtitle', 'content', 'mainImage', 'images',
      'categories', 'officials',
      'executives', 'municipals', 'relatedPosts'],
    properties: {
      _id: {
        title: 'Идентификатор новости',
        type: ['string', 'number'],
        unique: true
      },
      type: {
        title: 'Тип новости',
        type: 'object',
        required: ['_id', 'code', 'name'],
        properties: {
          _id: {
            title: 'Идентификатор типа новости',
            type: ['string', 'number']
          },
          code: {
            title: 'Код типа новости',
            type: 'string'
          },
          name: {
            title: 'Название типа новости',
            type: 'string'
          }
        }
      },
      date: {
        title: 'Дата новости',
        type: 'string'
      },
      title: {
        title: 'Заголовок новости',
        type: 'string'
      },
      subtitle: {
        title: 'Подзаголовок новости',
        type: 'string'
      },
      content: {
        title: 'Содержание новости',
        type: 'string'
      },
      mainImage: {
        title: 'Изображение',
        type: ['object', 'null'],
        required: ['id', 'url', 'thumb', 'title'],
        properties: {
          id: {
            title: 'Идентификатор',
            type: ['string', 'number'],
            unique: true
          },
          url: {
            title: 'Путь',
            type: 'string'
          },
          thumb: {
            title: 'Предпросмотр',
            type: 'string'
          },
          title: {
            title: 'Заголовок',
            type: 'string'
          }
        }
      },
      images: {
        title: 'Массив изображений для новости',
        type: 'array',
        uniqueItems: true,
        items: {
          title: 'Изображение',
          type: ['object', 'null'],
          required: ['id', 'url', 'thumb', 'title'],
          properties: {
            id: {
              title: 'Идентификатор',
              type: ['string', 'number'],
              unique: true
            },
            url: {
              title: 'Путь',
              type: 'string'
            },
            thumb: {
              title: 'Предпросмотр',
              type: 'string'
            },
            title: {
              title: 'Заголовок',
              type: 'string'
            }
          }
        }
      },
      categories: {
        title: 'Массив объектов категорий для новости',
        type: 'array',
        uniqueItems: true,
        items: {
          title: 'Объекты категорий новости',
          type: 'object',
          required: ['id', 'name', 'image'],
          properties: {
            id: {
              title: 'Идентификатор объекта категории новости',
              type: ['string', 'number'],
              unique: true
            },
            name: {
              title: 'Заголовок объекта категории новости',
              type: 'string'
            },
            image: {
              title: 'Изображение',
              type: ['object', 'null'],
              required: ['id', 'url', 'thumb'],
              properties: {
                id: {
                  title: 'Идентификатор',
                  type: ['string', 'number']
                },
                url: {
                  title: 'Название',
                  type: 'string'
                },
                thumb: {
                  title: 'Название',
                  type: 'string'
                },
                title: {
                  title: 'Название',
                  type: 'string'
                }
              }
            }
          }
        }
      },
      officials: {
        title: 'Массив объектов - должностные лица для новости',
        type: 'array',
        uniqueItems: true,
        items: {
          title: 'Схема данных объекта должностного лица',
          type: 'object',
          required: ['id', 'sname', 'fname', 'pname', 'position', 'image'],
          properties: {
            id: {
              title: 'Идентификатор должностного лица',
              type: ['string', 'number'],
              unique: true
            },
            sname: {
              title: 'Фамилия должностного лица',
              type: 'string'
            },
            fname: {
              title: 'Имя должностного лица',
              type: 'string'
            },
            pname: {
              title: 'Отчество должностного лица',
              type: 'string'
            },
            position: {
              title: 'Позиция должностного лица',
              type: 'string'
            },
            image: {
              title: 'Изображение должностного лица',
              type: 'object',
              required: ['id', 'url'],
              properties: {
                id: {
                  title: 'Идентификатор изображения новости',
                  type: ['string', 'number']
                },
                url: {
                  title: 'URL изображения новости',
                  type: 'string'
                }
              }
            }
          }
        }
      },
      executives: {
        title: 'Массив объектов - исполнители для новости',
        type: 'array',
        uniqueItems: true,
        items: {
          title: 'Схема данных объекта исполнитель',
          type: 'object',
          required: ['id', 'sname', 'fname', 'pname', 'position', 'image'],
          properties: {
            id: {
              title: 'Идентификатор исполнителя',
              type: ['string', 'number'],
              unique: true
            },
            sname: {
              title: 'Фамилия исполнителя',
              type: 'string'
            },
            fname: {
              title: 'Имя исполнителя',
              type: 'string'
            },
            pname: {
              title: 'Отчество исполнителя',
              type: 'string'
            },
            position: {
              title: 'Позиция исполнителя',
              type: 'string'
            },
            image: {
              title: 'Изображение исполнителя',
              type: 'object',
              required: ['id', 'url'],
              properties: {
                id: {
                  title: 'Идентификатор изображения исполнителя',
                  type: ['string', 'number']
                },
                url: {
                  title: 'URL изображения исполнителя',
                  type: 'string'
                }
              }
            }
          }
        }
      },
      municipals: {
        title: 'Массив объектов - муниципалитеты для новости',
        type: 'array',
        uniqueItems: true,
        items: {
          title: 'Объекты - муниципалитеты',
          type: 'object',
          required: ['id', 'name'],
          properties: {
            id: {
              title: 'Идентификатор муниципалитета',
              type: ['string', 'number'],
              unique: true
            },
            name: {
              title: 'Заголовок муниципалитета',
              type: 'string'
            }
          }
        }
      },
      relatedPosts: {
        type: 'array',
        $ref: '#'
      }
    }
  }
};

/* Зависимости и библиотеки */
var request = require('request');
var chai = require('chai');
var expect = require('chai').expect;
var chaiJSONSchema = require('chai3-json-schema');
// Используется чуть модифицированная библиотека, для совместимости
chai.use(chaiJSONSchema);

describe.skip('# Проверяем API MODEL Post', function () {
  describe('Проверяем список по REST запросу: ' + restURL, function () {
    describe('Выполняем GET запрос', function () {
      it('Ожидаем отработку запроса без ошибок', function (done) {
        request({
          url: restURL,
          method: 'GET',
          // Режим дебага, например через Fiddler посылать запрос, для дебага
          // debug = true,
          // proxy: 'http://localhost:8888',
          headers: {
            Authorization: auth
          }
        }, function (error, response, body) {
          if (error) {
            console.error('(x) REST запрос по адресу: ' + restURL + ' выдал ошибку:' + error);
            console.dir({RESTresponse: response});
            console.log('RESTbody:\n' + body);
            done(error);
          }
          resBody = body;
          responseOfRest = response;
          // Console.log('RESTbody:\n' + body);
          done();
        });
      });
    });
    describe('Проверяем результат GET запроса', function () {
      it('Ожидаем статус 200', function () {
        expect(responseOfRest.statusCode).to.be.equal(200);
      });
      it('Ожидаем совпадение Content-Type - json', function () {
        expect(responseOfRest.headers['content-type']).to.have.string('json');
      });
    });
    describe('Проверяем совпадение ответа с моделью', function () {
      it('Проверяем JSON', function () {
        expect(JSON.parse(resBody)).to.be.jsonSchema(postScheme);
      });
    });
  });
});
