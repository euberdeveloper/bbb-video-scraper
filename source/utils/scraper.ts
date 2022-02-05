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

export class BBBVideoScraper {
    private logger: Logger;
    private options: InternalBrowserOptions;
    private browser: /*Browser*/ any | null = null;

    constructor(options: BrowserOptions = {}) {
        this.setBrowserOptions(options);
    }

    private handleDurationText(durationText: string): number {
        const [hours, minutes, seconds] = durationText.split(':');
        return (+hours * 3600 + +minutes * 60 + +seconds) * 1000;
    }

    public setBrowserOptions(options: BrowserOptions): void {
        this.options = handleBrowserOptions(options);
        this.logger = new Logger({
            debug: this.options.debug,
            scope: this.options.debugScope
        });

        this.logger.debug('BrowserOptions are', this.options);
    }

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

    public async close(): Promise<void> {
        try {
            if (this.browser) {
                await this.browser.close();
            }
        } catch (error) {
            throw new BBBVideoScraperDuringBrowserCloseError(error);
        }
    }

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
                logger.debug('Getting the total time of the video');
                const durationText = await page.$eval('.vjs-remaining-time-display', el => {
                    return el.innerHTML;
                });
                scrapingOptions.duration = this.handleDurationText(durationText);
            }

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
