import React from 'react';
import NewLogin from './NewLogin.js';
import { observer } from 'mobx-react';

const Vault = observer(({store}) => {
  const loginNames = store.vault.loginNames.map((loginName, index) =>
    <tr key={index}>
      <td>{loginName}</td>
    </tr>
  );

  return <div>
    <section className='section'>
      <h1 className='title'>Vault</h1>
      <table className='table is-fullwidth'>
        <tbody>
          <tr>
            <td className='has-text-weight-semibold'>Contract address</td>
            <td>{store.vault.address}</td>
          </tr>
          <tr>
            <td className='has-text-weight-semibold'>Owner address</td>
            <td>{store.vault.owner}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section className='section'>
      <NewLogin store={store}/>
    </section>

    <section className='section'>
      <h1 className='title'>Logins</h1>
      <table className='table is-fullwidth'>
        <tbody>
          {loginNames}
        </tbody>
      </table>
    </section>
  </div>
});

export default Vault;
