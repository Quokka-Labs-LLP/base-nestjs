export enum CommonResponseMessageEnum {
    SYSTEM_ERROR = "System error",
    UNAUTHORIZED = "Unauthorized: token expired!",
    OTP_ERROR = "Error occured in sending otp",
    VERIFY_OTP_ERROR = "Error occured in verifying otp",
    OTP_SUCCESS = "Otp sent successfully!",
    VERIFY_OTP_SUCCESS = "Otp verified successfully!",
    WRONG_OTP = "Please provide a valid otp!",
    ONBOARDING_SUCCESS = "Onboarding Successful!",
    OTP_EXPIRED = "Otp has expired.",
    TOKENS_GENERATED = "Tokens generated.",
    USER_DO_NOT_EXIST = "This user does not exist.",
    
}