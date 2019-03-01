import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
// import styled, { injectGlobal } from 'styled-components';
import htmlData from '../../data/data.html';
import mdData from '../../data/data.md';
import logo from '../../data/favicon.png';
import scssStyles from './css/demo.scss';
import cssStyles from './css/demo.css';

// injectGlobal`
//   ul {
//     list-style: none;
//     margin: 0;
//     padding: 0;
//   }
// `;

const Item = styled.li`
  border: 1px solid #666;
  padding: 10px;
  margin: 20px 0;
`;

export default class Counter extends Component {
  state = {
    count: 0,
    jsonData: null,
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState(prevState => ({ count: prevState.count + 1 }));
    }, 200);

    import('../../data/data.json').then(({ default: jsonData }) => {
      this.setState({ jsonData });
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { count, jsonData } = this.state;
    const { style, location } = this.props;
    return (
      <div>
        <Helmet>
          <title>Counter</title>
          <meta name="description" content="A counter demo" />
          <link rel="canonical" href={location.pathname} />
        </Helmet>
        <p>
          <input
            type="number"
            readOnly={true}
            value={count}
            style={style}
            className={`${cssStyles.counter} ${scssStyles.counter}`}
          />
        </p>
        <p>
          <a href={logo} target="_blank">
            <img src={logo} />
          </a>
        </p>
        <ul>
          <Item>
            <span>{JSON.stringify(jsonData)}</span>
          </Item>
          <Item>
            <span>{htmlData}</span>
          </Item>
          <Item>
            <span>{mdData}</span>
          </Item>
        </ul>
      </div>
    );
  }
}

console.info('Counter loaded!');
