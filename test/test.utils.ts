import { INestApplication, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';


const setupNestApplication = async(): Promise<INestApplication> => {

    process.env.FALLBACK_LANGUAGE = "en";
    process.env.SOLACE_ENABLED = "false";
    process.env.LOG_LEVELS = "log";//warn|error";
    process.env.POSTGRES_DATABASE_URL = globalThis.postgresContainer.getConnectionUri();
    process.env.POSTGRES_LOG_ENABLED = "false";

    if (globalThis.redisEnabled) {
        process.env.REDIS_URL = globalThis.redisContainer.getConnectionUrl();
        process.env.REDIS_HOST = globalThis.redisContainer.getHost();
        process.env.REDIS_PORT = globalThis.redisContainer.getFirstMappedPort().toString();
    }

    initializeTransactionalContext({
        storageDriver: StorageDriver.ASYNC_LOCAL_STORAGE
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule]
    }).compile();

    const app = moduleFixture.createNestApplication({
        abortOnError: true,
        bodyParser: true
    });

    // app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    app.useGlobalPipes(new I18nValidationPipe());
    app.useGlobalFilters(
        new I18nValidationExceptionFilter({
            detailedErrors: true
        })
    );

    const configService = app.get<ConfigService>(ConfigService);
    const logLevels = configService.get("LOG_LEVELS")?.split("|") ?? [];
    app.useLogger(logLevels as LogLevel[]);
    
    await app.init();
    return app;
};

export {
    setupNestApplication
};

