import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
 
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: ["dist/**/*.entity{.ts,.js}"],// be careful with the path u may have to change it for prod
        synchronize: true,
        // type: 'postgres',
        // host: configService.get('DB_HOST'),
        // port: configService.get('DB_PORT'),
        // username: configService.get('DB_USER'),
        // password: configService.get('DB_PASSWORD'),
        // database: configService.get('DB_NAME'),
        // synchronize: true,  //its better to have synchronize as false for production. this creates the table if not there
        // migrations: ["dist/common/migrations/*{.ts,.js}"],
        // cli: {
        //   migrationsDir: "src/common/migrations"
        // },
        // migrationsRun: true
      })
    }),
  ],
})
export class DatabaseModule {}