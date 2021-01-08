export declare class TestStep {
    screenshotAmount: number;
    name: string;
    constructor(name: string, screenshotAmount?: number);
    registerScreenshot(): void;
    mergeOnSameName(testStep: TestStep): boolean;
    addStepToTest(test: TestController): void;
    private getMeta;
}
export default function step(name: string, testController: TestController, stepAction: any): Promise<any>;
