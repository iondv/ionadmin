var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var path = require('path');
require('./protractor-extend');
var PageObject = require('./mainFunc').PageObject;
var requestS = require('./mainFunc').superRequest;
var testObj = new PageObject();
var testConfig = require('./config');
var config =  require('../../../../app/config');
var serverURL = config.serverURL || 'http://localhost:3000';
var restURL = serverURL + '/ionadmin/models/official/create';
var TestImg = './modules/ionadmin/src/demo-photos/img1.jpg';
var TestText = 'test';
var CreateOff = function (done) {
  describe.skip('Проверяем доступность страницы Создать Должностное лицо', function () {
  it ('Ожидаем прогрузку страницы', function () {
    expect(testObj.get(restURL)).to.eventually.equal(restURL);
  });
  describe.skip('Проверяем загрузку страницы Создать изображение', function () {
    it ('Содержит основные блоки верстки', function () {
      it('Блок обертка', function () {
        element(by.className('wrapper')).isPresent().then(function (result) {
          expect(result).to.be.true;
        });
      });
      it('Блок шапка', function () {
        element(by.className('main-header')).isPresent().then(function (result) {
          expect(result).to.be.true;
        });
      });
      it('Блок меню', function () {
        element(by.className('main-sidebar')).isPresent().then(function (result) {
          expect(result).to.be.true;
        });
      });
      it('Блок обертка контента', function () {
        element(by.className('content-wrapper')).isPresent().then(function (result) {
          expect(result).to.be.true;
        });
      });
      it('Блок заголовок контента', function () {
        element(by.className('content-header')).isPresent().then(function (result) {
          expect(result).to.be.true;
        });
      });
      it('Блок контента', function () {
        element(by.className('content')).isPresent().then(function (result) {
          expect(result).to.be.true;
        });
      });
      it('Кнопка для сохранения данных', function () {
        element(by.xpath('//*[@id="save-form"]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
      });
      it('Поле для заполнения Фамилии', function () {
        element(by.xpath('//*[@id="obj-sname"]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
      });
      it('Поле для заполнения Имени', function () {
        element(by.xpath('//*[@id="obj-fname"]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
      });
      it('Поле для заполнения Отчества', function () {
        element(by.xpath('//*[@id="obj-pname"]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
      });
      it('Поле для заполнения Должности', function () {
        element(by.xpath('//*[@id="obj-position"]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
      });
      it('Элемент AJAX для загрузки фотографии', function () {
        element(by.xpath('//*[@id="ajaxUploader"]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
      });
      it('Блок футера', function () {
        element(by.className('main-footer')).isPresent().then(function (result) {
          expect(result).to.be.true;
        });
      });
    });
    it('Все ключевые JS загружаются с кодом 200', function (done) {
      var results = [];
      element.all(by.tagName('script')).count().then(function (scrCount) {
        for (var currSc = 0; currSc < scrCount; currSc++) {
          checkURL(results, currSc, scrCount, done);
        }
      });
      function checkURL(results, currLink, linksCount, done) {
        element.all(by.tagName('script')).get(currLink).getAttribute('src').then (function (src) {
          if (src) {
            requestS(src, 'JS файл: ' + (Number(currLink) + 1), linksCount, results,
              testConfig.timeout, done);
          } else {
            done();
          }
        });
      }
    });
    it('Все ключевые CSS загружаются с кодом 200', function (done) {
      var results = [];
      element(by.tagName('head')).all(by.tagName('link')).count().then(function (scrCount) {
        for (var currSc = 0; currSc < scrCount; currSc++) {
          checkURL(results, currSc, scrCount, done);
        }
      });
      function checkURL(results, currLink, linksCount, done) {
        element(by.tagName('head')).all(by.tagName('link')).get(currLink).getAttribute('href').then (function (src) {
          requestS(src, 'CSS файл ' + (Number(currLink) + 1) + '/' + linksCount, linksCount, results,
            testConfig.timeout, done);
        });
      }
    });
  });
  describe.skip('# Проверяем задачи на контрольной панели', function () {
    it('Проверка загрузки страницы по ссылки из меню', function (done) {
      var results = [];
      element(by.xpath('//*[@id="sidemenu-item-tasks"]/a')).getAttribute('href').then(function (href) {
        requestS(href, 'Ссылка на задачи', 1, results, testConfig.timeout, done);
      });
    });
  });
  describe.skip('Проверяем уведомления на контрольной панели', function () {
    it('Проверка загрузки страницы по ссылки из меню', function (done) {
      var results = [];
      element(by.xpath('//*[@id="sidemenu-item-notices"]/a')).getAttribute('href').then(function (href) {
        requestS(href, 'Ссылка на уведомления', 1, results, testConfig.timeout, done);
      });
    });
  });
  describe.skip('Проверяем сообщения на контрольной панели', function () {
    it('Проверка загрузки страницы по ссылки из меню', function (done) {
      var results = [];
      element(by.xpath('//*[@id="sidemenu-item-messages"]/a')).getAttribute('href').then(function (href) {
        requestS(href, 'Ссылка на сообщения', 1, results, testConfig.timeout, done);
      });
    });
  });
  describe.skip('Проверяем статистику на контрольной панели', function () {
    it ('Проверка прорисовки меню статистики', function () {
      element(by.xpath('/html/body/div[1]/aside/section/ul/li[5]')).click();
      browser.sleep(testConfig.browser.eachSleep);
      element(by.xpath('/html/body/div[1]/aside/section/ul/li[5]/ul')).isDisplayed().then(function (res) {
        expect(res).to.be.true;
      });
    });
    it('Проверка загрузки страниц по ссылкам из меню статистики', function (done) {
      var results = [];
      element(by.xpath('//*[@id="sidemenu-item-server"]/a')).getAttribute('href').then(function (href) {
        requestS(href, 'Ссылка на статистику сервера', 1, results, testConfig.timeout, done);
      });
      element(by.xpath('//*[@id="sidemenu-item-visitors"]/a')).getAttribute('href').then(function (href) {
        requestS(href, 'Ссылка на статистику посетителей', 1, results, testConfig.timeout, done);
      });
      element(by.xpath('//*[@id="sidemenu-item-browsers"]/a')).getAttribute('href').then(function (href) {
        requestS(href, 'Ссылка на статистику браузеров', 1, results, testConfig.timeout, done);
      });
      element(by.xpath('//*[@id="sidemenu-item-models"]/a')).getAttribute('href').then(function (href) {
        requestS(href, 'Ссылка на статистику моделей', 1, results, testConfig.timeout, done);
      });
    });
  });
  describe.skip('# Проверяем модели данных на контрольной панели', function () {
    it ('Проверка прорисовки меню моделей', function () {
      element(by.xpath('/html/body/div[1]/aside/section/ul/li[6]')).click();
      browser.sleep(testConfig.browser.eachSleep);
      element(by.xpath('/html/body/div[1]/aside/section/ul/li[6]/ul')).isDisplayed().then(function (res) {
        expect(res).to.be.true;
      });
    });
    it('Проверка загрузки страниц по ссылкам из меню моделей', function (done) {
      var results = [];
      element(by.xpath('//*[@id="sidemenu-item-image"]/a')).getAttribute('href').then(function (href) {
        requestS(href, 'Ссылка на модели изображений', 1, results, testConfig.timeout, done);
      });
      element(by.xpath('//*[@id="sidemenu-item-post"]/a')).getAttribute('href').then(function (href) {
        requestS(href, 'Ссылка на модели новостей', 1, results, testConfig.timeout, done);
      });
      element(by.xpath('//*[@id="sidemenu-item-postType"]/a')).getAttribute('href').then(function (href) {
        requestS(href, 'Ссылка на модели типов новостей', 1, results, testConfig.timeout, done);
      });
      element(by.xpath('//*[@id="sidemenu-item-postCategory"]/a')).getAttribute('href').then(function (href) {
        requestS(href, 'Ссылка на модели категории новостей', 1, results, testConfig.timeout, done);
      });
      element(by.xpath('//*[@id="sidemenu-item-official"]/a')).getAttribute('href').then(function (href) {
        requestS(href, 'Ссылка на модели должностных лиц', 1, results, testConfig.timeout, done);
      });
      element(by.xpath('//*[@id="sidemenu-item-municipal"]/a')).getAttribute('href').then(function (href) {
        requestS(href, 'Ссылка на модели муниципальных образований', 1, results, testConfig.timeout, done);
      });
    });
  });
  describe.skip('Проверяем меню в шапке на контрольной панели', function () {
    it('Проверка кнопки скрыть/показать меню слева', function () {
      element(by.xpath('/html/body/div[1]/header/nav/a')).click();
      browser.sleep(testConfig.browser.eachSleep);
      element(by.xpath('/html/body/div[1]/aside/section/ul/li[1]'))
        .isDisplayed().then(function (res) {
          expect(res).to.be.false;
        });
    });
    it('Проверка всплывающего окна Сообщения', function () {
      element(by.xpath('/html/body/div[1]/header/nav/div/ul/li[1]/a')).click();
      element(by.xpath('/html/body/div[1]/header/nav/div/ul/li[1]/ul')).waitElementReady();
      element(by.xpath('/html/body/div[1]/header/nav/div/ul/li[1]/ul'))
        .isDisplayed().then(function (res) {
          expect(res).to.be.true;
        });
    });
    it('Проверка всплывающего окна Уведомления', function () {
      element(by.xpath('/html/body/div[1]/header/nav/div/ul/li[2]')).click();
      element(by.xpath('/html/body/div[1]/header/nav/div/ul/li[2]/ul')).waitElementReady();
      element(by.xpath('/html/body/div[1]/header/nav/div/ul/li[2]/ul'))
        .isDisplayed().then(function (res) {
          expect(res).to.be.true;
        });
    });
    it('Проверка всплывающего окна Задачи', function () {
      element(by.xpath('/html/body/div[1]/header/nav/div/ul/li[3]')).click();
      element(by.xpath('/html/body/div[1]/header/nav/div/ul/li[3]/ul')).waitElementReady();
      element(by.xpath('/html/body/div[1]/header/nav/div/ul/li[3]/ul'))
        .isDisplayed().then(function (res) {
          expect(res).to.be.true;
        });
    });
  });
  describe.skip('Создание тестового изображения', function () {
    it('Проверка обязательности полей', function () {
      element(by.xpath('//*[@id="save-form"]')).click();
      browser.sleep(testConfig.browser.eachSleep);
      element(by.xpath('//*[@id="object-form"]/div/div[1]/div/p')).isDisplayed().then(function (result) {
        expect(result).to.be.true;
      });
      element(by.xpath('//*[@id="object-form"]/div/div[1]/div/p')).getText().then(function (result) {
        expect(result).to.be.equal('Поле обязательно для заполнения');
      });
    });
    it('Заполнение поля Файл', function () {
      var absPath = path.resolve(TestImg);
      element(by.css('input[type=file]')).sendKeys(absPath.replace(/\\/g, '/'));
      browser.sleep(testConfig.browser.eachSleep);
      element(by.id('image-image')).isDisplayed().then(function (result) {
        expect(result).to.be.true;
      });
    });
    it('Заполнение полей текстовых полей и Сохранение результата', function () {
      element(by.xpath('//*[@id="obj-sname"]')).sendKeys(TestText);
      element(by.xpath('//*[@id="obj-fname"]')).sendKeys(TestText);
      element(by.xpath('//*[@id="obj-pname"]')).sendKeys(TestText);
      element(by.xpath('//*[@id="obj-position"]')).sendKeys(TestText);
      element(by.xpath('//*[@id="save-form"]')).click();
      browser.sleep(testConfig.browser.eachSleep);
      element(by.id('message-callout')).getText().then(function (result) {
        expect(result).to.be.equal('Объект сохранен');
      });
    });
  });
});
  done();
};
module.exports.CreateOff = CreateOff;
