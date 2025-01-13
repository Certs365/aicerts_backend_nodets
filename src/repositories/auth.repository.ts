import logger from '../utils/logger';
import { IUser, User } from '../models/user';
import { Verification } from '../models/verification';
import { ServiceAccountQuotas } from '../models/serviceAccountQuotas';

const serviceLimit = Number(process.env.SERVICE_LIMIT) || 10;

const findUser = async (email: string): Promise<IUser | null> => {
  try {
    logger.info('Start: authRepository:findUser');
    const userExists: IUser | null = await User.findOne({
      $expr: {
        $eq: [{ $toLower: '$email' }, email.toLowerCase()],
      },
    });
    return userExists;
  } catch (error: any) {
    logger.error('Error: authRepository:findUser');
    return null;
  } finally {
    logger.info('End: authRepository:findUser');
  }
};

const createUser = async (body: Record<string, any>) => {
  try {
    logger.info('Start: authRepository:createUser');
    // Validate and sanitize inputs
    const {
      name = '',
      organization = '',
      email = '',
      password,
      issuerId,
      address = '',
      country = '',
      organizationType = '',
      city = '',
      zip = '',
      industrySector = '',
      state = '',
      websiteLink = '',
      phoneNumber = '',
      designation = '',
    } = body;

    const newUser = new User({
      name: name.trim(),
      organization: organization.trim(),
      email: email.trim(),
      password,
      issuerId,
      address: address.trim(),
      country: country.trim(),
      organizationType: organizationType.trim(),
      city: city.trim(),
      zip: zip,
      industrySector: industrySector.trim(),
      state: state.trim(),
      websiteLink: websiteLink.trim(),
      phoneNumber: phoneNumber,
      designation: designation.trim(),
    });
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error: any) {
    logger.error('Error: authRepository:createUser:', error);
    return null;
  } finally {
    logger.info('End: authRepository:createUser');
  }
};

const createUserServiceQuote = async (issuerId: string) => {
  try {
    logger.info('Start: authRepository:createUserServiceQuote');
    const todayDate = new Date();
    await Promise.all(
      ['issue', 'renew', 'revoke', 'reactivate'].map(
        async (serviceName: string) =>
          new ServiceAccountQuotas({
            issuerId,
            serviceId: serviceName,
            limit: serviceLimit,
            status: true,
            createdAt: todayDate,
            updatedAt: todayDate,
            resetAt: todayDate,
          }).save()
      )
    );
    return true;
  } catch (error: any) {
    logger.error('Error: authRepository:createUserServiceQuote:', error);
    return false;
  } finally {
    logger.info('End: authRepository:createUserServiceQuote');
  }
};

const updateUserRefreshToken = async (
  email: string,
  token: string
): Promise<IUser | null> => {
  try {
    logger.info('Start: authRepository:updateUserRefreshToken');
    const userExists: IUser | null = await User.findOneAndUpdate(
      {
        $expr: {
          $eq: [{ $toLower: '$email' }, email.toLowerCase()],
        },
      },
      { $set: { refreshToken: token } },
      { new: true }
    );
    return userExists;
  } catch (error: any) {
    logger.error('Error: authRepository:updateUserRefreshToken');
    return null;
  } finally {
    logger.info('End: authRepository:updateUserRefreshToken');
  }
};

const saveUserOtp = async (email: string, otp: number) => {
  try {
    logger.info('Start: authRepository:saveUserOtp');
    const verify = await Verification.findOne({
      $expr: {
        $eq: [{ $toLower: '$email' }, email.toLowerCase()],
      },
    });
    if (verify) {
      verify.code = otp;
      verify.verified = false;
      verify.save();
    } else {
      const createVerify = new Verification({
        email: email,
        code: otp,
        verified: false,
      });
      await createVerify.save();
    }
    return true;
  } catch (error: any) {
    logger.error('Error: authRepository:saveUserOtp:', error);
    throw Error('Error wile setting the otp for user');
  } finally {
    logger.info('End: authRepository:saveUserOtp');
  }
};

export default {
  findUser,
  createUser,
  createUserServiceQuote,
  updateUserRefreshToken,
  saveUserOtp,
};
