import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Delete,
} from '@nestjs/common';
import { AnimalService } from './animal.service';
import { CreateAnimalDto } from '../dto/input/animal/createAnimalDto';
import { FindAnimalDto } from '../dto/input/animal/findAnimalDto';
import { DeleteAnimalDto } from '../dto/input/animal/deleteAnimalDto';

@Controller('animal')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  @Post('create')
  createAnimal(@Body(ValidationPipe) createAnimalDto: CreateAnimalDto) {
    return this.animalService.createAnimal(createAnimalDto);
  }

  @Get('find')
  findAnimals(@Body(ValidationPipe) findAnimalDto: FindAnimalDto) {
    return this.animalService.findAnimals(findAnimalDto);
  }

  @Delete()
  deleteAnimal(@Body(ValidationPipe) deleteAnimalDto: DeleteAnimalDto) {
    return this.animalService.deleteAnimal(deleteAnimalDto);
  }
}
