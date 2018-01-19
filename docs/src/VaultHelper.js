/* global web3 */
import Web3 from 'web3';
import contract from './BlockchainPassword.json';
import CryptoJS from 'crypto-js';

function encrypt(key, input) {
  return CryptoJS.AES.encrypt(input, key).toString();
}

function decrypt(key, input) {
  return CryptoJS.AES.decrypt(input, key).toString(CryptoJS.enc.Utf8);
}

function getHashedPassphrase(passphrase, salt) {
  return CryptoJS.PBKDF2(passphrase, salt, { keySize: 4096/32, iterations: 128 }).toString();
}

export default class VaultHelper {
  constructor() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 === 'undefined') {
      this.web3Enabled = false;
      return;
    }

    this.web3 = new Web3(web3.currentProvider);
    this.web3Enabled = true;
  }

  // Gets the current active account/wallet.
  getAccountAddress() {
    return this.web3.eth.getAccounts().then((accounts) => {
      return accounts[0];
    });
  }

  // Check if passphrase matches vault.
  async unlockVault(passphrase) {
    const accountAddress = await this.getAccountAddress();
    const hashedPassphrase = getHashedPassphrase(passphrase, accountAddress);
    const vault = new this.web3.eth.Contract(contract.abi, this.address);

    return vault.methods.getTestPhrase().call().then((encryptedTestPhrase) => {
      return new Promise((resolve, reject) => {
        const decryptedTestPhrase = decrypt(hashedPassphrase, encryptedTestPhrase);
        if (decryptedTestPhrase === accountAddress) {
          this.hashedPassphrase = hashedPassphrase;
          resolve();
        } else {
          reject();
        }
      })
    });
  }

  // Gets and decrypts login details.
  getLogin(id) {
    if (!this.hashedPassphrase) {
      return Promise.reject(new Error('Vault is still locked'));
    }

    const vault = new this.web3.eth.Contract(contract.abi, this.address);
    return vault.methods.getLogin(id).call()
      .then((result) => {
        return {
          name: decrypt(this.hashedPassphrase, result.name),
          username: decrypt(this.hashedPassphrase, result.username),
          password: decrypt(this.hashedPassphrase, result.password)
        };
      });
  }

  // Gets list of login names associated with current unlocked vault, used to build vault index.
  async getLogins() {
    if (!this.hashedPassphrase) {
      return Promise.reject(new Error('Vault is still locked'));
    }

    const vault = new this.web3.eth.Contract(contract.abi, this.address);
    return vault.methods.getLogins().call().then((result) => {
      return result.split(',').map((loginName) => {
        return decrypt(this.hashedPassphrase, loginName);
      });
    });
  }

  // Add new login to an existing vault.
  async addNewLogin(name, username, password) {
    if (!this.hashedPassphrase) {
      return Promise.reject(new Error('Vault is still locked'));
    }

    const vault = new this.web3.eth.Contract(contract.abi, this.address);
    const account = await this.getAccountAddress();
    const encryptedLogin = [
      encrypt(this.hashedPassphrase, name),
      encrypt(this.hashedPassphrase, username),
      encrypt(this.hashedPassphrase, password)
    ];

    return vault.methods.addLogin(...encryptedLogin)
      .send({ from: account })
      .on('error', (error) => { console.error('Error', error) })
      .on('transactionHash', (hash) => { console.info('Transaction hash', hash) })
      .on('receipt', (receipt) => {
        console.info('New login receipt', receipt)
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        console.info('Confirmation', confirmationNumber, receipt);
      });
  }

  async deployNewVault(passphrase) {
    const vault = new this.web3.eth.Contract(contract.abi);
    const account = await this.getAccountAddress();
    const hashedPassphrase = getHashedPassphrase(passphrase, account);
    const encryptedTestPhrase = encrypt(hashedPassphrase, account);

    return vault.deploy({ data: contract.bytecode, arguments: [encryptedTestPhrase] })
      .send({ from: account })
      .on('error', (error) => { console.error('Error', error) })
      .on('transactionHash', (hash) => { console.info('Transaction hash', hash) })
      .on('receipt', (receipt) => {
        console.info('New contract receipt', receipt.contractAddress)
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        console.info('Confirmation', confirmationNumber, receipt);
      })
      .then((newContractInstance) => {
        const address = newContractInstance.options.address;
        this.address = address;
        this.hashedPassphrase = hashedPassphrase;
        return address;
      });
  }
}
