import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';

const LoginModal = observer(({store}) => {
  const onChange = (event) => {
    action(() => {
      store.viewLoginDialog[event.target.name] = event.target.value;
    })();
  };
  const onSubmit = (event) => {
    event.preventDefault();
    store.saveLoginInfoModal();
  };
  const onCancel = (event) => {
    event.preventDefault();
    store.closeLoginInfoModal();
  };
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
          <form onSubmit={onSubmit}>
            <div className='field'>
              <label className='label'>Website</label>
              <div className='control'>
                <input onChange={onChange} name='name' className='input' type='text' value={name} placeholder='Website name'/>
              </div>
            </div>

            <div className='field'>
              <label className='label'>Username</label>
              <div className='control'>
                <input onChange={onChange} name='username' className='input' type='text' value={username} placeholder='Username'/>
              </div>
            </div>

            <div className='field'>
              <label className='label'>Password</label>
              <div className='control'>
                <input onChange={onChange} name='password' className='input' type='text' value={password} placeholder='Password'/>
              </div>
            </div>

            <div className='field'>
              <div className='control'>
                <button type='submit' className='button is-primary'>Save changes</button>
                <button onClick={onCancel} className='button'>Cancel</button>
              </div>
            </div>
          </form>
        </div>
    </article>
    </div>
  </div>
});

export default LoginModal;
