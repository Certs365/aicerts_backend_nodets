import { SubscriptionPlan, ISubscriptionPlan } from '../models/subscription';
import { Admin, IAdmin } from '../models/admin';
import { User, IUser } from '../models/user';
import { messageCodes } from '../common/codes';
import {
  responseHandler,
  ResponseHandlerType,
  responseScenario,
} from '../utils/responseHandler';
import logger from '../utils/logger';
import { SimpleObject } from '../utils/types';
import {
  IUserSubscriptionPlan,
  UserSubscriptionPlan,
} from '../models/userSubscription';

const findAdmin = async (email: string): Promise<IAdmin | null> => {
  try {
    logger.info('Start: findAdminRepository');
    const adminExists: IAdmin | null = await Admin.findOne({ email });
    return adminExists;
  } catch (error: any) {
    logger.error('Error: findAdminRepository', error);
    return null;
  } finally {
    logger.info('End: findAdminRepository');
  }
};

const findUser = async (email: string): Promise<IUser | null> => {
  try {
    logger.info('Start: findUserRepository');
    const userExists: IUser | null = await User.findOne({
      email,
      approved: true,
    });
    return userExists;
  } catch (error: any) {
    logger.error('Error: findUserRepository', error);
    return null;
  } finally {
    logger.info('End: findUserRepository');
  }
};

const findPlan = async (code: string): Promise<ISubscriptionPlan | null> => {
  try {
    logger.info('Start: findPlanRepository');
    const userExists: ISubscriptionPlan | null = await SubscriptionPlan.findOne(
      {
        code,
        approved: true,
      }
    );
    return userExists;
  } catch (error: any) {
    logger.error('Error: findPlanRepository', error);
    return null;
  } finally {
    logger.info('End: findPlanRepository');
  }
};

const getSubscriptionPlan = async (
  planCode: string
): Promise<ISubscriptionPlan | null | ResponseHandlerType> => {
  try {
    logger.info('Start: getSubscriptionPlanRepository');
    const plan: ISubscriptionPlan | null = await SubscriptionPlan.findOne(
      {
        code: planCode,
      },
      { _id: 0, __v: 0 }
    );
    return plan;
  } catch (error) {
    logger.error('Error: getSubscriptionPlanRepository');
    return responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
  } finally {
    logger.info('End: getSubscriptionPlanRepository');
  }
};

const getSubscriptionPlanList = async (): Promise<
  ISubscriptionPlan[] | ResponseHandlerType
> => {
  try {
    logger.info('Start: getSubscriptionPlanListRepository');
    const allPlans: ISubscriptionPlan[] = await SubscriptionPlan.find(
      { status: true },
      { _id: 0, __v: 0 }
    );
    return allPlans;
  } catch (error) {
    logger.error('Error: getSubscriptionPlanListRepository');
    return responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
  } finally {
    logger.info('End: getSubscriptionPlanListRepository');
  }
};

const addSubscriptionPlan = async (
  plan: SimpleObject
): Promise<ResponseHandlerType | null | ISubscriptionPlan> => {
  try {
    logger.info('Start: addSubscriptionPlanRepository');

    const { email, code, title, subheader, fee, limit, rate, validity } = plan;
    const adminExists = await Admin.findOne({ email });
    if (!adminExists) {
      return responseHandler(
        403,
        responseScenario.fail,
        messageCodes.msgNonAdminAccess
      );
    }

    const addedPlan = await SubscriptionPlan.findOneAndUpdate(
      { code }, // Query: Check for existing 'code'
      {
        $setOnInsert: {
          code,
          title,
          subheader,
          fee,
          limit,
          rate,
          validity,
          lastUpdate: new Date(),
        },
      }, // Insert newData only if not found
      { upsert: true, new: false, setDefaultsOnInsert: true } // Options
    );
    return addedPlan;
  } catch (error: any) {
    logger.error('Error: addSubscriptionPlanRepository', error);
    return responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
  } finally {
    logger.info('End: addSubscriptionPlanRepository');
  }
};

const updateSubscriptionPlan = async (
  body: SimpleObject
): Promise<ResponseHandlerType | null | ISubscriptionPlan> => {
  try {
    logger.info('Start: updateSubscriptionPlanRepository');

    const { email, code, title, subheader, fee, limit, rate, validity } = body;
    const adminExists: IAdmin | null = await findAdmin(email as string);
    if (!adminExists) {
      return responseHandler(
        403,
        responseScenario.fail,
        messageCodes.msgNonAdminAccess
      );
    }

    const updatedPlan: ISubscriptionPlan | null =
      await SubscriptionPlan.findOneAndUpdate(
        { code }, // Query: Check for existing 'code'
        {
          $set: {
            code,
            title,
            subheader,
            fee,
            limit,
            rate,
            validity,
            lastUpdate: new Date(),
          },
        }, // update with newData only if not found
        { new: true }
      );
    return updatedPlan;
  } catch (error: any) {
    logger.error('Error: updateSubscriptionPlanRepository', error);
    return responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
  } finally {
    logger.info('End: updateSubscriptionPlanRepository');
  }
};

const deleteSubscriptionPlan = async (body: SimpleObject) => {
  try {
    logger.info('End: deleteSubscriptionPlanRepository');
    const { email, code } = body;
    const adminExists: IAdmin | null = await findAdmin(email as string);
    if (!adminExists) {
      return responseHandler(
        403,
        responseScenario.fail,
        messageCodes.msgNonAdminAccess
      );
    }
    const deletedPlan = await SubscriptionPlan.findOneAndDelete({ code });
    return deletedPlan;
  } catch (error: any) {
    logger.error('Error: deleteSubscriptionPlanRepository', error);
    return responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
  } finally {
    logger.info('End: deleteSubscriptionPlanRepository');
  }
};

const addUserSubscriptionPlan = async (
  email: string,
  user: IUser,
  plan: ISubscriptionPlan
): Promise<ResponseHandlerType | IUserSubscriptionPlan> => {
  try {
    logger.info(`Start: addUserSubscriptionPlanRepository`);
    const isUserPlanExist: IUserSubscriptionPlan | null =
      await UserSubscriptionPlan.findOne({
        email: email,
      });
    const todayDate: Date = new Date();
    if (isUserPlanExist) {
      isUserPlanExist.subscriptionPlanTitle.push(plan.title);
      isUserPlanExist.purchasedDate.push(todayDate);
      isUserPlanExist.subscriptionFee.push(plan.fee);
      isUserPlanExist.subscriptionDuration.push(plan.validity);
      isUserPlanExist.allocatedCredentials.push(plan.limit);
      // Get the last item in the currentCredentials array
      const lastCurrentCredential =
        isUserPlanExist.currentCredentials.at(-1) || 0;
      isUserPlanExist.currentCredentials.push(
        lastCurrentCredential + plan.limit
      );

      await isUserPlanExist.save();
      return isUserPlanExist;
    }
    const subscriptionPlanDetails = new UserSubscriptionPlan({
      email: email,
      issuerId: user.issuerId,
      subscriptionPlanTitle: [plan.title],
      purchasedDate: [todayDate],
      subscriptionFee: [plan.fee],
      subscriptionDuration: [plan.validity],
      allocatedCredentials: [plan.limit],
      currentCredentials: [plan.limit],
    });
    const savePlan = await subscriptionPlanDetails.save();
    return savePlan;
  } catch (error: any) {
    logger.error(`Error: addUserSubscriptionPlanRepository`, error);
    return responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
  } finally {
    logger.info(`End: addUserSubscriptionPlanRepository`);
  }
};

const addEnterpriseSubscriptionPlan = async (
  plan: SimpleObject,
  user: IUser
): Promise<ResponseHandlerType | IUserSubscriptionPlan> => {
  try {
    logger.info(`Start: addEnterpriseSubscriptionPlanRepository`);
    const isUserPlanExist: IUserSubscriptionPlan | null =
      await UserSubscriptionPlan.findOne({
        email: plan.email,
      });
    const todayDate: Date = new Date();
    const subscriptionFee = 5 * (plan.allocatedCredentials as number);
    if (isUserPlanExist) {
      isUserPlanExist.subscriptionPlanTitle.push(
        plan.subscriptionPlanTitle as string
      );
      isUserPlanExist.purchasedDate.push(todayDate);
      isUserPlanExist.subscriptionDuration.push(
        plan.subscriptionDuration as number
      );
      isUserPlanExist.subscriptionFee.push(subscriptionFee);
      isUserPlanExist.allocatedCredentials.push(
        plan.allocatedCredentials as number
      );
      // Get the last item in the currentCredentials array
      const lastCurrentCredential =
        isUserPlanExist.currentCredentials.at(-1) || 0;
      isUserPlanExist.currentCredentials.push(
        lastCurrentCredential + (plan.allocatedCredentials as number)
      );
      await isUserPlanExist.save();
      return isUserPlanExist;
    }
    const subscriptionDetails = new UserSubscriptionPlan({
      email: plan.email,
      issuerId: user.issuerId,
      subscriptionPlanTitle: [plan.subscriptionPlanTitle],
      purchasedDates: [todayDate],
      subscriptionFee: [subscriptionFee],
      subscriptionDurations: [plan.subscriptionDuration],
      allocatedCredentials: [plan.allocatedCredentials],
      currentCredentials: [plan.allocatedCredentials],
    });
    const savePlan = await subscriptionDetails.save();
    return savePlan;
  } catch (error: any) {
    logger.error(`Error: addEnterpriseSubscriptionPlanRepository`, error);
    return responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
  } finally {
    logger.info(`End: addEnterpriseSubscriptionPlanRepository`);
  }
};

const getIssuerSubscriptionDetails = async (
  email: string
): Promise<ResponseHandlerType | IUserSubscriptionPlan | null> => {
  try {
    logger.info(`Start: getIssuerSubscriptionDetailsRepository`);
    const userSubscribedPlan: IUserSubscriptionPlan | null =
      await UserSubscriptionPlan.findOne({
        email: email,
      });
    return userSubscribedPlan;
  } catch (error: any) {
    logger.error(`Error: getIssuerSubscriptionDetailsRepository`, error);
    return responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
  } finally {
    logger.info(`End: getIssuerSubscriptionDetailsRepository`);
  }
};

export default {
  getSubscriptionPlan,
  getSubscriptionPlanList,
  addSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  addUserSubscriptionPlan,
  addEnterpriseSubscriptionPlan,
  getIssuerSubscriptionDetails,
  findAdmin,
  findUser,
  findPlan,
};
