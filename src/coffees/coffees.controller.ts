import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { CoffeesService } from './coffees.service';

@Controller('coffees')
//* controller使用构造函数、ts类型声明连接service，并创建实例
export class CoffeesController {
    constructor(private readonly coffeesService:CoffeesService){ }


    // * Get装饰器，客户端对coffees路由发get请求时，进行处理的函数
    // * Query参数对数据进行过滤、分组、排序等操作
    @Get()
    findAll(@Query() paginationQuery:any){
        // const{limit,offset}=paginationQuery;
        return this.coffeesService.findAll()
    }

    // * 动态路由，获取param中的id
    @Get(':id')
    findOne(@Param('id') id:string){
       return this.coffeesService.findOne(id)
    }

    //* POST获取请求体内容
    // ! HttpCode修改状态码（处理错误）
    @Post()
    create(@Body('name') body:object){
        return this.coffeesService.create(body)
    }
    //* Patch和Delete方法
    @Patch(':id')
    update(@Param('id') id:string,@Body() body:any){
        return this.coffeesService.update(id,body)
        
    }

    @Delete('id')
    remove(@Param('id') id:string){
        return this.coffeesService.remove(id)

    }

    
}
