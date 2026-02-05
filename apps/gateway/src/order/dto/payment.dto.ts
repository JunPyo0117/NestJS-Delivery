import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export enum PaymentMethod {
  creditCard = 'CreditCard',
  kakaopay = 'Kakaopay',
}

export class PaymentDto {
  @IsString()
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @IsString()
  @IsNotEmpty()
  paymentName: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  expiryYear: string;

  @IsString()
  @IsNotEmpty()
  expiryMonth: string;

  @IsString()
  @IsNotEmpty()
  birthOrRegistration: string;

  @IsString()
  @IsNotEmpty()
  passwordTwoDigits: string;
}
