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

  return store.addNewLogin().then(() => {
    expect(store.newLogin.name).toBe('');
    expect(store.newLogin.username).toBe('');
    expect(store.newLogin.password).toBe('');
  });
});

it('loads a login', () => {
  const stub = {
    getLogin: () => Promise.resolve({ username: 'u', name: 'n', password: 'p' })
  }

  const store = new Store();
  store.vaultHelper = stub;

  expect(store.viewLoginDialog.open).toBe(false);

  return store.getLogin(1).then((login) => {
    expect(store.viewLoginDialog.open).toBe(true);
    expect(store.viewLoginDialog.username).toBe('u');
    expect(store.viewLoginDialog.name).toBe('n');
    expect(store.viewLoginDialog.password).toBe('p');
  });
});
