import { Test, TestingModule } from '@nestjs/testing';
import { AnimalController } from './animal.controller';
import { AnimalService } from './animal.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('AnimalController', () => {
  let controller: AnimalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnimalController],
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

    controller = module.get<AnimalController>(AnimalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
