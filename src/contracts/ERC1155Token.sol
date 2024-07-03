// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC1155Token is ERC1155, Ownable {
    uint256 public tokenCounter;
    string private _name;
    string private _symbol;

    mapping(uint256 => string) private _tokenURIs;

    constructor(address initialOwner, string memory name_, string memory symbol_) ERC1155("") Ownable(initialOwner) {
        tokenCounter = 1;
        _name = name_;
        _symbol = symbol_;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    function _setTokenURI(uint256 tokenId, string memory tokenURI) internal {
        require(bytes(_tokenURIs[tokenId]).length == 0, "URI already set");
        _tokenURIs[tokenId] = tokenURI;
    }

    function mint(address account, uint256 amount, string memory tokenURI, bytes memory data)
        public
        onlyOwner
        returns (uint256)
    {
        uint256 newItemId = tokenCounter;
        _mint(account, newItemId, amount, data);
        _setTokenURI(newItemId, tokenURI);
        tokenCounter += 1;
        return newItemId;
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    function name() public view returns(string memory) {
        return _name;
    }

    function symbol() public view returns(string memory) {
        return _symbol;
    }

    

}
