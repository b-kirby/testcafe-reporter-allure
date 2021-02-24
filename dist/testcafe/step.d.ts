export declare class TestStep {
    screenshotAmount: number;
    name: string;
    constructor(name: string, screenshotAmount?: number);
    registerScreenshot(): void;
    mergeOnSameName(testStep: TestStep): boolean;
    addStepToTest(test: TestController): void;
    private getMeta;
}
export declare function step(name: string, testController: any, stepAction: any): Promise<any>;
export declare function stepStart(name: string, testController: any): Promise<void>;
export declare function stepEnd(testController: any): Promise<void>;
