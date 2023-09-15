import { IsOptional, IsString } from "class-validator";

export class CreateNoteDto {
    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsString()
    pic: string;

    @IsString()
    @IsOptional()
    avatar: string | null;

    @IsString()
    username: string;
}