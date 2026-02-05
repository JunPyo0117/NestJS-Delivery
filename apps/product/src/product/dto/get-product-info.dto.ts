import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class GetProductsInfo {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  productIds: string[];
}