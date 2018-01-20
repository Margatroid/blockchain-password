import React from 'react';

const Nav = ({store}) => {
  return <nav className='navbar' aria-label='main navigation'>
    <div className='navbar-brand'/>
    <div className='navbar-menu'>
      <div className='navbar-start'>
        <a href='/' className='navbar-item'>Home</a>
      </div>

      <div className='navbar-end'>
        <div className='navbar-item'>
          <div className='field is-grouped'>
            <p className='control'>
              <a className='button' href='https://github.com/Margatroid/blockchain-password'>
                <span className='icon'>
                  <i className='fab fa-github'></i>
                </span>
                <span>View source</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </nav>
};

export default Nav;
