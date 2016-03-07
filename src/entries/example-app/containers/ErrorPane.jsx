
import paneStyles from '../styles/pane.scss';
import React, { Component } from 'react';
import cssModules from 'react-css-modules';
import {
  pureRender,
} from '../../../lib/boilerplate';
import Helmet from 'react-helmet';
import MessageBoxWithStyle from '../../../components/MessageBoxWithStyle';

@cssModules(paneStyles)
@pureRender()
export default class ErrorPane extends Component {

  render() {
    return (
      <div styleName="pane">
        <Helmet
          title="Example App - Error Page"
          meta={[
            { name: 'description', content: 'demo' },
          ]} />
        <MessageBoxWithStyle
          message={{
            status: -1,
            title: 'Not Found',
            content: 'Sorry we can\'t find that page',
          }} />
      </div>
    );
  }

}
