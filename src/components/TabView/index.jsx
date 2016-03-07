
import styles from './index.scss';
import React from 'react';
import cssModules from 'react-css-modules';

function TabView({
  id,
  className,
  Logo = null,
  logoWidth = 60,
  logoHeight = 60,
  title1 = 'Title 1',
  title2 = 'Title 2',
  menu = [{
    key: 1,
    text: 'default',
    icon: '',
    active: true,
  }],
  handleMenuClick = () => {},
  children,
}) {
  return (
    <div styleName="root" className={className} id={id}>
      <div styleName="top">
        {Logo
          ? <div styleName="top-logo">
            <Logo width={logoWidth} height={logoHeight} />
          </div>
          : ''}
        <div styleName="top-title">
          <span styleName="top-title-1">{title1}</span>
          <span styleName="top-title-2">{title2}</span>
        </div>
      </div>
      <div styleName="menu">
        {menu.map((item) =>
          <a
            key={item.path}
            href={item.path}
            onClick={() => {
              handleMenuClick(item.path);
            }}
            styleName={item.active ? 'item-active' : 'item'}>
            <i className={item.icon}></i>
            {item.text}
          </a>
        )}
      </div>
      {children}
      <div styleName="footer">This is a demo</div>
    </div>
  );
}

export default cssModules(TabView, styles);
