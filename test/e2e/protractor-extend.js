// Уточняем параметры jsHint.
// expr - убрать предупреждение для функций без (): expect(...).to.have.been.called или expect(...).to.be.ok
// maxstatements - множественные describe/it/expect одного уровня в одной группе describe или it
// jshint expr: true, maxstatements:20
/**
 * Actively wait for an element present and displayed up to specTimeoutMs
 * ignoring useless webdriver errors like StaleElementError.
 *
 * Usage:
 * Add `require('./waitReady.js');` in your onPrepare block or file.
 *
 * @example
 * expect($('.some-html-class').waitReady()).toBeTruthy();
 */
'use strict';
/**
 * Current workaround until https://github.com/angular/protractor/issues/1102
 * @type {Function}
 */
var ElementFinder = $('').constructor;
var config = require('./config');
browser.constructor.prototype.selectActiveWindow = function (param) {
  switch (param) {
    case 'first':
      browser.getAllWindowHandles().then(function (handles) {
        browser.switchTo().window(handles[0]);
      });
      break;
    case 'second':
      browser.getAllWindowHandles().then(function (handles) {
        browser.switchTo().window(handles[1]);
      });
      break;
    default:
    case 'last':
      browser.getAllWindowHandles().then(function (handles) {
        browser.switchTo().window(handles[handles.length - 1]);
      });
      break;
  }
};

ElementFinder.prototype.waitElementReady = function (option) {
  var _this = this;
  var driverWaitIterations = 0;
  var lastWebdriverError;

  function clickThis(button, curClickAttempt) {
    if (curClickAttempt < config.browser.maxClickAttempts) {
      button.click().then(null, function () {
        curClickAttempt++;
        console.log('Неудачная попытка клика #' +
            curClickAttempt + '. Повтор через 1 секунду');
        browser.sleep(config.browser.waitBetweenAttempts);
        clickThis(_this, curClickAttempt);
      });
    } else {
      console.log('##Ошибка: элемент не найден после ' + curClickAttempt + ' попыток. Прерывание теста');
      process.exit(1);
    }
  }

  function _throwError() {
    throw new Error('Expected "' + _this.locator().toString() +
      '" to be present and visible. ' +
      'After ' + driverWaitIterations + ' driverWaitIterations. ' +
      'Last webdriver error: ' + lastWebdriverError);
  }

  function _isPresentError(err) {
    lastWebdriverError = err !== null ? err.toString() : err;
    return false;
  }

  return browser.driver.wait(function () {
    driverWaitIterations++;
    if (option === 'withRefresh') {
      if (driverWaitIterations > 7) {
        _refreshPage();
      }
    }
    return _this.isPresent().then(function (present) {
      if (present) {
        return _this.isDisplayed().then(function (visible) {
          if (visible) {
            if (option === 'withClick') {
              clickThis(_this, 0); // CHECKME другой способ подсчета итераций. Нужен ли?
              lastWebdriverError = 'in wClick visible:' + visible;
              return visible;
            } else {
              lastWebdriverError = 'visible:' + visible;
              return visible;
            }
          } else {
            lastWebdriverError = 'visible:' + visible;
            return false;
          }
        }, _isPresentError);
      } else {
        lastWebdriverError = 'present:' + present;
        return false;
      }
    }, _isPresentError);
  }, config.browser.elementWait).then(function (waitResult) {
    if (!waitResult) {
      _throwError();
    }
    return waitResult;
  }, function (err) {
    console.log('Ошибка', err.toString());
    _isPresentError(err);
    _throwError();
    return false;
  });
};

// Helpers
function _refreshPage() {
  browser.navigate().refresh().then(function () {
  }, function (e) {
  });
}

