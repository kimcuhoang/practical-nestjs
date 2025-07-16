import { faker } from "@faker-js/faker"


const genCode = (length: number = 10): string => faker.string.alphanumeric(length).toUpperCase();

export {
    genCode,
};