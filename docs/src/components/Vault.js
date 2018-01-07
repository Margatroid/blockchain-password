import React from 'react';

const Vault = ({vault}) => {
  return <div>
    <h1>Vault</h1>
    <p>Vault contract address: {vault.address}</p>
    <p>Owner address: {vault.owner}</p>
  </div>
};

export default Vault;
