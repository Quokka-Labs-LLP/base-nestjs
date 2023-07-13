import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DATABASE_TYPE } from '@config/constant';

/**
 *
 */
@Module({})
export class DatabaseConnectModule {
  /**
   * @returns DynamicModule for database connection between MySQL and MongoDB.
   */
  static forRoot(): DynamicModule {
    return {
      module: DatabaseConnectModule,
      imports: [DatabaseConnectModule.getDatabaseModule()],
    };
  }

  /**
   * @returns DynamicModule for database connection between MySQL and MongoDB.
   */
  private static getDatabaseModule(): DynamicModule {
    const config = new ConfigService();
    const databaseType = config.get<string>('DATABASE_TYPE');

    let databaseModule: DynamicModule;
    if (databaseType === DATABASE_TYPE.MongoDB) {
      databaseModule = MongooseModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],

        /**
         *
         * @param configService Need to get values from environment to config MongoDB options.
         * @returns MongoDB connection.
         */
        useFactory: (configService: ConfigService) => ({
          uri: configService.get('MONGO_URI'),
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }),
      });
      console.log('Connected to MongoDb database using Mongoose');
    } else if (databaseType === DATABASE_TYPE.RDB) {
      databaseModule = TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        /**
         *
         * @param configService Need to get values from environment to config MySQL database options.
         * @returns MySQL database connection.
         */
        useFactory: (configService: ConfigService) => ({
          type: 'mysql',
          host: configService.get('RDB_HOST'),
          port: +configService.get('RDB_PORT'),
          username: configService.get('RDB_USERNAME'),
          password: configService.get('RDB_PASSWORD'),
          database: configService.get('RDB_DATABASE'),
          entities: [
            /* Add your TypeORM entities here */
          ],
          synchronize: true,
          logging: false,
        }),
        inject: [ConfigService],
      });
      console.log('Connected to RDBMS database using typeorm');
    } else {
      throw new Error(`Invalid database type: ${databaseType}`);
    }

    return databaseModule;
  }
}
