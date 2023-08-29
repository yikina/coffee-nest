# 封装

可以把一个module当作一个公共导出的api，如果需要引入其他module当中的service，必须要通过该module导入其他的需要使用其service的module :

例如，我们希望Apple services使用Fruit service中的方法

1. 在FruitModule中导出可供使用的Services，使其成为公共api的一部分，这样别的模块引入是才可以使用（这是因为module都是封装好的）

   ```ts
   //fruit.module.ts
   @Module({
       imports:[FruitModule],
       controllers:[FruitControllers]
       providers:[FruitService],
       export:[FruitService] //一定要导出
   })
   export class FruitModule
   ```

   

2. 在apple.module中imports需要的module

```ts
//apple.module.ts
@Module({
    imports:[FruitModule],
    providers:[AppleService]
})
export class AppleModule
```

3. 在appleservice中constructor引入

```ts
@Injectable()
export class AppleService{
    constructor(
    private readonly FruitService:FruitService)
}
```



# 原理

将依赖的实例委托给`IOC`容器，在这里，这个`IOC`容器就是`NestJS`运行时系统本身，`NestJS`在这里处理所有繁重的工作，而不是尝试自己实现依赖注入。

当Nest容器实例化`CoffeesController`时，它首先查看是否由任何依赖项需要，在我们的例子中，有一个`CoffeeService`，当Nest容器找到`CoffeesService`依赖项时，它会对`CoffeesService token`执行查找，从而返回`CoffeeService`类，假设该`Provider`具有单例范围，这就是可注入提供程序的默认行为，然后，Nest将创建`CoffeesService`的实例，将其缓存并返回，或者已有缓存直接返回。

用代码理解就是：

```ts
@Module({
 //..
    providers:[FruitService],
})
export class FruitModule
```

等同于

```ts
@Module({
 //..
    providers:[
        {
            provide:FruitService,
            useClass:FruitService
        }
    ],
})
export class FruitModule
```



##  Custom Provider

了解到provider实际上是通过provide和useClass实例化出来的，我们就可以通过这些属性自定义provider，比如除了useClass以外还有：

### useValue

适用场景：注入constant连续的值

```ts
class MockFruitService{}

@Module({
 //..
    providers:[
        {
            provide:FruitService,
            useValue:new MockFruitService() //使用
        }
    ],
})
export class FruitModule
```

这里我们使用MockFruitService（）模拟数据，使用useValue后每当provide（token）中的FruitService被解析时，他都会指向我们MockFruitService中的内容

### 修改provide

有时我们可能希望灵活地使用字符串或符号作为依赖注入:

```ts

@Module({
 //..
    providers:[FruitService,
        {
            provide:'FRUIT_TYPES',
            useValue:['Apple','banana','watermelon']
        }
    ],
})
export class FruitModule
```

1. 统一声明token文件

   ```ts
   //fruit.constants.ts
   
   export const FRUIT_TYPES='FRUIT_TYPES'
   ```

2. 在services中注入

   ```ts
   @Injectable()
   export class FruitService{
       constructor(
         @Inject(FRUIT_TYPES)//记得引入上方文件
       )
   }
   ```

   

### 动态解析token(provide)

假设我们希望解析到的因环境而异

```ts
@Module({
 //..
    providers:[FruitService,
       {  //使用三元表达式解析
           provide:ConfigService,
      useClass:process.env.NODE_ENV === 'development'
          ? DevelopmentConfigService
          : ProductionConfigService,
       }
    ],
})
export class FruitModule
```



### useFactory

动态创建value，使用上面的例子举例

```ts
@Module({
 //..
    providers:[FruitService,
        {
 //目标：实现['Apple','banana','watermelon']动态创建
            
            provide:'FRUIT_TYPES',
            useValue:['Apple','banana','watermelon']
        }
    ],
})
export class FruitModule
```

实现：

```ts
@Injectable()
	export class FruitTypesFactory{
        create(){
            //do sth
          return['Apple','banana','watermelon']
        }
    }




@Module({
 //..
    providers:[FruitService,
        {   //调用create方法动态创建value
            provide:'FRUIT_TYPES',
            useFactory:(typeFactory:FruitTypesFactory)=>typeFactory.create(),
            inject:[FruitTypesFactory] //引入Factory
        }
    ],
})
export class FruitModule
```

#### 异步Factory

结合async/await与useFactory结合

实际运用场景：在连接数据库以后再进行对数据库请求的操作，以防止报错；对数据库异步查询

```ts
@Module({
 //..
    providers:[FruitService,
        {
            provide:'FRUIT_TYPES',
    //使用async、await与useFactory结合
            useFactory:async(connection:Connection):Promise<string[]> =>{
            const fruitBrands=await connection.query('SLELECT * ...')
            return fruitBrands;
        },
        inject:[Connection],
            
        }
    ],
})
export class FruitModule
```

### 动态模块

当我们需要一个模块在不同情况下表现不同时候，可以使用动态模块。例如，我们希望这个模块可以被多个应用程序通用，但当这另一个应用程序想要使用这个模块并且需要使用不同端口时，就可以使用动态模块。

这里使用databaseModule举例：

```ts


@Module({
  providers: [
    {
      provide: 'CONNECTION',
      useValue: createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
      }),
    },
  ],
})
export class DatabaseModule {}
```

动态模块可以让消费模块使用API来控制导入时自定义此`DatabaseModule`，如下：

```ts
import { DynamicModule, Module } from '@nestjs/common';
import { ConnectionOptions, createConnection } from 'typeorm';

@Module({
  imports:[  //导入模块的静态属性
    DatabaseModule.register({
      type: 'postgres',
      host: 'localhost',
      password: 'pass123',
      port: 5432,
    })
  ]
}
)
export class DatabaseModule {
  static register(options: ConnectionOptions):DynamicModule{
    //DynamicModule与@Modules具有基本相同的接口，但需要传递一个module属性
    return {
      module: DatabaseModule,//需要传递
      providers:[
        {
          provide: 'CONNECTION',
          useValue: createConnection(options),
        }
      ]
    }
  }
}
```

## Provider范围

在NodeJS当中，请求由单线程来进行处理，所以nestjs采用`Singleton`实例设计模式，这也保证了了Singleton在单线程中是绝对安全的。

### Singleton

保证每一个类仅有一个实例，并为它提供一个全局访问点。顾名思义，单例类Singleton保证了程序中同一时刻最多存在该类的一个对象。

有些时候，某些组件在整个程序运行时就只需要一个对象，多余的对象反而会导致程序的错误。

或者，有些属性型对象也只需要全局存在一个。比如，假设黑体字属性是一种对象，调用黑体字属性对象的函数来让一个字变成黑体。显然并不需要在每创造一个黑体字时就生成一种属性对象，只需要调用当前存在的唯一对象的函数即可。

Singleton模式的功能有两点：一是保证程序的正确性，使得最多存在一种实例的对象不会被多次创建。二是提高程序性能，避免了多余对象的创建从而降低了内存占用。


`@Injection()`的**作用域**允许我们获得所需的提供者生命周期行为，默认情况下，NestJS中的每个提供者都是一个单例

```ts
// coffees.Service
@Injectable()
// 实际上是下面这种
@Injectable({scope: Scope.DEFAULT})
// 提供者的实例生命周期与我们应用程序的生命周期直接相关
```

对于大多数用例，建议使用单例范围，其为最佳实践。@Injectable`提供者可用的另外两个生命周期：`transent`和`request-scoped

修改方法：

```ts
//1.直接在injectable中修改
@Injectable({scope: Scope.TRANSENT})

//2.在provider中添加
@Module({
// ...
  providers: [
    CoffeesService,
    {
      provide: 'COFFEES_BRANDS',
      useFactory: ()=>['buddy brew', 'nescafe'],
      scope:Scope.TRANSIENT,  // COFFEES_BRANDS就变成瞬息的了
      inject: [Connection],
    },
```



### transent

transent瞬息，它的provider不会在consumer之间共享，如果使用`scope: Scope.DEFAULT`被injectable引入的services，**如果它被多个地方使用，它就会被多次实例化**。

不会像默认单例化一样只实例化一次。

### REQUEST scoped

`request-scoped`会**为每个到来的请求提供一个新的提供者实例**，当然，在请求完成处理后，也会对实例进行**垃圾收集**。

```
@Injectable({scope: Scope.REQUEST})
```

初始时，没有进行任何实例化，而当我们请求三次该接口时，`CoffeesService`会被创建3次，在其中测试的log也会被打印三遍。

`CoffeesController`是一个单例，为什么`CoffeesService`会被创建3次，我们并没有在控制器装饰器中修改任何东西？

其实在Nest中，这些scope会向上的注入链冒泡，这意味着如果`CoffeesController`依赖于属于`REQUSET`范围的`CoffeesService`，它也会隐式地变成`REQUSET`范围。

使用场景：访问headers\cookie\ip

弊端：影响性能（因为每个请求都会被创造为实例）