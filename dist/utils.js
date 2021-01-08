'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var allureJsCommons = require('allure-js-commons');
var mergeAnything = require('merge-anything');
var path = require('path');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var defaultReporterConfig = {
    REPORTER_CONFIG_FILE: './allure.config.js',
    CATEGORIES_CONFIG_FILE: './allure-categories.config.js',
    RESULT_DIR: './allure/allure-results',
    REPORT_DIR: './allure/allure-report',
    SCREENSHOT_DIR: './allure/screenshots',
    CLEAN_RESULT_DIR: true,
    CLEAN_REPORT_DIR: true,
    CLEAN_SCREENSHOT_DIR: true,
    ENABLE_SCREENSHOTS: true,
    ENABLE_QUARANTINE: false,
    ENABLE_LOGGING: false,
    CONCURRENCY: 1,
    META: {
        SEVERITY: 'Normal',
        ISSUE_URL: 'https://jira.example.nl/browse/',
    },
    LABEL: {
        ISSUE: 'JIRA Issue',
        FLAKY: 'Flaky test',
        SCREENSHOT_MANUAL: 'Screenshot taken manually',
        SCREENSHOT_ON_FAIL: 'Screenshot taken on fail',
        DEFAULT_STEP_NAME: 'Test Step',
    },
};
var defaultCategoriesConfig = [
    {
        name: 'Ignored tests',
        matchedStatuses: [allureJsCommons.Status.SKIPPED],
    },
    {
        name: 'Product defects',
        matchedStatuses: [allureJsCommons.Status.FAILED],
        messageRegex: '.*Assertion failed.*',
    },
    {
        name: 'Test defects',
        matchedStatuses: [allureJsCommons.Status.FAILED],
    },
    {
        name: 'Warnings',
        matchedStatuses: [allureJsCommons.Status.PASSED],
        messageRegex: '.*Warning.*',
    },
    {
        name: 'Flaky tests',
        matchedStatuses: [allureJsCommons.Status.PASSED, allureJsCommons.Status.FAILED],
        messageRegex: '.*Flaky.*',
    },
];
function loadCustomConfig(configFile) {
    var customConfig = null;
    try {
        // The presence of this config module is not guarenteed therefore this approach is needed.
        /* eslint-disable-next-line import/no-dynamic-require,global-require */
        customConfig = require(path.resolve(process.cwd(), configFile));
    }
    catch (error) {
        customConfig = {};
    }
    return customConfig;
}
function loadReporterConfig() {
    var customConfig = loadCustomConfig(defaultReporterConfig.REPORTER_CONFIG_FILE);
    var mergedConfig = mergeAnything.merge(defaultReporterConfig, customConfig);
    return mergedConfig;
}

var reporterConfig = loadReporterConfig();
var TestStep = /** @class */ (function () {
    function TestStep(name, screenshotAmount) {
        if (screenshotAmount) {
            this.screenshotAmount = screenshotAmount;
        }
        else {
            this.screenshotAmount = 0;
        }
        if (name) {
            this.name = name;
        }
        else {
            this.name = reporterConfig.LABEL.DEFAULT_STEP_NAME;
        }
    }
    TestStep.prototype.registerScreenshot = function () {
        this.screenshotAmount += 1;
    };
    TestStep.prototype.mergeOnSameName = function (testStep) {
        if (this.name === testStep.name) {
            if (testStep.screenshotAmount) {
                this.screenshotAmount += testStep.screenshotAmount;
            }
            return true;
        }
        return false;
    };
    // eslint-disable-next-line no-undef
    TestStep.prototype.addStepToTest = function (test) {
        // Steps can be added to the metadata of the test for persistance.
        var meta = this.getMeta(test);
        if (!meta.steps) {
            meta.steps = [];
        }
        meta.steps.push(this);
    };
    // Using the Testcontroller type might cause an error because of a confict with TestCafé's TestController
    TestStep.prototype.getMeta = function (testController) {
        var meta = testController.testRun.test.meta;
        if (!meta) {
            meta = {};
            testController.testRun.test.meta = meta;
        }
        return meta;
    };
    return TestStep;
}());
/* The TestController loses its parameters when returned as a TestControllerPromise.
   Therefore the steps cannot be added without a clean TestController.
*/
// eslint-disable-next-line no-undef
function step(name, testController, stepAction) {
    return __awaiter(this, void 0, void 0, function () {
        var stepPromise, testStep;
        return __generator(this, function (_a) {
            stepPromise = stepAction;
            testStep = new TestStep(name);
            if (reporterConfig.ENABLE_SCREENSHOTS) {
                stepPromise = stepPromise.takeScreenshot();
                testStep.registerScreenshot();
            }
            testStep.addStepToTest(testController);
            return [2 /*return*/, stepPromise];
        });
    });
}

var reporterConfig$1 = loadReporterConfig();

Object.defineProperty(exports, 'Severity', {
    enumerable: true,
    get: function () {
        return allureJsCommons.Severity;
    }
});
exports.reporterConfig = reporterConfig$1;
exports.step = step;
