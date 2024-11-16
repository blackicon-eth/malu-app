import { testHelpers, createVlayerClient } from "@vlayer/sdk";
import { ContractSpec } from "@vlayer/sdk";
import SimpleProver from "../out/SimpleProver.sol/SimpleProver.json";
import SimpleVerifier from "../out/SimpleVerifier.sol/SimpleVerifier.json";
import { foundry, base } from "viem/chains";
import { Abi, isAddress } from "viem";

// Convert the contract artifact to the expected ContractSpec format
const convertToContractSpec = (artifact: any): ContractSpec => ({
  abi: artifact.abi,
  bytecode: artifact.bytecode.object,
});

const john = "0xd0ab651368836f98dc35f2a6989a3636c8eb1157" as `0x${string}`;
const tokenId = BigInt(4359);  


const blockNumber = 22472028; // hardcoded 
const rewardNFT = "0xEe7D1B184be8185Adc7052635329152a4d0cdEfA" as `0x${string}`;

const prover = await testHelpers.deployContract(
  convertToContractSpec(SimpleProver),
  []
);

const verifier = await testHelpers.deployContract(
  convertToContractSpec(SimpleVerifier),
  []
);

console.log("Proving...");

const vlayer = createVlayerClient();
const { hash } = await vlayer.prove({
  address: prover,
  proverAbi: SimpleProver.abi as Abi,
  functionName: "elegible",
  args: [],
  chainId: foundry.id
});

const result = await vlayer.waitForProvingResult({ hash });
console.log("hash is: ", hash);

const [proof, owner, balance] = result;

console.log("Proof result:");
console.log(result);

// const receipt = await testHelpers.writeContract(
//   verifier,
//   SimpleVerifier.abi as Abi,
//   "claimWhale",
//   [proof, owner, balance],
// );

// console.log(`Verification result: ${receipt.status}`);