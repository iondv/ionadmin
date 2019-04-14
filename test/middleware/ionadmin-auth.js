var chai = require('chai');
var expect = require('chai').expect;
var chaiJSONSchema = require('chai3-json-schema');
chai.use(chaiJSONSchema);

var request = require('supertest');

var cookieAuth = 'connect.sid=';
var auth =  require('app/config').auth.test;
console.log(auth);

module.export = function (app, done) {
  request(app)
    .get('/reestr')
    .end(function (err, result) {
      if (err === null && result.res.statusCode === 401) {
        console.log('Авторизуемся');
        request(app)
          .post('/auth')
          .send({username: 'admin', password: '123', moduleName: 'reestr', 'checkbox-inline': 'on'})
          .end(function (err, result) {
            if (result.res.headers['set-cookie']) { // Ищем среди куков - авторизацию
              for (var i = 0; i < result.res.headers['set-cookie'].length; i++) {
                var cockiesArr = result.res.headers['set-cookie'][i].split(';');
                for (var j = 0; j < cockiesArr.length; j++) {
                  if (cockiesArr[j].indexOf('connect.sid') !== -1) {
                    cookieAuth = cockiesArr[j];
                    break;
                  }
                }
              }
            }
            console.log('Авторизовались admin/123, куки сессии:', cookieAuth);
            expect(result).to.have.status(302); // Переадрессация
            request(app)// INFO НЕЛЬЗЯ запрашивать как chai.request- не выходит из запроса при app на входе. Тест виснет
              .get('/reestr')
              .set({cookie: cookieAuth})
              .end(function (err, result) {
                done(err, result);
              });
          });
      } else {
        done(err, result);
      }
    });
}
