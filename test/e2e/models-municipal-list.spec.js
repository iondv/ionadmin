// Тестирование меню муниципальные образования
/**
 * Настройки теста
 * Этот тест должен запускать после тестов создания и редактирования мун.образований,
 * чтобы присутствовали необходимые данные
 * */
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
require('./protractor-extend');
var PageObject = require('./mainFunc').PageObject;
var requestS = require('./mainFunc').superRequest;
var testObj = new PageObject();
var testConfig = require('./config');
var config =  require('../../../../app/config');
var serverURL = config.serverURL || 'http://localhost:3000';
var restURL = serverURL + '/ionadmin/models/municipal-list';
var idTest;
var TestMunTitle = 'testEDIT';
var CreateMun = require ('./models-municipal-create.js').CreateMun;
var EditMun = require ('./models-municipal-ID.js').EditMun;

describe.skip('Проверяем доступность страницы Муниципальные образования', function () {
  it ('Ожидаем прогрузку страницы', function () {
    expect(testObj.get(restURL)).to.eventually.equal(restURL);
  });
  describe('Проверяем загрузку страницы Муниципальные образования', function () {
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
        it('Кнопки для работы с объектами (Обновить, Создать, Править, Удалить)', function () {
          element(by.xpath('/html/body/div/div/section[2]/div/div[2]/div[1]/button[2]'))
            .isPresent().then(function (result) {
              expect(result).to.be.true;
            });
          element(by.xpath('/html/body/div/div/section[2]/div/div[2]/div[1]/button[3]'))
            .isPresent().then(function (result) {
              expect(result).to.be.true;
            });
          element(by.xpath('/html/body/div/div/section[2]/div/div[2]/div[1]/button[4]'))
            .isPresent().then(function (result) {
              expect(result).to.be.true;
            });
          element(by.xpath('/html/body/div/div/section[2]/div/div[2]/div[1]/button[5]'))
            .isPresent().then(function (result) {
              expect(result).to.be.true;
            });
        });
        it('Поиск записей', function () {
          element(by.className('dataTables_filter')).isPresent().then(function (result) {
            expect(result).to.be.true;
          });
        });
        it('Регулировка количества записей на странице', function () {
          element(by.className('dataTables_length')).isPresent().then(function (result) {
            expect(result).to.be.true;
          });
        });
        it('Таблица с записями данных', function () {
          element(by.xpath('//*[@id="object-list"]')).isPresent().then(function (result) {
            expect(result).to.be.true;
          });
        });
        it('Информация о количестве записей на странице', function () {
          element(by.className('dataTables_info')).isPresent().then(function (result) {
            expect(result).to.be.true;
          });
        });
        it('Элемент пагинации', function () {
          element(by.xpath('//*[@id="object-list_paginate"]')).isPresent().then(function (result) {
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
  describe('Проверяем задачи на контрольной панели', function () {
    it('Проверка загрузки страницы по ссылки из меню', function (done) {
      var results = [];
      element(by.xpath('//*[@id="sidemenu-item-tasks"]/a')).getAttribute('href').then(function (href) {
        requestS(href, 'Ссылка на задачи', 1, results, testConfig.timeout, done);
      });
    });
  });
  describe('Проверяем уведомления на контрольной панели', function () {
    it('Проверка загрузки страницы по ссылки из меню', function (done) {
      var results = [];
      element(by.xpath('//*[@id="sidemenu-item-notices"]/a')).getAttribute('href').then(function (href) {
        requestS(href, 'Ссылка на уведомления', 1, results, testConfig.timeout, done);
      });
    });
  });
  describe('Проверяем сообщения на контрольной панели', function () {
    it('Проверка загрузки страницы по ссылки из меню', function (done) {
      var results = [];
      element(by.xpath('//*[@id="sidemenu-item-messages"]/a')).getAttribute('href').then(function (href) {
        requestS(href, 'Ссылка на сообщения', 1, results, testConfig.timeout, done);
      });
    });
  });
  describe('Проверяем статистику на контрольной панели', function () {
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
  describe('Проверяем модели данных на контрольной панели', function () {
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
  describe('Проверяем меню в шапке на контрольной панели', function () {
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
  // Вложенность тестов друг в друг сделана для того, чтобы соблюсти четкий порядок выполнения, так как
  // сначала необходимо создать тестовые данные, чтобы их можно было редактировать и удалять.
  // Если тесты сделать последовательными, а не вложенными, некоторые начинают запускаться до того,
  // как будут сгенерированы для них данные, что приводит к ошибке.
  describe('Проверяем Функциональные кнопки', function () {
    it('Проверка кнопки создать', function (done) {
      CreateMun (done);
      describe('Проверяем Редактирование', function () {
        it('Проверка кнопки Править, правка тестового объекта', function (done) {
          EditMun(done);
          describe('Проверяем поиск по списку объектов и Удаление тестового объекта', function () {
            it('Поиск по Заголовку', function () {
              element(by.xpath('//*[@id="object-list"]/tbody')).all(by.tagName('tr'))
                .get(0).all(by.tagName('td')).get(0).getText().then(function (titleTest) {
                  element(by.xpath('//*[@id="object-list_filter"]/label/input')).sendKeys(titleTest);
                  element(by.xpath('//*[@id="object-list"]/tbody')).all(by.tagName('tr'))
                    .count().then(function (result) {
                      expect(result).to.be.at.least(1);
                    });
                  element(by.xpath('//*[@id="object-list"]/tbody')).
                    element(by.className('dataTables_empty')).isPresent().then(function (res) {
                      expect(res).to.be.false;
                    });
                });
              browser.refresh();
              browser.sleep(testConfig.browser.eachSleep);
            });
            it('Поиск по ID', function () {
              element(by.xpath('//*[@id="object-list"]/tbody')).all(by.tagName('tr'))
                .get(0).all(by.tagName('td')).get(1).getText().then(function (idTest) {
                  element(by.xpath('//*[@id="object-list_filter"]/label/input')).sendKeys(idTest);
                  element(by.xpath('//*[@id="object-list"]/tbody')).all(by.tagName('tr'))
                    .count().then(function (result) {
                      idTest = result;
                      expect(result).to.be.equal(1);
                    });
                  element(by.xpath('//*[@id="object-list"]/tbody')).
                    element(by.className('dataTables_empty')).isPresent().then(function (res) {
                      expect(res).to.be.false;
                    });
                });
              browser.refresh();
              browser.sleep(testConfig.browser.eachSleep);
            });
            it('Удаление нового Мун. образования', function () {
              element(by.xpath('//*[@id="object-list"]/thead/tr[2]/th[2]')).click();
              element(by.xpath('//*[@id="object-list"]/thead/tr[2]/th[2]'))
                .getAttribute('aria-sort').then (function (res) {
                if (res == 'ascending') {element(by.xpath('//*[@id="object-list"]/thead/tr[2]/th[3]')).click();}
              });
              element(by.xpath('//*[@id="object-list"]/tbody')).all(by.tagName('tr'))
                .get(0).all(by.tagName('td')).get(0).getText().then(function (res) {
                  expect(res).to.be.equal(TestMunTitle);
                });
              element(by.xpath('//*[@id="object-list"]/tbody')).all(by.tagName('tr')).get(0).click();
              element (by.xpath('/html/body/div/div/section[2]/div/div[2]/div[1]/button[5]')).click();
              browser.sleep(testConfig.browser.eachSleep);
              var al = browser.switchTo().alert();
              al.accept();
              element(by.xpath('//*[@id="object-list_filter"]/label/input')).sendKeys(idTest);
              element(by.xpath('//*[@id="object-list"]/tbody')).
                element(by.className('dataTables_empty')).isPresent().then(function (res) {
                  expect(res).to.be.true;
                });
            });
          });
        });
      });
    });
  });
});
