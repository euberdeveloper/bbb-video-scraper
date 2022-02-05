import { BBBVideoScraperError } from '.';

/** The error extending [[BBBVideoScraperError]] that is thrown when an error occurs during a video scraping */
export class BBBVideoScraperDuringScrapingError extends BBBVideoScraperError {
    /**
     * The constructor of the [[BBBVideoScraperDuringScrapingError]] class.
     * @param error The error that caused this error.
     * @param message The message of the error.
     * @param otherInfo Other information about this error.
     */
    constructor(error: Error, message = 'There was an error during the scraping.', otherInfo?: any) {
        super(message, {
            error,
            otherInfo
        });
        this.name = 'BBBVideoScraperDuringScrapingError';
    }
}
