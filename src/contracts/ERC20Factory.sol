// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC20Token.sol";

contract ERC20Factory {
    event ContractDeployed(address tokenAddress);

    function createTokenERC20(string memory name, string memory symbol, uint256 initialSupply, uint8 decimals) external {
        ERC20Token newToken = new ERC20Token(name, symbol, initialSupply, decimals, msg.sender);
        emit ContractDeployed(address(newToken));
    }

    function createTokenERC20Ownable(string memory name, string memory symbol, uint256 initialSupply, uint8 decimals) external {
        // ERC20Token newToken = new ERC20Token(name, symbol, initialSupply);
        // emit ContractDeployed(address(newToken));
    }

    function createTokenERC20Upgradable(string memory name, string memory symbol, uint256 initialSupply, uint8 decimals) external {
        // ERC20Token newToken = new ERC20Token(name, symbol, initialSupply);
        // emit ContractDeployed(address(newToken));
    }
}
