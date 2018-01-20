import React from 'react';
import { observer } from 'mobx-react';
import NewLogin from './NewLogin.js';
import LoginModal from './LoginModal.js';

const Vault = observer(({store}) => {
  const loginNames = store.vault.loginNames.map((loginName, index) => {
    const onClick = () => { store.getLogin(index) };
    return <tr onClick={onClick} key={index}>
      <td>{loginName}</td>
    </tr>
  });

  const loginModal = (store.viewLoginDialog.show) ? <LoginModal store={store}/> : null;

  return <div>
    {loginModal}

    <section className='section'>
      <h1 className='title'>Vault</h1>
      <table className='table is-fullwidth'>
        <tbody>
          <tr>
            <td className='has-text-weight-semibold'>Contract address</td>
            <td>{store.vault.address}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section>
      Bookmark this page to quickly access your own vault.
      In the event that you lost this vault's address,
      use Etherscan on your own account to relocate this vault's contract address.
    </section>

    <section className='section'>
      <NewLogin store={store}/>
    </section>

    <section className='section'>
      <nav className='level'>
        <div className='level-left'>
          <div className='level-item'>
            <h1 className='title'>Logins</h1>
          </div>
        </div>
        <div className='level-right'>
          <button onClick={store.refreshLogins} className='button'>Reload vault</button>
        </div>
      </nav>

      <table className='table is-hoverable is-fullwidth'>
        <tbody>
          {loginNames}
        </tbody>
      </table>
    </section>
  </div>
});

export default Vault;
