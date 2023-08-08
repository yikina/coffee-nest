# nest.controller

官方文档：[Controllers | NestJS - A progressive Node.js framework --- 控制器 |NestJS - 一个渐进的 Node.js 框架](https://docs.nestjs.com/controllers)

## 创建controller

创建controller, nest generate controller ,也可以简写为

```
//cmd
nest g co xxname
```

运行这个命令时，会自动在src文件夹下创建xxname的文件夹，包含xxname.controller.ts和测试文件xxname.controller.spec.ts，同时自动在app.modules中

```tsx
@Module({
  imports: [],
  controllers: [AppController, XxnameController],
  providers: [AppService],
})
export class AppModule {}
```

如果我们不想要测试文件，运行命令时输入：

```
nest g co --no-spec
```

如果我们希望创建的controller在特定的文件夹下：

```
nest g co user/login
```

测试是否放在正确的文件夹：（执行后会展示创建所在哪一个目录，但实际上不会创建）

```
nest g co user/login --dry-run
```

## 初步使用

controller可以理解为一个路由标识，nestjs根据请求的路由@装饰器匹配到对应的路由，执行相关操作

例如我们在coffees Controller中编写：

```tsx
@Controller('coffees')
export class CoffeesController {
    // * Get装饰器，客户端对coffees路由发get请求时，进行处理的函数
    @Get()
    findAll(){
        return 'this is all sorts of coffees'
    }
    
}
```

当通过get请求localhost:3000/coffees时，会执行findAll，在这里，也就是返回'this is all sorts of coffees'。

- 嵌套路径

  如果想要通过get访问localhost:3000/coffees下面的路由，类似localhost:3000/coffees/orange,只需要在coffee Controller下的@Get()添加orange(不需要加/)

  ```tsx
   @Get('orange')
      findAll(){
          return 'this is all sorts of coffees'
      }
  ```


### RestFul Api

#### GET获取param

经常会遇到这样的场景，动态传递路由，例如id——https://www.xxx.com/2

在nest.js中使用@param标识并获取

```tsx
@Get(':id')
findOne(@Param('id') id:string){
    return `this is ${id} coffee `
}

//GET localhost:8888/5     this is 5 coffee
```

#### POST提取body

```tsx
 @Post()
    create(@Body('name') body:object){
        return body
    }
//获取body.name属性
//如果要获取全部属性：@Body后不填即可，@Body( ) body:object
```

- 其余restful api,与上述操作相差无二
  - PUT替换：替换原有资源，所有在载体中需要包含整个资源对象
  - PATCH更新：更新原有资源，包含需要更新的属性即可
  - DELETE删除：删除原有资源即可

```tsx
@Patch(':id')
    update(@Param('id') id:string,@Body() body:any){
        return `update ${id} coffees`
        
    }

    @Delete('id')
    remove(@Param('id') id:string){
        return `delete ${id} coffees`

    }
```



### 修改请求状态码

通过@HttpCode()修改
```tsx
@Post()
    @HttpCode(HttpStatus.SEE_OTHER)
    create(@Body('name') body:object){
        return body
    }
```



### 常用decoration

在之前我们已经使用过@Param\@Body\@Query等decoration，实际上可以看作对express框架的封装，如下所示：

| `@Request(), @Req()`                               | `req`                                                        |
| -------------------------------------------------- | ------------------------------------------------------------ |
| `@Response(), @Res()`***** `@Response(), @Res()` * | `res`                                                        |
| `@Next()`                                          | `next`                                                       |
| `@Session()`                                       | `req.session`                                                |
| `@Param(key?: string)`                             | `req.params` / `req.params[key]` `req.params` / `req.params[key]` |
| `@Body(key?: string)`                              | `req.body` / `req.body[key]` `req.body` / `req.body[key]`    |
| `@Query(key?: string)`                             | `req.query` / `req.query[key]` `req.query` / `req.query[key]` |
| `@Headers(name?: string)`                          | `req.headers` / `req.headers[name]` `req.headers` / `req.headers[name]` |
| `@Ip()`                                            | `req.ip`                                                     |
| `@HostParam()`                                     | `req.hosts`                                                  |
