import { BBBVideoScraperError } from '.';

export class BBBVideoScraperDuringScrapingError extends BBBVideoScraperError {
    constructor(error: Error, message = 'There was an error during the scraping.', otherInfo?: any) {
        super(message, {
            error,
            otherInfo
        });
        this.name = 'BBBVideoScraperDuringScrapingError';
    }
}
