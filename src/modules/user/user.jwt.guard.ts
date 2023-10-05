import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from "rxjs";
import { IS_PUBLIC_KEY } from "src/common/decorator/public.decorator";

//拦截未携带token的接口
@Injectable()
export class JwtUserGuard extends AuthGuard("jwt") {
    constructor(private reflector: Reflector) {
        super()
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ])
        if (isPublic) return true
        return super.canActivate(context)
    }
}