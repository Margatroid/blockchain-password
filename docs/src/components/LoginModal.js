import React from 'react';
import { observer } from 'mobx-react';

const LoginModal = observer(({store}) => {
  const {name, username, password} = store.viewLoginDialog;

  return <div className='modal is-active'>
    <div onClick={store.closeLoginInfoModal} className='modal-background'></div>
    <div className='modal-content'>
      <article className='message is-info'>
        <div className='message-header'>
          <p>Login: {name}</p>
          <button onClick={store.closeLoginInfoModal} className='delete' aria-label='delete'></button>
        </div>
        <div className='message-body'>
          <form>
            <div className='field'>
              <label className='label'>Website</label>
              <div className='control'>
                <input disabled={true} name='name' className='input' type='text' value={name} placeholder='Website name'/>
              </div>
            </div>

            <div className='field'>
              <label className='label'>Username</label>
              <div className='control'>
                <input disabled={true} name='username' className='input' type='text' value={username} placeholder='Username'/>
              </div>
            </div>

            <div className='field'>
              <label className='label'>Password</label>
              <div className='control'>
                <input disabled={true} name='password' className='input' type='text' value={password} placeholder='Password'/>
              </div>
            </div>

            <div className='field'>
              <div className='control'>
                <button type='submit' className='button is-primary'>Edit</button>
              </div>
            </div>
          </form>
        </div>
    </article>
    </div>
  </div>
});

export default LoginModal;
