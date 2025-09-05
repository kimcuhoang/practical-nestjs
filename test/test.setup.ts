import * as moment from "moment";
import * as TestHelpers from "@test/test-helpers";


const app = globalThis.nestApp;
const request = globalThis.httpClient;


export { 
    app, 
    request,
    moment, 
    TestHelpers 
};

// beforeAll(async () => {

//     connectionString = globalThis.postgresContainer.getConnectionUri();

//     process.env.POSTGRES_DATABASE_URL = connectionString;
//     process.env.POSTGRES_LOG_ENABLED = "!true";
//     process.env.FALLBACK_LANGUAGE = "en";
//     process.env.SOLACE_ENABLED = "false";
//     process.env.LOG_LEVELS = "log";//warn|error";

//     if (globalThis.redisEnabled) {
//         console.log("Redis is enabled");
//         process.env.CACHE_REDIS_URL = globalThis.redisContainer.getConnectionUrl();
//     }

//     initializeTransactionalContext({
//         storageDriver: StorageDriver.ASYNC_LOCAL_STORAGE
//     });

//     const moduleFixture: TestingModule = await Test.createTestingModule({
//         imports: [AppModule]
//     }).compile();

//     app = moduleFixture.createNestApplication({
//         abortOnError: true,
//         bodyParser: true
//     });

//     app.useGlobalPipes(new I18nValidationPipe({
//         //since we don't config @nestjs/swagger CLI plugin
//         // TODO: config ts-jest within @nestjs/swagger
//         whitelist: false, 
//         transform: true,
//         forbidNonWhitelisted: true,
//         stopAtFirstError: true,
//         always: true,
//         transformOptions: {
//             enableImplicitConversion: true,
//         }
//     }));
    
//     app.useGlobalFilters(
//         new I18nValidationExceptionFilter({
//             detailedErrors: true
//         })
//     );

//     const configService = app.get<ConfigService>(ConfigService);
//     const logLevels = configService.get("LOG_LEVELS")?.split("|") ?? [];
//     app.useLogger(logLevels as LogLevel[]);


//     await app.init();
//     request = httpClient(app.getHttpServer());
// });

// afterAll(async () => {
//     await app.close();
// });

// // add some timeout until containers are up and working 
// // jest.setTimeout(120000);
// export { app, request, moment, TestHelpers };