import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { Lot } from 'src/entities/lot';
import { CreateAnimalDto } from 'src/dto/input/createAnimalDto';

@Controller('animal')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  @Post('create')
  createLote(@Body(ValidationPipe) createAnimalDto: CreateAnimalDto) {
    return this.animalService.createAnimal(createAnimalDto);
  }
}
