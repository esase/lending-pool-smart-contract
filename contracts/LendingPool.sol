// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract LendingPool {
    mapping(address => mapping(address => uint)) lendings;
    mapping(address => uint) totalLendingAmount;

    event Lend(
        address indexed _borrower,
        address indexed _lender,
        uint _amount
    );
    event LendingAccepted(
        address indexed _lender,
        address indexed _borrower,
        uint _amount
    );

    modifier withCorrectLendingParams(address account, uint amount) {
        require(amount > 0, "You can lend amount which is greater then 0");
        require(
            msg.sender != account,
            "You cannot lend or close lending to yourself"
        );
        _;
    }

    function lendFrom(
        address lender,
        uint amount
    ) external withCorrectLendingParams(lender, amount) {
        totalLendingAmount[msg.sender] += amount;
        lendings[msg.sender][lender] += amount;

        emit Lend(msg.sender, lender, amount);
    }

    function acceptLendingFrom(
        address borrower,
        uint amount
    ) external withCorrectLendingParams(borrower, amount) {
        require(lendings[borrower][msg.sender] > 0, "There is no debt");

        totalLendingAmount[borrower] -= amount;
        lendings[borrower][msg.sender] -= amount;

        emit LendingAccepted(msg.sender, borrower, amount);
    }

    function totalLendingAmountOf(
        address account
    ) external view returns (uint) {
        return totalLendingAmount[account];
    }
}
