import { HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

export class PaymentCanclledException extends HttpException {
  constructor(message: any) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}