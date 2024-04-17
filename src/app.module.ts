import 'dotenv/config'; 
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infra/database/database.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    DatabaseModule.register({
      databaseUrl: process.env.DATABASE_URL
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
