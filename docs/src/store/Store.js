import { action, computed, extendObservable } from 'mobx';
import contract from '../BlockchainPassword.json';

export default class Store {
  constructor(web3) {
    this.web3 = web3;

    extendObservable(this, {
      web3Enabled: false,
      accounts: [],
      view: 'Home',
      currentAddress: null,
      currentPath: computed(() => {
        switch(this.view) {
          case 'Vault': return `/vault/${this.currentAddress}`
          default: return '/'
        }
      })
    });

    this.deployNewVault = this.deployNewVault.bind(this);
    this.showVault = this.showVault.bind(this);
    this.showHome = this.showHome.bind(this);
  }

  showHome() {
    action(() => {
      this.view = 'Home'
    })();
  }

  showVault(address) {
    action(() => {
      this.view = 'Vault';
      this.currentAddress = address;
    })();
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
