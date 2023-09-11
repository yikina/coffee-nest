import { Module } from "@nestjs/common";
import { PicSignController } from "./pic_sign.controller";
import { PicSignService } from "./pic_sign.service";

@Module({
    imports: [],
    controllers: [PicSignController],
    providers: [PicSignService]

})
export class PicSignModule { }