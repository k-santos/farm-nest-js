import { Test, TestingModule } from '@nestjs/testing';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AnimalService } from './animal.service';

describe('Animal Service', () => {
  let service: AnimalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnimalService],
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

    service = module.get<AnimalService>(AnimalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
