'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var allureJsCommons = require('allure-js-commons');
var mergeAnything = require('merge-anything');
var path = require('path');

const defaultReporterConfig = {
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
const defaultCategoriesConfig = [
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
    let customConfig = null;
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
    const customConfig = loadCustomConfig(defaultReporterConfig.REPORTER_CONFIG_FILE);
    const mergedConfig = mergeAnything.merge(defaultReporterConfig, customConfig);
    return mergedConfig;
}

const reporterConfig = loadReporterConfig();
var testStep;
class TestStep {
    constructor(name, screenshotAmount) {
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
    registerScreenshot() {
        this.screenshotAmount += 1;
    }
    mergeOnSameName(testStep) {
        if (this.name === testStep.name) {
            if (testStep.screenshotAmount) {
                this.screenshotAmount += testStep.screenshotAmount;
            }
            return true;
        }
        return false;
    }
    // eslint-disable-next-line no-undef
    addStepToTest(test) {
        // Steps can be added to the metadata of the test for persistance.
        const meta = this.getMeta(test);
        if (!meta.steps) {
            meta.steps = [];
        }
        meta.steps.push(this);
    }
    // Using the Testcontroller type might cause an error because of a confict with TestCafé's TestController
    getMeta(testController) {
        let { meta } = testController.testRun.test;
        if (!meta) {
            meta = {};
            testController.testRun.test.meta = meta;
        }
        return meta;
    }
}
/* The TestController loses its parameters when returned as a TestControllerPromise.
   Therefore the steps cannot be added without a clean TestController.
*/
// eslint-disable-next-line no-undef
async function step(name, testController, stepAction) {
    const testStep = new TestStep(name);
    testStep.addStepToTest(testController);
    let stepPromise = await stepAction;
    if (reporterConfig.ENABLE_SCREENSHOTS) {
        await testController.takeScreenshot();
        testStep.registerScreenshot();
    }
    return stepPromise;
}
async function stepStart(name, testController) {
    testStep = new TestStep(name);
    testStep.addStepToTest(testController);
}
async function stepEnd(testController) {
    if (reporterConfig.ENABLE_SCREENSHOTS) {
        await testController.takeScreenshot();
        testStep.registerScreenshot();
    }
}

const reporterConfig$1 = loadReporterConfig();

Object.defineProperty(exports, 'Severity', {
  enumerable: true,
  get: function () {
    return allureJsCommons.Severity;
  }
});
exports.reporterConfig = reporterConfig$1;
exports.step = step;
exports.stepEnd = stepEnd;
exports.stepStart = stepStart;
