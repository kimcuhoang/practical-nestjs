import { Project } from "@src/projects/core";
import { And, Between, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { getRepositoryToken } from '@nestjs/typeorm';
import { app } from "@test/test.setup";
import * as moment from "moment";
import { faker, tr } from "@faker-js/faker";
import { endOfDay, startOfDay, addHours } from 'date-fns';


describe(`Search projects & playing with date-time`, () => {
    let project: Project;
    let projectRepository: Repository<Project>;
    
    const timezoneForWorkingArea = 8;

    const refDate = moment().format("YYYY-MM-DD");

    beforeEach(async() => {
        projectRepository = app.get<Repository<Project>>(getRepositoryToken(Project));

        const aDate = moment(refDate).utcOffset(timezoneForWorkingArea);
        const projectStartDate = moment(aDate).utc().toDate();

        project = Project.create(p => {
            p.name = faker.lorem.sentence(5);
            p.startDate = projectStartDate
        });

        await projectRepository.save(project);
    })

    afterEach(async() => {
        await projectRepository.delete({});
    });

    test(`search projects has start-date from ${refDate}`, async() => {
        
        const searchDate = moment(refDate).utcOffset(timezoneForWorkingArea);
        const startFrom = moment(searchDate).startOf('date').utc().toDate();
        const endAt = moment(searchDate).endOf('date').utc().toDate();

        const aProject = await projectRepository.findOne({
            where: {
                startDate: And(MoreThanOrEqual(startFrom), LessThanOrEqual(endAt))
                // startDate: Between(startFrom, endAt)
            }
        });

        console.log(aProject);

        const projectStartDate = moment(aProject.startDate).utcOffset(timezoneForWorkingArea);

        console.log({
            origin: aProject.startDate,
            startDate: getFormatFromMoment(projectStartDate)
        });
    });

    xtest(`Manipulating search date for ${refDate}`, () => {

        const step01 = moment(refDate).utcOffset(timezoneForWorkingArea);
        const step02 = moment(step01).startOf('date').utc();
        const step03 = moment(step01).endOf('date').utc();

        console.log({
            receive: refDate,
            toWorkingTimezone: getFormatFromMoment(step01),
            searchBegin: getFormatFromMoment(step02),
            searchEnd: getFormatFromMoment(step03),
            searchBeginDate: step02.toDate(),
            searchEndDate: step03.toDate()
        });
    });

    xtest(`Manipulating search date for ${new Date(refDate)}`, () => {

        const today = moment(refDate).utcOffset(timezoneForWorkingArea).utc().toDate();
        const step02 = moment(today).startOf('date').utc();
        const step03 = moment(today).endOf('date').utc();

        console.log({
            receive: today.toISOString(),
            searchBegin: getFormatFromMoment(step02),
            searchEnd: getFormatFromMoment(step03),
            searchBeginDate: step02.toDate(),
            searchEndDate: step03.toDate()
        });
    });

    const getFormatFromMoment = (moment: moment.Moment, keepOffset?: boolean): string => {
        return moment.toISOString(keepOffset ?? true);
    };
});