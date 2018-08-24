import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { Bind } from 'lodash-decorators';
import cube from '../cube';
import Header from '../components/Header';
import Footer from '../components/Footer';
import List from './List';

class Layout extends PureComponent {
  static defaultProps = {
    title: '',
  };

  @Bind
  handleInputChange(content) {
    this.props.actions.changeInput(content);
  }

  @Bind
  handleInputSubmit(content) {
    this.props.actions.todo.add(content);
  }

  @Bind
  handleClear() {
    this.props.actions.todo.clearCompleted();
  }

  @Bind
  handleReset() {
    this.props.actions.todo.load();
  }

  render() {
    const { location, title, input, count } = this.props;
    const allFilter = item => item;
    const activeFilter = item => !item.isCompleted;
    const completedFilter = item => item.isCompleted;
    return (
      <section className="todoapp">
        <Header
          title={title}
          input={input}
          disableInput={false}
          onChange={this.handleInputChange}
          onSubmit={this.handleInputSubmit}
        />
        <Switch>
          <Route
            path={`/active`}
            render={() => <List filter={activeFilter} />}
          />
          <Route
            path={`/completed`}
            render={() => <List filter={completedFilter} />}
          />
          <Route
            exact={true}
            path={`/`}
            render={() => <List filter={allFilter} />}
          />
        </Switch>
        <Footer
          count={count}
          currentPath={location.pathname}
          onClear={this.handleClear}
        />
        <div className="footer">
          <button
            type="button"
            className="clear-completed"
            onClick={this.handleReset}>
            Reset local storage with remote data
          </button>
        </div>
      </section>
    );
  }
}

export default Layout
  |> cube.connect({
    select: [
      state => state.todo.input,
      state => state.todo.items,
      state => state.todo.isLoading,
    ],
    transform: (input, items, isLoading) => ({
      input,
      items,
      isLoading,
      count: items.filter(item => !item.isCompleted).length,
    }),
    loader: props => props.actions.todo.load(),
    isLoaded: props => !props.isLoading,
  })
  |> withRouter;
