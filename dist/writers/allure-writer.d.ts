/// <reference types="node" />
import { Category, TestResult, TestResultContainer } from 'allure-js-commons';
import { IAllureWriter } from 'allure-js-commons/dist/src/writers';
export declare class AllureTestWriter implements IAllureWriter {
    reporter: any;
    constructor(reporter: any);
    writeData(data: any): void;
    writeAttachment(name: string, content: Buffer | string): void;
    writeEnvironmentInfo(info?: Record<string, string | undefined>): void;
    writeCategoriesDefinitions(categories: Category[]): void;
    writeGroup(result: TestResultContainer): void;
    writeResult(result: TestResult): void;
}
