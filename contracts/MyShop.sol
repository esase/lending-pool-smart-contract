// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract MyShop {
    struct Service {
        string service;
        uint amount;
    }

    address public owner;
    mapping(address => Service[]) public payments;

    event Paying(address sender, uint amount);
    event Witdraw(address recipient, uint amount);

    constructor() {
        owner = msg.sender;
    }

    function payForService(string memory service) external payable {
        payments[msg.sender].push(Service(service, msg.value));

        emit Paying(msg.sender, msg.value);
    }

    function withdraw() external {
        require(owner == msg.sender, "Only contract owner can withdraw");

        emit Paying(owner, address(this).balance);
 
        payable(owner).transfer(address(this).balance);
    }
}
