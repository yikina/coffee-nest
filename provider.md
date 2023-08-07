# Provider(Service)

service指业务逻辑，使用service分离业务逻辑，便于复用

service==provider,它可以注入依赖(inject dependencies)，实际上是一个由@Injectable修饰的可以，为其controller存储数据方法

- 生成service

  ```
  nest generate service
  nest g service
  ```


## module

```
nest g module 'coffees'
```

生成一个名为coffees的module，使用module来管理我们的controller和services，coffees.module.ts接受四个参数: **controller**  **provider**  **import **  **export**，分别用来管理该模块的controller和services，是否导入其他模块和导出

```tsx
import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';

@Module({
    controllers:[CoffeesController],
    providers:[CoffeesService]})
export class CoffeesModule {}
```

回到我们的app.module.ts，因为我们已经使用imports导入了CoffeesModule，就可以把controllers和providers中的CoffeesController、CoffeesService都删除（防止被实例化两次）

最终的app.module.ts如下：

```tsx
@Module({
  imports: [CoffeesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## DTO

DTO就是数据传输对象(Data Transfer Object),DTO模式，是指将数据封装成普通的对象，在多个层级中传播，在传统的编程中，我们一般都是前台请求数据，发送到Webservice，然后WebService向数据库发出请求，获取数据，然后一层层返回，这种比较原始的请求方式带来的缺点有很多，多次请求耗费一定的网络资源，减慢效率。

![传统模式](https://imgconvert.csdnimg.cn/aHR0cDovL2ltYWdlcy5jbml0YmxvZy5jb20vYmxvZy80NzAxMi8yMDE0MDMvMjAxNzE2MTAyMDk0OTQzLnBuZw?x-oss-process=image/format,png)

而DTO模式则是：

![DTO模式](https://imgconvert.csdnimg.cn/aHR0cDovL2ltYWdlcy5jbml0YmxvZy5jb20vYmxvZy80NzAxMi8yMDE0MDMvMjAxNzE2MTE0NTk1MjI4LnBuZw?x-oss-process=image/format,png)

优点：

1.依据现有的类代码，即可方便的构造出DTO对象，而无需重新进行分析。

2.减少请求次数

3.按需提供DTO对象，页面需要的字段才提供，不需要的字段不提供，可以避免传输整个表的字段，一定程度上提高了安全性。

   一般我们使用DTO类来继承**entity**实体类，在DTO类里放一些业务字段，并提供get、set方法。当我们在业务逻辑层或者交互层用到一些数据库中不存在的字段时，我们就需要在DTO类里放这些字段，这些字段的意义就相当于一些经处理过的数据库字段，实质意义就是方便数据交互，提高效率。

- 生成dto

  ```tsx
  nest g class coffees/dto/create-coffee.dto --no-spec
  ```

  在coffees/dto目录下生成create-coffee.dto文件且不需要调试文件，我们可以统一在每个文件下的dto来管理该模块的dto。

  这里我们将使用create-coffee.dto来规定前端使用Post\Patch传递的字段，我们可以从entities中继承除了id以外的字段（id可以通过数据库生成）来

- 编写dto：可以使用readonly字段让属性变为只读，或者使用name?:string，问好?让字段变为可选传入

  ```tsx
  export class CreateCoffeeDto {
     readonly name:string;
     readonly brand:string;
     readonly flavors:string[];
  }
  ```

- 使用dto: 将我们post方法Body后跟的payload(载荷)修改为dto对象

  ```tsx
  @Post()
      create(@Body() createCoffeeDto:CreateCoffeeDto){
          return this.coffeesService.create(createCoffeeDto)
      }
  ```



### ValidationPipe: 验证传入字段是否符合Dto

- 导入，在main.ts中添加

  ```tsx
  import { ValidationPipe } from '@nestjs/common';
  
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe()) //添加这一行，注意引入
    await app.listen(3000);
  }
  bootstrap();
  ```

  安装validator transform包

  ```tsx
  pnpm i class-validator class-transformer
  ```

  通过validator我们可以<u>自动的验证前端传入的字段是否符合后端所设置的规则，如果不符合它将自动返回警告信息400 badrequest并附带说明</u>

  ```tsx
  import { IsString } from "class-validator";
  export class CreateCoffeeDto {
     @IsString()  //必须是字符串
     readonly name:string;
  
     @IsString()
     readonly brand:string;
  
     @IsString({each:true}) //必须每一项都是字符串
     readonly flavors:string[];
  }
  ```

  #### 过滤不该被传递的字段
  
  在main.ts中的app.useGlobalPipes(new ValidationPipe)中添加
  
  ```tsx
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
      whitelist:true,  //自动过滤前端不该传递的字段，只收到需要的字段
      forbidNonWhitelisted: true //一旦传递了不该传递的字段，throw error
    }))
    await app.listen(3000);
  }
  bootstrap();
  ```
  
  #### 自动转换类型
  
  在如上的地方添加,validationPipe将自动将需要转化的地方转化为所需的类型
  
  ```tsx
  transform: true
  ```
  
  1. 如——(在没有添加transform之前)，createCoffeeDto并不是Dto的实例
  
  ```tsx
   @Post()
      create(@Body() createCoffeeDto:CreateCoffeeDto){
          console.log(createCoffeeDto instanceof CreateCoffeeDto) // "false"
          return this.coffeesService.create(createCoffeeDto)
      }
  ```
  
  添加之后即为true
  
  2. 实现传递的过来的数字id自动转化为字符串
  
  ```tsx
  @Get(':id')
      findOne(@Param('id') id:string){
         return this.coffeesService.findOne(''+id)
      }
  ```
  
  

### 简化复制其他字段而生成的Dto

安装

```tsx
pnpm i @nestjs/mapped-types
```

我们刚刚编写的UpdateCoffeeDto是基于CreteCoffeeDto而来的，只不过字段都变为了可选，我们可以使用mapped-types中的PartialaType，用于继承CreteCoffeeDto，包括上述的IsString的验证约束，我们只需要写如下代码即可实现：

```tsx
import {PartialType} from '@nestjs/mapped-types'
import { CreateCoffeeDto } from './create-coffee.dto';

export class UpdataCoffeeDto extends PartialType(CreateCoffeeDto){
  
}
```



