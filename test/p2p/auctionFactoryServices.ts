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
import { AcceptLoan, AddCollateral, Auction, AuctionFactory, AuctionFactoryInstance, AuctionInstance, Bid, CancelLoan, CreateLoan, EditLoanFactory, ForfeitLoan, LiquidationLoan, Loan, LoanFactory, LoanFactoryInstance, LoanInstance, PayLoan, Redeem, RemoveCollateral, TestOracleInstance, TokenMapping, WithdrawLoanFactoryFees } from '../../artifacts/ts'
  
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
export async function deployAuctionFactory(auctionTemplate: AuctionInstance, oracleTemplate: TestOracleInstance) {
    return await AuctionFactory.deploy(defaultSigner, {
      initialFields: {
          admin: defaultSigner.account.address,
          auctionTemplate: auctionTemplate.contractId,
          loanFactory: "",
          auctionNumber: 0n,
          fee: 300n,
          oracle: oracleTemplate.contractId
      },
    });
}

// auction factory functions
export async function BidService (
    signer: SignerProvider,
    auctionFactory: AuctionFactoryInstance,
    auction: string,
    token: string,
    amount: bigint
) {
    return await Bid.execute(signer, {
      initialFields: {
          contract: auctionFactory.contractId,
          id: auction,
          token: token,
          amount: amount
      },
      attoAlphAmount: DUST_AMOUNT * 3n,
      tokens: [{id: token, amount: amount}]
    });
}

export async function RedeemService (
    signer: SignerProvider,
    auctionFactory: AuctionFactoryInstance,
    auction: string
) {
    return await Redeem.execute(signer, {
      initialFields: {
          contract: auctionFactory.contractId,
          id: auction
      },
      attoAlphAmount: DUST_AMOUNT
    });
}

// add edit lf

export async function EditLFAuctionFactoryService (
    signer: SignerProvider,
    auctionFactory: AuctionFactoryInstance,
    lf: LoanFactoryInstance
) {
    return await EditLoanFactory.execute(signer, {
      initialFields: {
          contract: auctionFactory.contractId,
          factoryId: lf.contractId
      },
      attoAlphAmount: DUST_AMOUNT
    });
}