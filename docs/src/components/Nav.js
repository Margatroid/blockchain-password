import React from 'react';

const Nav = ({store}) => {
  return <div>
    Navigation:
    <button onClick={store.showHome}>Home</button>
    <button onClick={store.showVault}>Vault</button>
  </div>
};

export default Nav;
