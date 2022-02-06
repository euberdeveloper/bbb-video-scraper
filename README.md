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

This is why I have written this module, that uses [**puppeteer**](https://www.npmjs.com/package/puppeteer) under the hood to open a google-chrome browser, see the video and take a video recording of it.

The module is written in **Typescript**, uses **Webpack** to reduce the bundle size (even if most of it comes from the puppeter browser), uses **[euberlog](https://www.npmjs.com/package/euberlog)** for a scoped debug log and is **full of configurations**.

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

The documentation site is: [euberlog documentation](https://euberlog.euber.dev)

The documentation for development site is: [euberlog dev documentation](https://euberlog-dev.euber.dev)

### Logger

The logger class, its instances will be the euber loggers.

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

The options given to the BBBVideoScraper constructor.

**Parameters:**

* __debug__: Default value: `false`. If true, it will show debug log.
* __debugScope__: Default value: `'BBB Video Scraper'`. The scope given to the euberlog debug logger.
* __browserExecutablePath__: Default value: `'/usr/bin/google-chrome'`. The path to the browser executable.
* __windowSize__: Default value: `{ width: 1920, height: 1080 }`. The object that says how big the window size will be.

### ScrapingOptions

The options passing to a scrape method.

**Parameters:**

* __duration__: Default value: `null`. The duration in milliseconds of the recorded video.
* __delayAfterVideoStarted__: Default value: `0`. The delay in milliseconds after that the play button has been clicked.
* __delayAfterVideoFinished__: Default value: `15_000`. The delay in milliseconds after that the duration milliseconds are past and before that the recording is stopped.
* __audio__: Default value: `true`. If true, the audio will be recorded.
* __video__: Default value: `true`. If true, the video will be recorded.
* __mimeType__: Default value: `'video/webm'`. The mimetype of the recorded video or audio.
* __audioBitsPerSecond__: Default value: `undefined`. The chosen bitrate for the audio component of the media. If not specified, it will be adaptive, depending upon the sample rate and the number of channels.
* __videoBitsPerSecond__: Default value: `undefined`. The chosen bitrate for the video component of the media. If not specified, the rate will be 2.5Mbps.
* __frameSize__: Default value: `20`. The number of milliseconds to record into each packet.
* __useGlobalDebug__: Default value: `true`. If true, the global logger will be used, ignoring other debug options in this object.
* __debug__: Default value: `null`. If null, the debug will be shown by looking at the passed BrowserOptions. Otherwise, if useGlobalDebug is false, this specifies if the debug will be shown.
* __debugScope__: Default value: `null`. If useGlobalDebug is true, this will be ignore. Otherwise, this specifies if the euberlog logger scope for the debug of this scrape.

### Errors

There are also some error classes that can be thrown by this module:

* __BBBVideoScraperError__: The base error class of the bbb-video-scraper module
* __BBBVideoScraperBrowserNotLaunchedError__: The error extending BBBVideoScraperError that is thrown when actions on a non-launched browser are attempted to be executed.
* __BBBVideoScraperDuringBrowserLaunchError__: The error extending BBBVideoScraperError that is thrown when an error occurred when a browser is getting closed.
* __BBBVideoScraperDuringBrowserCloseError__: The error extending BBBVideoScraperError that is thrown when an error occurs during the launch of a browser.
* __BBBVideoScraperDuringScrapingError__: The error extending BBBVideoScraperError that is thrown when an error occurs during a video scraping
## Notes

* The default browser is **Google Chrome** on `/usr/bin/google-chrome`, because Chromium did not support the BBB videos. You can always change the browser executable path on the configurations.
* By default (if the **duration** option is `null`), the **duration of the recording will be automatically detected** by looking at the vjs player of the page and by adding a stopping delay of 15 seconds.
* This module can be uses only in **headful mode**.

## Project history

I faced this problem when I was preparing for the exam ["Program optimization (2021/2022) - Msc. Informatik - TUM"](https://bbb.in.tum.de/hel-mec-64a) and I could not download the lectures in order to watch them even when offline and maybe at velocity x2.5.

The first thing I tried is the Firefox extension [Video download helper](https://addons.mozilla.org/de/firefox/addon/video-downloadhelper/). It worked but not totally, because the slides are embedded in the HTML so are not part of the video. The downloaded video was just the face of the professor while he was talking and that was not very useful.

So I wrote the scraper, the first attempt was by using the module [puppeteer-video-recorder](https://www.npmjs.com/package/puppeteer-video-recorder), as it can be seen in the [Version 0.0.1](https://github.com/euberdeveloper/bbb-video-scraper/tree/0.0.1). It worked very well but had two problems: the first one was that it was **very slow in saving the videos**, because it used ffmpeg under the hood; the second one was that **it saved the video without the sound**. This library saved regurarly **frames saved by the browser** and created a video from them by using **ffmpeg**. Another problem was the fact that if **nothing happened in the browser** (e.g. everyhing was still), the **video was shorter** because the browser did not send any frame in those cases.

At that point I passed to the module [puppeteer-stream](https://www.npmjs.com/package/puppeteer-stream), that solved both the problems. By using a **stream**, it saves the video during its reproduction in the browser. By using the **[MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/MediaRecorder)**, this module allows you also to save the audio and not just a video. A **problem introduced** by this module is that it **must be headful**, so it is very difficult to make it run on cloud systems such as Google Cloud Platform. In any case, this was for me acceptable and I made it run during the night, by using [this gist that I made](https://gist.github.com/euberdeveloper/5e2aafc0768834d2089eb88a5661738a).