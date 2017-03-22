
import React, { PureComponent } from 'react';
import {
  connect,
  stateSelector,
  actionDispatcher,
} from 'webcube/boilerplate';
import Helmet from 'react-helmet';
import * as myActions from '../actions';

@connect()
@stateSelector(
  state => state.homeModel,
  (homeModel) => ({
    message: homeModel.message,
    list: homeModel.list,
  }),
)
@actionDispatcher({
  add: myActions.addItem,
  remove: myActions.removeItem,
}, 'actions')
export default class Home extends PureComponent {

  render() {
    const {
      message,
    } = this.props;
    return (
      <div>
        <Helmet
          title="{{titleCase entryName}} - Home"
          meta={[
            { name: 'description', content: '' },
          ]} />
        {message}
      </div>
    );
  }

}
