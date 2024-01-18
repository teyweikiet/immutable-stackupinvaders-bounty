/**
 * endpoint: /.netlify/functions/mint
 */

import { getDefaultProvider, Wallet, utils, Contract } from 'ethers';

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const CONTRACT_ABI = [
  'function grantRole(bytes32 role, address account)',
  'function MINTER_ROLE() view returns (bytes32)',
  'function mint(address to, uint256 tokenId)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function hasRole(bytes32 role, address account) view returns (bool)',
  'function totalSupply() view returns (uint256)'
]

const grantMinterRole = async (recipientAddress) => {
  try {
    const provider = getDefaultProvider('https://rpc.testnet.immutable.com')
    const adminWallet = new Wallet(PRIVATE_KEY, provider)
    const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, adminWallet)

    const minterRole = await contract.MINTER_ROLE()

    const currentGasPrice = await provider.getGasPrice()
    const adjustedGasPrice = currentGasPrice.add(utils.parseUnits('10', 'gwei'))
    const tx = await contract.grantRole(minterRole, recipientAddress, {
      gasPrice: adjustedGasPrice
    })

    return utils.serializeTransaction(tx)
  } catch (e) {
    console.error('Error in granting minter role:', e)
    throw e
  }
}

export default async (req, context) => {
  const { recipientAddress } = await req.json()
  const data = await grantMinterRole(recipientAddress)
  return Response.json({ data }, { status: 200 });
};
