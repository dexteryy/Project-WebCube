import { pipeResolvers, isDependee, resolveDependee } from 'graphql-resolvers';
import {
  shopsLoader,
  shopsUpdater,
  shopsRemover,
  servicesLoader,
  ordersGetter,
  positionGetter,
} from './mock';

const resolvers = {
  Query: {
    shops: isDependee((_, args, context) =>
      shopsLoader().then(({ shops, timestamp }) => {
        context.result = {
          shops,
          timestamp,
        };
        return shops;
      }),
    ),
    timestamp: pipeResolvers(
      resolveDependee('shops'),
      (_, args, context) => context.result.timestamp,
    ),
  },
  Mutation: {
    shops: isDependee((_, { shopId, shopData }, context) =>
      (shopData ? shopsUpdater(shopId, shopData) : shopsRemover(shopId)).then(
        ({ shops, timestamp }) => {
          context.result = {
            shops,
            timestamp,
          };
          return shops;
        },
      ),
    ),
    timestamp: pipeResolvers(
      resolveDependee('shops'),
      (_, args, context) => context.result.timestamp,
    ),
  },
  Shop: {
    services: () => servicesLoader(),
    orders: () => ordersGetter(),
    position: () => positionGetter(),
  },
};

export default resolvers;
