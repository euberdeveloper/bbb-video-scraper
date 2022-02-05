import { BrowserOptions, InternalBrowserOptions, InternalScrapingOptions, ScrapingOptions } from '../types/options';

/**
 * The default browser options of the library. The options passed by the user will be merged with these options.
 */
export const DEFAULT_BROWSER_OPTIONS: InternalBrowserOptions = {
    debug: false,
    debugScope: 'BBBVideoScraper',
    windowSize: {
        width: 1920,
        height: 1080
    },
    browserExecutablePath: '/usr/bin/google-chrome'
};

/**
 * Merges partial browser options with some default options.
 * @param options The partial browser options to purge and merge.
 * @param defaultBrowserOptions The default browser options value (default is [[DEFAULT_BROWSER_OPTIONS]]) for the not specified values in the options parameter.
 */
export function handleBrowserOptions(
    options: BrowserOptions | string,
    defaultBrowserOptions = DEFAULT_BROWSER_OPTIONS
): InternalBrowserOptions {
    return typeof options === 'object'
        ? {
              debug: options.debug ?? defaultBrowserOptions.debug,
              debugScope: options.debugScope !== undefined ? options.debugScope : defaultBrowserOptions.debugScope,
              windowSize: {
                  width: options.windowSize?.width ?? defaultBrowserOptions.windowSize.width,
                  height: options.windowSize?.height ?? defaultBrowserOptions.windowSize.height
              },
              browserExecutablePath: options.browserExecutablePath ?? defaultBrowserOptions.browserExecutablePath
          }
        : { ...defaultBrowserOptions };
}

/**
 * The default browser options of the library. The options passed by the user will be merged with these options.
 */
export const DEFAULT_SCRAPING_OPTIONS: InternalScrapingOptions = {
    duration: null,
    delayAfterVideoStarted: 0,
    delayAfterVideoFinished: 15_000,
    audio: true,
    video: true,
    debug: null,
    debugScope: 'BBBVideoScraper',
    useGlobalDebug: false
};

/**
 * Merges partial browser options with some default options.
 * @param options The partial browser options to purge and merge.
 * @param defaultScrapingOptions The default browser options value (default is [[DEFAULT_SCRAPING_OPTIONS]]) for the not specified values in the options parameter.
 */
export function handleScrapingOptions(
    options: ScrapingOptions | string,
    defaultScrapingOptions = DEFAULT_SCRAPING_OPTIONS
): InternalScrapingOptions {
    return typeof options === 'object'
        ? {
              duration: options.duration !== undefined ? options.duration : defaultScrapingOptions.duration,
              delayAfterVideoStarted: options.delayAfterVideoStarted ?? defaultScrapingOptions.delayAfterVideoStarted,
              delayAfterVideoFinished:
                  options.delayAfterVideoFinished ?? defaultScrapingOptions.delayAfterVideoFinished,
              audio: options.audio ?? defaultScrapingOptions.audio,
              video: options.video ?? defaultScrapingOptions.video,
              debug: options.debug !== undefined ? options.debug : defaultScrapingOptions.debug,
              debugScope: options.debugScope !== undefined ? options.debugScope : defaultScrapingOptions.debugScope,
              useGlobalDebug: options.useGlobalDebug ?? defaultScrapingOptions.useGlobalDebug
          }
        : { ...defaultScrapingOptions };
}
