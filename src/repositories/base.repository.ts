import { IUser, User } from '../models/user';
import logger from '../utils/logger';

const findUser = async (email: string): Promise<IUser | null> => {
  try {
    logger.info('Start: baseRepository/findUser');
    const userExists: IUser | null = await User.findOne({
      $expr: {
        $eq: [{ $toLower: '$email' }, email.toLowerCase()],
      },
    });
    return userExists;
  } catch (error: any) {
    logger.error('Error: baseRepository/findUser', error);
    return null;
  } finally {
    logger.info('End: baseRepository/findUser');
  }
};

export default { findUser };
