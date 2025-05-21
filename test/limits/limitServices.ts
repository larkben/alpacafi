import {
    ALPH_TOKEN_ID,
    Address,
    DUST_AMOUNT,
    HexString,
    NULL_CONTRACT_ADDRESS,
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
import { defaultSigner, getContractCreated } from '../p2p/helperFunctions'
import { ForLoop, ForLoopInstance, TestCycle } from '../../artifacts/ts'
  
web3.setCurrentNodeProvider('http://127.0.0.1:22973', undefined, fetch)
  
const nodeProvider = new NodeProvider('http://127.0.0.1:22973') 

// auction template contract
export async function loopTemplate() {
    return await ForLoop.deploy(defaultSigner, {
      initialFields: {
          targetValue: 40n                          // for starters
      },
    });
}

export async function TestCycleService (
    signer: SignerProvider,
    contract: ForLoopInstance
) {
    return await TestCycle.execute(signer, {
      initialFields: {
          contract: contract.contractId
      },    
      attoAlphAmount: DUST_AMOUNT * 2n          // n for the bigInt
    });
}
