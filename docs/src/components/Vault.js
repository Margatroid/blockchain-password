import React from 'react';

const Vault = ({vault}) => {
  return <div>
    <section className='section'>
      <h1 className='title'>Vault</h1>
      <table className='table is-fullwidth'>
        <tbody>
          <tr>
            <td className='has-text-weight-semibold'>Contract address</td>
            <td>{vault.address}</td>
          </tr>
          <tr>
            <td className='has-text-weight-semibold'>Owner address</td>
            <td>{vault.owner}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
};

export default Vault;
