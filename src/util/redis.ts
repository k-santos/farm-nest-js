import { Redis } from 'ioredis';

export async function clearCache(redis: Redis) {
  let keys = await redis.keys('animals:*');
  if (keys.length > 0) {
    await this.redis.del(keys);
  }

  keys = await redis.keys('lots:*');
  if (keys.length > 0) {
    await this.redis.del(keys);
  }
}
