import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Observable, catchError, map, throwError } from "rxjs";

@Injectable()
export class RpcInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const resp = {
            status: 'success',
            data: data,
        }
        console.log(resp);
        return resp;
        }),
        catchError((err) => {
            const resp = {
                status: 'error',
                message: err,
            }
            console.log(resp);
            return throwError(() => new RpcException(err));
        }),
    );
  }
}