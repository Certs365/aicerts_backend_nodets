import redisClient from '../config/redis.config';
import logger from './logger';

export const getKey = async (
  hashKey: string,
  key: string
): Promise<string | null | undefined> => {
  try {
    return await redisClient.hget(hashKey, key);
  } catch (error: any) {
    logger.error('Error: Redis get key: ', error);
  }
};
