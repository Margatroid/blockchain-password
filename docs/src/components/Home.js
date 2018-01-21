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

  const web3Warning = (store.web3Enabled) ? null :
    <article className='message is-info'>
      <div className='message-body'>
        A web3 compatible browser is required to continue.
      </div>
    </article>;

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
          <div className='content'>
            <h2>About</h2>
            <p>
              If you've ever dreamed of harnessing the power of the blockchain to securely store
              your passwords, you've come to the right place.
            </p>
            <h2>How it works</h2>
            <p>
              Your login credentials are stored inside a vault which is essentially a smart contract.
              This web frontend will give you the ability to deploy new vaults and edit the details
              inside vaults that you own (deployed).
            </p>
            <p>
              See a demonstration in this video.
            </p>
            <h2>How secure is this?</h2>
            <p>
              All the code is open-source and available here. The crypto-js library is used
              to provide the encryption standards. You provide a passphrase which passes through
              PBKDF2 to derive a much longer hashed key. This key is then used to encrypt and decrypt
              the vault contents with AES.
            </p>
            <p>
              Due to the open nature of the blockchain, the contents of your encrypted vault can be
              read by anyone. However it is nearly impossible to derive the decrypted contents (in theory).
            </p>

            <p>Use at your own risk.</p>
          </div>
        </div>
      </div>

      <div className='column'>
        <div className='section'>
          <div className='content'>
            <h2>Get started</h2>
            <p>
              <strong>An Ethereum (web3) compatible browser is required to use this app.</strong>
              The easiest way is to get Metamask. Blockchain Password has only been deployed
              to the test networks so far due to the high gas prices on the main
              Ethereum network.
            </p>
            <p>
              Once you've got that running with some Ether in your acccount and it is ready to
              use in Metamask, you should be able
              to deploy a new vault below (which is just a smart contract) and begin using it to
              store your passwords securely. Reading existing vault data is free, but any
              write operations (including deployment) to the blockchain will cost additional gas.
            </p>
          </div>
        </div>

        <section className='section'>
          <div className='card'>
            <div className='card-content'>
              {web3Warning}
              <form onSubmit={onSubmit}>
                <div className='field'>
                  <label className='label'>Enter passphrase</label>
                  <div className='control'>
                    <input name='name'
                      onChange={onChange}
                      className='input'
                      disabled={store.newVaultDialog.isDeploying || !store.web3Enabled}
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
            </div>
          </div>
        </section>
      </div>
    </div>

  </div>
});

export default Home;
