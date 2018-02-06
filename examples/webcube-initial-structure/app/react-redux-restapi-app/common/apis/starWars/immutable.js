import { createSource } from 'redux-source-immutable';
import schema from './schema/index.gql';
import resolvers from './resolvers';

export const source = createSource({
  schema,
  resolvers,
});
