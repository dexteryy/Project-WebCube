import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'redux-cube';

import { actions as todoActions } from '../reducers/todo';
import Header from '../components/Header';
import Footer from '../components/Footer';
import List from './List';

@connect({
  select: {
    todo: {
      input: true,
      items: true,
    },
  },
  transform: (input, items) => ({
    input,
    items,
    count: items.filter(item => !item.isCompleted).length,
  }),
  actions: todoActions,
})
export default class Main extends PureComponent {
  static defaultProps = {
    title: '',
    routePath: '',
  };

  @autobind
  handleInputChange(content) {
    this.props.actions.changeInput(content);
  }

  @autobind
  handleInputSubmit(content) {
    this.props.actions.todo.add(content);
  }

  @autobind
  handleClear() {
    this.props.actions.todo.clearCompleted();
  }

  render() {
    const { location, title, routePath, input, count } = this.props;
    const isRouteMatch = routePath
      ? location.pathname.indexOf(routePath) > -1
      : true;
    const allFilter = item => item;
    const activeFilter = item => !item.isCompleted;
    const completedFilter = item => item.isCompleted;
    return (
      <section className="todoapp">
        <Header
          title={title}
          input={input}
          disableInput={!isRouteMatch}
          onChange={this.handleInputChange}
          onSubmit={this.handleInputSubmit}
        />
        {/* eslint-disable react/jsx-no-bind */}
        <Switch>
          <Route
            path={`${routePath}/active`}
            render={() => <List filter={activeFilter} />}
          />
          <Route
            path={`${routePath}/completed`}
            render={() => <List filter={completedFilter} />}
          />
          <Route
            exact={true}
            path={`${routePath}`}
            render={() => <List filter={allFilter} />}
          />
        </Switch>
        {/* eslint-enable react/jsx-no-bind */}
        <Footer
          count={count}
          basePath={routePath}
          currentPath={location.pathname}
          onClear={this.handleClear}
        />
      </section>
    );
  }
}
