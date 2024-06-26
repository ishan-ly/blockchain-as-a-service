// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC1155Token.sol";

contract ERC1155Factory {
    ERC1155Token[] public deployedTokens;

    event ERC1155Created(address tokenAddress);

    function createERC1155(string memory name, string memory symbol) public {
        ERC1155Token newToken = new ERC1155Token(msg.sender, name, symbol);
        deployedTokens.push(newToken);
        emit ERC1155Created(address(newToken));
    }

    function getDeployedTokens() public view returns (ERC1155Token[] memory) {
        return deployedTokens;
    }
}
