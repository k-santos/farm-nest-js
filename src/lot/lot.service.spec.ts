import { Test, TestingModule } from '@nestjs/testing';
import { LotService } from './lot.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('LotService', () => {
  let service: LotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LotService],
      imports: [
        RedisModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            config: {
              host: configService.get<string>('REDIS_HOST'),
              port: configService.get<number>('REDIS_PORT'),
            },
          }),
          inject: [ConfigService],
        }),
      ],
    }).compile();

    service = module.get<LotService>(LotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
