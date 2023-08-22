import { Injectable, NestInterceptor, CallHandler } from '@nestjs/common'
import { map } from 'rxjs/operators'
import {Observable} from 'rxjs'
 
 
 
interface data<T>{
    data:T
}
 
@Injectable()
export class Response<T = any> implements NestInterceptor {
    intercept(context: any, next: CallHandler):Observable<data<T>> {
        return next.handle().pipe(map(data => {
            return {
               data,
               statusCode:200,
               message:"请求成功"
            }
        }))
    }
}