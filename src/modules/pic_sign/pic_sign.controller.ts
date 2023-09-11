import { Controller, Get } from "@nestjs/common";
import { PicSignService } from "./pic_sign.service";

@Controller('pic_sign')
export class PicSignController {
    constructor(private readonly picSignService: PicSignService) {}
  
    @Get()
    getSignature() {
        return this.picSignService.getSignature();
    }
}