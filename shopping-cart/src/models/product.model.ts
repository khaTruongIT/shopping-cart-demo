import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Product extends Entity {
  // Define well-known properties here

  @property({
    type: 'string',
    id: true,
    genegrated: true,
  })
  productID?:string;

  @property({
    type:'string',
    required: true
  })
  name: string;

  @property({
    type: 'number',
    required: true
  })
  price: number

  @property({
    type:'string'
  })
  image?:string

  @property({
    type: 'string',
  })
  description: string

  @property({
    type: 'string'
  })
  detail?:string 

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
