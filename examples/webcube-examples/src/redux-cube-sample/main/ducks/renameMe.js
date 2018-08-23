import gql from 'graphql-tag';
import cube from '../cube';
import { source } from '../../common/apis/main';

cube.handle(
  'renameMe',
  source(
    gql`
      query renameMe {
        renameMe {
          id
        }
      }
    `,
  ),
);
