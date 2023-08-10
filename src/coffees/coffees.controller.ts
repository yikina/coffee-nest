import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdataCoffeeDto } from './dto/create-coffee.dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';

@Controller('coffees')
//* controller使用构造函数、ts类型声明连接service，并创建实例
export class CoffeesController {
    constructor(private readonly coffeesService:CoffeesService){ }


    // * Get装饰器，客户端对coffees路由发get请求时，进行处理的函数
    // * Query参数对数据进行过滤、分组、排序等操作
    @Get()
    findAll(@Query() paginationQuery:PaginationQueryDto){
        return this.coffeesService.findAll(paginationQuery)
    }

    // * 动态路由，获取param中的id
    @Get(':id')
    findOne(@Param('id') id:string){
       return this.coffeesService.findOne(''+id)
    }

    //* POST获取请求体内容
    // ! HttpCode修改状态码（处理错误）
    @Post()
    create(@Body() createCoffeeDto:CreateCoffeeDto){
        return this.coffeesService.create(createCoffeeDto)
    }
    //* Patch和Delete方法
    @Patch(':id')
    update(@Param('id') id:string,@Body() updateCoffeeDto:UpdataCoffeeDto){
        return this.coffeesService.update(id, updateCoffeeDto)
        
    }

    @Delete('id')
    remove(@Param('id') id:string){
        return this.coffeesService.remove(id)

    }

    
}
