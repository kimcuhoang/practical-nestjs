import 'dotenv/config'; 
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './building-blocks/infra/database/database.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ProjectsModule } from './projects/projects.module';
import { ProjectsModuleSchemas, ProjectsModuleMigrations } from './projects/persistence';

@Module({
  imports: [
    DatabaseModule.register({
      databaseUrl: process.env.DATABASE_URL,
      schemas: [
        ...ProjectsModuleSchemas,
      ],
      migrations: [
        ...ProjectsModuleMigrations
      ]
    }),
    CqrsModule.forRoot(),
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {}
