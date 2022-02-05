import { DeepPartial } from '../deep-partial';

/**
 * The internal options of the scraper's browser. Used internally.
 */
export interface InternalBrowserOptions {
    debug: boolean;
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
}

/**
 * The options of the scraper's scraping.
 */
export type ScrapingOptions = DeepPartial<InternalScrapingOptions>;
