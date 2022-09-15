import { BBBVideoScraper, ScrapingOptions } from '../source';

import * as fs from 'fs';
import * as path from 'path';

const assetsPath = path.join(__dirname, 'assets');
const scraperOptions: ScrapingOptions = {
    duration: 2000,
    delayAfterVideoStarted: 0,
    delayAfterVideoFinished: 0
};

describe('Integration tests', () => {
    beforeAll(async () => {
        if (!fs.existsSync(assetsPath)) {
            await fs.promises.mkdir(assetsPath);
        }
    });

    it(`Test simple video download`, async () => {
        const url =
            'https://balancer.bbb.rbg.tum.de/playback/presentation/2.3/f3456b985855f531b992ac267cba49d55e2c7de9-1640249795107?meetingId=f3456b985855f531b992ac267cba49d55e2c7de9-1640249795107';
        const destination = path.join(assetsPath, 'simple-video.webm');

        const scraper = new BBBVideoScraper({
            debug: true
        });
        await scraper.launch();
        await scraper.scrape(url, destination, scraperOptions);
        await scraper.close();

        expect(fs.existsSync(destination)).toBe(true);
    });

    it(`Test multiple subsequent video download`, async () => {
        const url1 =
            'https://balancer.bbb.rbg.tum.de/playback/presentation/2.3/f3456b985855f531b992ac267cba49d55e2c7de9-1640249795107?meetingId=f3456b985855f531b992ac267cba49d55e2c7de9-1640249795107';
        const url2 =
            'https://balancer.bbb.rbg.tum.de/playback/presentation/2.3/f3456b985855f531b992ac267cba49d55e2c7de9-1641977746168?meetingId=f3456b985855f531b992ac267cba49d55e2c7de9-1641977746168';
        const destination1 = path.join(assetsPath, 'multiple-subsequent-video-1.webm');
        const destination2 = path.join(assetsPath, 'multiple-subsequent-video-2.webm');

        const scraper = new BBBVideoScraper({
            debug: true
        });
        await scraper.launch();
        await scraper.scrape(url1, destination1, scraperOptions);
        await scraper.scrape(url2, destination2, scraperOptions);
        await scraper.close();

        expect(fs.existsSync(destination1)).toBe(true);
        expect(fs.existsSync(destination2)).toBe(true);
    });

    it(`Test multiple parallel video download`, async () => {
        const url1 =
            'https://balancer.bbb.rbg.tum.de/playback/presentation/2.3/f3456b985855f531b992ac267cba49d55e2c7de9-1640249795107?meetingId=f3456b985855f531b992ac267cba49d55e2c7de9-1640249795107';
        const url2 =
            'https://balancer.bbb.rbg.tum.de/playback/presentation/2.3/f3456b985855f531b992ac267cba49d55e2c7de9-1641977746168?meetingId=f3456b985855f531b992ac267cba49d55e2c7de9-1641977746168';
        const destination1 = path.join(assetsPath, 'multiple-parallel-video-1.webm');
        const destination2 = path.join(assetsPath, 'multiple-parallel-video-2.webm');

        const scraper = new BBBVideoScraper({
            debug: true
        });
        await scraper.launch();

        async function scrape(dest: string, link: string) {
            await scraper.scrape(link, dest, scraperOptions);
        }

        const tasks = [
            [destination1, url1],
            [destination2, url2]
        ].map(async ([dest, link]) => scrape(dest, link));
        await Promise.all(tasks);

        await scraper.close();

        expect(fs.existsSync(destination1)).toBe(true);
        expect(fs.existsSync(destination2)).toBe(true);
    });

    afterAll(async () => {
        if (fs.existsSync(assetsPath)) {
            await fs.promises.rm(assetsPath, { recursive: true, force: true });
        }
    });
});
