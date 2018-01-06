import React from 'react';

const Nav = ({store}) => {
  return <div>
    Navigation:
    <button onClick={store.showHome}>Home</button>
    <button onClick={store.showVault}>Vault</button>
    <button onClick={store.deployNewVault}>Deploy</button>
  </div>
};

export default Nav;
