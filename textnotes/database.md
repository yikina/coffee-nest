# 连接数据库

## docker容器管理

docker是一个容器，有了它可以快速部署环境，无论是在本地还是线上都是同等的，且都能很方便的使用，让开发者能够更专注的进行功能的开发而不用被配置环境的琐事烦恼。按照官网提示安装docker，在项目中新建docker-compose.yml，使用docker来安装postgreSQL

以yml结尾的文件是yaml文件，**YAML** 是一种可读性高，以数据为中心的数据序列化格式。可以表达 **对象（键值对）**，**数组**，**标量** 这几种数据形式 能够被多种编程语言和脚本语言解析。

### YAML基本语法

- 以 `k: v` 的形式来表示键值对的关系，**冒号后面必须有一个空格**
- `#` 表示注释
- 对大小写敏感
- 通过缩进来表示层级关系，**缩排中空格的数目不重要，只要相同阶层的元素左侧对齐就可以了**
- 缩进只能使用空格，不能使用 `tab` 缩进键
- **字符串可以不用双引号**

yaml文件中表示含义：

```yml
version: "3"  //版本号

services:  //具体有哪些服务
  db: //数据库服务
    image: postgres  //创建镜像
    restart: always
    ports: //外：内 端口号，这里共用一个
     - "5432:5432"
    environment:
      POSTGRES_PASSWORD: pass123

```

终端运行 

```
docker-compose up  db -d 
//分离启动db服务，如果只是docker-compose up -d，将会启动yml services下的所有服务
```

### 运行Pgadmin4——可视化postgresSQL工具

终端输入

```
docker run -d -p 5433:80 --name pgadmin4 -e PGADMIN_DEFAULT_EMAIL=test@123.com -e PGADMIN_DEFAULT_PASSWORD=123456 dpage/pgadmin4
```

打开localhost:5433：80输入刚刚设置的email和密码

## TypeORM

**ORM** 是 Object Relational Mapping 的缩写，译为“对象关系映射”，它解决了<u>对象和关系型数据库之间的数据交互问题</u>。

使用面向对象编程时，数据很多时候都存储在对象里面，具体来说是存储在对象的各个属性（也称成员变量）中。例如有一个 User 类，它的 id、username、password、email 属性都可以用来记录用户信息。当我们需要把对象中的数据存储到数据库时，按照传统思路，就得手动编写 SQL 语句，将对象的属性值提取到 SQL 语句中，然后再调用相关方法执行 SQL 语句。

而有了 ORM 技术以后，只要提前配置好对象和数据库之间的映射关系，ORM 就可以自动生成 SQL 语句，并将对象中的数据自动存储到数据库中，整个过程不需要人工干预。

**TypeORM** 是一个[ORM](https://en.wikipedia.org/wiki/Object-relational_mapping)框架，它可以运行在 NodeJS、Browser、Cordova、PhoneGap、Ionic、React Native、Expo 和 Electron 平台上，可以与 TypeScript 和 JavaScript (ES5,ES6,ES7,ES8)一起使用。 它的目标是始终支持最新的 JavaScript 特性并提供额外的特性以帮助你开发任何使用数据库的（不管是只有几张表的小型应用还是拥有多数据库的大型企业应用）应用程序。

1. 安装TypeORM

```
pnpm i @nestjs/typeorm typeorm pg
```

2. 在nest.js中引入TypeORM模块

```tsx
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'postgres',  //使用数据库类型
      host:'localhost',//本地开发
      port:5432,//端口，与docker-compose.yml设置一致
      username:'postgres', //默认postgres，可以自定义但也必须和yml配置文件一致
      password:'pass322', //同上
      autoLoadEntities:true, //自动导入entities
      synchronize:true //同步数据库数据，但避免在production环境中使用
    }),
    CoffeesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### Entity

在typeOrm中，每一个Entity都会被自动生成一张SQL表，我们可以在其中使用@标识主键等信息，如：

```tsx
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()  //自动生成SQL表名为小写开头，这里为coffee
//@Entity('cats') 生成名为cats的SQL表
export class Coffee{
    @PrimaryGeneratedColumn() //主键
    id:number;

    @Column()//每一列的表头
    name:string;

    @Column()
    brand:string;

    @Column('json',{nullable:true}) //标识为json格式且为可选
    flavors:string[];
}
```

在每个模块的Entity设置完毕后，要到该模块的module.ts中引入(imports)

```tsx
@Module({ //使用forFeature引入Entity
    imports:[TypeOrmModule.forFeature([Coffee])],
    controllers: [CoffeesController], providers: [CoffeesService] })
export class CoffeesModule { }
```

接着使用pnpm run start启动nest.js，打开pgAdmin4即可看到coffee表

### Repository

在coffee.service中利用构造函数constructor,并使用@InjectRepository连接Entity来连接postgreSQL

```tsx
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CoffeesService {
    //连接真实数据库
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository:Repository<Coffee>,
    ){}
    
    ...}
```

同时如下的方法也要修改为Repository内置的方法

```tsx
findAll(){
        return this.coffeeRepository.find()
    }
    
    async findOne(id:string){
        const coffee=await this.coffeeRepository.findOneBy({id:+id});
        if(!coffee){
            throw new HttpException(`coffee ${id} not found`,404)
        }
        return coffee;
    }
```

启动数据库以及nestjs，通过postcode发请求可以看到成功连接了数据库

### Relationship

各表之间的relationship主要有：

一对一`@OneToOne()`：主表的每一行在外部表都有且只有一个关联行；

一对多`@OneToMany()`，多对一`@ManyToOne()`：主表的每一行在外部表中都有一个或多个相关行；

多对多`@ManyToMany()`：主表中的每一行在外表都有许多相关的行，并且外表中的每条记录在主表中都有许多相关的行；

在这里，我们希望将coffee与flavors连接起来，在普遍的sql中就是再新建一张表存放二者的id，通过这张表再连接原本coffee和flavors的表，nestjs为我们提供了自动完成的功能，只需要：

1. 新建flavors.entity

   ```tsx
   @Entity()
   export class Flavor {
       @PrimaryGeneratedColumn()
       id:number;
   
       @Column()
       name:string;
   
       @ManyToMany(  //通过ManyToMany装饰器连接Coffee
           type => Coffee,
           coffee=>coffee.flavors
       )
       coffees:Coffee[];
   
   }
   
   ```

   

2. 修改coffee.entity

   ```tsx
     @JoinTable()  //连接flaors，主动连接需要加入
       @ManyToMany(
           type => Flavor,
           flavor => flavor.coffees,
           {
               cascade: true,//启用联级插入
           }
          
       )
       flavors:Flavor[];
   ```

   

3. 在coffee.,module模块中引入Flavor.entites

   ```tsx
   @Module({ 
       imports:[TypeOrmModule.forFeature([Coffee,Flavor])],
   ```

4. 在coffees.services中标识relation，根据联级插入修改

   ```tsx
   findAll(){
           return this.coffeeRepository.find({
               relations:['flavors'], //标识relation
           })
       }
    
   
   
   async findOne(id:string){
           const coffee = await this.coffeeRepository.findOne({
               where: { id: +id },
               relations: ['flavors'], //标识relation
             })
           if(!coffee){
               throw new HttpException(`coffee ${id} not found`,404)
           }
           return coffee;
       }
   
   
   //创建coffee-同时注意flavors
      async create(createCoffeeDto:CreateCoffeeDto){
           const flavors=await Promise.all(
           createCoffeeDto.flavors.map(name=>this.preloadFlavorByName(name)),
           )
           const coffee=this.coffeeRepository.create({
               ...createCoffeeDto,
               flavors
           })
           return this.coffeeRepository.save(coffee)
       }
   
   
   
       async update(id:string,updatecoffeeDto:UpdataCoffeeDto){
           const flavors=updatecoffeeDto.flavors &&(await Promise.all(
               updatecoffeeDto.flavors.map(name=>this.preloadFlavorByName(name))
           ))
          const coffee=await this.coffeeRepository.preload({
           id:+id,
           ...updatecoffeeDto,
           flavors
          })
          if(!coffee){
           throw new NotFoundException(`coffee ${id} not found`)
          }
          return this.coffeeRepository.save(coffee);
       }
   
   //为联级操作写的方法——如果存在flavor，就返回，否则创建
    private async preloadFlavorByName(name:string):Promise<Flavor>{
           const existFlavor= await this.flavorRepository.findOneBy(
               {name:name});
           if(existFlavor){
               return existFlavor
           }
           return this.flavorRepository.create({name})
       }
   }
   ```

   

### pagination

分页，要向数据库传递分页请求，首先新建一个paginationDto

```tsx
export class PaginationQueryDto{
    @IsOptional()  //可选
    @IsPositive()  //大于0
   @Type(()=>Number)  //将url传递的param string类型转换为数字
    limit:number;
    offset:number;
}
```

除了使用@Type()装饰器以外，我们还可以在main.ts中添加配置，使得所有的DTO的类型都可以自动转换，这样就不必在每一个DTO中都填写@Type

```tsx
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true, 
    transform:true,  
    forbidNonWhitelisted: true,
    transformOptions:{
      enableImplicitConversion:true,  //开启DTO自动转换类型
    }
  }))
  await app.listen(3000);
}
bootstrap();
```

根据需要修改controller以及service中的内容，添加paginationDto即可

## Transaction

含义：针对数据库执行的event，**只表示数据库中的更改**

推荐使用dataSource中的QueryRunner类

例如，我们现在有一个需求，希望在coffee.entity中添加一个recommendations属性，每当有一位用户推荐这种coffee时，对应的recommendations添加

1. 在coffee.entity中添加recommendations属性，设置{default:0}
2. 创建Event.entity标识事件表
3. 将Event添加到modules.TypeOrmModule.forFeature([Event])
4. 在Service中引入datasource，编写事件

```tsx
export class CoffeesService {
   
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository:Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository:Repository<Flavor>,
        private readonly datasource:DataSource,//引入
    ){}
    
    //使用transaction
    async recommendCoffee(coffee:Coffee){
        const queryRunner=this.datasource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{
            coffee.recommendations++;
          //结合event.entity
            const recommendEvent=new Event();
            recommendEvent.name='recommend_coffee';
            recommendEvent.type='coffee';
            recommendEvent.payload={coffeeId:coffee.id}


        }catch(err){
            await queryRunner.rollbackTransaction()
        }finally{
            await queryRunner.release()
        }
    }}
```

### Index

我们可以使用Index来提高索引效率，可以直接在属性上添加@Index()装饰器，适用于单个属性

```tsx
@Index()
@Column()
name: string
```

也可以直接在Entity最上方用数组标识需要Index的属性，适用于多个属性

```tsx
@Index(['name','type'])
@Entity()
export class Event {...}
```

