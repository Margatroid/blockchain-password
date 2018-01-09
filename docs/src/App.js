import React from 'react';
import { Router } from 'director/build/director';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';

import Home from './components/Home';
import Vault from './components/Vault';
import Nav from './components/Nav';

import './App.css';

function renderView(store) {
  switch (store.view) {
    case 'Vault':
      return <Vault store={store}/>;
    default:
      return <Home store={store}/>;
  }
}

export function startRouter(store) {
  const router = new Router({
    'vault/:address': (address) => store.showVault(address),
    '/': () => store.showHome()
  });

  router.configure({ html5history: true });
  router.init();

  autorun(() => {
    const path = store.currentPath;
    if (path !== window.location.pathName) {
      window.history.pushState(null, null, path);
    }
  });
}

export const App = observer(({store}) => {
  return <div className='app container'>
    <Nav store={store}/>
    {renderView(store)}
  </div>;
});
