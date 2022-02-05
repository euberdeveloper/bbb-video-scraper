import { BBBVideoScraperError } from '.';

export class BBBVideoScraperDuringBrowserLaunchError extends BBBVideoScraperError {
    constructor(error: Error, message = 'There was an error during the browser launch.', otherInfo?: any) {
        super(message, {
            error,
            otherInfo
        });
        this.name = 'BBBVideoScraperDuringBrowserLaunchError';
    }
}
