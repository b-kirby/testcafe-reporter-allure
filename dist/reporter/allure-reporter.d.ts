import { AllureConfig } from 'allure-js-commons';
import { TestRunInfo } from '../testcafe/models';
export default class AllureReporter {
    private runtime;
    private userAgents;
    private group;
    private groupMetadata;
    private tests;
    constructor(allureConfig?: AllureConfig, userAgents?: string[]);
    setGlobals(): void;
    startGroup(name: string, meta: object): void;
    endGroup(): void;
    startTest(name: string, meta: object): void;
    endTest(name: string, testRunInfo: TestRunInfo, meta: object): void;
    private addVideoAttachments;
    private addStepsWithAttachments;
    private addScreenshotAttachments;
    private addScreenshotAttachment;
    private mergeSteps;
    private mergeErrors;
    private getCurrentTest;
    private setCurrentTest;
}
