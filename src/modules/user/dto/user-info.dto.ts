import { IsNotEmpty, IsString } from "class-validator";

export class UserInfoDto {
    @IsNotEmpty()
    id: string

    @IsString()
    nickname: string;

    @IsString()
    avatar: string;
}