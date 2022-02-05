import { BBBVideoScraperError } from '.';

export class BBBVideoScraperDuringBrowserCloseError extends BBBVideoScraperError {
    constructor(error: Error, message = 'There was an error during the browser close.', otherInfo?: any) {
        super(message, {
            error,
            otherInfo
        });
        this.name = 'BBBVideoScraperDuringBrowserCloseError';
    }
}
