import React from 'react';

const Nav = ({store}) => {
  return <nav className='navbar is-light' aria-label='main navigation'>
    <div className='navbar-menu'>
      <div className='navbar-start'>
        <a href='/' className='navbar-item'>Home</a>
      </div>
    </div>
  </nav>
};

export default Nav;
