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
import { defaultSigner } from './helperFunctions'
import { AcceptLoan, AddCollateral, AuctionFactoryInstance, CancelLoan, CreateLoan, ForfeitLoan, LiquidationLoan, Loan, LoanFactory, LoanFactoryInstance, LoanInstance, PayLoan, RemoveCollateral, TestOracleInstance, TokenMapping, WithdrawLoanFactoryFees } from '../../artifacts/ts'
  
web3.setCurrentNodeProvider('http://127.0.0.1:22973', undefined, fetch)
  
const nodeProvider = new NodeProvider('http://127.0.0.1:22973') 

// loan template contract
export async function deployLoanTemplate(auctionHouse: AuctionFactoryInstance) {
    return await Loan.deploy(defaultSigner, {
      initialFields: {
          borrower: defaultSigner.account.address,
          lender: defaultSigner.account.address,
          tokenRequested: '',
          tokenAmount: 0n,
          collateralToken: '',
          collateralAmount: 0n,
          interest: 0n,
          rate: 0n,
          duration: 0n,
          startTime: 0n,
          active: false,
          parentContract: defaultSigner.account.address,
          canLiquidate: false,
          ratio: 0n,
          auctionContract: auctionHouse.contractId
      },
    });
}

// loan factory contract
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

// loan factory functions

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

export async function AcceptLoanService (
    signer: SignerProvider,
    loanFactory: LoanFactoryInstance,
    loan: string
) {
    return await AcceptLoan.execute(signer, {
      initialFields: {
          loanFactory: loanFactory.contractId,
          contract: loan
      },
      attoAlphAmount: DUST_AMOUNT
    });
}

export async function CancelLoanService (
    signer: SignerProvider,
    loanFactory: LoanFactoryInstance,
    loan: string
) {
    return await CancelLoan.execute(signer, {
      initialFields: {
          loanFactory: loanFactory.contractId,
          contract: loan
      },
      attoAlphAmount: DUST_AMOUNT
    });
}


export async function PayLoanService (
    signer: SignerProvider,
    loanFactory: LoanFactoryInstance,
    loan: string
) {
    return await PayLoan.execute(signer, {
      initialFields: {
          loanFactory: loanFactory.contractId,
          contract: loan
      },
      attoAlphAmount: DUST_AMOUNT
    });
}


export async function ForfeitLoanService (
    signer: SignerProvider,
    loanFactory: LoanFactoryInstance,
    loan: string
) {
    return await ForfeitLoan.execute(signer, {
      initialFields: {
          loanFactory: loanFactory.contractId,
          contract: loan
      },
      attoAlphAmount: DUST_AMOUNT
    });
}

//? Liquidation Options
//? ------------------------------------------------------

export async function AddCollateralService (
    signer: SignerProvider,
    loanFactory: LoanFactoryInstance,
    loan: string,
    amount: bigint
) {
    return await AddCollateral.execute(signer, {
      initialFields: {
          loanFactory: loanFactory.contractId,
          contractId: loan,
          amount: amount
      },
      attoAlphAmount: DUST_AMOUNT
    });
}

export async function RemoveCollateralService (
    signer: SignerProvider,
    loanFactory: LoanFactoryInstance,
    loan: string,
    amount: bigint
) {
    return await RemoveCollateral.execute(signer, {
      initialFields: {
          loanFactory: loanFactory.contractId,
          contractId: loan,
          amount: amount
      },
      attoAlphAmount: DUST_AMOUNT
    });
}

export async function LiquidateLoanService (
    signer: SignerProvider,
    loanFactory: LoanFactoryInstance,
    loan: string
) {
    return await LiquidationLoan.execute(signer, {
      initialFields: {
          loanFactory: loanFactory.contractId,
          contract: loan,
      },
      attoAlphAmount: DUST_AMOUNT
    });
}

//* contract admin
//* ---------------------------------------------------------

export async function WithdrawLoanFactoryFeesService (
    signer: SignerProvider,
    loanFactory: LoanFactoryInstance,
    who: Address,
    token: string,
    amount: bigint
) {
    return await WithdrawLoanFactoryFees.execute(signer, {
      initialFields: {
          loanFactory: loanFactory.contractId,
          who: who,
          token: token,
          amount: amount
      },
      attoAlphAmount: DUST_AMOUNT
    });
}

//? need to add mapping for fee contracts and paths
// much needed upgrade due to utxo asset limits; while adding dia oracle edits

//* need to add amount to tokenMapping (this is to prevent bad admin)
export async function TokenMappingService (
    signer: SignerProvider,
    loanFactory: LoanFactoryInstance,
    token: string, 
    add: boolean,
    pairtoken: string,
    decimals: bigint,
    alephiumOracle: boolean
) {
    return await TokenMapping.execute(signer, {
      initialFields: {
          loanFactory: loanFactory.contractId,
          token: token,
          add: add,
          pairtoken: pairtoken,
          decimals: decimals,
          alephiumOracle: alephiumOracle
      },
      attoAlphAmount: DUST_AMOUNT
    });
}