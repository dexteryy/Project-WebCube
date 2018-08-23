import { Component, createElement } from 'react';
import uuidv4 from 'uuid/v4';
import { createHoc } from 'react-common-kit';

/* eslint-disable react/no-multi-comp */
const dataLoader = {
  loader(getPromise) {
    const uuid = uuidv4();
    return createHoc(
      OriginComponent =>
        class WithLoader extends Component {
          state = {
            initialData: null,
            isInitialDataLoading: true,
          };

          componentDidMount() {
            getPromise(this.props).then(result => {
              this.setState({
                initialData: result,
                isInitialDataLoading: false,
              });
            });
          }

          render() {
            const { ...passThroughProps } = this.props;
            const { initialData, isInitialDataLoading } = this.state;
            return createElement(OriginComponent, {
              initialData,
              isInitialDataLoading,
              ...passThroughProps,
            });
          }
        },
    );
  },
  rootLoader() {
    return createHoc(
      OriginComponent =>
        class WithRootLoader extends Component {
          constructor(props) {
            super(props);
          }

          componentDidMount() {}

          render() {
            const { ...passThroughProps } = this.props;
            return createElement(OriginComponent, {
              ...passThroughProps,
            });
          }
        },
    );
  },
};
/* eslint-enable react/no-multi-comp */

export default dataLoader;
