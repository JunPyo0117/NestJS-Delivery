import { UserPayloadDto } from '@app/common';
import { ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const UserPayload = createParamDecorator<UserPayloadDto>(
  (data: any, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    const { user } = req;

    if (!user) {
      throw new InternalServerErrorException('토큰 Guard를 깜빡했나요?');
    }
    return req.user;
  },
);
