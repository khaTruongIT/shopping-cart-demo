import {belongsTo, Entity, model, property} from '@loopback/repository';
import { ShoppingCartItem } from './shopping-cart-item.model';
import { User } from './user.model';
@model()
export class ShoppingCart extends Entity {

  @belongsTo(() => User)
  userId: string;

  @property.array(ShoppingCartItem)
  item?: ShoppingCartItem[];

  constructor(data?: Partial<ShoppingCart>) {
    super(data);
  }
}

export interface ShoppingCartRelations {
  // describe navigational properties here
}

export type ShoppingCartWithRelations = ShoppingCart & ShoppingCartRelations;
