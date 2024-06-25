// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721Token.sol";

contract ERC721Factory {
    ERC721Token[] public deployedTokens;

    event ERC721Created(address tokenAddress);

    function createERC721(string memory name, string memory symbol) public {
        ERC721Token newToken = new ERC721Token(name, symbol, msg.sender);
        deployedTokens.push(newToken);
        emit ERC721Created(address(newToken));
    }

    function createERC721Ownable(string memory name, string memory symbol) public {
        // ERC721Token newToken = new ERC721Token(name, symbol, msg.sender);
        // deployedTokens.push(newToken);
        // emit ERC721Created(address(newToken));
    }

    function createERC721Upgradable(string memory name, string memory symbol) public {
        // ERC721Token newToken = new ERC721Token(name, symbol, msg.sender);
        // deployedTokens.push(newToken);
        // emit ERC721Created(address(newToken));
    }

    function getDeployedTokens() public view returns (ERC721Token[] memory) {
        return deployedTokens;
    }
}
