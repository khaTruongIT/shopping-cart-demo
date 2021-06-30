import {Entity, model, property} from '@loopback/repository';

@model()
export class ShoppingCartItem extends Entity {

  @property({id: true })
  productId: string;

  //product Name

  @property()
  name:string

  @property()
  quantity: number

  @property()
  price: number;

  constructor(data?: Partial<ShoppingCartItem>) {
    super(data);
  }
}

export interface ShoppingCartItemRelations {
  // describe navigational properties here
}

export type ShoppingCartItemWithRelations = ShoppingCartItem & ShoppingCartItemRelations;
