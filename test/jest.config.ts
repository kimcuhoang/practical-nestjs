import type { Config } from '@jest/types';

const jestConfig: Config.InitialOptions = {
    silent: false,
    verbose: true,
    restoreMocks: true,
    cache: true,
    testTimeout: 120000,
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
    // setupFilesAfterEnv: [
    //     "./test/test.setup.ts"
    // ],
    // setupFiles: [
    //     "dotenv/config",
    //     "reflect-metadata"
    // ],
    moduleNameMapper: {
        "^@src/(.*)$": "<rootDir>/src/$1",
        "^@test/(.*)$": "<rootDir>/test/$1"
    },
    coverageReporters: ["json", "html", "clover", "lcov", "text"],
    collectCoverageFrom: [
        "libs/**/src/*.ts",
        "!libs/**/src/main.ts",
        "!libs/**/src/**/index.ts",
        "!libs/**/src/**/*.module.ts",
        "!libs/**/src/**/persistence/**",
        "src/**/*.ts",
        "!src/main.ts",
        "!src/**/index.ts",
        "!src/**/*.module.ts",
        "!src/**/persistence/**",
        "!node_modules/**"
    ]
};

export default jestConfig;