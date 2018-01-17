import React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';

const LockedVault = observer(({store}) => {
  const onSubmit = (event) => {
    event.preventDefault();
    store.unlockVault();
  };

  const onChange = (event) => {
    action(() => {
      store.unlockDialog.passphrase = event.target.value;
    })();
  };

  const closeModal = () => {
    action(() => {
      // @TODO: Refactor these into the stores.
      store.unlockDialog.incorrectPassphrase = false;
    })();
  };

  let passphraseError;
  if (store.unlockDialog.incorrectPassphrase) {
    passphraseError = <div className='modal is-active'>
      <div onClick={closeModal} className='modal-background'></div>
      <div className='modal-content'>
        <article className='message is-danger'>
          <div className='message-header'>
            <p>Error</p>
            <button onClick={closeModal} className='delete' aria-label='delete'></button>
          </div>
          <div className='message-body'>
            Incorrect passphrase.
          </div>
      </article>
      </div>
    </div>;
  }

  return <div>
    {passphraseError}
    <section className='section'>
      <h1 className='title'>This vault is locked</h1>
      <form onSubmit={onSubmit}>
        <div className='field'>
          <label className='label'>Enter passphrase</label>
          <div className='control'>
            <input name='name'
              onChange={onChange}
              className='input'
              type='password'
              value={store.unlockDialog.passphrase}
              placeholder='Enter passphrase to unlock'
            />
          </div>
        </div>

        <div className='field'>
          <div className='control'>
            <button type='submit' className='button is-primary'>Unlock</button>
          </div>
        </div>
      </form>
    </section>
  </div>
});

export default LockedVault;
