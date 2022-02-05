import { DeepPartial } from '../deep-partial';

/**
 * The internal options of the scraper's browser. Used internally.
 */
export interface InternalBrowserOptions {
    debug: boolean;
    debugScope: string | null;
    browserExecutablePath: string;
    windowSize: {
        width: number;
        height: number;
    };
}

/**
 * The options of the scraper's browser.
 */
export type BrowserOptions = DeepPartial<InternalBrowserOptions>;

/**
 * The internal options of the scraper's scraping. Used internally.
 */
export interface InternalScrapingOptions {
    duration: number | null;
    delayAfterVideoStarted: number;
    delayAfterVideoFinished: number;
    audio: boolean;
    video: boolean;
    useGlobalDebug: boolean;
    debug: boolean | null;
    debugScope: string | null;
}

/**
 * The options of the scraper's scraping.
 */
export type ScrapingOptions = DeepPartial<InternalScrapingOptions>;
