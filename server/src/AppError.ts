import { ErrorCode } from "@shared/models";

class AppError extends Error {
    public code: ErrorCode;

    constructor(code: ErrorCode, message: string) {
      super(message);
      this.code = code;
    }
}

  
export { AppError };