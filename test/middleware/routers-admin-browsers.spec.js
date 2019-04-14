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
var restURL = serverURL + '/ionadmin/api/stat/browsers';
// Var restIDURL = serverURL + '/api/services/01e5';

// Данные для авторизации в header, если нужна в запросе - в конфиге, или по умолчанию
var username = config.username || 'testname';
var password = config.password || 'testpsw';
var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');

// Результат запроса присваиваем переменным ниже
var resBody; // Содержит body ответа
var responseOfRest; // Содержит значение переменной res http://expressjs.com/4x/api.html#res

// Задаем схему проверки http://chaijs.com/plugins/chai-json-schema
var browsersScheme = {
  title: 'Схема данных статистики браузера',
  type: 'array',
  uniqueItems: true,
  items: {
    title: 'Схема данных объекта статистики браузера',
    type: 'object',
    required: ['browser', 'users'],
    properties: {
      browser: {
        title: 'Браузер',
        type: 'string'
      },
      users: {
        title: 'Пользователей',
        type: 'number'
      }
    }
  }
};

/* Зависимости и библиотеки */

var chai = require('chai');
var expect = require('chai').expect;
var chaiJSONSchema = require('chai3-json-schema');
chai.use(chaiJSONSchema);

var request = require('supertest');

var app;
var resGetHome;
var ionTestUrl;
describe.skip('# Модуль IONAdmin. Проверяем API STAT Browsers', function () {
  before(function () {
    app = global.ionTest.app;
    ionTestUrl = global.ionTest.url;
  });
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
        expect(JSON.parse(resBody)).to.be.jsonSchema(browsersScheme);
      });
    });
  });
});
