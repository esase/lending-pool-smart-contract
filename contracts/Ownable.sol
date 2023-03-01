// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

abstract contract Ownable {
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    modifier onlyOwner {
        require(owner == msg.sender, "Only owner can perform the action");
        _;
    }
}