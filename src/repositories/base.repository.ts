import { IUser, User } from '../models/user';
import logger from '../utils/logger';

const findUser = async (email: string): Promise<IUser | null> => {
  try {
    logger.info('Start: baseRepository');
    const userExists: IUser | null = await User.findOne({
      email,
    });
    return userExists;
  } catch (error: any) {
    logger.error('Error: baseRepository', error);
    return null;
  } finally {
    logger.info('End: baseRepository');
  }
};

export default { findUser };
