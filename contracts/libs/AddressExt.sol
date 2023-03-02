// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library AddressExt {
    function notZeroAccount(address _address) public pure returns(bool) {
        return _address != address(0);
    }
}
