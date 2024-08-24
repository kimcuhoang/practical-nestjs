import * as moment from "moment";

describe("Datetime conversion", () => {
    
    const offsetTimezone = 8;
    // const sDatetimeAtLocal = "2024-08-24T11:36:24.560Z";
    const sDatetimeAtLocal = "2024-08-24T11:36:00";

    const dateTimeAtLocal = moment(sDatetimeAtLocal).toDate();
    const dateTimeAtTUtc = moment(sDatetimeAtLocal).subtract(offsetTimezone, 'hours').toDate();

    // const sStartLocalDate = "2024-08-24T00:00:00.000Z";
    const sStartLocalDate = "2024-08-24T00:00:00";
    const startDateLocalDate = moment(sStartLocalDate).toDate();
    
    // const sStartLocalDateAtUtc = "2024-08-23T16:00:00.000Z";
    const sStartLocalDateAtUtc = "2024-08-23T16:00:00";
    const startLocalDateAtUtc = moment(sStartLocalDateAtUtc).toDate();

    const convertToUtc = (localDate: Date, offsetTimezone: number, callback?: (m: moment.Moment) => void) : Date => {
        let momentObj = moment(localDate);
        if (callback) {
            callback(momentObj);
        }
        return momentObj.utcOffset(offsetTimezone, true).utc(false).toDate();
    };

    const convertToLocal = (utcDateTime: Date, offsetTimezone: number): Date => {
        return moment(utcDateTime).utcOffset(offsetTimezone, false).utc(true).toDate();
    };

    describe(`pure moment`, () => {
        test(`local to utc`, () => {
            const toUtc = moment(dateTimeAtLocal).utcOffset(offsetTimezone, true).utc(false).toDate();
            const toUtc1 = convertToUtc(dateTimeAtLocal, offsetTimezone);
            expect(toUtc).toEqual(dateTimeAtTUtc);
            expect(toUtc1).toEqual(dateTimeAtTUtc);
        });
    
        test(`utc back to local`, () => {
            const toLocal = moment(dateTimeAtTUtc).utcOffset(offsetTimezone, false).utc(true).toDate();
            const toLocal1 = convertToLocal(dateTimeAtTUtc, offsetTimezone);
            expect(toLocal).toEqual(dateTimeAtLocal);
            expect(toLocal1).toEqual(dateTimeAtLocal);
        });
    
        test(`start date at utc`, () => {
            const toUtc = moment(startDateLocalDate).startOf('date').utcOffset(offsetTimezone, true).utc(false).toDate();
            const toUtc1 = convertToUtc(dateTimeAtLocal, offsetTimezone, m => m.startOf('date'));
            expect(toUtc).toEqual(startLocalDateAtUtc);
            expect(toUtc1).toEqual(startLocalDateAtUtc);
        });
    
        test(`start day in Utc back to local`, () => {
            const toLocal = moment(startLocalDateAtUtc).utcOffset(offsetTimezone, false).utc(true).toDate();
            const toLocal1 = convertToLocal(startLocalDateAtUtc, offsetTimezone);
            expect(toLocal).toEqual(startDateLocalDate);
            expect(toLocal1).toEqual(startDateLocalDate);
        });

        test(`YYYY-MM-DD to utc`, () => {
            const sDateOnly = moment(dateTimeAtLocal).format("YYYY-MM-DD");
            const dateOnly = moment(sDateOnly).toDate();

            const toUtc = moment(dateOnly).utcOffset(offsetTimezone, true).utc(false).toDate();
            const toUtc1 = convertToUtc(dateOnly, offsetTimezone);

            expect(toUtc).toEqual(startLocalDateAtUtc);
            expect(toUtc1).toEqual(startLocalDateAtUtc);
            console.log({
                dateOnly,
                toUtc,
                toUtc1,
                startLocalDateAtUtc,
            })
        });
    });
});