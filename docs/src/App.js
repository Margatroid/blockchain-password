import React from 'react';
import { Router } from 'director/build/director';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';

import Home from './components/Home';
import Vault from './components/Vault';
import LockedVault from './components/LockedVault';

import './App.css';

function renderView(store) {
  switch (store.view) {
    case 'Vault':
      if (store.vault.locked) {
        return <LockedVault store={store}/>;
      }
      return <Vault store={store}/>;
    default:
      return <Home store={store}/>;
  }
}

export function startRouter(store) {
  const router = new Router({
    '/vault/:address': (address) => store.showVault(address),
    '/': () => store.showHome()
  });

  router.configure({ html5history: false });
  router.init();

  autorun(() => {
    const path = store.currentPath;
    if (path !== window.location.hash) {
      window.location.hash = path;
    }
  });
}

export const App = observer(({store}) => {
  return <div className='app container'>
    {renderView(store)}
  </div>;
});
