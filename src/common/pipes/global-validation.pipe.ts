import {
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

const GlobalValidationPipe = new ValidationPipe({
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
  whitelist: true,
  /**
   *
   * @param validationErrors Returned from any exceptions or validation rules
   * @returns Strcutured validation errors returned from any exceptions or validation rules
   */
  exceptionFactory: (validationErrors: ValidationError[] = []) => {
    const errors: any = {};
    validationErrors.forEach((err: ValidationError) => {
      let errObj: any = {};
      if (err.children?.length) {
        errors[err.property] = {};
        err.children.forEach((child) => {
          if (child.children?.length) {
            errors[err.property][child.property] = {};
            child.children.forEach((grandChild) => {
              errObj = grandChild.constraints;
              errors[err.property][child.property][grandChild.property] =
                Object.values(errObj)[0];
            });
          } else {
            errObj = child.constraints;
            errors[err.property][child.property] = Object.values(errObj)[0];
          }
        });
      } else {
        errObj = err.constraints;
        errors[err.property] = Object.values(errObj)[0];
      }
    });
    return new UnprocessableEntityException(errors);
  },
});

export default GlobalValidationPipe;
