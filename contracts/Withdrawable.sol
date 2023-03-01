// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Ownable.sol";

abstract contract Withdrawable is Ownable {
    event Withdraw(address recipient, uint amount);

    function balance() external view returns(uint) {
        return address(this).balance;
    }

    function withdraw() external onlyOwner {
        emit Withdraw(owner, address(this).balance);
 
        payable(owner).transfer(address(this).balance);
    }
}