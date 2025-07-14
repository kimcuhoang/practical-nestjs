import type { Config } from '@jest/types';

const jestConfig: Config.InitialOptions = {
    silent: false,
    verbose: true,
    restoreMocks: true,
    cache: false,
    moduleFileExtensions: ["js", "json", "ts"],
    extensionsToTreatAsEsm: [".ts"],
    rootDir: "..",
    maxWorkers: '50%',
    testEnvironment: "node",
    testPathIgnorePatterns: [
        "/node_modules/",
        "/dist/",
        "/src/"
    ],
    testRegex: [
        ".e2e-spec.ts$",
        ".e2e.ts$"
    ],
    transform: {
        "^.+\\.(t|j)s$": "ts-jest"
    },
    globalSetup: "./test/global.setup.ts",
    globalTeardown: "./test/global.teardown.ts",
    setupFilesAfterEnv: [
        "./test/test.setup.ts"
    ],
    setupFiles: [
        "dotenv/config",
        "reflect-metadata"
    ],
    moduleNameMapper: {
        "^@src/(.*)$": "<rootDir>/src/$1",
        "^@building-blocks/(.*)$": "<rootDir>/src/building-blocks/$1",
        "^@integration-events/(.*)$": "<rootDir>/src/integration-events/$1",
        "^@projects/(.*)$": "<rootDir>/src/projects/$1",
        "^@notifications/(.*)$": "<rootDir>/src/notifications/$1",
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
        "!src/integration-events/**",
        "!node_modules/**"
    ]
};

export default jestConfig;