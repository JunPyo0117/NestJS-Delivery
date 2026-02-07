import { USER_SERVICE, UserMicroservice, constructorMetadata } from '@app/common';
import {
  Inject,
  Injectable,
  NestMiddleware,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware, OnModuleInit {
  authService: UserMicroservice.AuthServiceClient;

  constructor(
    // @Inject(USER_SERVICE)
    // private readonly userMicroservice: ClientProxy,
    @Inject(USER_SERVICE)
    private readonly userMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService =
      this.userMicroservice.getService<UserMicroservice.AuthServiceClient>(
        'AuthService',
      );
  }

  async use(req: any, res: any, next: (error?: Error | any) => void) {
    // 1. Raw Token 가져오기
    const token = this.getRawToken(req);

    if (!token) {
      next();
      return;
    }

    // 2. Raw Token 검증하기
    const payload = this.verifyToken(token);

    // 3. req.user payload 추가하기
    req.user = payload;
    next();
  }

  getRawToken(req: any): string | null {
    const authHeader = req.headers['authorization'];
    return authHeader;
  }

  async verifyToken(token: string) {
    const result = await lastValueFrom(
      this.authService.parseBearerToken(
        { token },
        constructorMetadata(BearerTokenMiddleware.name, 'verifyToken'),
      ),
    );

    return result;
  }
}
