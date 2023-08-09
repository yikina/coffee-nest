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

