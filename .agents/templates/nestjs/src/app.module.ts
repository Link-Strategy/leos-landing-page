import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const loadUnifiedConfig = () => {
  const infraConfig = require('@configs/infrastructure-config');
  // Service-specific config should be merged here during generation
  return { ...infraConfig };
};

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      load: [loadUnifiedConfig]
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
