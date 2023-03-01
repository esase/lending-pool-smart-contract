// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Ownable {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(owner == msg.sender, "Only owner can perform the action");
        _;
    }
}

contract Withdrawable is Ownable {
    event Withdraw(address recipient, uint amount);

    function balance() external view returns(uint) {
        return address(this).balance;
    }

    function withdraw() external onlyOwner {
        emit Withdraw(owner, address(this).balance);
 
        payable(owner).transfer(address(this).balance);
    }
}

contract MyShop is Ownable, Withdrawable {
    struct Service {
        string service;
        uint amount;
    }

    mapping(address => Service[]) public payments;

    event Paying(address sender, uint amount);

    function payForService(string memory service) external payable {
        payments[msg.sender].push(Service(service, msg.value));

        emit Paying(msg.sender, msg.value);
    }
}
