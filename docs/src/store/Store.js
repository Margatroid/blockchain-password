import { action, computed, extendObservable } from 'mobx';
import contract from '../BlockchainPassword.json';

export default class Store {
  constructor(web3) {
    this.web3 = web3;

    extendObservable(this, {
      web3Enabled: false,
      accounts: [],
      view: 'Home',
      currentVault: {
        owner: null,
        address: null
      },
      currentPath: computed(() => {
        switch(this.view) {
          case 'Vault': return `/vault/${this.currentVault.address}`
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
    const vault = new this.web3.eth.Contract(contract.abi, address);
    vault.methods.owner().call().then(
      action((owner) => {
        this.view = 'Vault';
        this.currentVault.address = address;
        this.currentVault.owner = owner;
      })
    );
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
