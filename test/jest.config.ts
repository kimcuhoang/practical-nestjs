import type { Config } from '@jest/types';

const jestConfig: Config.InitialOptions = {
    silent: false,
    verbose: true,
    moduleFileExtensions: ["js", "json", "ts"],
    rootDir: "..",
    testEnvironment: "node",
    testRegex: [
        ".e2e-spec.ts$",
        ".e2e.ts$"
    ],
    transform: {
        "^.+\\.(t|j)s$": "ts-jest"
    },
    globalSetup: "./test/global.setup.ts",
    globalTeardown: "./test/global.teardown.ts",
    setupFiles: [
        "reflect-metadata"
    ],
    moduleNameMapper: {
        "^@src/(.*)$": "<rootDir>/src/$1",
        "^@building-blocks/(.*)$": "<rootDir>/src/building-blocks/$1",
        "^@projects/(.*)$": "<rootDir>/src/projects/$1",
        "^@test/(.*)$": "<rootDir>/test/$1"
    },
    coverageReporters: ["json", "html", "clover", "lcov", "text"],
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/main.ts",
        "!src/**/index.ts",
        "!src/**/*.module.ts",
        "!src/**/persistence/**",
        "!src/building-blocks/**",
        "!node_modules/**"
    ]
};

export default jestConfig;