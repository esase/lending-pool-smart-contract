// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract LendingPool {
    mapping(address => mapping(address => uint256)) private lendings;
    mapping(address => uint256) private totalLendingAmount;

    event Lend(address indexed _borrower, address indexed _lender, uint256 _amount);
    event LendingClosed(address indexed _lender, address indexed _borrower, uint256 _amount);

    function totalLendingAmountOf(address account) external view returns (uint256) {
        return totalLendingAmount[account];
    }

    function lendFrom(address lender, uint256 amount) external {
        require(amount > 0, "You can lend amount which is greater then 0");
        require(msg.sender != lender, "You cannot lend to yourself");
        require(lendings[msg.sender][lender] == 0, "You already lent from this account");

        totalLendingAmount[msg.sender] += amount;
        lendings[msg.sender][lender] = amount;

        emit Lend(msg.sender, lender, amount);
    }

    function closeLendingFrom(address borrower) external {
        require(lendings[borrower][msg.sender] > 0, "There is no debt");

        uint256 amount = lendings[borrower][msg.sender];

        totalLendingAmount[borrower] -= amount;
        lendings[borrower][msg.sender] = 0;

        emit LendingClosed(msg.sender, borrower, amount);
    }
}
