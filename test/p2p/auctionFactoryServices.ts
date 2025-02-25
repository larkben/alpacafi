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
import { defaultSigner } from './helperFunctions'
import { AcceptLoan, AddCollateral, Auction, AuctionFactoryInstance, CancelLoan, CreateLoan, ForfeitLoan, LiquidationLoan, Loan, LoanFactory, LoanFactoryInstance, LoanInstance, PayLoan, RemoveCollateral, TestOracleInstance, TokenMapping, WithdrawLoanFactoryFees } from '../../artifacts/ts'
  
web3.setCurrentNodeProvider('http://127.0.0.1:22973', undefined, fetch)
  
const nodeProvider = new NodeProvider('http://127.0.0.1:22973') 

// auction template contract
export async function deployAuctionTemplate() {
    return await Auction.deploy(defaultSigner, {
      initialFields: {
          parentContract: defaultSigner.account.address,
          tokenRequested: '',
          tokenAmount: 0n,
          collateralToken: '',
          collateralAmount: 0n,
          fee: 0n,
          loaner: defaultSigner.account.address,
          highestBidder: defaultSigner.account.address,
          timeToEnd: 0n
      },
    });
}

// auction factory template
/*
export async function deployLoanFactory(loanTemplate: LoanInstance, auctionHouse: AuctionFactoryInstance, oracle: TestOracleInstance) {
    return await LoanFactory.deploy(defaultSigner, {
      initialFields: {
          admin: defaultSigner.account.address,
          loanTemplate: loanTemplate.contractId,
          auctionHouse: auctionHouse.contractId,
          activeLoans: 0n,
          rate: 300n,                               // p2p lending fee
          oracle: oracle.address,
          alpaca: oracle.address
      },
    });
}
*/

// loan factory functions

/*
export async function CreateLoanService (
    signer: SignerProvider,
    loanFactory: LoanFactoryInstance,
    tokenRequested: string,
    tokenAmount: bigint,
    collateralToken: string,
    collateralAmount: bigint,
    interest: bigint,
    duration: bigint,
    canLiquidate: boolean
) {
    return await CreateLoan.execute(signer, {
      initialFields: {
          loanFactory: loanFactory.contractId,
          tokenRequested: '',
          tokenAmount: tokenAmount,
          collateralToken: '',
          collateralAmount: collateralAmount,
          interest: interest,
          duration: duration,
          canLiquidate: canLiquidate
      },
      attoAlphAmount: DUST_AMOUNT
    });
}
*/