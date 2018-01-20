pragma solidity ^0.4.17;

contract BlockchainPassword {
  address private owner;
  string private testPhrase;

  struct Login {
    string name;
    string username;
    string password;
  }

  mapping (uint => Login) private logins;
  uint private numLogins;

  // Constructor
  function BlockchainPassword(string encryptedTestPhrase) public {
    owner = msg.sender;
    numLogins = 0;
    testPhrase = encryptedTestPhrase;
  }

  function addLogin(string name, string username, string password) public returns (bool success) {
    if (msg.sender != owner) return;
    logins[numLogins].name = name;
    logins[numLogins].username = username;
    logins[numLogins].password = password;
    numLogins++;
    return true;
  }

  function setLogin(uint index, string name, string username, string password) public returns (bool success) {
    if (msg.sender != owner) return;

    Login storage login = logins[index];

    if (keccak256(name) != keccak256(login.name)) {
      login.name = name;
    }

    if (keccak256(username) != keccak256(login.username)) {
      login.username = username;
    }

    if (keccak256(password) != keccak256(login.password)) {
      login.password = password;
    }

    return true;
  }

  function getLogin(uint id) public view returns (string name, string username, string password) {
    name = logins[id].name;
    username = logins[id].username;
    password = logins[id].password;
  }

  function getLogins() public view returns (string allLogins) {
    if (numLogins == 0) return '';

    uint totalLength = 0;
    for (uint i=0; i < numLogins; i++) {
      totalLength = totalLength + bytes(logins[i].name).length + 1;
    }

    bytes memory result = bytes(new string(totalLength));
    uint counter = 0;
    for (i=0; i < numLogins; i++) {
      bytes memory name = bytes(logins[i].name);
      for (uint x=0; x < name.length; x++) {
        result[counter] = name[x];
        counter++;
      }

      if (i != (numLogins - 1)) {
        result[counter] = byte(',');
        counter++;
      }
    }

    return string(result);
  }

  function getTestPhrase() public view returns (string phrase) {
    return testPhrase;
  }

  function getOwner() public view returns (address ownerAddress) {
    return owner;
  }

  function kill() public {
    if (msg.sender == owner) selfdestruct(owner);
  }
}

