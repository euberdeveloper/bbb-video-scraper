import { BBBVideoScraperError } from '.';

export class BBBVideoScraperBrowserNotLaunchedError extends BBBVideoScraperError {
    constructor(
        message = 'You cannot scrape if a browser was not launched. Use "scraper.launch()" before calling this method',
        context = null
    ) {
        super(message, context);
        this.name = 'BBBVideoScraperBrowserNotLaunchedError';
    }
}
