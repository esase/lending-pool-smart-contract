// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Ownable.sol";
import "./Withdrawable.sol";
import "./libs/AddressExt.sol";

contract MyShop is Ownable, Withdrawable {
    using AddressExt for address;

    constructor() Ownable (msg.sender) {
    }
 
    struct Service {
        string service;
        address recipient;
        uint amount;
    }

    mapping(address => Service[]) public payments;

    event Paying(address sender, address recipient, string service, uint amount);

    function payForService(string memory service, address recipient) external payable {
        require(recipient.notZeroAccount() == true, "Zero account is not acceptable");

        payments[msg.sender].push(Service(service, recipient, msg.value));

        emit Paying(msg.sender, recipient, service, msg.value);
    }
}
