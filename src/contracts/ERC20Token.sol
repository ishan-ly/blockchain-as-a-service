// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract ERC20Token is ERC20, Ownable {

    uint8 _decimal ;

    constructor(string memory name, string memory symbol, uint256 initialSupply, uint8 decimal, address initialOwner) 
        ERC20(name, symbol)
        Ownable(initialOwner)

    {
        _decimal = decimal;
        _mint(initialOwner, initialSupply * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function decimals() public view override returns(uint8) {
        return _decimal;
    }
}
