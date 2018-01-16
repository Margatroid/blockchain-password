var BlockchainPassword = artifacts.require('BlockchainPassword');

contract('BlockchainPassword', function(accounts) {
  it('should assert true', function(done) {
    var blockchain_password = BlockchainPassword.deployed();
    assert.isTrue(true);
    done();
  });

  it ('should return 0 logins', function(done) {
    BlockchainPassword.deployed().then(function(instance) {
      blockchainPassword = instance;
    }).then(function() {
      return blockchainPassword.getLogins.call();
    }).then(function(result) {
      assert.equal(result, '');
      done();
    });
  });

  it('should store a login', function(done) {
    BlockchainPassword.deployed().then(function(instance) {
      blockchainPassword = instance;
      return blockchainPassword.addLogin.sendTransaction('login', 'username', 'pass');
    }).then(function(txHash) {
      return blockchainPassword.getLogin.call(0);
    }).then(function(result) {
      assert.equal(result[0], 'login');
      assert.equal(result[1], 'username');
      assert.equal(result[2], 'pass');
    }).then(function() {
      return blockchainPassword.getLogins.call();
    }).then(function(result) {
      assert.equal(result, 'login');
      done();
    });
  });

  it('should retrieve logins', function(done) {
    BlockchainPassword.deployed().then(function(instance) {
      blockchainPassword = instance;
      return blockchainPassword.addLogin.sendTransaction('login2', 'username', 'pass');
    }).then(function() {
      return blockchainPassword.addLogin.sendTransaction('login3', 'username2', 'pass2');
    }).then(function() {
      return blockchainPassword.getLogins.call();
    }).then(function(result) {
      assert.equal(result, 'login,login2,login3');
      done();
    });
  });

  it('should override an existing login', function(done) {
    BlockchainPassword.deployed().then(function(instance) {
      blockchainPassword = instance;
      return blockchainPassword.getLogin.call(1);
    }).then(function(result) {
      assert.equal(result[0], 'login2');
      assert.equal(result[1], 'username');
      assert.equal(result[2], 'pass');
    }).then(function() {
      return blockchainPassword.setLogin.sendTransaction(1, 'newlogin', 'newuser', 'newpass');
    }).then(function() {
      return blockchainPassword.getLogin.call(1);
    }).then(function(result) {
      assert.equal(result[0], 'newlogin');
      assert.equal(result[1], 'newuser');
      assert.equal(result[2], 'newpass');
    }).then(function() {
      return blockchainPassword.getLogins.call();
    }).then(function(result) {
      assert.equal(result, 'login,newlogin,login3');
      done();
    });
  });

  it('should retrieve the test phrase', function(done) {
    BlockchainPassword.new('helloworld').then(function(instance) {
      return instance.getTestPhrase.call();
    }).then(function(result) {
      assert.equal(result, 'helloworld');
      done();
    });
  });
});
