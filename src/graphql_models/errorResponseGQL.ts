class ErrorResponseGQL {
  success: boolean = false;
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export default ErrorResponseGQL;
