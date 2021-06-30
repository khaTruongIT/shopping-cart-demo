import {belongsTo, Entity, model, property} from '@loopback/repository';
import {ShoppingCartItem} from './shopping-cart-item.model';
import { User } from './user.model';

@model({settings: {strict: false}})
export class Order extends Entity {
  // Define well-known properties here
  @property({
    type:'string',
    id: true,
    postgresql: {
      dataType: 'text'
    }
  })
  orderId?:string;

  @property({
    type:'date'
  })
  date?:string;

  @belongsTo(() => User)
  userId:string;

  @property({
    type: 'number'
  })
  total?:number

  @property.array(ShoppingCartItem, {required: true})
  products: ShoppingCartItem[];

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {
  // describe navigational properties here
}

export type OrderWithRelations = Order & OrderRelations;
