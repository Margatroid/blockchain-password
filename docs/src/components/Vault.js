import React from 'react';
import NewLogin from './NewLogin.js';

const Vault = ({store}) => {
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
  </div>
};

export default Vault;
