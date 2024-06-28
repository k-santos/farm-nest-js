import { Test, TestingModule } from '@nestjs/testing';
import { LotController } from './lot.controller';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LotService } from './lot.service';
import { CreateLotDto } from '../dto/input/lot/createLotDto';
import { reset } from '../util/reset';
import { NotFoundException } from '@nestjs/common';

describe('LotController', () => {
  let controller: LotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LotController],
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

    controller = module.get<LotController>(LotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a lot', async () => {
    const createLotDto: CreateLotDto = {
      code: 99,
      name: 'Lot name',
    };

    const createdLot = await controller.createLote(createLotDto);

    expect(createdLot).toBeDefined();
    expect(createdLot.name).toBe(createLotDto.name);
    expect(createdLot.code).toBe(createLotDto.code);
  });

  beforeEach(async () => {
    await reset();
  });
});
