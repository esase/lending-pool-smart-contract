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
        uint amount;
    }

    mapping(address => Service[]) public payments;

    event Paying(address sender, uint amount);

    function payForService(string memory service) external payable {
        require(AddressExt.notZeroAccount(msg.sender) == true, "Zero account is not acceptable");

        payments[msg.sender].push(Service(service, msg.value));

        emit Paying(msg.sender, msg.value);
    }
}
