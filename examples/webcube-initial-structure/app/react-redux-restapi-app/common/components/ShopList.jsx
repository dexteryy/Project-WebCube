import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import faker from 'faker';

import styles from '../styles/info.scss';

function getRandomShop(id) {
  return {
    id,
    name: faker.company.companyName(),
    address: faker.address.streetAddress(),
    deliveryEnabled: faker.random.boolean(),
    services: [],
    orders: [],
    position: {
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
    },
  };
}

export default class ShopList extends PureComponent {
  @autobind
  handleFetch() {
    this.props.actions.shopsSource.fetchShops();
  }

  @autobind
  handleAdd() {
    if (this.props.source.result.shops.find(shop => shop.id === 'shop-1')) {
      this.props.actions.shopsSource.addShop({
        id: 'shop-100',
        data: getRandomShop('shop-100'),
      });
    } else {
      this.props.actions.shopsSource.addShop({
        id: 'shop-1',
        data: getRandomShop('shop-1'),
      });
    }
  }

  @autobind
  handleUpdate() {
    this.props.actions.shopsSource.updateShop({
      id: 'shop-1',
      data: getRandomShop('shop-100'),
    });
  }

  @autobind
  handleDelete() {
    if (this.props.source.result.shops.find(shop => shop.id === 'shop-1')) {
      this.props.actions.shopsSource.deleteShop({
        id: 'shop-1',
      });
    } else {
      this.props.actions.shopsSource.deleteShop({
        id: 'shop-100',
      });
    }
  }

  render() {
    const {
      source: {
        result: { shops = [], timestamp = '' },
        errors: sourceErrors,
        isPending: isSourceLoading,
      },
    } = this.props;
    return (
      <div>
        {isSourceLoading && <p className={styles.loading}>Loading...</p>}
        {sourceErrors.length > 0 && (
          <p className={styles.error}>
            Error! {sourceErrors.map(({ message }) => message)}
          </p>
        )}
        <h3>Shop List</h3>
        <input
          type="button"
          className={styles.button}
          value="Fetch"
          onClick={this.handleFetch}
        />
        <input
          type="button"
          className={styles.button}
          value="Add"
          onClick={this.handleAdd}
        />
        <input
          type="button"
          className={styles.button}
          value="Update"
          onClick={this.handleUpdate}
        />
        <input
          type="button"
          className={styles.button}
          value="Delete"
          onClick={this.handleDelete}
        />
        <div className={styles.info}>
          <h4>Result</h4>
          <ul>
            {(shops.length &&
              shops.map(shop => (
                <li key={shop.id}>
                  <p className={styles['result-title']}>{shop.name}</p>
                  <p>
                    <label>Address</label>
                    {shop.address}
                  </p>
                  <p>
                    <label>Position</label>
                    {Object.values(shop.position).join(', ')}
                  </p>
                  <h4>Services</h4>
                  <ul>
                    {(shop.services.length &&
                      shop.services.map(service => (
                        <li key={service.id}>
                          <p className={styles['result-title']}>
                            {service.name}
                          </p>
                          <p>
                            <label>Price</label>
                            {service.price}
                          </p>
                        </li>
                      ))) || (
                      <li>
                        <p>None</p>
                      </li>
                    )}
                  </ul>
                  <h4>Orders</h4>
                  <ul>
                    {(shop.orders.length &&
                      shop.orders.map((order, i) => (
                        <li key={i}>
                          <p className={styles['result-title']}>{order.user}</p>
                          <p>
                            <label>Cost</label>
                            {order.cost}
                          </p>
                        </li>
                      ))) || (
                      <li>
                        <p>None</p>
                      </li>
                    )}
                  </ul>
                </li>
              ))) || (
              <li>
                <p>None</p>
              </li>
            )}
          </ul>
          <p>
            <label>Timestamp</label>
            {timestamp}
          </p>
        </div>
      </div>
    );
  }
}
