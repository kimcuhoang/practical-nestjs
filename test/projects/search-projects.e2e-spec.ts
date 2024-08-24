import { Project } from "@src/projects/core";
import { And, Between, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { getRepositoryToken } from '@nestjs/typeorm';
import { app } from "@test/test.setup";
import * as moment from "moment";
import { faker } from "@faker-js/faker";

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

describe(`Search projects & playing with date-time`, () => {

    let project: Project;
    let projectRepository: Repository<Project>;

    const timezoneForWorkingArea = 8;
    const sRefDateAtLocal = "2024-08-24";
    const sRefDateAtUtc = "2024-08-23T16:00:00";
    const refDateAtLocal = moment(sRefDateAtLocal).toDate();
    const refDateAtUtc = moment(sRefDateAtUtc).toDate();

    beforeEach(async() => {
        projectRepository = app.get<Repository<Project>>(getRepositoryToken(Project));

        const projectStartDate = convertToUtc(refDateAtLocal, timezoneForWorkingArea);
        expect(projectStartDate).toEqual(refDateAtUtc);
        const projectStartDateAtLocal = convertToLocal(projectStartDate, timezoneForWorkingArea);
        expect(projectStartDateAtLocal).toEqual(refDateAtLocal);

        project = Project.create(p => {
            p.name = faker.lorem.sentence(5);
            p.startDate = projectStartDate
        });

        await projectRepository.save(project);
    })

    afterEach(async() => {
        await projectRepository.delete({});
    });

    test(`search projects has start-date from ${refDateAtLocal}`, async() => {
        
        const startFrom = convertToUtc(refDateAtLocal, timezoneForWorkingArea, m => m.startOf('date'));
        const endAt = convertToUtc(refDateAtLocal, timezoneForWorkingArea, m => m.endOf('date'));

        const aProject = await projectRepository.findOne({
            where: {
                startDate: And(MoreThanOrEqual(startFrom), LessThanOrEqual(endAt))
                // startDate: Between(startFrom, endAt)
            }
        });

        console.log(aProject);

        expect(aProject).toBeDefined();
        expect(aProject.id).toEqual(project.id);
        expect(aProject.name).toEqual(project.name);
        expect(aProject.startDate).toEqual(project.startDate);
    });

    
});