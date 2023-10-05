import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";



export interface JwtPayload {
    sub:string
    username: string
}


@Injectable()
// 验证请求头中的token
export default class JwtUserStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: ""+process.env.jwt_secret
        })
    }

    async validate(payload: JwtPayload) {
        const { username } = payload
        return {
            username
        }
    }
}
