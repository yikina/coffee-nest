import { IsNotEmpty } from "class-validator";

export class UserInfoDto {
    @IsNotEmpty()
    username: string;
    avatar: string;
    fan: number;
    following: number;
    insignia:number;
}