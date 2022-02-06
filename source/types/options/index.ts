import { BrowserMimeType } from 'puppeteer-stream';
import { DeepPartial } from '../deep-partial';

/**
 * The internal options of the scraper's browser. Used internally.
 */
export interface InternalBrowserOptions {
    /** If true, it will show debug log. (Default value: false) */
    debug: boolean;
    /** The scope given to the euberlog debug logger. (Default value: 'BBB Video Scraper') */
    debugScope: string | null;
    /** The path to the browser executable. (Default value: '/usr/bin/google-chrome') */
    browserExecutablePath: string;
    /** The object that says how big the window size will be. (Default value: { width: 1920, height: 1080 }) */
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
    /**
     * The duration in milliseconds of the recorded video.
     * The recording starts [[delayAfterVideoStarted]] milliseconds after that the play button has been clicked
     * and finishes [[delayAfterVideoFinished]] milliseconds after that this duration has passed.
     * If the value is null, the duration will be automatically gotten by looking at the page's video duration.
     * (Default value: null)
     */
    duration: number | null;
    /**
     * The delay in milliseconds after that the play button has been clicked. (Default value: 0)
     */
    delayAfterVideoStarted: number;
    /**
     * The delay in milliseconds after that the [[duration]] milliseconds are past and before that the recording is stopped. (Default value: 15_000)
     */
    delayAfterVideoFinished: number;
    /**
     * If true, the audio will be recorded. (Default value: true)
     */
    audio: boolean;
    /**
     * If true, the video will be recorded. (Default value: true)
     */
    video: boolean;
    /**
     * The mimetype of the recorded video or audio. (Default value: 'video/webm')
     */
    mimeType: BrowserMimeType;
    /**
     * The chosen bitrate for the audio component of the media. If not specified, it will be adaptive, depending upon the sample rate and the number of channels. (Default value: undefined)
     */
    audioBitsPerSecond?: number;
    /**
     * The chosen bitrate for the video component of the media. If not specified, the rate will be 2.5Mbps. (Default value: undefined)
     */
    videoBitsPerSecond?: number;
    /**
     * The number of milliseconds to record into each packet. (Default value: 20)
     */
    frameSize?: number;
    /**
     * If true, the global logger will be used, ignoring other debug options in this object. (Default value: true)
     */
    useGlobalDebug: boolean;
    /**
     * If null, the debug will be shown by looking at the passed [[BrowserOptions]]. Otherwise, if [[useGlobalDebug]] is false, this specifies if the debug will be shown.
     */
    debug: boolean | null;
    /**
     * If [[useGlobalDebug]] is true, this will be ignore. Otherwise, this specifies if the euberlog logger scope for the debug of this scrape.
     */
    debugScope: string | null;
}

/**
 * The options of the scraper's scraping.
 */
export type ScrapingOptions = DeepPartial<InternalScrapingOptions>;
