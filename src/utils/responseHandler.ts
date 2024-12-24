import { isObjectEmpty } from './helper';

class ResponseHandler {
  code: number;
  status: string;
  message: string;
  data?: object = {};

  constructor(code: number, status: string, message: string) {
    this.code = code;
    this.status = status;
    this.message = message;
  }

  addData(responseData: object | object[]): void {
    this.data = responseData;
  }
}

// Success response generator
export const responseHandler = (
  code: number,
  status: string,
  message: string,
  data: object | object[] | null = null
): ResponseHandler => {
  const response = new ResponseHandler(code, status, message);
  if (data && !isObjectEmpty(data)) {
    response.addData(data);
  } else {
    delete response.data;
  }
  return response;
};

// Response Scenario
export enum responseScenario {
  success = 'SUCCESS',
  fail = 'FAILED',
}

// Type for ResponseHandler class
export type ResponseHandlerType = InstanceType<typeof ResponseHandler>;
