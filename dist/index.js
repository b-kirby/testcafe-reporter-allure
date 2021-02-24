'use strict';

var allureJsCommons = require('allure-js-commons');
var uuid = require('uuid');
var fs = require('fs');
var mergeAnything = require('merge-anything');
var path = require('path');
var rimraf = require('rimraf');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var rimraf__default = /*#__PURE__*/_interopDefaultLegacy(rimraf);

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
function loadCategoriesConfig() {
    const customConfig = loadCustomConfig(defaultReporterConfig.CATEGORIES_CONFIG_FILE);
    if (customConfig instanceof Array) {
        return customConfig;
    }
    return defaultCategoriesConfig;
}

const reporterConfig = loadReporterConfig();
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

function addNewLine(text, line) {
    if (text === null || text.length === 0) {
        return line;
    }
    return `${text}\n${line}`;
}

/* eslint-disable class-methods-use-this,array-callback-return */
const reporterConfig$1 = loadReporterConfig();
class Metadata {
    constructor(meta, test) {
        this.flaky = false;
        this.otherMeta = new Map();
        if (meta) {
            const { severity, description, issue, suite, epic, story, feature, flaky, steps, ...otherMeta } = meta;
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
            Object.keys(otherMeta).forEach((key) => {
                if (this.isString(otherMeta[key])) {
                    this.otherMeta.set(key, otherMeta[key]);
                }
            });
        }
    }
    addMetadataToTest(test, groupMetadata) {
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
            test.addLink(`${reporterConfig$1.META.ISSUE_URL}${this.issue}`, `${reporterConfig$1.LABEL.ISSUE}: ${this.issue}`, allureJsCommons.LinkType.ISSUE);
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
        Array.from(this.otherMeta.entries()).map((entry) => {
            test.addParameter(entry[0], entry[1]);
        });
    }
    mergeMetadata(metadata) {
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
            Array.from(metadata.otherMeta.entries()).map((entry) => {
                if (!this.otherMeta.has(entry[0])) {
                    this.otherMeta.set(entry[0], entry[1]);
                }
            });
        }
    }
    setFlaky() {
        this.flaky = true;
    }
    getSteps() {
        if (this.steps) {
            return this.steps;
        }
        return null;
    }
    isValidEnumValue(value, validEnum) {
        if (!value) {
            return false;
        }
        return value.toUpperCase() in validEnum;
    }
    isString(value) {
        if (!value) {
            return false;
        }
        return typeof value === 'string';
    }
    isBoolean(value) {
        return typeof value === 'boolean';
    }
}

/* eslint-disable @typescript-eslint/no-unused-vars,class-methods-use-this */
const reporterConfig$2 = loadReporterConfig();
const categoriesConfig = loadCategoriesConfig();
class AllureReporter {
    constructor(allureConfig, userAgents) {
        this.runtime = null;
        this.userAgents = null;
        /* TestCafé does not run the groups concurrently when running the tests concurrently and will end the tests sequentially based on their group/fixture.
        This allows for only a single group and group meta to be stored at once.
        Saving them in the same way as the tests is also not possible because TestCafé does not call the reporter when a group has ended it is, therefore, not possible to end the groups based on their name. */
        this.group = null;
        /* To differentiate between the running tests when running concurrently they are stored using their name as the unique key. */
        this.tests = {};
        let config;
        if (!allureConfig) {
            config = new allureJsCommons.AllureConfig(reporterConfig$2.RESULT_DIR);
        }
        else {
            config = allureConfig;
        }
        this.userAgents = userAgents;
        this.runtime = new allureJsCommons.AllureRuntime(config);
    }
    setGlobals() {
        // Writing the globals has to be done after the first group has been written for a currently unknown reason.
        // Best to call this function in reporterTaskEnd and to write it as the last thing.
        this.runtime.writeCategoriesDefinitions(categoriesConfig);
        if (this.userAgents) {
            this.runtime.writeEnvironmentInfo({ browsers: this.userAgents.toString() });
        }
    }
    startGroup(name, meta) {
        this.groupMetadata = new Metadata(meta);
        this.groupMetadata.suite = name;
        this.group = this.runtime.startGroup(name);
    }
    endGroup() {
        const currentGroup = this.group;
        if (currentGroup !== null) {
            currentGroup.endGroup();
        }
    }
    startTest(name, meta) {
        const currentGroup = this.group;
        if (currentGroup === null) {
            throw new Error('No active suite');
        }
        const currentTest = currentGroup.startTest(name);
        currentTest.fullName = `${currentGroup.name} : ${name}`;
        currentTest.historyId = uuid.v4();
        currentTest.stage = allureJsCommons.Stage.RUNNING;
        this.setCurrentTest(name, currentTest);
    }
    endTest(name, testRunInfo, meta) {
        let currentTest = this.getCurrentTest(name);
        // If no currentTest exists create a new one
        if (currentTest === null) {
            this.startTest(name, meta);
            currentTest = this.getCurrentTest(name);
        }
        const hasErrors = !!testRunInfo.errs && !!testRunInfo.errs.length;
        const hasWarnings = !!testRunInfo.warnings && !!testRunInfo.warnings.length;
        const isSkipped = testRunInfo.skipped;
        let testMessages = '';
        let testDetails = '';
        if (isSkipped) {
            currentTest.status = allureJsCommons.Status.SKIPPED;
        }
        else if (hasErrors) {
            currentTest.status = allureJsCommons.Status.FAILED;
            const mergedErrors = this.mergeErrors(testRunInfo.errs);
            mergedErrors.forEach((error) => {
                if (error.errMsg) {
                    testMessages = addNewLine(testMessages, error.errMsg);
                }
                // TODO: Add detailed error stacktrace
                // How to convert CallSiteRecord to stacktrace?
                const callSite = error.callsite;
                if (callSite) {
                    if (callSite.filename) {
                        testDetails = addNewLine(testDetails, `File name: ${callSite.filename}`);
                    }
                    if (callSite.lineNum) {
                        testDetails = addNewLine(testDetails, `Line number: ${callSite.lineNum}`);
                    }
                }
                if (error.userAgent) {
                    testDetails = addNewLine(testDetails, `User Agent(s): ${error.userAgent}`);
                }
            });
        }
        else {
            currentTest.status = allureJsCommons.Status.PASSED;
        }
        if (hasWarnings) {
            testRunInfo.warnings.forEach((warning) => {
                testMessages = addNewLine(testMessages, warning);
            });
        }
        const currentMetadata = new Metadata(meta, true);
        if (testRunInfo.unstable) {
            currentMetadata.setFlaky();
        }
        if (currentMetadata.flaky) {
            testMessages = addNewLine(testMessages, reporterConfig$2.LABEL.FLAKY);
        }
        currentMetadata.addMetadataToTest(currentTest, this.groupMetadata);
        // If steps exist handle them, if not add screenshots to base of the test.
        const testSteps = currentMetadata.getSteps();
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
    }
    //Add video attachments if Video capture is set 
    addVideoAttachments(currentTest, testRunInfo) {
        if (testRunInfo.videos) {
            testRunInfo.videos.forEach(video => {
                const file = this.runtime.writeAttachment(fs.readFileSync(video.videoPath), allureJsCommons.ContentType.WEBM);
                currentTest.addAttachment("Video", allureJsCommons.ContentType.WEBM, file);
            });
        }
    }
    /* To add the screenshots to the correct test steps they have to be loaded from testRunInfo.screenshots.
    Because of how the screenshots are registered within TestCafé the only data the TestStep has via the metadata is the amount
    of screenshots taken an no reference to which screeshot was taken.
    However because both the screenshots and the TestSteps are saved chronologically it can be determined what screenshots are part
    each TestStep by keeping an index of the current screenshot and the number of screenshots taken per TestStep and looping through them. */
    addStepsWithAttachments(test, testRunInfo, steps) {
        const mergedSteps = this.mergeSteps(steps);
        const stepAmount = mergedSteps.length;
        const stepLastIndex = stepAmount - 1;
        let screenshotIndex = 0;
        for (let i = 0; i < stepAmount; i += 1) {
            const testStep = mergedSteps[i];
            const allureStep = test.startStep(testStep.name);
            if (testStep.screenshotAmount && testStep.screenshotAmount > 0) {
                for (let j = 0; j < testStep.screenshotAmount; j += 1) {
                    const screenshot = testRunInfo.screenshots[screenshotIndex];
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
        /* Handle failure screenshots */
        testRunInfo.screenshots.forEach(screenshot => {
            if (screenshot.takenOnFail) {
                this.addScreenshotAttachment(test, screenshot);
            }
        });
    }
    addScreenshotAttachments(test, testRunInfo) {
        if (testRunInfo.screenshots) {
            testRunInfo.screenshots.forEach((screenshot) => {
                this.addScreenshotAttachment(test, screenshot);
            });
        }
    }
    addScreenshotAttachment(test, screenshot) {
        if (screenshot.screenshotPath && fs.existsSync(screenshot.screenshotPath)) {
            let screenshotName;
            if (screenshot.takenOnFail) {
                screenshotName = reporterConfig$2.LABEL.SCREENSHOT_ON_FAIL;
            }
            else {
                screenshotName = reporterConfig$2.LABEL.SCREENSHOT_MANUAL;
            }
            // Add the useragent data to the screenshots to differentiate between browsers within the tests.
            if (this.userAgents && this.userAgents.length > 1 && screenshot.userAgent) {
                screenshotName = `${screenshotName} - ${screenshot.userAgent}`;
            }
            const img = fs.readFileSync(screenshot.screenshotPath);
            const file = this.runtime.writeAttachment(img, allureJsCommons.ContentType.PNG);
            test.addAttachment(screenshotName, allureJsCommons.ContentType.PNG, file);
        }
    }
    /* Merge the steps together based on their name. */
    mergeSteps(steps) {
        const mergedSteps = [];
        steps.forEach((step) => {
            if (step && step.name) {
                let stepExists = false;
                mergedSteps.forEach((mergedStep) => {
                    stepExists = mergedStep.mergeOnSameName(step);
                });
                if (!stepExists) {
                    mergedSteps.push(new TestStep(step.name, step.screenshotAmount));
                }
            }
        });
        return mergedSteps;
    }
    /* Merge the errors together based on their message. */
    mergeErrors(errors) {
        const mergedErrors = [];
        errors.forEach((error) => {
            if (error && error.errMsg) {
                let errorExists = false;
                mergedErrors.forEach((mergedError) => {
                    if (error.errMsg === mergedError.errMsg) {
                        errorExists = true;
                        if (error.userAgent && mergedError.userAgent !== error.userAgent) {
                            /* eslint-disable-next-line no-param-reassign */
                            mergedError.userAgent = `${mergedError.userAgent}, ${error.userAgent}`;
                        }
                    }
                });
                if (!errorExists) {
                    mergedErrors.push(error);
                }
            }
        });
        return mergedErrors;
    }
    getCurrentTest(name) {
        if (name) {
            const allureTest = this.tests[name.toString()];
            if (allureTest) {
                return allureTest;
            }
        }
        return null;
    }
    setCurrentTest(name, test) {
        if (name && test) {
            this.tests[name] = test;
        }
    }
}

const reporterConfig$3 = loadReporterConfig();
async function deleteFolderContents(dataPath) {
    if (dataPath) {
        await rimraf__default['default'](`${dataPath}/*`, () => { });
    }
}
async function cleanAllureFolders() {
    if (reporterConfig$3.CLEAN_RESULT_DIR) {
        await deleteFolderContents(path.resolve(process.cwd(), reporterConfig$3.RESULT_DIR));
    }
    if (reporterConfig$3.CLEAN_REPORT_DIR) {
        await deleteFolderContents(path.resolve(process.cwd(), reporterConfig$3.REPORT_DIR));
    }
    if (reporterConfig$3.CLEAN_SCREENSHOT_DIR) {
        await deleteFolderContents(path.resolve(process.cwd(), reporterConfig$3.SCREENSHOT_DIR));
    }
}

const reporterConfig$4 = loadReporterConfig();
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
        getReporter() {
            return this;
        },
        preloadConfig(allureConfig) {
            this.allureConfig = allureConfig;
        },
        async reportTaskStart(startTime, userAgents, testCount) {
            log(this, 'Starting Task');
            this.allureReporter = new AllureReporter(this.allureConfig, userAgents);
            // Clean the previous allure results
            await cleanAllureFolders();
        },
        async reportFixtureStart(name, path, meta) {
            log(this, `Starting Fixture: ${name}`);
            // End the previous group because testcafe does not trigger the reporter when a fixture ends.
            this.allureReporter.endGroup();
            this.allureReporter.startGroup(name, meta);
        },
        async reportTestStart(name, meta) {
            log(this, `Starting Test: ${name}`);
            this.allureReporter.startTest(name, meta);
        },
        async reportTestDone(name, testRunInfo, meta) {
            log(this, `Ending Test: ${name}`);
            this.allureReporter.endTest(name, testRunInfo, meta);
        },
        async reportTaskDone(endTime, passed, warnings, result) {
            log(this, 'Ending Task');
            this.allureReporter.endGroup();
            this.allureReporter.setGlobals();
        },
    };
}

module.exports = index;
