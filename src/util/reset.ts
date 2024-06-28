import { readFileSync } from 'fs';
import { join } from 'path';
import { seedData } from '../database/seed';

function readDataFromFile(filePath: string) {
  const dataBuffer = readFileSync(filePath);
  const dataJSON = dataBuffer.toString();
  return JSON.parse(dataJSON);
}

export async function reset() {
  const dataPath = join(__dirname, '..', 'database', 'data.json');
  const data = readDataFromFile(dataPath);
  seedData(data);
}
