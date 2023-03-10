// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


import "./Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// https://ethereum.org/en/developers/docs/standards/tokens/erc-20/

contract MyErc20Token is ERC20, Ownable {
    constructor(string memory name, string memory symbol, uint initialSupply) ERC20(name, symbol) Ownable (msg.sender) {
        _mint(owner, initialSupply);
    }
}
