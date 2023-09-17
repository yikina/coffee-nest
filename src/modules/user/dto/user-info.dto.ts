import { IsNotEmpty, IsString } from "class-validator";

export class UserInfoDto {
    @IsNotEmpty()
    id: string

    @IsString()
    username: string;

    @IsString()
    avatar: string;
}