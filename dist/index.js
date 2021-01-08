'use strict';

var allureJsCommons = require('allure-js-commons');
var uuid = require('uuid');
var fs = require('fs');
var mergeAnything = require('merge-anything');
var path = require('path');
var rimraf = require('rimraf');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var rimraf__default = /*#__PURE__*/_interopDefaultLegacy(rimraf);

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

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

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
function loadCategoriesConfig() {
    var customConfig = loadCustomConfig(defaultReporterConfig.CATEGORIES_CONFIG_FILE);
    if (customConfig instanceof Array) {
        return customConfig;
    }
    return defaultCategoriesConfig;
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

function addNewLine(text, line) {
    if (text === null || text.length === 0) {
        return line;
    }
    return text + "\n" + line;
}

var reporterConfig$1 = loadReporterConfig();
var Metadata = /** @class */ (function () {
    function Metadata(meta, test) {
        var _this = this;
        this.flaky = false;
        this.otherMeta = new Map();
        if (meta) {
            var severity = meta.severity, description = meta.description, issue = meta.issue, suite = meta.suite, epic = meta.epic, story = meta.story, feature = meta.feature, flaky = meta.flaky, steps = meta.steps, otherMeta_1 = __rest(meta, ["severity", "description", "issue", "suite", "epic", "story", "feature", "flaky", "steps"]);
            if (this.isValidEnumValue(severity, allureJsCommons.Severity)) {
                this.severity = severity;
            }
            if (this.isString(description)) {
                this.description = description;
            }
            if (this.isString(issue)) {
                this.issue = issue;
            }
            if (this.isString(suite)) {
                if (test) {
                    this.sub_suite = suite;
                }
                else {
                    this.parent_suite = suite;
                }
            }
            if (this.isString(epic)) {
                this.epic = epic;
            }
            if (this.isString(story)) {
                this.story = story;
            }
            if (this.isString(feature)) {
                this.feature = feature;
            }
            if (this.isBoolean(flaky)) {
                this.flaky = flaky;
            }
            if (steps) {
                this.steps = steps;
            }
            Object.keys(otherMeta_1).forEach(function (key) {
                if (_this.isString(otherMeta_1[key])) {
                    _this.otherMeta.set(key, otherMeta_1[key]);
                }
            });
        }
    }
    Metadata.prototype.addMetadataToTest = function (test, groupMetadata) {
        if (!(groupMetadata instanceof Metadata)) {
            throw new Error('groupMetadata is not a valid Metadata object');
        }
        // Once metadata has been set it cannot be overritten,
        // therefore priority metadata has to be loaded added first
        // The results will list both entries if both added but allure will only take the first.
        this.mergeMetadata(groupMetadata);
        // Labels only accept specific keys/names as valid, it will ignore all other labels
        // Other variabels have to be added as parameters or links.
        // Only the first severity value is loaded.
        if (this.severity) {
            test.addLabel(allureJsCommons.LabelName.SEVERITY, this.severity);
        }
        else {
            // If no severity is given, set the default severity
            test.addLabel(allureJsCommons.LabelName.SEVERITY, reporterConfig$1.META.SEVERITY);
        }
        // Tests can be added to multiple suites at the same time.
        // Suites support 3 different suite levels: Parent, Suite, Sub
        // A test can have multiple of the same level suites but this will duplicate the test in the report
        // If a test has 2 parents and 2 suites the result will be that the test is duplicated 4 times for each combination.
        // Therefore it is advisable to only use suites to categorise them in single fixtures and not for custom configurations.
        if (this.parent_suite) {
            test.addLabel(allureJsCommons.LabelName.PARENT_SUITE, this.parent_suite);
        }
        if (this.suite) {
            test.addLabel(allureJsCommons.LabelName.SUITE, this.suite);
        }
        if (this.sub_suite) {
            test.addLabel(allureJsCommons.LabelName.SUB_SUITE, this.sub_suite);
        }
        // BDD style notation, containing Epics, Features, and Stories can be added to the tests.
        // These labels work the same way as the suites containing 3 levels. These are in order: Epic -> Feature -> Story
        if (this.epic) {
            test.addLabel(allureJsCommons.LabelName.EPIC, this.epic);
        }
        if (this.feature) {
            test.addLabel(allureJsCommons.LabelName.FEATURE, this.feature);
        }
        if (this.story) {
            test.addLabel(allureJsCommons.LabelName.STORY, this.story);
        }
        if (this.issue) {
            test.addLink("" + reporterConfig$1.META.ISSUE_URL + this.issue, reporterConfig$1.LABEL.ISSUE + ": " + this.issue, allureJsCommons.LinkType.ISSUE);
        }
        if (this.description) {
            /* eslint-disable-next-line no-param-reassign */
            test.description = this.description;
        }
        // Flaky is a boolean, only add to test if flaky is true.
        if (this.flaky) {
            // TODO: Add flaky correctly to allure instead of as a parameter
            // However currenly allure-js-commons does not seem to support flaky tests.
            test.addParameter(reporterConfig$1.LABEL.FLAKY, this.flaky.toString());
        }
        Array.from(this.otherMeta.entries()).map(function (entry) {
            test.addParameter(entry[0], entry[1]);
        });
    };
    Metadata.prototype.mergeMetadata = function (metadata) {
        var _this = this;
        // Local metadata takes preference to merged metadata
        if (!this.severity && metadata.severity) {
            this.severity = metadata.severity;
        }
        if (!this.description && metadata.description) {
            this.description = metadata.description;
        }
        if (!this.issue && metadata.issue) {
            this.issue = metadata.issue;
        }
        // Parent_Suite and Suite are used from the merged metadata but Sub_Suite is not.
        if (!this.parent_suite && metadata.parent_suite) {
            this.parent_suite = metadata.parent_suite;
        }
        if (!this.suite && metadata.suite) {
            this.suite = metadata.suite;
        }
        if (!this.epic && metadata.epic) {
            this.epic = metadata.epic;
        }
        if (!this.story && metadata.story) {
            this.story = metadata.story;
        }
        if (!this.feature && metadata.feature) {
            this.feature = metadata.feature;
        }
        if (metadata.flaky) {
            this.flaky = metadata.flaky;
        }
        if (metadata.otherMeta.size > 0) {
            Array.from(metadata.otherMeta.entries()).map(function (entry) {
                if (!_this.otherMeta.has(entry[0])) {
                    _this.otherMeta.set(entry[0], entry[1]);
                }
            });
        }
    };
    Metadata.prototype.setFlaky = function () {
        this.flaky = true;
    };
    Metadata.prototype.getSteps = function () {
        if (this.steps) {
            return this.steps;
        }
        return null;
    };
    Metadata.prototype.isValidEnumValue = function (value, validEnum) {
        if (!value) {
            return false;
        }
        return value.toUpperCase() in validEnum;
    };
    Metadata.prototype.isString = function (value) {
        if (!value) {
            return false;
        }
        return typeof value === 'string';
    };
    Metadata.prototype.isBoolean = function (value) {
        return typeof value === 'boolean';
    };
    return Metadata;
}());

/* eslint-disable @typescript-eslint/no-unused-vars,class-methods-use-this */
var reporterConfig$2 = loadReporterConfig();
var categoriesConfig = loadCategoriesConfig();
var AllureReporter = /** @class */ (function () {
    function AllureReporter(allureConfig, userAgents) {
        this.runtime = null;
        this.userAgents = null;
        /* TestCafé does not run the groups concurrently when running the tests concurrently and will end the tests sequentially based on their group/fixture.
        This allows for only a single group and group meta to be stored at once.
        Saving them in the same way as the tests is also not possible because TestCafé does not call the reporter when a group has ended it is, therefore, not possible to end the groups based on their name. */
        this.group = null;
        /* To differentiate between the running tests when running concurrently they are stored using their name as the unique key. */
        this.tests = {};
        var config;
        if (!allureConfig) {
            config = new allureJsCommons.AllureConfig(reporterConfig$2.RESULT_DIR);
        }
        else {
            config = allureConfig;
        }
        this.userAgents = userAgents;
        this.runtime = new allureJsCommons.AllureRuntime(config);
    }
    AllureReporter.prototype.setGlobals = function () {
        // Writing the globals has to be done after the first group has been written for a currently unknown reason.
        // Best to call this function in reporterTaskEnd and to write it as the last thing.
        this.runtime.writeCategoriesDefinitions(categoriesConfig);
        if (this.userAgents) {
            this.runtime.writeEnvironmentInfo({ browsers: this.userAgents.toString() });
        }
    };
    AllureReporter.prototype.startGroup = function (name, meta) {
        this.groupMetadata = new Metadata(meta);
        this.groupMetadata.suite = name;
        this.group = this.runtime.startGroup(name);
    };
    AllureReporter.prototype.endGroup = function () {
        var currentGroup = this.group;
        if (currentGroup !== null) {
            currentGroup.endGroup();
        }
    };
    AllureReporter.prototype.startTest = function (name, meta) {
        var currentGroup = this.group;
        if (currentGroup === null) {
            throw new Error('No active suite');
        }
        var currentTest = currentGroup.startTest(name);
        currentTest.fullName = currentGroup.name + " : " + name;
        currentTest.historyId = uuid.v4();
        currentTest.stage = allureJsCommons.Stage.RUNNING;
        this.setCurrentTest(name, currentTest);
    };
    AllureReporter.prototype.endTest = function (name, testRunInfo, meta) {
        var currentTest = this.getCurrentTest(name);
        // If no currentTest exists create a new one
        if (currentTest === null) {
            this.startTest(name, meta);
            currentTest = this.getCurrentTest(name);
        }
        var hasErrors = !!testRunInfo.errs && !!testRunInfo.errs.length;
        var hasWarnings = !!testRunInfo.warnings && !!testRunInfo.warnings.length;
        var isSkipped = testRunInfo.skipped;
        var testMessages = '';
        var testDetails = '';
        if (isSkipped) {
            currentTest.status = allureJsCommons.Status.SKIPPED;
        }
        else if (hasErrors) {
            currentTest.status = allureJsCommons.Status.FAILED;
            var mergedErrors = this.mergeErrors(testRunInfo.errs);
            mergedErrors.forEach(function (error) {
                if (error.errMsg) {
                    testMessages = addNewLine(testMessages, error.errMsg);
                }
                // TODO: Add detailed error stacktrace
                // How to convert CallSiteRecord to stacktrace?
                var callSite = error.callsite;
                if (callSite) {
                    if (callSite.filename) {
                        testDetails = addNewLine(testDetails, "File name: " + callSite.filename);
                    }
                    if (callSite.lineNum) {
                        testDetails = addNewLine(testDetails, "Line number: " + callSite.lineNum);
                    }
                }
                if (error.userAgent) {
                    testDetails = addNewLine(testDetails, "User Agent(s): " + error.userAgent);
                }
            });
        }
        else {
            currentTest.status = allureJsCommons.Status.PASSED;
        }
        if (hasWarnings) {
            testRunInfo.warnings.forEach(function (warning) {
                testMessages = addNewLine(testMessages, warning);
            });
        }
        var currentMetadata = new Metadata(meta, true);
        if (testRunInfo.unstable) {
            currentMetadata.setFlaky();
        }
        if (currentMetadata.flaky) {
            testMessages = addNewLine(testMessages, reporterConfig$2.LABEL.FLAKY);
        }
        currentMetadata.addMetadataToTest(currentTest, this.groupMetadata);
        // If steps exist handle them, if not add screenshots to base of the test.
        var testSteps = currentMetadata.getSteps();
        if (testSteps) {
            this.addStepsWithAttachments(currentTest, testRunInfo, testSteps);
        }
        else {
            this.addScreenshotAttachments(currentTest, testRunInfo);
        }
        this.addVideoAttachments(currentTest, testRunInfo);
        currentTest.detailsMessage = testMessages;
        currentTest.detailsTrace = testDetails;
        currentTest.stage = allureJsCommons.Stage.FINISHED;
        currentTest.endTest();
    };
    //Add video attachments if Video capture is set 
    AllureReporter.prototype.addVideoAttachments = function (currentTest, testRunInfo) {
        var _this = this;
        if (testRunInfo.videos) {
            testRunInfo.videos.forEach(function (video) {
                var file = _this.runtime.writeAttachment(fs.readFileSync(video.videoPath), allureJsCommons.ContentType.WEBM);
                currentTest.addAttachment("Video", allureJsCommons.ContentType.WEBM, file);
            });
        }
    };
    /* To add the screenshots to the correct test steps they have to be loaded from testRunInfo.screenshots.
    Because of how the screenshots are registered within TestCafé the only data the TestStep has via the metadata is the amount
    of screenshots taken an no reference to which screeshot was taken.
    However because both the screenshots and the TestSteps are saved chronologically it can be determined what screenshots are part
    each TestStep by keeping an index of the current screenshot and the number of screenshots taken per TestStep and looping through them. */
    AllureReporter.prototype.addStepsWithAttachments = function (test, testRunInfo, steps) {
        var mergedSteps = this.mergeSteps(steps);
        var stepAmount = mergedSteps.length;
        var stepLastIndex = stepAmount - 1;
        var screenshotIndex = 0;
        for (var i = 0; i < stepAmount; i += 1) {
            var testStep = mergedSteps[i];
            var allureStep = test.startStep(testStep.name);
            if (testStep.screenshotAmount && testStep.screenshotAmount > 0) {
                for (var j = 0; j < testStep.screenshotAmount; j += 1) {
                    var screenshot = testRunInfo.screenshots[screenshotIndex];
                    this.addScreenshotAttachment(allureStep, screenshot);
                    screenshotIndex += 1;
                }
            }
            /* Steps do not record the state they finished because this data is not available from TestCafé.
            If a step is not last it can be assumed that the step was successfull because otherwise the test would of stopped earlier.
            If a step is last the status from the test itself should be copied. */
            if (i === stepLastIndex) {
                allureStep.status = test.status;
            }
            else {
                allureStep.status = allureJsCommons.Status.PASSED;
            }
            allureStep.stage = allureJsCommons.Stage.FINISHED;
            allureStep.endStep();
        }
    };
    AllureReporter.prototype.addScreenshotAttachments = function (test, testRunInfo) {
        var _this = this;
        if (testRunInfo.screenshots) {
            testRunInfo.screenshots.forEach(function (screenshot) {
                _this.addScreenshotAttachment(test, screenshot);
            });
        }
    };
    AllureReporter.prototype.addScreenshotAttachment = function (test, screenshot) {
        if (screenshot.screenshotPath && fs.existsSync(screenshot.screenshotPath)) {
            var screenshotName = void 0;
            if (screenshot.takenOnFail) {
                screenshotName = reporterConfig$2.LABEL.SCREENSHOT_ON_FAIL;
            }
            else {
                screenshotName = reporterConfig$2.LABEL.SCREENSHOT_MANUAL;
            }
            // Add the useragent data to the screenshots to differentiate between browsers within the tests.
            if (this.userAgents && this.userAgents.length > 1 && screenshot.userAgent) {
                screenshotName = screenshotName + " - " + screenshot.userAgent;
            }
            var img = fs.readFileSync(screenshot.screenshotPath);
            var file = this.runtime.writeAttachment(img, allureJsCommons.ContentType.PNG);
            test.addAttachment(screenshotName, allureJsCommons.ContentType.PNG, file);
        }
    };
    /* Merge the steps together based on their name. */
    AllureReporter.prototype.mergeSteps = function (steps) {
        var mergedSteps = [];
        steps.forEach(function (step) {
            if (step && step.name) {
                var stepExists_1 = false;
                mergedSteps.forEach(function (mergedStep) {
                    stepExists_1 = mergedStep.mergeOnSameName(step);
                });
                if (!stepExists_1) {
                    mergedSteps.push(new TestStep(step.name, step.screenshotAmount));
                }
            }
        });
        return mergedSteps;
    };
    /* Merge the errors together based on their message. */
    AllureReporter.prototype.mergeErrors = function (errors) {
        var mergedErrors = [];
        errors.forEach(function (error) {
            if (error && error.errMsg) {
                var errorExists_1 = false;
                mergedErrors.forEach(function (mergedError) {
                    if (error.errMsg === mergedError.errMsg) {
                        errorExists_1 = true;
                        if (error.userAgent && mergedError.userAgent !== error.userAgent) {
                            /* eslint-disable-next-line no-param-reassign */
                            mergedError.userAgent = mergedError.userAgent + ", " + error.userAgent;
                        }
                    }
                });
                if (!errorExists_1) {
                    mergedErrors.push(error);
                }
            }
        });
        return mergedErrors;
    };
    AllureReporter.prototype.getCurrentTest = function (name) {
        if (name) {
            var allureTest = this.tests[name.toString()];
            if (allureTest) {
                return allureTest;
            }
        }
        return null;
    };
    AllureReporter.prototype.setCurrentTest = function (name, test) {
        if (name && test) {
            this.tests[name] = test;
        }
    };
    return AllureReporter;
}());

var reporterConfig$3 = loadReporterConfig();
function deleteFolderContents(dataPath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!dataPath) return [3 /*break*/, 2];
                    return [4 /*yield*/, rimraf__default['default'](dataPath + "/*", function () { })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function cleanAllureFolders() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!reporterConfig$3.CLEAN_RESULT_DIR) return [3 /*break*/, 2];
                    return [4 /*yield*/, deleteFolderContents(path.resolve(process.cwd(), reporterConfig$3.RESULT_DIR))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!reporterConfig$3.CLEAN_REPORT_DIR) return [3 /*break*/, 4];
                    return [4 /*yield*/, deleteFolderContents(path.resolve(process.cwd(), reporterConfig$3.REPORT_DIR))];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    if (!reporterConfig$3.CLEAN_SCREENSHOT_DIR) return [3 /*break*/, 6];
                    return [4 /*yield*/, deleteFolderContents(path.resolve(process.cwd(), reporterConfig$3.SCREENSHOT_DIR))];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}

var reporterConfig$4 = loadReporterConfig();
function log(reporter, text) {
    if (reporterConfig$4.ENABLE_LOGGING) {
        reporter.write(text).newline();
    }
}

function index () {
    return {
        allureReporter: null,
        allureConfig: null,
        /* Used to get the reporter for unittesting itself. */
        getReporter: function () {
            return this;
        },
        preloadConfig: function (allureConfig) {
            this.allureConfig = allureConfig;
        },
        reportTaskStart: function (startTime, userAgents, testCount) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            log(this, 'Starting Task');
                            this.allureReporter = new AllureReporter(this.allureConfig, userAgents);
                            // Clean the previous allure results
                            return [4 /*yield*/, cleanAllureFolders()];
                        case 1:
                            // Clean the previous allure results
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        reportFixtureStart: function (name, path, meta) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    log(this, "Starting Fixture: " + name);
                    // End the previous group because testcafe does not trigger the reporter when a fixture ends.
                    this.allureReporter.endGroup();
                    this.allureReporter.startGroup(name, meta);
                    return [2 /*return*/];
                });
            });
        },
        reportTestStart: function (name, meta) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    log(this, "Starting Test: " + name);
                    this.allureReporter.startTest(name, meta);
                    return [2 /*return*/];
                });
            });
        },
        reportTestDone: function (name, testRunInfo, meta) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    log(this, "Ending Test: " + name);
                    this.allureReporter.endTest(name, testRunInfo, meta);
                    return [2 /*return*/];
                });
            });
        },
        reportTaskDone: function (endTime, passed, warnings, result) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    log(this, 'Ending Task');
                    this.allureReporter.endGroup();
                    this.allureReporter.setGlobals();
                    return [2 /*return*/];
                });
            });
        },
    };
}

module.exports = index;
