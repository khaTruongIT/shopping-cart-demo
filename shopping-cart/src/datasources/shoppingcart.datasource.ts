import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'shoppingcart',
  connector: 'postgresql',
  url: 'postgres://Truong:123456@localhost/shoppingcartdb',
  host: 'localhost',
  port: 5433,
  user: 'Truong',
  password: '123456',
  database: 'shoppingcartdb'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class ShoppingcartDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'shoppingcart';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.shoppingcart', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
