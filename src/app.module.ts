import 'dotenv/config'; 
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infra/database/database.module';
import { CqrsModule } from '@nestjs/cqrs';
import { DomainModule } from './project-management/domain.module';

@Module({
  imports: [
    DatabaseModule.register({
      databaseUrl: process.env.DATABASE_URL
    }),
    CqrsModule.forRoot(),
    DomainModule,
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {}
