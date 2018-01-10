import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';

const NewLogin = observer(({store}) => {
  const onChange = (event) => {
    action(() => {
      store.newLogin[event.target.name] = event.target.value;
    })();
  };

  const onSubmit = (event) => {
    event.preventDefault();
    store.addNewLogin();
  };

  const {name, username, password} = store.newLogin;

  return <div className='card'>
    <header className='card-header'>
      <p className='card-header-title'>
        Add new login
      </p>
    </header>

    <div className='card-content'>
      <div className='content'>
        <form onSubmit={onSubmit}>
          <div className='field'>
            <label className='label'>Website</label>
            <div className='control'>
              <input name='name' onChange={onChange} className='input' type='text' value={name} placeholder='Website name'/>
            </div>
          </div>

          <div className='field'>
            <label className='label'>Username</label>
            <div className='control'>
              <input name='username' onChange={onChange} className='input' type='text' value={username} placeholder='Username'/>
            </div>
          </div>

          <div className='field'>
            <label className='label'>Password</label>
            <div className='control'>
              <input name='password' onChange={onChange} className='input' type='text' value={password} placeholder='Password'/>
            </div>
          </div>

          <div className='field'>
            <div className='control'>
              <button type='submit' className='button is-primary'>Add</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
});

export default NewLogin;
