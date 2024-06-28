import { Controller, Post, Body, ValidationPipe, Get } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { CreateAnimalDto } from 'src/dto/input/createAnimalDto';
import { FindAnimalDto } from 'src/dto/input/findAnimalDto';

@Controller('animal')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  @Post('create')
  createAnimal(@Body(ValidationPipe) createAnimalDto: CreateAnimalDto) {
    return this.animalService.createAnimal(createAnimalDto);
  }

  @Get('find')
  findAnimal(@Body(ValidationPipe) findAnimalDto: FindAnimalDto) {
    return this.animalService.findAnimals(findAnimalDto);
  }
}
