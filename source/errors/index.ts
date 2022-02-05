/* eslint-disable @typescript-eslint/naming-convention */

export class BBBVideoScraperError extends Error {
    public __proto__: Error;
    public readonly context: any;

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
