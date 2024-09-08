import { Injectable } from "@nestjs/common";
import * as moment from "moment";

@Injectable()
export class DateTimeProvider {
    
    public getUtcNow(): Date {
        return moment.utc().toDate();
    }

    public convertToUtc(dateTimeInLocal: Date, timezoneOffset: number, callback?: (m: moment.Moment) => void) : Date {
        let momentObj = moment(dateTimeInLocal);
        if (callback) {
            callback(momentObj);
        }
        return momentObj.utc(false).utcOffset(timezoneOffset, true).toDate();;
    }

    public convertToLocalDateTime(dateTimeInUtc: Date, timezoneOffset: number): Date {
        return moment(dateTimeInUtc).utcOffset(timezoneOffset, false).utc(true).toDate();
    }
}