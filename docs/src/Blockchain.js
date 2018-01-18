/* global web3 */
import Web3 from 'web3';

// Wrapper for web3.
export default class Blockchain {
  constructor() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      this.web3 = new Web3(web3.currentProvider);
    } else {
      this.web3Enabled = false;
    }
  }
}
