import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Bind } from 'lodash-decorators';
import { Loader } from 'react-loaders';
import 'loaders.css/src/animations/line-scale.scss';
import cube from '../cube';

class Number extends Component {
  componentWillUnmount() {
    this.props.actions.reset();
  }

  @Bind
  handleIncrease() {
    this.props.actions.increase(2);
  }

  @Bind
  handleDecrease() {
    this.props.actions.decrease(2);
  }

  render() {
    const { value, loading } = this.props;
    return (
      <div>
        <Helmet>
          <title>Number</title>
        </Helmet>
        {loading ? (
          <div>
            <Loader type="line-scale" active={true} color="#06f" />
          </div>
        ) : (
          <div>
            <input type="text" readOnly={true} value={value} />
            <button type="button" onClick={this.handleIncrease}>
              +
            </button>
            <button type="button" onClick={this.handleDecrease}>
              -
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default Number
  |> cube.connect({
    select: [state => state.number],
    transform: number => number,
    loader: props => props.actions.load(),
    isLoaded: props => Boolean(props.value),
  });
