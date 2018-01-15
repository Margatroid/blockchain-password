import React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';

const Home = observer(({store}) => {
  const onSubmit = (event) => {
    event.preventDefault();
    store.deployNewVault();
  };

  const onChange = (event) => {
    action(() => {
      store.newVaultDialog.passphrase = event.target.value;
    })();
  };

  return <div>
    <section className='hero is-primary'>
      <div className='hero-body'>
        <div className='container'>
          <h1 className='title'>
            Blockchain Password
          </h1>
          <h2 className='subtitle'>
            Open source experimental password manager built on the Ethereum blockchain.
          </h2>
        </div>
      </div>
    </section>

    <section className='section'>
      <form onSubmit={onSubmit}>
        <div className='field'>
          <label className='label'>Enter passphrase</label>
          <div className='control'>
            <input name='name'
              onChange={onChange}
              className='input'
              type='password'
              value={store.newVaultDialog.passphrase}
              placeholder='Enter passphrase to encrypt your vault contents'
            />
          </div>
        </div>

        <div className='field'>
          <div className='control'>
            <button disabled={store.newVaultDialog.disableForm} type='submit' className='button is-primary'>Deploy new vault</button>
          </div>
        </div>
      </form>
    </section>
  </div>
});

export default Home;
