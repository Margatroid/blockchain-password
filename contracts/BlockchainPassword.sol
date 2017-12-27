pragma solidity ^0.4.17;

contract BlockchainPassword {
  address owner;

  struct Login {
    string name;
    string username;
    string password;
  }

  mapping (uint => Login) logins;
  uint numLogins;

  // Constructor
  function BlockchainPassword() public {
    owner = msg.sender;
    numLogins = 0;
  }

  function addLogin(string name, string username, string password) public returns (bool success) {
    logins[numLogins].name = name;
    logins[numLogins].username = username;
    logins[numLogins].password = password;
    numLogins++;
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

  function kill() public {
    if (msg.sender == owner) selfdestruct(owner);
  }
}

