import faker from 'faker';

export const shopsLoader = () => {
  const n = Math.ceil(Math.random() * 3 + 1);
  const shops = [];
  for (let i = 1; i <= n; i++) {
    shops.push({
      id: `shop-${i}`,
      name: faker.company.companyName(),
      address: faker.address.streetAddress(),
      deliveryEnabled: faker.random.boolean(),
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        shops,
        timestamp: Date.now(),
      });
    }, 100);
  });
};

export const shopsUpdater = (shopId, shopData) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve({
        shops: [shopData],
        timestamp: Date.now(),
      });
    }, 100);
  });

export const shopsRemover = shopId =>
  new Promise(resolve => {
    setTimeout(() => {
      const deleteData = { id: shopId, deliveryEnabled: false };
      resolve({
        shops: [deleteData],
        timestamp: Date.now(),
      });
    }, 100);
  });

export const servicesLoader = () => {
  const n = Math.ceil(Math.random() * 4);
  const services = [];
  for (let i = 1; i <= n; i++) {
    services.push({
      id: `service-${i}`,
      name: faker.lorem.word(),
      price: faker.random.number(),
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(services);
    }, 100);
  });
};

export const ordersGetter = () => {
  const n = Math.ceil(Math.random() * 4);
  const orders = [];
  for (let i = 1; i <= n; i++) {
    orders.push({
      user: faker.name.findName(),
      cost: faker.random.number(),
    });
  }
  return orders;
};

export const positionGetter = () => ({
  latitude: faker.address.latitude(),
  longitude: faker.address.longitude(),
});
