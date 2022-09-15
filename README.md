![Build](https://github.com/euberdeveloper/bbb-video-scraper/workflows/Build/badge.svg)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![License](https://img.shields.io/npm/l/bbb-video-scraper.svg)](https://github.com/euberdeveloper/bbb-video-scraper/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/euberdeveloper/bbb-video-scraper.svg)](https://github.com/euberdeveloper/bbb-video-scraper/issues)
[![GitHub stars](https://img.shields.io/github/stars/euberdeveloper/bbb-video-scraper.svg)](https://github.com/euberdeveloper/bbb-video-scraper/stargazers)
![npm](https://img.shields.io/npm/v/bbb-video-scraper.svg)

# bbb-video-scraper
This is a scraper written in Node.js and using Puppeteer that gets the videos served by [BBB](https://bbbserver.de/) services.

## Install

To install bbb-video-scraper, run:

```bash
$ npm install bbb-video-scraper
```

## Project purpose

This module is written because videos hosted on [BBB services](https://bbbserver.de/) are difficult to download and watchable only in the browser. Even by using some browser tools, usually, only the video of the person talking is saved, because evantual slides are embedded in the HTML of the browser and will not be part of the video. 

This is why I have written this module, that uses **[puppeteer](https://www.npmjs.com/package/puppeteer)** and **[puppeteer-stream](https://www.npmjs.com/package/puppeteer-stream)** under the hood to open a google-chrome browser, see the video and take a video recording of it.

The module is written in **Typescript**, uses **Webpack** to reduce the bundle size (even if most of it comes from the puppeter browser), uses **[euberlog](https://www.npmjs.com/package/euberlog)** for a scoped debug log and is **full of configurations**.

## Refactor with Video Scraper Core

A full refactor has been done by replacing most of the code with the module [video-scraper-core](https://www.npmjs.com/package/video-scraper-core), so classes such as errors and options are now gotten from there.

## Project usage

To scrape a BBB video available at "https://balancer.bbb.rbg.tum.de/playback/presentation/2.3/myvideo" and save it to "./saved.webm":

```javascript
const { BBBVideoScraper } = require('bbb-video-scraper');

async function main() {
    // Create an instance of the scraper
    const scraper = new BBBVideoScraper({
        debug: true
    });
    // Launch the Chrome browser
    await scraper.launch();
    // Scrape and save the video
    await scraper.scrape('https://balancer.bbb.rbg.tum.de/playback/presentation/2.3/myvideo', './saved.webm');
    // Close the browser
    await scraper.close();
}
main();
```

To scrape and download more than one video:

```javascript
const { BBBVideoScraper } = require('bbb-video-scraper');

async function main() {
    // Create an instance of the scraper
    const scraper = new BBBVideoScraper({
        debug: true
    });
    // Launch the Chrome browser
    await scraper.launch();
    // Scrape and save the first video
    await scraper.scrape('https://balancer.bbb.rbg.tum.de/playback/presentation/2.3/myvideo', './saved.webm');
    // Scrape and save the second video
    await scraper.scrape('https://balancer.bbb.rbg.tum.de/playback/presentation/2.3/myvideo-bis', './saved_bis.webm');
    // Close the browser
    await scraper.close();
}
main();
```

To scrape and download in parallel more than one video:

```javascript
const { BBBVideoScraper } = require('bbb-video-scraper');

async function scrape(dest, link) {
    // Create an instance of the scraper
    const scraper = new BBBVideoScraper({
        debug: true
    });
    // Launch the Chrome browser
    await scraper.launch();
    // Scrape and save the first video
    await scraper.scrape(, './saved.webm');
    // Scrape and save the second video
    await scraper.scrape('', './saved_bis.webm');
    // Close the browser
    await scraper.close();
}

async function main() {
    const tasks = [
        ['./saved.webm', 'https://balancer.bbb.rbg.tum.de/playback/presentation/2.3/myvideo'],
        ['./saved_bis.webm', 'https://balancer.bbb.rbg.tum.de/playback/presentation/2.3/myvideo-bis']
    ].map(([dest, link]) => scrape(dest, link));
    await Promise.all(tasks);
}
main();
```

With custom options:

```javascript
const { BBBVideoScraper } = require('bbb-video-scraper');

async function main() {
    // Browser options
    const scraper = new BBBVideoScraper({
        debug: true,
        debugScope: 'This will be written as scope of the euberlog debug',
        windowSize: {
            width: 1000,
            height: 800
        },
        browserExecutablePath: '/usr/bin/firefox'
    });
    await scraper.launch();

    // Scraping options
    await scraper.scrape('https://balancer.bbb.rbg.tum.de/playback/presentation/2.3/myvideo', './saved.webm', { duration: 1000 });
    await scraper.scrape('https://balancer.bbb.rbg.tum.de/playback/presentation/2.3/myvideo-bis', './saved_bis.webm', { 
        audio: false,
        delayAfterVideoStarted: 3000,
        delayAfterVideoFinished: 2000 
    });

    await scraper.close();
}
main();
```

...all the options can be seen in the API section or with the Typescript definitions.

## API

The documentation site is: [bbb-video-scraper documentation](https://bbb-video-scraper.euber.dev)

The documentation for development site is: [bbb-video-scraper dev documentation](https://bbb-video-scraper-dev.euber.dev)

### BBBVideoScraper

The BBBVideoScraper class, that scrapes a video from a "BBB WebKonferenze" and saves it to a file.

**Syntax:**

`const scraper = new BBBVideoScraper(options);`

**Parameters:**

* __options__: Optional. A `BrowserOptions` object that specifies the options for this instance.

**Methods:**

* __setBrowserOptions(options: BrowserOptions): void__: Changes the browser options with the ones given by the `options` parameter.
* __launch(): Promise<void>__: Launches the browser window.
* __close(): Promise<void>__: Closes the browser window.
* __scrape(url: string, destPath: string, options: ScrapingOptions): Promise<void>__: Scrapes the video in `url` and saves it to `destPath`. Some ScrapingOptions can be passed.

### BrowserOptions

The options given to the BBBVideoScraper constructor, see [video-scraper-core](https://github.com/euberdeveloper/video-scraper-core#browseroptions) for more information.

### ScrapingOptions

The options passing to a scrape method, see [video-scraper-core](https://github.com/euberdeveloper/video-scraper-core#scrapingoptions) for more information.

### Errors

There are also some error classes that can be thrown by this module, see [video-scraper-core](https://github.com/euberdeveloper/video-scraper-core#errors) for more information.

## Notes

* The default browser is **Google Chrome** on `/usr/bin/google-chrome`, because Chromium did not support the BBB videos. You can always change the browser executable path on the configurations.
* By default (if the **duration** option is `null`), the **duration of the recording will be automatically detected** by looking at the vjs player of the page and by adding a stopping delay of 15 seconds.
* This module can be uses only in **headful mode**.

## Project history

I faced this problem when I was preparing for the exam ["Program optimization (2021/2022) - Msc. Informatik - TUM"](https://bbb.in.tum.de/hel-mec-64a) and I could not download the lectures in order to watch them even when offline and maybe at velocity x2.5.

The first thing I tried is the Firefox extension [Video download helper](https://addons.mozilla.org/de/firefox/addon/video-downloadhelper/). It worked but not totally, because the slides are embedded in the HTML so are not part of the video. The downloaded video was just the face of the professor while he was talking and that was not very useful.

So I wrote the scraper, the first attempt was by using the module [puppeteer-video-recorder](https://www.npmjs.com/package/puppeteer-video-recorder), as it can be seen in the [Version 0.0.1](https://github.com/euberdeveloper/bbb-video-scraper/tree/0.0.1). It worked very well but had two problems: the first one was that it was **very slow in saving the videos**, because it used ffmpeg under the hood; the second one was that **it saved the video without the sound**. This library saved regurarly **frames saved by the browser** and created a video from them by using **ffmpeg**. Another problem was the fact that if **nothing happened in the browser** (e.g. everyhing was still), the **video was shorter** because the browser did not send any frame in those cases.

At that point I passed to the module **[puppeteer-stream](https://www.npmjs.com/package/puppeteer-stream)**, that solved both the problems. By using a **stream**, it saves the video during its reproduction in the browser. By using the **[MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/MediaRecorder)**, this module allows you also to save the audio and not just a video. A **problem introduced** by this module is that it **must be headful**, so it is very difficult to make it run on cloud systems such as Google Cloud Platform. In any case, this was for me acceptable and I made it run during the night, by using [this gist that I made](https://gist.github.com/euberdeveloper/5e2aafc0768834d2089eb88a5661738a).

After having developed the core module **[video-scraper-core](https://www.npmjs.com/package/video-scraper-core)**, containing an abstract class that simplifies writing video scrapers like this, most of the code has been replaced.