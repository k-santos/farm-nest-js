import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Delete,
} from '@nestjs/common';
import { AnimalService } from './animal.service';
import { CreateAnimalDto } from 'src/dto/input/createAnimalDto';
import { FindAnimalDto } from 'src/dto/input/findAnimalDto';
import { DeleteAnimalDto } from 'src/dto/input/deleteAnimalDto';

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
