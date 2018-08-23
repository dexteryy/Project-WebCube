import { createSource } from 'redux-source-immutable';
import positionSchema from '../common/schema/position.gql';
import schema from './schema/index.gql';
import resolvers from './resolvers';

export const source = createSource({
  schema: `
    ${positionSchema}
    ${schema}
  `,
  resolvers,
});
