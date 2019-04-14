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
var restURL = serverURL + '/ionadmin/models/post-list';
var TestPostTitle = 'teststring';
var TestPostTitleE = 'edit';
var EditPost = function (done) {
  describe.skip('# Проверяем доступность страницы Редактировать новость', function () {
  it('Ожидаем прогрузку страницы Редактировать новость', function () {
    testObj.get(restURL);
    element(by.xpath('//*[@id="object-list"]/thead/tr[2]/th[1]')).click();
    element(by.xpath('//*[@id="object-list"]/thead/tr[2]/th[1]'))
      .getAttribute('aria-sort').then (function (res) {
      if (res == 'ascending') {element(by.xpath('//*[@id="object-list"]/thead/tr[2]/th[1]')).click();}
    });
    element(by.xpath('//*[@id="object-list"]/tbody')).all(by.tagName('tr'))
      .get(0).all(by.tagName('td')).get(2).getText().then(function (res) {
        expect(res).to.be.equal(TestPostTitle);
      });
    element(by.xpath('//*[@id="object-list"]/tbody')).all(by.tagName('tr')).get(0).click();
    element (by.xpath('/html/body/div/div/section[2]/div/div[2]/div[1]/button[4]')).click();
    browser.sleep(testConfig.browser.eachSleep);
    // Получаем хендлеры открытых вкладок
    browser.getAllWindowHandles().then(function (res) {
      // Переключаемся на новую вкладку после нажатия кнопки
      browser.switchTo().window(res[1]);
      browser.switchTo().activeElement();
      element(by.xpath('/html/body/div/div/section[1]/h1')).getText().then(function (res) {
        expect(res).to.be.equal('Редактировать новость');
      });
    });
  });
  describe.skip('Проверяем страницу Редактировать изображение', function () {
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
      it('Чекбоксы', function () {
        element(by.xpath('//*[@id="object-form"]/div/div[1]/div/div'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
        element(by.xpath('//*[@id="object-form"]/div/div[2]/div/div'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
        element(by.xpath('//*[@id="object-form"]/div/div[3]/div/div'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
      });
      it('Поле для выбора Типа новости', function () {
        element(by.xpath('//*[@id="object-form"]/div/div[4]/div/div'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
      });
      it('Поле для выбора Даты', function () {
        element(by.xpath('//*[@id="object-form"]/div/div[5]/div/div'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
      });
      it('Поле для заполнения Заголовка', function () {
        element(by.xpath('//*[@id="obj-title"]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
      });
      it('Поле для заполнения Подзаголовка', function () {
        element(by.xpath('//*[@id="obj-subtitle"]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
      });
      it('Форма для заполнения Текста новости', function () {
        element(by.xpath('//*[@id="object-form"]/div/div[8]/div'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
      });
      it('Кнопки для редактирования и добавления Главного фото', function () {
        element(by.xpath('//*[@id="object-form"]/div/div[9]/div/div/div[2]/div[1]/button[1]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
        element(by.xpath('//*[@id="object-form"]/div/div[9]/div/div/div[2]/div[1]/button[2]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
        element(by.xpath('//*[@id="object-form"]/div/div[9]/div/div/div[2]/div[1]/button[3]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
      });
      it('Таблица для вывода объектов Главное фото', function () {
        element(by.xpath('//*[@id="table-mainImage"]')).isPresent().then(function (result) {
          expect(result).to.be.true;
        });
      });
      it('Кнопки для редактирования и добавления Фотосессии', function () {
        element(by.xpath('//*[@id="object-form"]/div/div[10]/div/div/div/div[1]/button[1]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
        element(by.xpath('//*[@id="object-form"]/div/div[10]/div/div/div/div[1]/button[2]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
        element(by.xpath('//*[@id="object-form"]/div/div[10]/div/div/div/div[1]/button[3]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
      });
      it('Таблица для вывода объектов Фотосессия', function () {
        element(by.xpath('//*[@id="table-images"]')).isPresent().then(function (result) {
          expect(result).to.be.true;
        });
      });
      it('Кнопки для редактирования и добавления Категории', function () {
        element(by.xpath('//*[@id="object-form"]/div/div[11]/div/div/div/div[1]/button[1]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
        element(by.xpath('//*[@id="object-form"]/div/div[11]/div/div/div/div[1]/button[2]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
        element(by.xpath('//*[@id="object-form"]/div/div[11]/div/div/div/div[1]/button[3]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
      });
      it('Таблица для вывода объектов Категория', function () {
        element(by.xpath('//*[@id="table-categories"]')).isPresent().then(function (result) {
          expect(result).to.be.true;
        });
      });
      it('Кнопки для редактирования и добавления Должностных лиц', function () {
        element(by.xpath('//*[@id="object-form"]/div/div[12]/div/div/div/div[1]/button[1]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
        element(by.xpath('//*[@id="object-form"]/div/div[12]/div/div/div/div[1]/button[2]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
        element(by.xpath('//*[@id="object-form"]/div/div[12]/div/div/div/div[1]/button[3]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
      });
      it('Таблица для вывода объектов Должностные лица', function () {
        element(by.xpath('//*[@id="table-officials"]')).isPresent().then(function (result) {
          expect(result).to.be.true;
        });
      });
      it('Кнопки для редактирования и добавления Ответственных лиц', function () {
        element(by.xpath('//*[@id="object-form"]/div/div[13]/div/div/div/div[1]/button[1]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
        element(by.xpath('//*[@id="object-form"]/div/div[13]/div/div/div/div[1]/button[2]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
        element(by.xpath('//*[@id="object-form"]/div/div[13]/div/div/div/div[1]/button[3]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
      });
      it('Таблица для вывода объектов Ответственные лица', function () {
        element(by.xpath('//*[@id="table-executives"]')).isPresent().then(function (result) {
          expect(result).to.be.true;
        });
      });
      it('Кнопки для редактирования и добавления Муниципальных образований', function () {
        element(by.xpath('//*[@id="object-form"]/div/div[14]/div/div/div/div[1]/button[1]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
        element(by.xpath('//*[@id="object-form"]/div/div[14]/div/div/div/div[1]/button[2]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
        element(by.xpath('//*[@id="object-form"]/div/div[14]/div/div/div/div[1]/button[3]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
      });
      it('Таблица для вывода объектов Муниципальные образования', function () {
        element(by.xpath('//*[@id="table-municipals"]')).isPresent().then(function (result) {
          expect(result).to.be.true;
        });
      });
      it('Кнопки для редактирования и добавления Связанных новостей', function () {
        element(by.xpath('//*[@id="object-form"]/div/div[14]/div/div/div/div[1]/button[1]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
        element(by.xpath('//*[@id="object-form"]/div/div[14]/div/div/div/div[1]/button[2]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
        element(by.xpath('//*[@id="object-form"]/div/div[14]/div/div/div/div[1]/button[3]'))
          .isPresent().then(function (result) {
            expect(result).to.be.true;
          });
      });
      it('Таблица для вывода объектов Связанные новости', function () {
        element(by.xpath('//*[@id="table-municipals"]')).isPresent().then(function (result) {
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
  describe.skip('Проверяем задачи на контрольной панели', function () {
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
  describe.skip('Проверяем модели данных на контрольной панели', function () {
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
      browser.sleep(1000);
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

  describe.skip('Изменение всех полей при редактировании', function () {
    it ('Изменение поля Публиковать', function () {
      element.all(by.xpath('//*[@id="object-form"]/div/div[1]/div/div/label')).click();
      element(by.xpath('//*[@id="obj-isPublic"]')).isSelected().then(function (res) {
        expect(res).to.be.false;
      });
    });
    it('Изменение поля Важная новость', function () {
      element.all(by.xpath('//*[@id="object-form"]/div/div[2]/div/div/label')).click();
      element(by.xpath('//*[@id="obj-isImportant"]')).isSelected().then(function (res) {
        expect(res).to.be.false;
      });
    });
    it('Изменение поля Показать на главной', function () {
      element.all(by.xpath('//*[@id="object-form"]/div/div[3]/div/div/label')).click();
      element(by.xpath('//*[@id="obj-isFrontpage"]')).isSelected().then(function (res) {
        expect(res).to.be.false;
      });
    });
    it('Изменение поля Тип новости', function () {
      element(by.xpath('//*[@id="obj-type"]/option[2]')).getAttribute('value').then(function (res) {
        element(by.xpath('//*[@id="obj-type"]/option[2]')).click();
        expect(res).to.not.be.empty;
      });
    });
    it('Изменение поля Дата', function () {
      element(by.xpath('//*[@id="object-form"]/div/div[5]/div/div/input[2]')).click();
      element(by.xpath('/html/body/div[2]/div[1]/table/tbody/tr[2]/td[1]')).click();
      element(by.xpath('//*[@id="obj-date"]')).getAttribute('value').then(function (res) {
        expect(res).to.not.be.empty;
      });
    });
    it('Изменение поля Заголовок', function () {
      element(by.xpath('//*[@id="obj-title"]')).sendKeys(TestPostTitleE);
      element(by.xpath('//*[@id="obj-title"]')).getAttribute('value').then(function (res) {
        expect(res).to.be.equal(TestPostTitle + TestPostTitleE);
      });
    });
    it('Изменение поля Подзаголовок', function () {
      element(by.xpath('//*[@id="obj-subtitle"]')).sendKeys(TestPostTitleE);
      element(by.xpath('//*[@id="obj-subtitle"]')).getAttribute('value').then(function (res) {
        expect(res).to.be.equal(TestPostTitle + TestPostTitleE);
      });
    });
    it('Изменение поля Текст новости', function () {
      browser.switchTo().frame(0);
      element(by.xpath('/html/body')).sendKeys(TestPostTitleE);
      element(by.xpath('/html/body')).getText().then(function (res) {
        expect(res).to.be.equal(TestPostTitleE + TestPostTitle);
      });
      browser.switchTo().defaultContent();
    });
    it('Изменение поля Главное фото', function (done) {
      element(by.xpath('//*[@id="table-mainImage"]/tbody')).
        element(by.className('dataTables_empty')).isPresent().then(function (result) {
          if (result) {
            done();
          } else {
            browser.sleep(testConfig.browser.eachSleep);
            // Удаление привязанного объекта
            element(by.xpath('//*[@id="table-mainImage"]/tbody')).all(by.tagName('tr')).get(0).click();
            element(by.xpath('//*[@id="object-form"]/div/div[9]/div/div/div[2]/div[1]/button[3]')).click();
            browser.sleep(testConfig.browser.eachSleep);
            var al = browser.switchTo().alert();
            al.accept();
            element(by.xpath('//*[@id="table-mainImage"]/tbody')).
              element(by.className('dataTables_empty')).isPresent().then(function (res) {
                expect(res).to.be.true;
              });
            // Нажимаем на кнопку "Создать", должна открытся новая вкладка
            element(by.xpath('//*[@id="object-form"]/div/div[9]/div/div/div[2]/div[1]/button[1]')).click();
            browser.sleep(testConfig.browser.eachSleep);
            // Получаем хендлеры открытых вкладок
            browser.getAllWindowHandles().then(function (res) {
              // Переключаемся на новую вкладку после нажатия кнопки
              browser.switchTo().window(res[2]);
              browser.switchTo().activeElement();
              // Сранвиваем URL с необходимым
              browser.getCurrentUrl().then(function (url) {
                expect(url).to.be.equal(serverURL + '/ionadmin/models/image-list');
              });
              // Проверка наличия тестовых данных
              element(by.className('dataTables_empty')).isPresent().then(function (res) {
                expect(res).to.be.false;
              });
              // Выбираем первый элемент
              element(by.xpath('//*[@id="object-list"]/tbody')).all(by.tagName('tr')).get(0).click();
              // Нажимаем кнопку Выбрать
              element(by.xpath('//*[@id="select-btn"]')).click();
              // Переключаемся на старую вкладку
              browser.switchTo().window(res[1]);
              browser.switchTo().activeElement();
              // Проверка добавления
              element(by.xpath('//*[@id="table-mainImage"]')).
                element(by.className('dataTables_empty')).isPresent().then(function (res) {
                  expect(res).to.be.false;
                  done();
                });
            });
          }
        });
    });
    it('Изменение поля Фотосессия', function (done) {
      element(by.xpath('//*[@id="table-images"]/tbody')).
        element(by.className('dataTables_empty')).isPresent().then(function (result) {
          if (result) {
            done();
          } else {
            browser.sleep(testConfig.browser.eachSleep);
            // Удаление привязанного объекта
            element(by.xpath('//*[@id="table-images"]/tbody')).all(by.tagName('tr')).get(0).click();
            element (by.xpath('//*[@id="object-form"]/div/div[10]/div/div/div/div[1]/button[3]')).click();
            browser.sleep(testConfig.browser.eachSleep);
            var al = browser.switchTo().alert();
            al.accept();
            element(by.xpath('//*[@id="table-images"]/tbody')).
        element(by.className('dataTables_empty')).isPresent().then(function (res) {
          expect(res).to.be.true;
        });
            element (by.xpath('//*[@id="object-form"]/div/div[10]/div/div/div/div[1]/button[1]')).click();
            browser.sleep(testConfig.browser.eachSleep);
            browser.getAllWindowHandles().then(function (res) {
        browser.switchTo().window(res[2]);
        browser.switchTo().activeElement();
        browser.getCurrentUrl().then (function (url) {
          expect(url).to.be.equal(serverURL + '/ionadmin/models/image-list');
        });
        element(by.className('dataTables_empty')).isPresent().then(function (res) {
          expect(res).to.be.false;
        });
        element(by.xpath('//*[@id="object-list"]/tbody')).all(by.tagName('tr')).get(0).click();
        element(by.xpath('//*[@id="select-btn"]')).click();
        browser.switchTo().window(res[1]);
        browser.switchTo().activeElement();
        element(by.xpath('//*[@id="table-images"]')).
          element(by.className('dataTables_empty')).isPresent().then(function (res) {
            expect(res).to.be.false;
          });
      });
          }
        });
    });
    it('Изменение поля Категории', function (done) {
      element(by.xpath('//*[@id="table-categories"]/tbody')).
        element(by.className('dataTables_empty')).isPresent().then(function (result) {
          if (result) {
            done();
          } else {
            // Удаление привязанного объекта
            element(by.xpath('//*[@id="table-categories"]/tbody')).all(by.tagName('tr')).get(0).click();
            element(by.xpath('//*[@id="object-form"]/div/div[11]/div/div/div/div[1]/button[3]')).click();
            browser.sleep(testConfig.browser.eachSleep);
            var al = browser.switchTo().alert();
            al.accept();
            element(by.xpath('//*[@id="table-categories"]/tbody')).
        element(by.className('dataTables_empty')).isPresent().then(function (res) {
          expect(res).to.be.true;
        });
            // Добавление нового объекта
            element(by.xpath('//*[@id="object-form"]/div/div[11]/div/div/div/div[1]/button[1]')).click();
            browser.sleep(testConfig.browser.eachSleep);
            browser.getAllWindowHandles().then(function (res) {
        browser.switchTo().window(res[2]);
        browser.switchTo().activeElement();
        browser.getCurrentUrl().then(function (url) {
          expect(url).to.be.equal(serverURL + '/ionadmin/models/postCategory-list');
        });
        element(by.className('dataTables_empty')).isPresent().then(function (res) {
          expect(res).to.be.false;
        });
        element(by.xpath('//*[@id="object-list"]/tbody')).all(by.tagName('tr')).get(0).click();
        element(by.xpath('//*[@id="select-btn"]')).click();
        browser.switchTo().window(res[1]);
        browser.switchTo().activeElement();
        element(by.xpath('//*[@id="table-categories"]')).
          element(by.className('dataTables_empty')).isPresent().then(function (res) {
            expect(res).to.be.false;
            done();
          });
      });
          }
        });
    });
    it('Изменение поля Должностные лица', function (done) {
      element(by.xpath('//*[@id="table-officials"]/tbody')).
        element(by.className('dataTables_empty')).isPresent().then(function (result) {
          if (result) {
            done();
          } else {
            // Удаление привязанного объекта
            element(by.xpath('//*[@id="table-officials"]/tbody')).all(by.tagName('tr')).get(0).click();
            element(by.xpath('//*[@id="object-form"]/div/div[12]/div/div/div/div[1]/button[3]')).click();
            browser.sleep(testConfig.browser.eachSleep);
            var al = browser.switchTo().alert();
            al.accept();
            element(by.xpath('//*[@id="table-officials"]/tbody')).
        element(by.className('dataTables_empty')).isPresent().then(function (res) {
          expect(res).to.be.true;
        });
            // Добавление нового объекта
            element(by.xpath('//*[@id="object-form"]/div/div[12]/div/div/div/div[1]/button[1]')).click();
            browser.sleep(testConfig.browser.eachSleep);
            browser.getAllWindowHandles().then(function (res) {
        browser.switchTo().window(res[2]);
        browser.switchTo().activeElement();
        browser.getCurrentUrl().then(function (url) {
          expect(url).to.be.equal(serverURL + '/ionadmin/models/official-list');
        });
        element(by.className('dataTables_empty')).isPresent().then(function (res) {
          expect(res).to.be.false;
        });
        element(by.xpath('//*[@id="object-list"]/tbody')).all(by.tagName('tr')).get(0).click();
        element(by.xpath('//*[@id="select-btn"]')).click();
        browser.switchTo().window(res[1]);
        browser.switchTo().activeElement();
        element(by.xpath('//*[@id="table-officials"]')).
          element(by.className('dataTables_empty')).isPresent().then(function (res) {
            expect(res).to.be.false;
            done();
          });
      });
          }
        });
    });
    it('Изменение поля Ответственные лица', function (done) {
      element(by.xpath('//*[@id="table-executives"]/tbody')).
        element(by.className('dataTables_empty')).isPresent().then(function (result) {
          if (result) {
            done();
          } else {
            // Удаление привязанного объекта
            element(by.xpath('//*[@id="table-executives"]/tbody')).all(by.tagName('tr')).get(0).click();
            element(by.xpath('//*[@id="object-form"]/div/div[13]/div/div/div/div[1]/button[3]')).click();
            browser.sleep(testConfig.browser.eachSleep);
            var al = browser.switchTo().alert();
            al.accept();
            element(by.xpath('//*[@id="table-executives"]/tbody')).
              element(by.className('dataTables_empty')).isPresent().then(function (res) {
                expect(res).to.be.true;
              });
            // Добавление нового объекта
            element(by.xpath('//*[@id="object-form"]/div/div[13]/div/div/div/div[1]/button[1]')).click();
            browser.sleep(testConfig.browser.eachSleep);
            browser.getAllWindowHandles().then(function (res) {
              browser.switchTo().window(res[2]);
              browser.switchTo().activeElement();
              browser.getCurrentUrl().then(function (url) {
                expect(url).to.be.equal(serverURL + '/ionadmin/models/official-list');
              });
              element(by.className('dataTables_empty')).isPresent().then(function (res) {
                expect(res).to.be.false;
              });
              element(by.xpath('//*[@id="object-list"]/tbody')).all(by.tagName('tr')).get(0).click();
              element(by.xpath('//*[@id="select-btn"]')).click();
              browser.switchTo().window(res[1]);
              browser.switchTo().activeElement();
              element(by.xpath('//*[@id="table-executives"]')).
                element(by.className('dataTables_empty')).isPresent().then(function (res) {
                  expect(res).to.be.false;
                  done();
                });
            });
          }
        });
    });
    it('Изменение поля Муниципальные образования', function (done) {
      element(by.xpath('//*[@id="table-municipals"]/tbody')).
        element(by.className('dataTables_empty')).isPresent().then(function (result) {
          if (result) {
            done();
          } else {
            // Удаление привязанного объекта
            element(by.xpath('//*[@id="table-municipals"]/tbody')).all(by.tagName('tr')).get(0).click();
            element(by.xpath('//*[@id="object-form"]/div/div[14]/div/div/div/div[1]/button[3]')).click();
            browser.sleep(testConfig.browser.eachSleep);
            var al = browser.switchTo().alert();
            al.accept();
            element(by.xpath('//*[@id="table-municipals"]/tbody')).
              element(by.className('dataTables_empty')).isPresent().then(function (res) {
                expect(res).to.be.true;
              });
            // Добавление нового объекта
            element(by.xpath('//*[@id="object-form"]/div/div[14]/div/div/div/div[1]/button[1]')).click();
            browser.sleep(testConfig.browser.eachSleep);
            browser.getAllWindowHandles().then(function (res) {
              browser.switchTo().window(res[2]);
              browser.switchTo().activeElement();
              browser.getCurrentUrl().then(function (url) {
                expect(url).to.be.equal(serverURL + '/ionadmin/models/municipal-list');
              });
              element(by.className('dataTables_empty')).isPresent().then(function (res) {
                expect(res).to.be.false;
              });
              element(by.xpath('//*[@id="object-list"]/tbody')).all(by.tagName('tr')).get(0).click();
              element(by.xpath('//*[@id="select-btn"]')).click();
              browser.switchTo().window(res[1]);
              browser.switchTo().activeElement();
              element(by.xpath('//*[@id="table-municipals"]')).
                element(by.className('dataTables_empty')).isPresent().then(function (res) {
                  expect(res).to.be.false;
                  done();
                });
            });
          }
        });
    });
    it('Изменение поля Связанные новости', function (done) {
      element(by.xpath('//*[@id="table-relatedPosts"]/tbody')).
        element(by.className('dataTables_empty')).isPresent().then(function (result) {
          if (result) {
            done();
          } else {
            // Удаление привязанного объекта
            element(by.xpath('//*[@id="table-relatedPosts"]/tbody')).all(by.tagName('tr')).get(0).click();
            element(by.xpath('//*[@id="object-form"]/div/div[15]/div/div/div/div[1]/button[3]')).click();
            browser.sleep(testConfig.browser.eachSleep);
            var al = browser.switchTo().alert();
            al.accept();
            element(by.xpath('//*[@id="table-relatedPosts"]/tbody')).
              element(by.className('dataTables_empty')).isPresent().then(function (res) {
                expect(res).to.be.true;
              });
            // Добавление нового объекта
            element(by.xpath('//*[@id="object-form"]/div/div[15]/div/div/div/div[1]/button[1]')).click();
            browser.sleep(testConfig.browser.eachSleep);
            browser.getAllWindowHandles().then(function (res) {
              browser.switchTo().window(res[2]);
              browser.switchTo().activeElement();
              browser.getCurrentUrl().then(function (url) {
                expect(url).to.be.equal(serverURL + '/ionadmin/models/post-list');
              });
              element(by.className('dataTables_empty')).isPresent().then(function (res) {
                expect(res).to.be.false;
              });
              element(by.xpath('//*[@id="object-list"]/tbody')).all(by.tagName('tr')).get(0).click();
              element(by.xpath('//*[@id="select-btn"]')).click();
              browser.switchTo().window(res[1]);
              browser.switchTo().activeElement();
              element(by.xpath('//*[@id="table-relatedPosts"]')).
                element(by.className('dataTables_empty')).isPresent().then(function (res) {
                  expect(res).to.be.false;
                  done();
                });
            });
          }
        });
    });
  });
  describe.skip('Проверяем кнопку Сохранить', function () {
    it('Сохранение новости', function () {
      element(by.xpath('//*[@id="save-form"]')).click();
      browser.sleep(testConfig.browser.eachSleep);
      element(by.id('message-callout')).getText().then(function (result) {
        expect(result).to.be.equal('Объект сохранен');
      });
    });
    it('Проверка изменений', function () {
      browser.getAllWindowHandles().then(function (res) {
        browser.close();
        browser.switchTo().window(res[0]);
      });
      browser.refresh();
      browser.sleep(testConfig.browser.eachSleep);
      element(by.xpath('//*[@id="object-list"]/thead/tr[2]/th[1]')).click();
      element(by.xpath('//*[@id="object-list"]/thead/tr[2]/th[1]'))
        .getAttribute('aria-sort').then (function (res) {
        if (res == 'ascending') {element(by.xpath('//*[@id="object-list"]/thead/tr[2]/th[1]')).click();}
      });
      element(by.xpath('//*[@id="object-list"]/tbody')).all(by.tagName('tr'))
        .get(0).all(by.tagName('td')).get(2).getText().then(function (res) {
          expect(res).to.be.equal(TestPostTitle + TestPostTitleE);
        });
    });
  });
});
  done();
};
module.exports.EditPost = EditPost;
