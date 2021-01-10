// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol";

contract DummyErc20 is ERC20PresetMinterPauser {
    constructor() public ERC20PresetMinterPauser("token", "TOK") {}
}
