import { VideoScraperCore, ScrapingOptions } from 'video-scraper-core';

/**
 * The [[BBBVideoScraper]] class, that scrapes a video from a "BBB WebKonferenze" and saves it to a file.
 */
export class BBBVideoScraper extends VideoScraperCore {
    protected getFullScreenSelector(): string {
        return '';
    }
    protected getPlayButtonSelector(): string {
        return '.vjs-big-play-button';
    }
    protected getVideoDurationSelector(): string {
        return '.vjs-remaining-time-display';
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected async afterPageLoaded(): Promise<void> {}

    /**
     * Scrapes a video from a BBB conference.
     * @param url The url of the video to save
     * @param destPath The path where the video will be saved. Note that the extension should be webm.
     * @param options The [[ScrapingOptions]] to pass to this method.
     */
    public async scrape(
        url: string,
        destPath: string,
        options: Omit<ScrapingOptions, 'fullScreen'> = {}
    ): Promise<void> {
        (options as any).fullScreen = false;
        await super.scrape(url, destPath, options);
    }
}
