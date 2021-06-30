import {Entity, hasMany, hasOne, model, NULL, property} from '@loopback/repository';
import{Order} from './order.model';
import { ShoppingCart } from './shopping-cart.model';


@model({
  settings: { postgresql: { schema: 'public', table: 'User'} },
})
export class User extends Entity {
  // Define well-known properties here

  @property({
    type: 'number',
    id: true,
    description: 'The unique id for user',
    postgresql: {
      columnName: 'id',
      dataType: 'generated',
      dataPrecision: null,
      dataScale: 0,
      nullable: 'NO'
    }
  })
  id: string;

  @property({
    type: 'string',
    unique: true,
    required: true,
    trim: true,
    postgressql: {
      columnName: 'email',
      dataType: 'text',
      dataLength: null,
      dataPrecision: null,
      nullable: 'NO'
    }
  })
  email: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'name',
      dataType: 'text',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO'
    }
  })
  name: string

  @property({
    type: 'string',
    enum: ['user', 'admin'],
    required: true,
    postgresql: {
      columnName: 'roles',
      dataType: 'text',
      dataLength: null,
      dataScale: null,
      nullable: 'NO'
    }
  })
  roles?:string[];

  @property({
    type:'string',
    required: true,
    postgresql: {
      columnName: 'password',
      dataType: 'text',
      dataLength: null,
      dataScale: null,
      nullable: 'NO'
    }
  })
  password: string

  @hasOne(() => ShoppingCart)
  shoppingCart: ShoppingCart;

  @hasMany(() => Order)
  orders:Order[];

  @property({
    type:'string',
    postgresql: {
      column: 'resetKey'
    }
  })
  resetKey: string;

  @property({
    type: 'string',
    postgresql: {
      column: 'resteTimestamp'
    }
  })
  resetTimestamp: string;

  @property({
    type: 'string',
  })
  resetKeyTimestamp: string;


  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }



}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
