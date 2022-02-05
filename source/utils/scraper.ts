import * as fs from 'fs';
import * as puppeteerStream from 'puppeteer-stream';
// import { Browser } from 'puppeteer';
import { Logger } from 'euberlog';

import { BrowserOptions, InternalBrowserOptions, ScrapingOptions } from '../types';
import {
    BBBVideoScraperBrowserNotLaunchedError,
    BBBVideoScraperDuringBrowserCloseError,
    BBBVideoScraperDuringBrowserLaunchError,
    BBBVideoScraperDuringScrapingError
} from '../errors';

import { handleBrowserOptions, handleScrapingOptions } from './options';

/**
 * The [[BBBVideoScraper]] class, that scrapes a video from a "BBB WebKonferenze" and saves it to a file.
 */
export class BBBVideoScraper {
    private logger: Logger;
    private options: InternalBrowserOptions;
    private browser: /*Browser*/ any | null = null;

    /**
     * The constructor of the [[BBBVideoScraper]] class.
     * @param options The [[BrowserOptions]] to pass to the instance.
     */
    constructor(options: BrowserOptions = {}) {
        this.setBrowserOptions(options);
    }

    /**
     * Given the duration text gotten from the page's HTML (e.g. 1:30:23), it returns the duration in milliseconds.
     * @param durationText The duration text gotten from the page's HTML.
     * @returns The duration in milliseconds.
     */
    private handleDurationText(durationText: string): number {
        const [hours, minutes, seconds] = durationText.split(':');
        return (+hours * 3600 + +minutes * 60 + +seconds) * 1000;
    }

    /**
     * Changes the [[BrowserOptions]] options.
     * @param options The new options.
     */
    public setBrowserOptions(options: BrowserOptions): void {
        this.options = handleBrowserOptions(options);
        this.logger = new Logger({
            debug: this.options.debug,
            scope: this.options.debugScope
        });

        this.logger.debug('BrowserOptions are', this.options);
    }

    /**
     * Launches the browser window.
     */
    public async launch(): Promise<void> {
        try {
            this.logger.debug('Launching browser');
            this.browser = await puppeteerStream.launch({
                executablePath: this.options.browserExecutablePath,
                defaultViewport: null,
                args: [`--window-size=${this.options.windowSize.width},${this.options.windowSize.height}`]
            });
            this.logger.debug('Browser launched');
        } catch (error) {
            throw new BBBVideoScraperDuringBrowserLaunchError(error);
        }
    }

    /**
     * Closes the browser window.
     */
    public async close(): Promise<void> {
        try {
            if (this.browser) {
                await this.browser.close();
            }
        } catch (error) {
            throw new BBBVideoScraperDuringBrowserCloseError(error);
        }
    }

    /**
     * Scrapes a video from a BBB conference.
     * @param url The url of the video to save
     * @param destPath The path where the video will be saved. Note that the extension should be webm.
     * @param options The [[ScrapingOptions]] to pass to this method.
     */
    public async scrape(url: string, destPath: string, options: ScrapingOptions = {}): Promise<void> {
        const scrapingOptions = handleScrapingOptions(options);

        if (!this.browser) {
            throw new BBBVideoScraperBrowserNotLaunchedError();
        }

        try {
            const logger = options.useGlobalDebug
                ? this.logger
                : new Logger({ debug: scrapingOptions.debug ?? this.options.debug, scope: scrapingOptions.debugScope });

            logger.debug('Launching page and going to the url', url);
            const page = await this.browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle0' });

            if (scrapingOptions.duration === null) {
                logger.debug('Waiting for selector of video duration');
                await page.waitForSelector('.vjs-remaining-time-display');

                logger.debug('Getting the total time of the video');
                const durationText = await page.$eval('.vjs-remaining-time-display', el => {
                    return el.innerHTML;
                });
                scrapingOptions.duration = this.handleDurationText(durationText);
            }

            logger.debug('Waiting for selector of play button');
            await page.waitForSelector('.vjs-big-play-button');

            logger.debug('Clicking play on the video');
            await page.click('.vjs-big-play-button');

            logger.debug(`Waiting for ${scrapingOptions.delayAfterVideoStarted}ms before starting recording`);
            await page.waitForTimeout(scrapingOptions.delayAfterVideoStarted);

            logger.debug('Staring recording');
            const file = fs.createWriteStream(destPath);
            const stream = await puppeteerStream.getStream(page, {
                audio: scrapingOptions.audio,
                video: scrapingOptions.video
            });
            stream.pipe(file);

            logger.debug('Waiting for video to end. Duration is', scrapingOptions.duration);
            await page.waitForTimeout(scrapingOptions.duration);

            logger.debug(`Waiting for ${scrapingOptions.delayAfterVideoFinished}ms before stopping recording`);
            await page.waitForTimeout(scrapingOptions.delayAfterVideoFinished);

            logger.debug('Stopping recording');
            await stream.destroy();
            file.close();

            logger.debug('Closing page');
            await page.close();
        } catch (error) {
            throw new BBBVideoScraperDuringScrapingError(error);
        }
    }
}
