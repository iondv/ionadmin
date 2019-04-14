// Основные функции
var request = require('superagent');
var config =  require('../../../../app/config');
var serverURL = config.serverURL || 'http://localhost:3000';
var restURL = serverURL + '/ionadmin/';
var PageObject = function () {
  this.resizeWindow = function () {
    browser.driver.manage().window().maximize();
    return browser.driver.manage().window().getSize();
  };
  this.get = function (url) {
    browser.get(url);
    return browser.getCurrentUrl();
  };
  this.getTitle = function () {
    return browser.getTitle();
  };
};

module.exports.PageObject = PageObject;

var superRequest = function (url, msg, all, results, timeout, done) {
  request.get(url).timeout(timeout)
    .end(function (err, res) {
      results.push(url);
      if (err) {
        if (err.status) {
          console.error('✖ ' + msg + ': ' + url + ' Ошибка доступа: ' + err.status);
        } else
        if (err.code === 'ECONNREFUSED') {
          console.error('✖ ' + msg + ' (Некорректный/пустой url)');
        } else
        if (err.code === 'ECONNABORTED') {
          console.error('✖ ' + msg + ' (Таймаут соединения)');
        } else {
          console.error('✖ (Неизвестная ошибка) ' + msg);
        }
      } else {
        if (res.res.statusCode !== 200) {
          console.log('✖ ' + msg + ': ' + url + ' Ошибка доступа: ' + res.res.statusCode);
        } else {
          console.log('➤ ' + msg + ': ' + url);
        }
      }
      if (results.length === all) {
        done();
      }
    });
}
module.exports.superRequest = superRequest;
