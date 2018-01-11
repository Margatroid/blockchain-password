import { action, computed, extendObservable } from 'mobx';
import contract from '../BlockchainPassword.json';
import CryptoJS from 'crypto-js';

function encrypt(key, input) {
  return CryptoJS.AES.encrypt(input, key).toString();
}

function decrypt(key, input) {
  return CryptoJS.AES.decrypt(input, key).toString(CryptoJS.enc.Utf8);
}

export default class Store {
  constructor(web3) {
    this.web3 = web3;

    extendObservable(this, {
      web3Enabled: false,
      accounts: [],
      view: 'Home',
      vault: {
        owner: null,
        address: null,
        loginNames: [],
        encryptionKey: null
      },
      newLogin: {
        name: '',
        password: '',
        username: ''
      },
      unlockDialog: {
        passphrase: ''
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
    this.getLogins = this.getLogins.bind(this);
    this.addNewLogin = this.addNewLogin.bind(this);
    this.unlockVault = this.unlockVault.bind(this);
  }

  showHome() {
    action(() => {
      this.view = 'Home'
    })();
  }

  showVault(address) {
    const vault = new this.web3.eth.Contract(contract.abi, address);
    vault.methods.getOwner().call().then(
      action((owner) => {
        this.view = 'Vault';
        this.vault.address = address;
        this.vault.owner = owner;
      })
    );

    if (this.vault.encryptionKey) {
      this.getLogins(address);
    }
  }

  addNewLogin() {
    const contractToAddNewLogin = new this.web3.eth.Contract(contract.abi, this.vault.address);
    contractToAddNewLogin.methods.addLogin(
      encrypt(this.vault.encryptionKey, this.newLogin.name),
      encrypt(this.vault.encryptionKey, this.newLogin.username),
      encrypt(this.vault.encryptionKey, this.newLogin.password)
    )
      .send({ from: this.accounts[0] })
      .on('error', (error) => { console.error('Error', error) })
      .on('transactionHash', (hash) => { console.info('Transaction hash', hash) })
      .on('receipt', (receipt) => {
        console.info('New login receipt', receipt)
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        console.info('Confirmation', confirmationNumber, receipt);
      });
  }

  unlockVault() {
    const salt = this.accounts[0];
    const encryptedPassphrase = CryptoJS.PBKDF2(this.unlockDialog.passphrase, salt, { keySize: 4096/32, iterations: 128 }).toString();
    action(() => {
      this.unlockDialog.passphrase = '';
      this.vault.encryptionKey = encryptedPassphrase;
      this.getLogins(this.vault.address);
    })();
  }

  getLogins(address) {
    const vault = new this.web3.eth.Contract(contract.abi, address);
    vault.methods.getLogins().call().then(action((result) => {
      this.vault.loginNames = result.split(',').map((loginName) => decrypt(this.vault.encryptionKey, loginName))
    }));
  }

  deployNewVault() {
    const contractToDeploy = new this.web3.eth.Contract(contract.abi);
    contractToDeploy.deploy({ data: contract.bytecode })
      .send({ from: this.accounts[0] })
      .on('error', (error) => { console.error('Error', error) })
      .on('transactionHash', (hash) => { console.info('Transaction hash', hash) })
      .on('receipt', (receipt) => {
        console.info('New contract receipt', receipt.contractAddress)
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        console.info('Confirmation', confirmationNumber, receipt);
      })
      .then((newContractInstance) => {
        const newContractAddress = newContractInstance.options.address;
        console.info('New contract address', newContractAddress);
        this.showVault(newContractAddress);
        return null;
      });
  }

  load() {
    if (!this.web3Enabled) return;
    this.loadAccountList();
  }

  loadAccountList() {
    this.web3.eth.getAccounts(action((error, accounts) => { this.accounts = accounts }));
  }
}
