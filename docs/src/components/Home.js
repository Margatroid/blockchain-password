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

  const submitButton = (store.newVaultDialog.isDeploying) ?
    <div className='notification is-info'>
      <strong>Please wait while your vault is being deployed.</strong>
    </div> :
    <button disabled={store.newVaultDialog.disableForm} type='submit' className='button is-primary'>Deploy new vault</button>;

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

    <div className='columns'>
      <div className='column'>
        <div className='section'>
          <h1 className='title'>About</h1>
        </div>
      </div>

      <div className='column'>
        <div className='section'>
          <h1 className='title'>How to get started</h1>
        </div>
      </div>
    </div>

    <section className='section'>
      <form onSubmit={onSubmit}>
        <div className='field'>
          <label className='label'>Enter passphrase</label>
          <div className='control'>
            <input name='name'
              onChange={onChange}
              className='input'
              disabled={store.newVaultDialog.isDeploying}
              type='password'
              value={store.newVaultDialog.passphrase}
              placeholder='Enter passphrase to encrypt your vault contents'
            />
          </div>
        </div>

        <div className='field'>
          <div className='control'>
            {submitButton}
          </div>
        </div>
      </form>
    </section>
  </div>
});

export default Home;
