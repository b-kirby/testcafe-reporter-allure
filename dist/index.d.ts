import { AllureConfig } from 'allure-js-commons';
import { TestRunInfo } from './testcafe/models';
export default function (): {
    allureReporter: any;
    allureConfig: any;
    getReporter(): any;
    preloadConfig(allureConfig: AllureConfig): void;
    reportTaskStart(startTime: Date, userAgents: string[], testCount: number): Promise<void>;
    reportFixtureStart(name: string, path: string, meta: object): Promise<void>;
    reportTestStart(name: string, meta: object): Promise<void>;
    reportTestDone(name: string, testRunInfo: TestRunInfo, meta: object): Promise<void>;
    reportTaskDone(endTime: Date, passed: number, warnings: string[], result: object): Promise<void>;
};
