import { BBBVideoScraperError } from '.';

/** The error extending [[BBBVideoScraperError]] that is thrown when an error occurred when a browser is getting closed */
export class BBBVideoScraperDuringBrowserCloseError extends BBBVideoScraperError {
    /**
     * The constructor of the [[BBBVideoScraperDuringBrowserCloseError]] class.
     * @param error The error that caused this error.
     * @param message The message of the error.
     * @param otherInfo Other information about this error.
     */
    constructor(error: Error, message = 'There was an error during the browser close.', otherInfo?: any) {
        super(message, {
            error,
            otherInfo
        });
        this.name = 'BBBVideoScraperDuringBrowserCloseError';
    }
}
