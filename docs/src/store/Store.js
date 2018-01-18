import { action, computed, extendObservable } from 'mobx';
import contract from '../BlockchainPassword.json';
import CryptoJS from 'crypto-js';
import Blockchain from '../Blockchain';

function encrypt(key, input) {
  return CryptoJS.AES.encrypt(input, key).toString();
}

function decrypt(key, input) {
  return CryptoJS.AES.decrypt(input, key).toString(CryptoJS.enc.Utf8);
}

function getEncryptedPassphrase(passphrase, salt) {
  return CryptoJS.PBKDF2(passphrase, salt, { keySize: 4096/32, iterations: 128 }).toString();
}

export default class Store {
  constructor(blockchain) {
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
        passphrase: '',
        incorrectPassphrase: false
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
    this.getLogins = this.getLogins.bind(this);
    this.addNewLogin = this.addNewLogin.bind(this);
    this.unlockVault = this.unlockVault.bind(this);

    this.blockchain = new Blockchain();
    if (this.blockchain.web3Enabled) {
      this.web3Enabled = true;
      this.load();
    }
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
    const encryptedPassphrase = getEncryptedPassphrase(this.unlockDialog.passphrase, this.accounts[0]);
    const vault = new this.web3.eth.Contract(contract.abi, this.vault.address);

    vault.methods.getTestPhrase().call().then(
      action((phrase) => {
        const decryptedTestPhrase = decrypt(encryptedPassphrase, phrase);
        this.unlockDialog.passphrase = '';
        if (decryptedTestPhrase === this.accounts[0]) {
          // Passphrase is correct.
          this.vault.encryptionKey = encryptedPassphrase;
          // @TODO: Refactor to avoid creating another promise.
          this.getLogins(this.vault.address);
        } else {
          this.unlockDialog.incorrectPassphrase = true;
        }
      })
    );
  }

  getLogins(address) {
    const vault = new this.web3.eth.Contract(contract.abi, address);
    vault.methods.getLogins().call().then(action((result) => {
      this.vault.loginNames = result.split(',').map((loginName) => decrypt(this.vault.encryptionKey, loginName))
    }));
  }

  deployNewVault() {
    const contractToDeploy = new this.web3.eth.Contract(contract.abi);
    const encryptedPassphrase = getEncryptedPassphrase(this.newVaultDialog.passphrase, this.accounts[0]);
    const encryptedTestPhrase = encrypt(encryptedPassphrase, this.accounts[0]);

    contractToDeploy.deploy({ data: contract.bytecode, arguments: [encryptedTestPhrase] })
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
        action(() => { this.newVaultDialog.passphrase = '' })();
        return null;
      });
  }

  load() {
    this.loadAccountList();
  }

  loadAccountList() {
    this.web3.eth.getAccounts(action((error, accounts) => { this.accounts = accounts }));
  }
}
