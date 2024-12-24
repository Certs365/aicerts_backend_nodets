import Joi from 'joi';
import { messageCodes } from '../../common/codes';

const subscriptionValidation = {
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } }) // This checks for a valid email
    .required() // Email is required
    .messages({
      'string.email': messageCodes.msgInvalidEmail,
      'string.base': messageCodes.msgInvalidEmail,
      'any.required': messageCodes.msgRequireEmail,
    }),
  code: Joi.string().trim().required(),
  title: Joi.string().trim().required(),
  subheader: Joi.string().trim().required(),
  fee: Joi.number().required(),
  limit: Joi.number().required(),
  rate: Joi.number().required(),
  validity: Joi.number().required(),
};

// Get one specific or all Subscription plan(s)
const getSubscriptionPlansSchema = Joi.object({
  email: subscriptionValidation.email,
  planCode: Joi.string().trim().optional().messages({
    'string.email': messageCodes.msgInvalidEmail,
    'string.base': messageCodes.msgInvalidEmail,
    'any.required': messageCodes.msgRequireEmail,
  }), // Plan is optional, but must be a string if provided
});

const addSubscriptionPlanSchema = Joi.object({
  email: subscriptionValidation.email,
  code: subscriptionValidation.code,
  title: subscriptionValidation.title,
  subheader: subscriptionValidation.subheader,
  fee: subscriptionValidation.fee,
  limit: subscriptionValidation.limit,
  rate: subscriptionValidation.rate,
  validity: subscriptionValidation.validity,
});

const updateSubscriptionPlanSchema = Joi.object({
  email: subscriptionValidation.email,
  code: subscriptionValidation.code,
  title: subscriptionValidation.title,
  subheader: subscriptionValidation.subheader,
  fee: subscriptionValidation.fee,
  limit: subscriptionValidation.limit,
  rate: subscriptionValidation.rate,
  validity: subscriptionValidation.validity,
});

const deleteSubscriptionPlanSchema = Joi.object({
  email: subscriptionValidation.email,
  code: subscriptionValidation.code,
});

const addUserSubscriptionPlanSchema = Joi.object({
  email: subscriptionValidation.email,
  code: subscriptionValidation.code,
});

const addEnterpriseSubscriptionPlanSchema = Joi.object({
  email: subscriptionValidation.email,
  subscriptionPlanTitle: Joi.string().trim().required(),
  subscriptionDuration: Joi.number().required(),
  allocatedCredentials: Joi.number().required(),
});

const checkoutSubscriptionPaymentSchema = Joi.object({
  email: subscriptionValidation.email,
  plan: Joi.object({
    name: subscriptionValidation.title,
    fee: subscriptionValidation.fee,
    rate: subscriptionValidation.rate,
    validity: subscriptionValidation.validity,
    credits: Joi.number().required(),
    successUrl: Joi.string().trim().uri().required(),
    cancelUrl: Joi.string().trim().uri().required(),
  }),
});

const getIssuerSubscriptionDetailsSchema = Joi.object({
  email: subscriptionValidation.email,
});

const grievanceMailSchema = Joi.object({
  email: subscriptionValidation.email,
  paymentID: Joi.string().trim().required(),
});

const fetchPaymentDetailsSchema = Joi.object({
  email: subscriptionValidation.email,
  sessionId: Joi.string().trim().required(),
});

export default {
  getSubscriptionPlansSchema,
  addSubscriptionPlanSchema,
  updateSubscriptionPlanSchema,
  deleteSubscriptionPlanSchema,
  addUserSubscriptionPlanSchema,
  addEnterpriseSubscriptionPlanSchema,
  getIssuerSubscriptionDetailsSchema,
  checkoutSubscriptionPaymentSchema,
  grievanceMailSchema,
  fetchPaymentDetailsSchema,
};
