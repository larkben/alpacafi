import {
    ALPH_TOKEN_ID,
    Address,
    DUST_AMOUNT,
    HexString,
    MINIMAL_CONTRACT_DEPOSIT,
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
import { defaultSigner } from './helperFunctions'
import { AddPair, TestOracle, TestOracleInstance, Token, UpdateTime, UpdateValue } from '../../artifacts/ts'
  
web3.setCurrentNodeProvider('http://127.0.0.1:22973', undefined, fetch)
  
const nodeProvider = new NodeProvider('http://127.0.0.1:22973') 

 // token contract
export async function deployTestOracle() {
    return await TestOracle.deploy(defaultSigner, {
      initialFields: {
        currentTime: 0n
      },
    });
}

export async function EditOracleTime(
    signer: SignerProvider,
    oracle: TestOracleInstance,
    time: number
) {
    return await UpdateTime.execute(signer, {
      initialFields: {
          oracle: oracle.contractId,
          time: BigInt(time)
      },
      attoAlphAmount: DUST_AMOUNT
    });
}

export async function AddPairService (
  signer: SignerProvider,
  oracle: TestOracleInstance,
  pair: string
) {
  return await AddPair.execute(signer, {
    initialFields: {
      oracle: oracle.contractId,
      pair: stringToHex(pair)
    },
    attoAlphAmount: DUST_AMOUNT
  });
}

export async function UpdateValueService (
  signer: SignerProvider,
  oracle: TestOracleInstance,
  pair: string,
  value: bigint
) {
  return await UpdateValue.execute(signer, {
    initialFields: {
      oracle: oracle.contractId,
      pair: stringToHex(pair),
      value: value
    },
    attoAlphAmount: DUST_AMOUNT + MINIMAL_CONTRACT_DEPOSIT
  });
}