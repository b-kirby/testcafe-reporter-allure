/* eslint-disable class-methods-use-this,no-param-reassign */
import Metadata from '../reporter/metadata';
import { loadReporterConfig } from '../utils/config';

const reporterConfig = loadReporterConfig();
var testStep: TestStep

export class TestStep {
  public screenshotAmount: number;

  public name: string;

  constructor(name: string, screenshotAmount?: number) {
    if (screenshotAmount) {
      this.screenshotAmount = screenshotAmount;
    } else {
      this.screenshotAmount = 0;
    }

    if (name) {
      this.name = name;
    } else {
      this.name = reporterConfig.LABEL.DEFAULT_STEP_NAME;
    }
  }

  public registerScreenshot(): void {
    this.screenshotAmount += 1;
  }

  public mergeOnSameName(testStep: TestStep): boolean {
    if (this.name === testStep.name) {
      if (testStep.screenshotAmount) {
        this.screenshotAmount += testStep.screenshotAmount;
      }
      return true;
    }
    return false;
  }

  // eslint-disable-next-line no-undef
  public addStepToTest(test: TestController): void {
    // Steps can be added to the metadata of the test for persistance.
    const meta: any = this.getMeta(test);
    if (!meta.steps) {
      meta.steps = [];
    }
    meta.steps.push(this);
  }

  // Using the Testcontroller type might cause an error because of a confict with TestCafé's TestController
  private getMeta(testController: any): any {
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
export async function step(name: string, testController: any, stepAction: any) {
  const testStep = new TestStep(name);
  testStep.addStepToTest(testController);
  let stepPromise = await stepAction
  if (reporterConfig.ENABLE_SCREENSHOTS) {
    await testController.takeScreenshot()
    testStep.registerScreenshot(); 
  }
  return stepPromise;
}

export async function stepStart(name:string, testController: any) {
  testStep = new TestStep(name);
  testStep.addStepToTest(testController);
}

export async function stepEnd(testController: any) {
  if (reporterConfig.ENABLE_SCREENSHOTS) {
    await testController.takeScreenshot()
    testStep.registerScreenshot(); 
  }
}
