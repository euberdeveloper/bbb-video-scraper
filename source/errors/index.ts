/* eslint-disable @typescript-eslint/naming-convention */

/** The base error class of the bbb-video-scraper module */
export class BBBVideoScraperError extends Error {
    public __proto__: Error;
    /** A context that may contain information about the error */
    public readonly context: any;

    /**
     * The constructor of the [[BBBVideoScraperError]] class
     * @param message The message of the error
     * @param context The context of the error
     */
    constructor(message = 'There was a generic error with BBBVideoScraper', context: any = null) {
        // This includes a trick in order to make the instanceof properly work
        const trueProto = new.target.prototype;
        super(message);
        this.__proto__ = trueProto;

        this.name = 'BBBVideoScraperError';
        this.context = context;
    }
}

export * from './browserNotLaunched';
export * from './duringBrowserLaunch';
export * from './duringBrowserClose';
export * from './duringScraping';
