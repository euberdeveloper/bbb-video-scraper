const path = require('path');
const puppeteer = require('puppeteer');
const PuppeteerVideoRecorder = require('puppeteer-video-recorder');

async function main() {
    const browser = await puppeteer.launch({
        headless: true, executablePath: '/usr/bin/google-chrome', defaultViewport: null, args: ['--window-size=1920,1080']
    });
    const page = await browser.newPage();
    await page.goto('https://balancer.bbb.rbg.tum.de/playback/presentation/2.3/f3456b985855f531b992ac267cba49d55e2c7de9-1643878021663?meetingId=f3456b985855f531b992ac267cba49d55e2c7de9-1643878021663', { waitUntil: 'networkidle0' });
    const recorder = new PuppeteerVideoRecorder();
    await recorder.init(page, path.resolve(process.cwd(), './merda'));
    await recorder.start();
    await page.click('.vjs-big-play-button');
    await page.waitForTimeout(5000);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await recorder.stop();
    await browser.close();
}
main();