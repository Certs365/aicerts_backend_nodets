import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import {
  responseHandler,
  ResponseHandlerType,
  responseScenario,
} from '../utils/responseHandler';
import { messageCodes } from '../common/codes';
import logger from '../utils/logger';

export default function validateRequest(
  validationSchems: Joi.ObjectSchema<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info(`Starting validation at ${req.url}`);
      if (!req.body || Object.keys(req.body).length === 0) {
        logger.error(`Empty Body`);
        const response: ResponseHandlerType = responseHandler(
          422,
          responseScenario.fail,
          messageCodes.msgNonEmpty // Message for empty body
        );
        res.status(response.code).json(response);
        return;
      }
      const validatedBody: Joi.ValidationResult<typeof validationSchems> =
        validationSchems.validate(req.body, {
          abortEarly: false, // Ensures all validation errors are captured
        });
      if (validatedBody.error) {
        logger.error(`Invalid body`);
        console.log(validatedBody.error);
        const response: ResponseHandlerType = responseHandler(
          400,
          responseScenario.fail,
          messageCodes.msgEnterInvalid
        );
        res.status(response.code).json(response);
        return;
      }
      next();
    } catch (error: any) {
      logger.error(`Error while validation request: `, error);
      const response: ResponseHandlerType = responseHandler(
        500,
        responseScenario.fail,
        messageCodes.msgInternalError
      );
      res.status(response.code).json(response);
    } finally {
      logger.info(`Ending validation: ${req.url}`);
    }
  };
}
