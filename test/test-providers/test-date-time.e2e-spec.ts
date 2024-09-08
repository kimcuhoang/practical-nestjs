import * as moment from "moment";

const offsetTimezone = 7;
const testCases = new Array<{ localDateTime: Date, utcDateTime: Date }>();

testCases.push({
    localDateTime: moment("2024-08-24T11:36:24.560Z").toDate(),
    utcDateTime: moment("2024-08-24T11:36:24.560Z").subtract(offsetTimezone, 'hours').toDate()
});

testCases.push({
    localDateTime: moment("2024-08-24T11:36:00").toDate(),
    utcDateTime: moment("2024-08-24T11:36:00").subtract(offsetTimezone, 'hours').toDate()
});

testCases.push({
    localDateTime: moment("2024-08-24T11:36:00Z").toDate(),
    utcDateTime: moment("2024-08-24T11:36:00Z").subtract(offsetTimezone, 'hours').toDate()
});

testCases.push({
    localDateTime: moment("2024-08-24T00:00:00Z").toDate(),
    utcDateTime: moment("2024-08-24T00:00:00Z").subtract(offsetTimezone, 'hours').toDate()
});

const convertToUtc = (localDate: Date, offsetTimezone: number, callback?: (m: moment.Moment) => void) : Date => {
    let momentObj = moment(localDate);
    if (callback) {
        callback(momentObj);
    }
    return momentObj.utc(false).utcOffset(offsetTimezone, true).toDate();
};

const convertToLocal = (utcDateTime: Date, offsetTimezone: number): Date => {
    return moment(utcDateTime).utcOffset(offsetTimezone, false).utc(true).toDate();
};

describe(`Datetime coversion with timezone offset is GMT+${offsetTimezone}`, () => {

    describe.each(testCases)("From Opco's datetime to Utc should be correct", testCase => {
        test(`${testCase.localDateTime.toISOString()} should be ${testCase.utcDateTime.toISOString()}`, () => {

            const toUtc = convertToUtc(testCase.localDateTime, offsetTimezone);

            console.log({
                local: testCase.localDateTime,
                toUtc: toUtc
            });

            expect(toUtc).toEqual(testCase.utcDateTime);
        });
    });

    describe.each(testCases)("From Utc to Opco's datetime should be correct", testCase => {
        test(`${testCase.utcDateTime.toISOString()} should be ${testCase.localDateTime.toISOString()}`, () => {
            
            const toOpcoDatetime = convertToLocal(testCase.utcDateTime, offsetTimezone);

            console.log({
                fromUtc: testCase.utcDateTime,
                OpcoDateTime: toOpcoDatetime
            });

            expect(toOpcoDatetime).toEqual(testCase.localDateTime);
        })

    });
});