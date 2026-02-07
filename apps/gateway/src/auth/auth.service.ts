import { USER_SERVICE, UserMicroservice } from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';
import { lastValueFrom } from 'rxjs';
import { constructorMetadata } from '@app/common/grpc/utils/constructor-metadata.utils';

@Injectable()
export class AuthService implements OnModuleInit {
  authService: UserMicroservice.AuthServiceClient;

  constructor(
    @Inject(USER_SERVICE)
    private readonly userMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService =
      this.userMicroservice.getService<UserMicroservice.AuthServiceClient>(
        'AuthService',
      );
  }

  register(token: string, registerDto: RegisterDto) {
    return lastValueFrom(
      this.authService.registerUser(
        {
          token,
          ...registerDto,
        },
        constructorMetadata(AuthService.name, 'register'),
      ),
    );
  }

  login(token: string) {
    return lastValueFrom(
      this.authService.loginUser(
        { token },
        constructorMetadata(AuthService.name, 'login'),
      ),
    );
  }
}
