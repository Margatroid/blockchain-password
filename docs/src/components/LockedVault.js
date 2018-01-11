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

  return <div>
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
