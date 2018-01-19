import { action, computed, extendObservable } from 'mobx';
import VaultHelper from '../VaultHelper';

export default class Store {
  constructor() {
    extendObservable(this, {
      web3Enabled: false,
      view: 'Home',
      vault: {
        address: null,
        loginNames: [],
        locked: true
      },
      newLogin: {
        name: '',
        password: '',
        username: ''
      },
      viewLoginDialog: {
        name: '',
        username: '',
        password: '',
        show: false
      },
      unlockDialog: {
        passphrase: '',
        show: false
      },
      newVaultDialog: {
        passphrase: '',
        disableForm: computed(() => {
          return !this.newVaultDialog.passphrase.trim().length;
        })
      },
      currentPath: computed(() => {
        switch(this.view) {
          case 'Vault': return `/vault/${this.vault.address}`
          default: return '/'
        }
      })
    });

    this.deployNewVault = this.deployNewVault.bind(this);
    this.showVault = this.showVault.bind(this);
    this.showHome = this.showHome.bind(this);
    this.refreshLogins = this.refreshLogins.bind(this);
    this.addNewLogin = this.addNewLogin.bind(this);
    this.unlockVault = this.unlockVault.bind(this);
    this.closeLoginInfoModal = this.closeLoginInfoModal.bind(this);

    this.vaultHelper = new VaultHelper();
  }

  showHome() {
    action(() => {
      this.view = 'Home'
    })();
  }

  showVault(address) {
    this.vaultHelper.address = address;

    action(() => {
      this.view = 'Vault';
      this.vault.address = address;
    })();
  }

  // Add new login to an existing vault.
  addNewLogin() {
    return this.vaultHelper.addNewLogin(this.newLogin.name, this.newLogin.username, this.newLogin.password)
      .then(action(() => {
        this.newLogin.name = '';
        this.newLogin.username = '';
        this.newLogin.password = '';
      }))
      .then(() => {
        this.refreshLogins();
      });
  }

  // Opens the login info modal to see the password.
  getLogin(index) {
    return this.vaultHelper.getLogin(index)
      .then(action((login) => {
        this.viewLoginDialog = {...this.viewLoginDialog, show: true, ...login};
      }));
  }

  closeLoginInfoModal() {
    action(() => {
      this.viewLoginDialog.show = false;
    })();
  }

  // Verifies passphrase and temporarily stores hashed passphrase in vault wrapper.
  unlockVault() {
    return this.vaultHelper.unlockVault(this.unlockDialog.passphrase)
      .then(action(() => {
        // Passphrase is correct. Load vault.
        this.vault.locked = false;
      }))
      .then(() => {
        this.refreshLogins();
      })
      .catch(action(() => {
        this.unlockDialog.show = true;
      }));
  }

  // Gets list of login names associated with current unlocked vault.
  refreshLogins() {
    this.vaultHelper.getLogins().then(action((result) => {
      this.vault.loginNames = result;
    }));
  }

  deployNewVault() {
    this.vaultHelper.deployNewVault(this.newVaultDialog.passphrase)
      .then((address) => this.showVault(address))
      .then(action(() => {
        this.vault.locked = false;
      }));
  }
}
