export const messageCodes = Object.freeze({
  // Admin
  msgNonAdminAccess: 'Unauthorizes access',
  // Tasks Messages
  msgDbReady: 'Database connection is Ready',
  msgDbNotReady: 'Database connection is Not Ready',

  // Response code messages
  msgInternalError: 'Unable to reach the server, Please try again...',

  // Validation Error codes Issues (Route)
  msgInvalidFile: 'Invalid file uploaded / Please Try again ...',
  magInvalidEncryptBody: 'Failed to decrypt request data',
  msgEnterInvalid: 'Entered invalid input / Please check and try again...',
  msgInvalidEmail: 'Entered invalid Email',
  msgRequireEmail: 'Email is required',
  msgNonEmpty: 'Input field cannot be empty',
  msgInputProvide: 'Input should be provided',
  msgInvalidFormat: 'Entered input format is invalid',
  msgInvalidDate: 'Entered date format is invalid',
  msgInvalidEthereum: 'Invalid Issuer ID format',
  msgZipLimit: 'Entered Zip must be 6 digits',
  msgPhoneNumberLimit: 'Entered Phone Number must be 10 digits',
  msgNameMaxLength: 'Entered Name must not exceed 40 characters',
  msgOrgMaxLength: 'Entered Organization must not exceed 40 characters',
  msgUnameMaxLength: 'Entered Username must not exceed 40 characters',
  msgPwdMaxLength: 'Entered password must between 8 to 30 characters',
  msgPwdRegex:
    'Password must be 8-30 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  msgNoSpecialCharacters: 'No special characters are allowed in name',

  // Issuer Messages
  msgValidCredentials: 'Valid Issuer Credentials',
  msgInvalidPassword: 'Invalid password entered!',
  msgInvalidPhone: 'Invalid phone number entered!',
  msgErrorOnComparePassword: 'An error occurred while comparing passwords',
  msgInvalidOrUnapproved:
    'Invalid credentials entered (or) Issuer not approved',
  msgExistingUserError: 'An error occurred while checking for existing user',
  msgInvalidOtp: 'Invalid OTP entered / bad format.',
  msgErrorOnLogin: 'Error Occured during the Login',
  msgErrorOnOtp: 'An error occurred while sending OTP',
  msgIssuerNotFound: 'Issuer not found / not Active',
  msgIssuerFound: 'Issuer Found',
  msgOtpSent: 'OTP sent to the Issuer Email',
  msgExistEmail: 'User with the provided email already exists',
  msgSignupSuccess: 'User signup successful',
  msgEnterOrgEmail: 'Please Enter Your Organisation Email',
  msgIssuerUpdated: 'Issuer updated successfully',
  msgErroOnPwdReset: 'An error occurred during password reset process!',
  msgPwdNotSame: 'Password cannot be the same as the previous one!',
  msgPwdReset: 'Password reset successful',
  msgErrorOnSaveUser: 'An error occurred while saving user account!',
  msgErrorOnPwdHash: 'An error occurred while hashing password!',
  msgNoRecordFound: 'No verification record found for the provided email',
  msgCodeNotMatch: 'Verification code does not match',
  msgVerfySuccess: 'Verification successful',
  msgVerifyError: 'An error occurred during the verification process',

  // Auth Messages
  msgInvalidToken: 'Provided invalid token',
  msgTokenExpired: 'Invalid OTP or Token Expired',

  // Migrated Fetching APIs Messages
  msgAllIssuersFetched: 'All Issuer details fetched successfully',
  msgErrorOnFetching: 'Unable to process requested details, Please try again',
  msgGraphDataFetched: 'Graph data fetched successfully',
  msgInvalidGraphInput: 'Please provide valid Graph Input',
  msgMatchFound: 'Requested results found',
  msgNoMatchFound: 'No matching results found',
  msgOperationSuccess: 'Uploaded successfully',
  msgAdminMailNotExist: 'Admin with the provided email not exist',
  msgInvalidIssuer: 'Invalid / Inactive Issuer email',
  msgUnableToProcessRequest: 'Unable to process the request',
  msgProvideValidFlag: 'Please provide valid flag value as 1, 2',
  msgStartDateShouldOld:
    'Provided Start date must not be future date to the End date',
  msgUnableToGenerateRepoert:
    'Unable to generating the report, Please try again...',
  msgServerNameExist:
    'Server name already existed, Please try again with different name',
  msgServerNameNotExist:
    'Server name not available, Please try again with valid name',
  msgServerDeleted: 'Server details deleted successfully',
  msgFetchedVerificationCourses:
    'Verification results count fetched successfully with searched course',
  msgInvalidFlag: 'Provide valid flag value',
  msgProvideValidFilter: 'Please provide valid filter key',
  msgIssueFound: 'Credential details found',
  msgInvalidInput: 'Invalid Input parameter',
  msgUserNotFound: 'Issuer not found! / Issuer not Approved',

  // Subscription Module
  msgPlanDetailsFetched: 'Plan details fetched successfully',
  msgPlanNotFound: 'Unable to find the plan, Please check and Try again',
  msgPlanCodeExist: 'Subscription plan code exist, Please check and Try again',
  msgPlanAddedSuccess: 'Plan added successfully',
  msgPlanUpdatedSuccess: 'Plan updated successfully',
  msgPlanDeleted: 'Plan removed successfully',
  msgLimitAboutToExhaust: 'Limit About to Exhaust',
  msgGrievanceSent: 'Grievance request placed successfully',

  // Dashboard apis
  msgIssueLogsFetched: 'Issuer Logs data fetched successfully',
});
