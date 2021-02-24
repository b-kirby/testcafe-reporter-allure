import { Severity } from 'allure-js-commons';
import { loadReporterConfig } from './utils/config';
import { step, stepEnd, stepStart } from './testcafe/step';

const reporterConfig = loadReporterConfig();

export { step, stepStart, stepEnd, reporterConfig, Severity };
