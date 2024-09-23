import { Module } from '@nestjs/common';
import { AuthModule } from './model/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './model/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from './config/database.config';
import { WhitelistMiddleware } from './middleware/whitelist.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes config globally available
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {
  configure(consumer: any) {
    consumer
      .apply(WhitelistMiddleware)
      .forRoutes('*'); // Apply whitelist for all routes
  }
}