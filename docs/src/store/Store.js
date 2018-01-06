import { action, computed, extendObservable } from 'mobx';

export default class Store {
  constructor(web3) {
    this.web3 = web3;

    extendObservable(this, {
      web3Enabled: false,
      accounts: [],
      view: 'Home',
      currentPath: computed(() => {
        switch(this.view) {
          case 'Vault': return '/vault/address'
          default: return '/'
        }
      }),
      showHome: action(() => { this.view = 'Home' }),
      showVault: action(() => { this.view = 'Vault' })
    });
  }

  load() {
    if (!this.web3Enabled) return;
    this.loadAccountList();
  }

  loadAccountList() {
    this.web3.eth.getAccounts((error, accounts) => { this.accounts = accounts });
  }
}
