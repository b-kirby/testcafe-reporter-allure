export {};
declare global {
    interface TestController {
        testRun: TestRun;
    }
    interface TestRun {
        test: Test;
    }
    interface Test {
        meta: object;
    }
}
export interface Screenshot {
    screenshotPath?: string;
    thumbnailPath?: string;
    userAgent?: string;
    quarantineAttempt?: number;
    takenOnFail?: boolean;
}
export interface Video {
    singleFile?: boolean;
    testRunId?: string;
    videoPath?: string;
}
export interface TestRunInfo {
    videos: Video[];
    errs?: object[];
    warnings?: string[];
    durationMs?: number;
    unstable?: boolean;
    screenshotPath?: string;
    screenshots?: Screenshot[];
    quarantine?: object;
    skipped?: boolean;
}
export interface ErrorObject {
    errMsg?: string;
    callsite?: CallSite;
    userAgent?: string;
}
export interface CallSite {
    filename?: string;
    lineNum?: string;
}
