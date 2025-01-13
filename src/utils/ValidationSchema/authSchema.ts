import Joi from 'joi';
import { messageCodes } from '../../common/codes';

const authValidation = {
  email: Joi.string()
    .trim()
    .empty('')
    .email({ tlds: { allow: false } }) // This checks for a valid email
    .required() // Email is required
    .messages({
      'string.email': messageCodes.msgInvalidEmail,
      'string.base': messageCodes.msgInvalidEmail,
      'any.required': messageCodes.msgRequireEmail,
    }),
  password: Joi.string().required().trim().min(8).max(30).messages({
    'any.required': messageCodes.msgNonEmpty,
    'string.max': messageCodes.msgPwdMaxLength,
    'string.min': messageCodes.msgPwdMaxLength,
  }),
};

const signUpSchema = Joi.object({
  email: authValidation.email,
  password: Joi.string()
    .required()
    .trim()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()[\]{}])[A-Za-z\d@$!%*?&#^()[\]{}]{8,30}$/
    )
    .messages({
      'any.required': messageCodes.msgNonEmpty,
      'string.pattern.base': messageCodes.msgPwdRegex,
    }),
  // name: Joi.string().trim().empty('').required().max(40).messages({
  //   'string.max': messageCodes.msgNameMaxLength,
  //   'any.required': messageCodes.msgInputProvide,
  //   'string.empty': messageCodes.msgNonEmpty,
  // }),
  // organization: Joi.string().trim().empty('').required().max(40).messages({
  //   'string.max': messageCodes.msgOrgMaxLength,
  //   'any.required': messageCodes.msgInputProvide,
  //   'string.empty': messageCodes.msgNonEmpty,
  // }),
  // organizationType: Joi.string().optional(),
  // industrySector: Joi.string().optional(),
  // address: Joi.string().optional(),
  // city: Joi.string().optional(),
  // state: Joi.string().optional(),
  // country: Joi.string().optional(),
  // zip: Joi.string()
  //   .optional()
  //   .pattern(/^\d{6}$/)
  //   .messages({
  //     'string.pattern.base': messageCodes.msgZipLimit,
  //   }),
  // websiteLink: Joi.string().optional().uri(),
  // phoneNumber: Joi.string()
  //   .optional()
  //   .pattern(/^\d{10}$/)
  //   .messages({
  //     'string.pattern.base': messageCodes.msgPhoneNumberLimit,
  //   }),
  // designation: Joi.string().optional(),
}).options({ abortEarly: false });

const onboardingSchema = Joi.object({
  email: authValidation.email,
  name: Joi.string().trim().empty('').required().max(40).messages({
    'string.max': messageCodes.msgNameMaxLength,
    'any.required': messageCodes.msgInputProvide,
    'string.empty': messageCodes.msgNonEmpty,
  }),
  organization: Joi.string().trim().empty('').required().max(40).messages({
    'string.max': messageCodes.msgOrgMaxLength,
    'any.required': messageCodes.msgInputProvide,
    'string.empty': messageCodes.msgNonEmpty,
  }),
  organizationType: Joi.string().empty('').required().messages({
    'string.empty': messageCodes.msgNonEmpty,
  }),
  industrySector: Joi.string().required(),
  designation: Joi.string().optional(),
}).options({ abortEarly: false });

const loginSchema = Joi.object({
  email: authValidation.email,
  password: authValidation.password,
}).options({ abortEarly: false });

const twoFactorAuthSchema = Joi.object({
  email: authValidation.email,
  code: Joi.string()
    .required()
    .pattern(/^\d{6}$/),
}).options({ abortEarly: false });

const refreshTokenSchema = Joi.object({
  email: authValidation.email,
  token: Joi.string().required().trim().empty('').messages({
    'string.empty': messageCodes.msgNonEmpty,
    'any.required': messageCodes.msgInputProvide,
  }),
}).options({ abortEarly: false });

const forgetPasswordSchema = Joi.object({
  email: authValidation.email,
});

const verifyIssuerSchema = Joi.object({
  email: authValidation.email,
  code: Joi.string()
    .required()
    .pattern(/^\d{6}$/),
});

export default {
  signUpSchema,
  loginSchema,
  twoFactorAuthSchema,
  refreshTokenSchema,
  onboardingSchema,
  forgetPasswordSchema,
  verifyIssuerSchema,
};
