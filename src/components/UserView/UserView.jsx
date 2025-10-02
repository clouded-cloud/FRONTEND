import React from 'react';
import Menu from './Menu';
import Cart from './Cart';
import './UserView.css';

const UserView = () => {
  return (
    <div className="user-view">
      <div className="main-content">
        <Menu />
      </div>
      <div className="sidebar">
        <Cart />
      </div>
    </div>
  );
};

export default UserView;