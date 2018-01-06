import React from 'react';
import { observer } from 'mobx-react';

const WalletStatus = observer(({store}) => {
  const accounts = store.accounts.map((account) => <li key={account}>{account}</li>);

  return <div>
    <p>Web3 enabled: { store.web3Enabled ? 'Yes' : 'No' }</p>
    <ol>Accounts: { accounts }</ol>
  </div>
});

export default WalletStatus;
