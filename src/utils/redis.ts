import redisClient from '../config/redis.config';
import logger from './logger';

export const getKey = async (
  issuerId: string,
  key: string = ''
): Promise<string | null | undefined> => {
  try {
    const dashboardKey: string = `dashboard:${issuerId}`;
    if (key) {
      return await redisClient.hget(dashboardKey, key);
    }
    return JSON.stringify(await redisClient.hgetall(dashboardKey));
  } catch (error: any) {
    logger.error(`Error: Redis get key(${issuerId}): `, error);
  }
};
