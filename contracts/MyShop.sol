// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Ownable.sol";
import "./Withdrawable.sol";

contract MyShop is Ownable, Withdrawable {
    constructor() Ownable (msg.sender) {
    }
 
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
