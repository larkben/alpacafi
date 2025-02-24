import {
    ALPH_TOKEN_ID,
    Address,
    DUST_AMOUNT,
    HexString,
    NodeProvider,
    ONE_ALPH,
    SignerProvider,
    addressVal,
    binToHex,
    byteVecVal,
    encodePrimitiveValues,
    groupOfAddress,
    hexToBinUnsafe,
    prettifyAttoAlphAmount,
    stringToHex,
    u256Val,
    web3
} from '@alephium/web3'
import { randomBytes } from 'crypto'
import * as base58 from 'bs58'
import * as blake from 'blakejs'
import { PrivateKeyWallet } from '@alephium/web3-wallet'
import { testPrivateKey } from '@alephium/web3-test'
import { off } from 'process'
import { ValByteVec } from '@alephium/web3/dist/src/api/api-alephium'
import { MinimalContractDeposit, token } from '@alephium/web3/dist/src/codec'
  
web3.setCurrentNodeProvider('http://127.0.0.1:22973', undefined, fetch)
export const ZERO_ADDRESS = 'tgx7VNFoP9DJiFMFgXXtafQZkUvyEdDHT9ryamHJYrjq'
export const defaultSigner = new PrivateKeyWallet({ privateKey: testPrivateKey })
  
const nodeProvider = new NodeProvider('http://127.0.0.1:22973') 

export function randomP2PKHAddress(groupIndex = 0): string {
    const prefix = Buffer.from([0x00])
    const bytes = Buffer.concat([prefix, randomBytes(32)])
    const address = base58.encode(bytes)
    if (groupOfAddress(address) === groupIndex) {
      return address
    }
    return randomP2PKHAddress(groupIndex)
}
  
export function alph(amount: bigint | number): bigint {
    return BigInt(amount) * ONE_ALPH
}
  
export async function getALPHBalance(address: Address): Promise<String> {
    const balances = await nodeProvider.addresses.getAddressesAddressBalance(address)
    return balances.balanceHint
}
  
export async function getPreciseALPHBalance(address: Address): Promise<String> {
    const balances = await nodeProvider.addresses.getAddressesAddressBalance(address)
    return balances.balance
}