export const baseScoreAddress = "0x3879f20ad2643eb5fba4306b214b1e50933d5301" as const;

export const baseScoreAbi = [
  {
    inputs: [{ name: "amount", type: "uint256" }],
    name: "earn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getScore",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
