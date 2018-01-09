import React from 'react';

const NewLogin = ({store}) => {
  return <div className='card'>
    <header className='card-header'>
      <p className='card-header-title'>
        Add new login
      </p>
    </header>

    <div className='card-content'>
      <div className='content'>
        <form>
          <div className='field'>
            <label className='label'>Website</label>
            <div className='control'>
              <input className='input' type='text' placeholder='Website name'/>
            </div>
          </div>

          <div className='field'>
            <label className='label'>Username</label>
            <div className='control'>
              <input className='input' type='text' placeholder='Username'/>
            </div>
          </div>

          <div className='field'>
            <label className='label'>Password</label>
            <div className='control'>
              <input className='input' type='text' placeholder='Password'/>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
};

export default NewLogin;
