


import { DateTimeProvider } from "@src/building-blocks/providers";
import { app } from "@test/test.setup";
import * as moment from "moment";

const offsetTimezone = 8;
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

describe(`Datetime coversion with timezone offset is GMT+${offsetTimezone}`, () => {

    describe.each(testCases)("From Opco's datetime to Utc should be correct", testCase => {
        test(`${testCase.localDateTime.toISOString()} should be ${testCase.utcDateTime.toISOString()}`, () => {

            const dateTimeProvider = app.get<DateTimeProvider>(DateTimeProvider);
            const toUtc = dateTimeProvider.convertToUtc(testCase.localDateTime, offsetTimezone);

            console.log({
                local: testCase.localDateTime,
                toUtc: toUtc
            });

            expect(toUtc).toEqual(testCase.utcDateTime);
        });
    });

    describe.each(testCases)("From Utc to Opco's datetime should be correct", testCase => {
        test(`${testCase.utcDateTime.toISOString()} should be ${testCase.localDateTime.toISOString()}`, () => {
            
            const dateTimeProvider = app.get<DateTimeProvider>(DateTimeProvider);
            const toOpcoDatetime = dateTimeProvider.convertToLocalDateTime(testCase.utcDateTime, offsetTimezone);

            console.log({
                fromUtc: testCase.utcDateTime,
                OpcoDateTime: toOpcoDatetime
            });

            expect(toOpcoDatetime).toEqual(testCase.localDateTime);
        })

    });
});