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

describe("convert local to utc back and forth", () => {
    test.each(testCases)(`should be success`, testCase => {

        const toUtc = convertToUtc(testCase.localDateTime, offsetTimezone);
        const backToLocal = convertToLocal(toUtc, offsetTimezone);

        console.log({
            testCase,
            toUtc,
            backToLocal
        });

        expect(toUtc).toEqual(testCase.utcDateTime);
        expect(backToLocal).toEqual(testCase.localDateTime);
    });
});



// describe("Datetime conversion", () => {
    
//     const offsetTimezone = 8;
//     const sDatetimeAtLocal = "2024-08-24T11:36:24.560Z";
//     // const sDatetimeAtLocal = "2024-08-24T11:36:00";

//     const dateTimeAtLocal = moment(sDatetimeAtLocal).toDate();
//     const dateTimeAtTUtc = moment(sDatetimeAtLocal).subtract(offsetTimezone, 'hours').toDate();
//     // const dateTimeAtTUtc = moment("2024-08-24T03:36:24.560Z").toDate();

//     const sStartLocalDate = "2024-08-24T00:00:00.000Z";
//     // const sStartLocalDate = "2024-08-24T00:00:00";
//     const startDateLocalDate = moment(sStartLocalDate).toDate();
    
//     const sStartLocalDateAtUtc = "2024-08-23T16:00:00.000Z";
//     // const sStartLocalDateAtUtc = "2024-08-23T16:00:00";
//     const startLocalDateAtUtc = moment(sStartLocalDateAtUtc).toDate();

//     const convertToUtc = (localDate: Date, offsetTimezone: number, callback?: (m: moment.Moment) => void) : Date => {
//         let momentObj = moment(localDate);
//         if (callback) {
//             callback(momentObj);
//         }
//         return momentObj.utc(false).utcOffset(offsetTimezone, true).toDate();
//     };

//     const convertToLocal = (utcDateTime: Date, offsetTimezone: number): Date => {
//         return moment(utcDateTime).utcOffset(offsetTimezone, false).utc(true).toDate();
//     };

//     describe(`pure moment`, () => {
//         xtest(`local to utc`, () => {

//             // console.log({
//             //     a4: moment(dateTimeAtLocal).utc(false).toDate(),
//             //     a41: moment(dateTimeAtLocal).utc(false).utcOffset(offsetTimezone, true).toDate()
//             // });

//             const toUtc = moment(dateTimeAtLocal).utc(false).utcOffset(offsetTimezone, true).toDate();
//             const toUtc1 = convertToUtc(dateTimeAtLocal, offsetTimezone);
            

//             console.log({
//                 dateTimeAtLocal,
//                 toUtc,
//                 toUtc1,
//                 dateTimeAtTUtc
//             });

//             expect(toUtc).toEqual(dateTimeAtTUtc);
//             expect(toUtc1).toEqual(dateTimeAtTUtc);
//         });
    
//         test(`utc back to local`, () => {

//             const toUtc = convertToUtc(dateTimeAtLocal, offsetTimezone);
//             const toLocal = moment(toUtc).utcOffset(offsetTimezone, false).utc(true).toDate();
//             const toLocal1 = convertToLocal(toUtc, offsetTimezone);

//             console.log({
//                 dateTimeAtLocal,
//                 dateTimeAtTUtc
//                 toUtc,
//                 toLocal,
//                 toLocal1
//             });

//             expect(toUtc).toEqual(dateTimeAtTUtc);
//             expect(toLocal).toEqual(dateTimeAtLocal);
//             expect(toLocal1).toEqual(dateTimeAtLocal);

            
            
//             // console.log({
//             //     a: toUtc1,
//             //     a1: moment(toUtc).utc(false).toDate(),
//             //     a2: moment(toUtc).utc(false).utcOffset(offsetTimezone, false).toDate(),

//             //     b1: moment(toUtc).utcOffset(offsetTimezone, true).toDate(),
//             //     b2: moment(toUtc).utcOffset(offsetTimezone, false).toDate(),
//             //     b3: moment(toUtc).utcOffset(offsetTimezone, false).utc(true).toDate(),
//             //     b4: moment(toUtc).utcOffset(offsetTimezone, false).utc(false).toDate(),
                
//             // });

//             // const toLocal = moment(dateTimeAtTUtc).utcOffset(offsetTimezone, false).utc(true).toDate();
//             // const toLocal1 = convertToLocal(dateTimeAtTUtc, offsetTimezone);
//             // expect(toLocal).toEqual(dateTimeAtLocal);
//             // expect(toLocal1).toEqual(dateTimeAtLocal);
//         });
    
//         xtest(`start date at utc`, () => {
//             const toUtc = moment(startDateLocalDate).startOf('date').utcOffset(offsetTimezone, true).utc(false).toDate();
//             const toUtc1 = convertToUtc(dateTimeAtLocal, offsetTimezone, m => m.startOf('date'));
//             expect(toUtc).toEqual(startLocalDateAtUtc);
//             expect(toUtc1).toEqual(startLocalDateAtUtc);
//         });
    
//         xtest(`start day in Utc back to local`, () => {
//             const toLocal = moment(startLocalDateAtUtc).utcOffset(offsetTimezone, false).utc(true).toDate();
//             const toLocal1 = convertToLocal(startLocalDateAtUtc, offsetTimezone);
//             expect(toLocal).toEqual(startDateLocalDate);
//             expect(toLocal1).toEqual(startDateLocalDate);
//         });

//         xtest(`YYYY-MM-DD to utc`, () => {
//             const sDateOnly = moment(dateTimeAtLocal).format("YYYY-MM-DD");
//             const dateOnly = moment(sDateOnly).toDate();

//             const toUtc = moment(dateOnly).utcOffset(offsetTimezone, true).utc(false).toDate();
//             const toUtc1 = convertToUtc(dateOnly, offsetTimezone);

//             expect(toUtc).toEqual(startLocalDateAtUtc);
//             expect(toUtc1).toEqual(startLocalDateAtUtc);
//             console.log({
//                 dateOnly,
//                 toUtc,
//                 toUtc1,
//                 startLocalDateAtUtc,
//             })
//         });
//     });
// });