import Redis from 'ioredis';
import logger from '../utils/logger';

const redisConfig = {
  host: process.env.REDIS_HOST as string,
  port: Number(process.env.REDIS_PORT),
};

const redisClient = new Redis(redisConfig);

redisClient.on('connect', () => {
  logger.info('Info: Connected to Redis Client');
});

redisClient.on('error', (err) => {
  logger.error('Error: Redis: ', err);
});

export default redisClient;
