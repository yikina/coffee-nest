import { Injectable } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
    //模拟数据
    //TODOS:连接真实数据库
    private coffees:Coffee=
        {
            id:1,
            name:'orangeCoffee',
            brand:'lucky',
            flavors:['orange','coffee']
        }
    
}
