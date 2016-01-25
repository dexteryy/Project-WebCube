
import './entry.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import WelcomeBox from '../../components/WelcomeBox';

window.onload = function () {
  ReactDOM.render(
    <WelcomeBox message="This is a demo" />,
    document.getElementById('welcome')
  );

  // test
  const url = String(require('file!test.json'));
  fetch(url).then((res) => {
    console.info(res);
  });
};
