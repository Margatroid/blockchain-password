/* global web3 */

import React from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3';
import { useStrict } from 'mobx';
import { App, startRouter } from './App';
import Store from './store/Store';
import './index.css';

useStrict(true);

window.addEventListener('load', () => {
  let store = new Store();
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    store = new Store(new Web3(web3.currentProvider));
    store.web3Enabled = true;
    store.load();
  }

  startRouter(store);
  ReactDOM.render(<App store={store}/>, document.getElementById('root'));
})
