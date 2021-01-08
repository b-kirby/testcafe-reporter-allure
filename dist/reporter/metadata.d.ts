import { AllureTest, Severity } from 'allure-js-commons';
import { TestStep } from '../testcafe/step';
export default class Metadata {
    severity: Severity;
    description: string;
    issue: string;
    parent_suite: string;
    suite: string;
    sub_suite: string;
    epic: string;
    story: string;
    feature: string;
    flaky: boolean;
    steps: TestStep[];
    otherMeta: Map<string, string>;
    constructor(meta?: any, test?: boolean);
    addMetadataToTest(test: AllureTest, groupMetadata: Metadata): void;
    private mergeMetadata;
    setFlaky(): void;
    getSteps(): TestStep[] | null;
    private isValidEnumValue;
    private isString;
    private isBoolean;
}
