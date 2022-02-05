import { BBBVideoScraperError } from '.';

/** The error extending [[BBBVideoScraperError]] that is thrown when actions on a non-launched browser are attempted to be executed */
export class BBBVideoScraperBrowserNotLaunchedError extends BBBVideoScraperError {
    /**
     * The constructor of the [[BBBVideoScraperBrowserNotLaunchedError]] class.
     * @param message The message of the error.
     * @param context The context of the error.
     */
    constructor(
        message = 'You cannot scrape if a browser was not launched. Use "scraper.launch()" before calling this method',
        context = null
    ) {
        super(message, context);
        this.name = 'BBBVideoScraperBrowserNotLaunchedError';
    }
}
