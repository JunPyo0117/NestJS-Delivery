import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-dto';
import { Authorization } from '../../../gateway/src/auth/decorator/authorization.decorator';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ParseBearerTokenDto } from './dto/parse-bearer-token.dto';
import { RpcInterceptor } from '@app/common/interceptor/rpc.interceptor';
import { LoginDto } from './dto/login.dto';
import { GrpcInterceptor, UserMicroservice } from '@app/common';
import { Metadata } from '@grpc/grpc-js';

@Controller('auth')
@UserMicroservice.AuthServiceControllerMethods()
@UseInterceptors(GrpcInterceptor)
export class AuthController implements UserMicroservice.AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  // @MessagePattern({
  //   cmd: 'parse_bearer_token',
  // })
  // @UsePipes(ValidationPipe)
  // @UseInterceptors(RpcInterceptor)
  parseBearerToken(request: UserMicroservice.ParseBearerTokenRequest) {
    return this.authService.parseBearerToken(request.token, false);
  }

  // @MessagePattern({
  //   cmd: 'register',
  // })
  async registerUser(
    request: UserMicroservice.RegisterUserRequest,
  ): Promise<UserMicroservice.RegisterUserResponse> {
    const { token } = request;

    if (!token) {
      throw new UnauthorizedException('토큰을 입력해주세요!');
    }

    return this.authService.register(
      token,
      request,
    ) as Promise<UserMicroservice.RegisterUserResponse>;
  }

  // @MessagePattern({
  //   cmd: 'login',
  // })
  loginUser(request: UserMicroservice.LoginUserRequest, metadata: Metadata) {
    const { token } = request;
    if (!token) {
      throw new UnauthorizedException('토큰을 입력해주세요!');
    }

    return this.authService.login(token);
  }
}
