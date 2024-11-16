// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Prover} from "vlayer-0.1.0/Prover.sol";
import {IERC721} from "openzeppelin-contracts/token/ERC721/ERC721.sol";

contract SimpleProver is Prover {
    IERC721 immutable token;
    uint256 immutable blockNo;

    constructor() {
        token = IERC721(0x139608ABeE12Ff39FEDae39C493B571A25995E10);
    }   

    function elegible() public returns (Proof memory, address) {
        setChain(8453, 22475120);
        address tokenOwner = token.ownerOf(4359);
 

        return (proof(), tokenOwner);
    }
}
