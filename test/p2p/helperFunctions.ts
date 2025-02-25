import { PrivateKeyWallet } from '@alephium/web3-wallet'
import { testPrivateKey } from '@alephium/web3-test'
import { off } from 'process'
import { ValByteVec } from '@alephium/web3/dist/src/api/api-alephium'
import { MinimalContractDeposit, token } from '@alephium/web3/dist/src/codec'
import { ALPH_TOKEN_ID, Address, DUST_AMOUNT, ONE_ALPH, SignerProvider, groupOfAddress, web3, waitForTxConfirmation, NodeProvider, contractIdFromAddress } from '@alephium/web3'
import { randomBytes } from 'crypto'
import * as base58 from 'bs58'
  
web3.setCurrentNodeProvider('http://127.0.0.1:22973', undefined, fetch)
export const ZERO_ADDRESS = 'tgx7VNFoP9DJiFMFgXXtafQZkUvyEdDHT9ryamHJYrjq'
export const defaultSigner = new PrivateKeyWallet({ privateKey: testPrivateKey })
  
const nodeProvider = new NodeProvider('http://127.0.0.1:22973')

// get the contract created
export async function getContractCreated(tx: string): Promise<string>{
    let details = await nodeProvider.transactions.getTransactionsDetailsTxid(tx)
    //console.log(details)

    const u8int = contractIdFromAddress(details.generatedOutputs[0].address)
    const hexString = Array.from(u8int, byte => byte.toString(16).padStart(2, '0')).join('');

    return hexString
}
  
export function randomP2PKHAddress(groupIndex = 0): string {
    const prefix = new Uint8Array([0x00]);
    const randomData = new Uint8Array(randomBytes(32));
    const bytes = new Uint8Array(prefix.length + randomData.length);

    bytes.set(prefix, 0);
    bytes.set(randomData, prefix.length);

    const address = base58.encode(bytes);
    if (groupOfAddress(address) === groupIndex) {
        return address;
    }
    return randomP2PKHAddress(groupIndex);
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