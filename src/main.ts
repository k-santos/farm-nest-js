import { readFileSync } from 'fs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { seedData } from './database/seed';

function readDataFromFile(filePath: string) {
  const dataBuffer = readFileSync(filePath);
  const dataJSON = dataBuffer.toString();
  return JSON.parse(dataJSON);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  const dataPath = join(__dirname, '..', '../database', 'data.json');
  const data = readDataFromFile(dataPath);
  seedData(data);
}
bootstrap();
