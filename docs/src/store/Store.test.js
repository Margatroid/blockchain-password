import Store from './Store';

it('clears the new login form after success', () => {
  const vaultStubs = {
    addNewLogin: () => Promise.resolve(),
    getLogins: () => Promise.resolve()
  }

  const store = new Store();
  store.vaultHelper = vaultStubs;
  store.newLogin = {
    name: 'warm',
    username: 'and',
    password: 'cozy'
  }

  store.addNewLogin().then(() => {
    expect(store.newLogin.name).toBe('');
    expect(store.newLogin.username).toBe('');
    expect(store.newLogin.password).toBe('');
  });
});
