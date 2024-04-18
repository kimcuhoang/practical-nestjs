import 'dotenv/config';
import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './building-blocks/infra/database/database.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './projects/projects.module';
import { ProjectsModuleDataSource } from './projects/persistence';
import { ConfigurationsModule } from './building-blocks/infra/configurations/configurations.module';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot(),
    ConfigurationsModule.register({
      connectionString: process.env.DATABASE_URL
    }),
    DatabaseModule.register({
      databaseUrl: process.env.DATABASE_URL,
      migrations: [
        ...ProjectsModuleDataSource.Migrations
      ]
    }),
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [ AppService ],
})
export class AppModule {
  
}
