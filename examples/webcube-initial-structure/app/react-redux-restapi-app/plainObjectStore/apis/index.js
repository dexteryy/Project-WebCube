import { createSource } from 'redux-source';
import schema from './schema/index.gql';
import resolvers, { defaultValues } from './resolvers';

export const source = createSource({
  schema,
  resolvers,
  defaultValues,
});
