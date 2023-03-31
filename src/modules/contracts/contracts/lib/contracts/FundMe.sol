// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";


contract FundMe is ERC1155, Ownable, Pausable {
    // State variables
    address[] private s_funders;
    mapping (address => uint256) public s_balances;
    uint256 private _nextMintId;

    constructor() ERC1155("FundMe contract") {
    }

    // Events
    event Funded(address indexed from, uint256 amount, uint256 token);
    event Withdrawn(address indexed beneficiary, uint256 amount);

    // Functions
    function fund() public payable {
        require(msg.value > 0, "Cannot deposit 0 or negative value");

        s_balances[msg.sender] += msg.value;
        s_funders.push(msg.sender);

        _mint(msg.sender, _nextMintId, msg.value, "");
        emit Funded(msg.sender, msg.value, _nextMintId);

        _nextMintId++;
    }

    function withdraw(uint256 amount) public onlyOwner {
        uint256 contractBalance = address(this).balance;
        uint256 actualAmount = amount * 10 ** 18;
        require(contractBalance >= actualAmount, "Contract balance must be higher than withdrawal amount");

        (bool success, ) = payable(owner()).call{value: actualAmount}("");
        require(success, "Send failed!");

        emit Withdrawn(msg.sender, actualAmount);
    }

    // Explainer from: https://solidity-by-example.org/fallback/
    // Ether is sent to contract
    //      is msg.data empty?
    //          /   \
    //         yes  no
    //         /     \
    //    receive()?  fallback()
    //     /   \
    //   yes   no
    //  /        \
    //receive()  fallback()

    fallback() external payable {
        fund();
    }

    receive() external payable {
        fund();
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
    internal
    whenNotPaused
    override
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
