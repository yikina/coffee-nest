import { HttpException, Injectable } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
    //模拟数据
    //TODOS:连接真实数据库
    private coffees:Coffee[]=
       [ {
            id:1,
            name:'orangeCoffee',
            brand:'lucky',
            flavors:['orange','coffee']
        },
        {
            id:2,
            name:'blackCoffee',
            brand:'costa',
            flavors:['coffee']
        },

    ];
    findAll(){
        return this.coffees;
    }
    
    findOne(id:string){
        const coffee=this.coffees.find(item=>item.id===+id);
        if(!coffee){
            throw new HttpException(`coffee ${id} not found`,404)
        }
        return coffee;
    }

    create(createInstance:any){
        this.coffees.push(createInstance)
    }

    update(id:string,updateInstance:any){
        const existCoffee=this.findOne(id);
        if(existCoffee){
            // TODO 
        }
    }

    remove(id:string){
        const coffeeIndex=this.coffees.findIndex(item=>item.id===+id);
        if(coffeeIndex >=0){
            this.coffees.splice(coffeeIndex,1);
        }
    }
}
