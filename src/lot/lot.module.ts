import { Module } from '@nestjs/common';
import { LotService } from './lot.service';
import { LotController } from './lot.controller';

@Module({
  providers: [LotService],
  controllers: [LotController]
})
export class LotModule {}
