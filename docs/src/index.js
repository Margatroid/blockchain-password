import React from 'react';
import ReactDOM from 'react-dom';
import { useStrict } from 'mobx';
import { App, startRouter } from './App';
import Store from './store/Store';
import 'bulma/css/bulma.css'
import './index.css';

useStrict(true);

window.addEventListener('load', () => {
  const store = new Store();
  startRouter(store);
  ReactDOM.render(<App store={store}/>, document.getElementById('root'));
})
