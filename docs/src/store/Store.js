import { action, computed, extendObservable } from 'mobx';
import contract from '../BlockchainPassword.json';

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
        loginNames: []
      },
      newLogin: {
        name: '',
        password: '',
        username: ''
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

    this.getLogins(address);
  }

  addNewLogin() {
    console.log('Adding new login');
    const contractToAddNewLogin = new this.web3.eth.Contract(contract.abi, this.vault.address);
    contractToAddNewLogin.methods.addLogin(
      this.newLogin.name,
      this.newLogin.username,
      this.newLogin.password
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

  getLogins(address) {
    const vault = new this.web3.eth.Contract(contract.abi, address);
    vault.methods.getLogins().call().then(action((result) => {
      this.vault.loginNames = result.split(',');
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
