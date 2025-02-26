/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Address,
  Contract,
  ContractState,
  TestContractResult,
  HexString,
  ContractFactory,
  EventSubscribeOptions,
  EventSubscription,
  CallContractParams,
  CallContractResult,
  TestContractParams,
  ContractEvent,
  subscribeContractEvent,
  subscribeContractEvents,
  testMethod,
  callMethod,
  multicallMethods,
  fetchContractState,
  Asset,
  ContractInstance,
  getContractEventsCurrentCount,
  TestContractParamsWithoutMaps,
  TestContractResultWithoutMaps,
  SignExecuteContractMethodParams,
  SignExecuteScriptTxResult,
  signExecuteMethod,
  addStdIdToFields,
  encodeContractFields,
  Narrow,
} from "@alephium/web3";
import { default as LoanFactoryContractJson } from "../loans/LoanFactory.ral.json";
import { getContractByCodeHash, registerContract } from "./contracts";
import {
  DIAOracleValue,
  OracleData,
  PairInfo,
  TokenData,
  AllStructs,
} from "./types";
import { RalphMap } from "@alephium/web3";

// Custom types for the contract
export namespace LoanFactoryTypes {
  export type Fields = {
    admin: Address;
    loanTemplate: HexString;
    auctionHouse: HexString;
    feeTemplate: HexString;
    activeLoans: bigint;
    rate: bigint;
    oracle: HexString;
    alpaca: HexString;
  };

  export type State = ContractState<Fields>;

  export type NewLoanEvent = ContractEvent<{
    contract: HexString;
    tokenRequested: HexString;
    tokenAmount: bigint;
    collateralToken: HexString;
    collateralAmount: bigint;
    interest: bigint;
    duration: bigint;
    who: Address;
  }>;
  export type AcceptedLoanEvent = ContractEvent<{
    contract: HexString;
    who: Address;
  }>;
  export type LoanRemovedEvent = ContractEvent<{
    contract: HexString;
    who: Address;
  }>;
  export type LoanCanceledEvent = ContractEvent<{
    contract: HexString;
    who: Address;
  }>;
  export type LoanLiqWithEvent = ContractEvent<{
    contract: HexString;
    liquidation: boolean;
    who: Address;
  }>;
  export type LoanPayedEvent = ContractEvent<{
    contract: HexString;
    who: Address;
  }>;
  export type AddCollateralLoanEvent = ContractEvent<{
    contract: HexString;
    who: Address;
    token: HexString;
    amount: bigint;
  }>;
  export type RemoveCollateralLoanEvent = ContractEvent<{
    contract: HexString;
    who: Address;
    token: HexString;
    amount: bigint;
  }>;
  export type LoanLiquidationEvent = ContractEvent<{
    contract: HexString;
    token: HexString;
    startingBid: bigint;
  }>;

  export interface CallMethodTable {
    determineCollateralRatio: {
      params: CallContractParams<{
        tokenRequested: HexString;
        tokenAmount: bigint;
        tokenOracle: boolean;
        collateralToken: HexString;
        collateralAmount: bigint;
        collateralOracle: boolean;
        threshhold: bigint;
      }>;
      result: CallContractResult<[bigint, boolean]>;
    };
    getTime: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    depositFeeCollector: {
      params: CallContractParams<{ token: HexString }>;
      result: CallContractResult<HexString>;
    };
    getRequiredTokens: {
      params: CallContractParams<{
        contractId: HexString;
        withInterest: boolean;
      }>;
      result: CallContractResult<[HexString, bigint]>;
    };
    checkTokenAmount: {
      params: CallContractParams<{ priceIn: bigint; commissionRateIn: bigint }>;
      result: CallContractResult<null>;
    };
    createLoan: {
      params: CallContractParams<{
        tokenRequested: HexString;
        tokenAmount: bigint;
        collateralToken: HexString;
        collateralAmount: bigint;
        interest: bigint;
        duration: bigint;
        canLiquidate: boolean;
      }>;
      result: CallContractResult<null>;
    };
    accept: {
      params: CallContractParams<{ contractId: HexString }>;
      result: CallContractResult<null>;
    };
    cancel: {
      params: CallContractParams<{ contractId: HexString }>;
      result: CallContractResult<null>;
    };
    pay: {
      params: CallContractParams<{ contractId: HexString }>;
      result: CallContractResult<null>;
    };
    forfeit: {
      params: CallContractParams<{ contractId: HexString }>;
      result: CallContractResult<null>;
    };
    liquidation: {
      params: CallContractParams<{ contractId: HexString }>;
      result: CallContractResult<null>;
    };
    addCollateral: {
      params: CallContractParams<{ contractId: HexString; amount: bigint }>;
      result: CallContractResult<null>;
    };
    removeCollateral: {
      params: CallContractParams<{ contractId: HexString; amount: bigint }>;
      result: CallContractResult<null>;
    };
    editRate: {
      params: CallContractParams<{ newRate: bigint }>;
      result: CallContractResult<null>;
    };
    tokenMapping: {
      params: CallContractParams<{
        token: HexString;
        add: boolean;
        pairtoken: HexString;
        decimals: bigint;
        alephiumOracle: boolean;
      }>;
      result: CallContractResult<null>;
    };
    withdrawLoanFactoryFees: {
      params: CallContractParams<{
        who: Address;
        token: HexString;
        amount: bigint;
      }>;
      result: CallContractResult<null>;
    };
    updateLoanFactoryCode: {
      params: CallContractParams<{ newCode: HexString }>;
      result: CallContractResult<null>;
    };
    updateLoanFactoryFields: {
      params: CallContractParams<{
        newCode: HexString;
        immFields: HexString;
        mutFields: HexString;
      }>;
      result: CallContractResult<null>;
    };
  }
  export type CallMethodParams<T extends keyof CallMethodTable> =
    CallMethodTable[T]["params"];
  export type CallMethodResult<T extends keyof CallMethodTable> =
    CallMethodTable[T]["result"];
  export type MultiCallParams = Partial<{
    [Name in keyof CallMethodTable]: CallMethodTable[Name]["params"];
  }>;
  export type MultiCallResults<T extends MultiCallParams> = {
    [MaybeName in keyof T]: MaybeName extends keyof CallMethodTable
      ? CallMethodTable[MaybeName]["result"]
      : undefined;
  };
  export type MulticallReturnType<Callss extends MultiCallParams[]> = {
    [index in keyof Callss]: MultiCallResults<Callss[index]>;
  };

  export interface SignExecuteMethodTable {
    determineCollateralRatio: {
      params: SignExecuteContractMethodParams<{
        tokenRequested: HexString;
        tokenAmount: bigint;
        tokenOracle: boolean;
        collateralToken: HexString;
        collateralAmount: bigint;
        collateralOracle: boolean;
        threshhold: bigint;
      }>;
      result: SignExecuteScriptTxResult;
    };
    getTime: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    depositFeeCollector: {
      params: SignExecuteContractMethodParams<{ token: HexString }>;
      result: SignExecuteScriptTxResult;
    };
    getRequiredTokens: {
      params: SignExecuteContractMethodParams<{
        contractId: HexString;
        withInterest: boolean;
      }>;
      result: SignExecuteScriptTxResult;
    };
    checkTokenAmount: {
      params: SignExecuteContractMethodParams<{
        priceIn: bigint;
        commissionRateIn: bigint;
      }>;
      result: SignExecuteScriptTxResult;
    };
    createLoan: {
      params: SignExecuteContractMethodParams<{
        tokenRequested: HexString;
        tokenAmount: bigint;
        collateralToken: HexString;
        collateralAmount: bigint;
        interest: bigint;
        duration: bigint;
        canLiquidate: boolean;
      }>;
      result: SignExecuteScriptTxResult;
    };
    accept: {
      params: SignExecuteContractMethodParams<{ contractId: HexString }>;
      result: SignExecuteScriptTxResult;
    };
    cancel: {
      params: SignExecuteContractMethodParams<{ contractId: HexString }>;
      result: SignExecuteScriptTxResult;
    };
    pay: {
      params: SignExecuteContractMethodParams<{ contractId: HexString }>;
      result: SignExecuteScriptTxResult;
    };
    forfeit: {
      params: SignExecuteContractMethodParams<{ contractId: HexString }>;
      result: SignExecuteScriptTxResult;
    };
    liquidation: {
      params: SignExecuteContractMethodParams<{ contractId: HexString }>;
      result: SignExecuteScriptTxResult;
    };
    addCollateral: {
      params: SignExecuteContractMethodParams<{
        contractId: HexString;
        amount: bigint;
      }>;
      result: SignExecuteScriptTxResult;
    };
    removeCollateral: {
      params: SignExecuteContractMethodParams<{
        contractId: HexString;
        amount: bigint;
      }>;
      result: SignExecuteScriptTxResult;
    };
    editRate: {
      params: SignExecuteContractMethodParams<{ newRate: bigint }>;
      result: SignExecuteScriptTxResult;
    };
    tokenMapping: {
      params: SignExecuteContractMethodParams<{
        token: HexString;
        add: boolean;
        pairtoken: HexString;
        decimals: bigint;
        alephiumOracle: boolean;
      }>;
      result: SignExecuteScriptTxResult;
    };
    withdrawLoanFactoryFees: {
      params: SignExecuteContractMethodParams<{
        who: Address;
        token: HexString;
        amount: bigint;
      }>;
      result: SignExecuteScriptTxResult;
    };
    updateLoanFactoryCode: {
      params: SignExecuteContractMethodParams<{ newCode: HexString }>;
      result: SignExecuteScriptTxResult;
    };
    updateLoanFactoryFields: {
      params: SignExecuteContractMethodParams<{
        newCode: HexString;
        immFields: HexString;
        mutFields: HexString;
      }>;
      result: SignExecuteScriptTxResult;
    };
  }
  export type SignExecuteMethodParams<T extends keyof SignExecuteMethodTable> =
    SignExecuteMethodTable[T]["params"];
  export type SignExecuteMethodResult<T extends keyof SignExecuteMethodTable> =
    SignExecuteMethodTable[T]["result"];

  export type Maps = { tokenPairs?: Map<HexString, PairInfo> };
}

class Factory extends ContractFactory<
  LoanFactoryInstance,
  LoanFactoryTypes.Fields
> {
  encodeFields(fields: LoanFactoryTypes.Fields) {
    return encodeContractFields(
      addStdIdToFields(this.contract, fields),
      this.contract.fieldsSig,
      AllStructs
    );
  }

  eventIndex = {
    NewLoan: 0,
    AcceptedLoan: 1,
    LoanRemoved: 2,
    LoanCanceled: 3,
    LoanLiqWith: 4,
    LoanPayed: 5,
    AddCollateralLoan: 6,
    RemoveCollateralLoan: 7,
    LoanLiquidation: 8,
  };
  consts = {
    LoanCodes: { NotAdmin: BigInt("0"), TokenSizeTooSmall: BigInt("1") },
  };

  at(address: string): LoanFactoryInstance {
    return new LoanFactoryInstance(address);
  }

  tests = {
    determineCollateralRatio: async (
      params: TestContractParams<
        LoanFactoryTypes.Fields,
        {
          tokenRequested: HexString;
          tokenAmount: bigint;
          tokenOracle: boolean;
          collateralToken: HexString;
          collateralAmount: bigint;
          collateralOracle: boolean;
          threshhold: bigint;
        },
        LoanFactoryTypes.Maps
      >
    ): Promise<
      TestContractResult<[bigint, boolean], LoanFactoryTypes.Maps>
    > => {
      return testMethod(
        this,
        "determineCollateralRatio",
        params,
        getContractByCodeHash
      );
    },
    getTime: async (
      params: Omit<
        TestContractParams<
          LoanFactoryTypes.Fields,
          never,
          LoanFactoryTypes.Maps
        >,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint, LoanFactoryTypes.Maps>> => {
      return testMethod(this, "getTime", params, getContractByCodeHash);
    },
    depositFeeCollector: async (
      params: TestContractParams<
        LoanFactoryTypes.Fields,
        { token: HexString },
        LoanFactoryTypes.Maps
      >
    ): Promise<TestContractResult<HexString, LoanFactoryTypes.Maps>> => {
      return testMethod(
        this,
        "depositFeeCollector",
        params,
        getContractByCodeHash
      );
    },
    getRequiredTokens: async (
      params: TestContractParams<
        LoanFactoryTypes.Fields,
        { contractId: HexString; withInterest: boolean },
        LoanFactoryTypes.Maps
      >
    ): Promise<
      TestContractResult<[HexString, bigint], LoanFactoryTypes.Maps>
    > => {
      return testMethod(
        this,
        "getRequiredTokens",
        params,
        getContractByCodeHash
      );
    },
    checkTokenAmount: async (
      params: TestContractParams<
        LoanFactoryTypes.Fields,
        { priceIn: bigint; commissionRateIn: bigint },
        LoanFactoryTypes.Maps
      >
    ): Promise<TestContractResult<null, LoanFactoryTypes.Maps>> => {
      return testMethod(
        this,
        "checkTokenAmount",
        params,
        getContractByCodeHash
      );
    },
    createLoan: async (
      params: TestContractParams<
        LoanFactoryTypes.Fields,
        {
          tokenRequested: HexString;
          tokenAmount: bigint;
          collateralToken: HexString;
          collateralAmount: bigint;
          interest: bigint;
          duration: bigint;
          canLiquidate: boolean;
        },
        LoanFactoryTypes.Maps
      >
    ): Promise<TestContractResult<null, LoanFactoryTypes.Maps>> => {
      return testMethod(this, "createLoan", params, getContractByCodeHash);
    },
    accept: async (
      params: TestContractParams<
        LoanFactoryTypes.Fields,
        { contractId: HexString },
        LoanFactoryTypes.Maps
      >
    ): Promise<TestContractResult<null, LoanFactoryTypes.Maps>> => {
      return testMethod(this, "accept", params, getContractByCodeHash);
    },
    cancel: async (
      params: TestContractParams<
        LoanFactoryTypes.Fields,
        { contractId: HexString },
        LoanFactoryTypes.Maps
      >
    ): Promise<TestContractResult<null, LoanFactoryTypes.Maps>> => {
      return testMethod(this, "cancel", params, getContractByCodeHash);
    },
    pay: async (
      params: TestContractParams<
        LoanFactoryTypes.Fields,
        { contractId: HexString },
        LoanFactoryTypes.Maps
      >
    ): Promise<TestContractResult<null, LoanFactoryTypes.Maps>> => {
      return testMethod(this, "pay", params, getContractByCodeHash);
    },
    forfeit: async (
      params: TestContractParams<
        LoanFactoryTypes.Fields,
        { contractId: HexString },
        LoanFactoryTypes.Maps
      >
    ): Promise<TestContractResult<null, LoanFactoryTypes.Maps>> => {
      return testMethod(this, "forfeit", params, getContractByCodeHash);
    },
    liquidation: async (
      params: TestContractParams<
        LoanFactoryTypes.Fields,
        { contractId: HexString },
        LoanFactoryTypes.Maps
      >
    ): Promise<TestContractResult<null, LoanFactoryTypes.Maps>> => {
      return testMethod(this, "liquidation", params, getContractByCodeHash);
    },
    addCollateral: async (
      params: TestContractParams<
        LoanFactoryTypes.Fields,
        { contractId: HexString; amount: bigint },
        LoanFactoryTypes.Maps
      >
    ): Promise<TestContractResult<null, LoanFactoryTypes.Maps>> => {
      return testMethod(this, "addCollateral", params, getContractByCodeHash);
    },
    removeCollateral: async (
      params: TestContractParams<
        LoanFactoryTypes.Fields,
        { contractId: HexString; amount: bigint },
        LoanFactoryTypes.Maps
      >
    ): Promise<TestContractResult<null, LoanFactoryTypes.Maps>> => {
      return testMethod(
        this,
        "removeCollateral",
        params,
        getContractByCodeHash
      );
    },
    editRate: async (
      params: TestContractParams<
        LoanFactoryTypes.Fields,
        { newRate: bigint },
        LoanFactoryTypes.Maps
      >
    ): Promise<TestContractResult<null, LoanFactoryTypes.Maps>> => {
      return testMethod(this, "editRate", params, getContractByCodeHash);
    },
    tokenMapping: async (
      params: TestContractParams<
        LoanFactoryTypes.Fields,
        {
          token: HexString;
          add: boolean;
          pairtoken: HexString;
          decimals: bigint;
          alephiumOracle: boolean;
        },
        LoanFactoryTypes.Maps
      >
    ): Promise<TestContractResult<null, LoanFactoryTypes.Maps>> => {
      return testMethod(this, "tokenMapping", params, getContractByCodeHash);
    },
    withdrawLoanFactoryFees: async (
      params: TestContractParams<
        LoanFactoryTypes.Fields,
        { who: Address; token: HexString; amount: bigint },
        LoanFactoryTypes.Maps
      >
    ): Promise<TestContractResult<null, LoanFactoryTypes.Maps>> => {
      return testMethod(
        this,
        "withdrawLoanFactoryFees",
        params,
        getContractByCodeHash
      );
    },
    updateLoanFactoryCode: async (
      params: TestContractParams<
        LoanFactoryTypes.Fields,
        { newCode: HexString },
        LoanFactoryTypes.Maps
      >
    ): Promise<TestContractResult<null, LoanFactoryTypes.Maps>> => {
      return testMethod(
        this,
        "updateLoanFactoryCode",
        params,
        getContractByCodeHash
      );
    },
    updateLoanFactoryFields: async (
      params: TestContractParams<
        LoanFactoryTypes.Fields,
        { newCode: HexString; immFields: HexString; mutFields: HexString },
        LoanFactoryTypes.Maps
      >
    ): Promise<TestContractResult<null, LoanFactoryTypes.Maps>> => {
      return testMethod(
        this,
        "updateLoanFactoryFields",
        params,
        getContractByCodeHash
      );
    },
  };

  stateForTest(
    initFields: LoanFactoryTypes.Fields,
    asset?: Asset,
    address?: string,
    maps?: LoanFactoryTypes.Maps
  ) {
    return this.stateForTest_(initFields, asset, address, maps);
  }
}

// Use this object to test and deploy the contract
export const LoanFactory = new Factory(
  Contract.fromJson(
    LoanFactoryContractJson,
    "=62-2+48=2+7=1-1=2-2+88=2-2+a0=2870-2+42=31-1+8=60+7a7e0214696e73657274206174206d617020706174683a2000=85-1+2=36+7a7e021472656d6f7665206174206d617020706174683a2000=206",
    "5bd2f2b4788ae3d69c75799a9852be91e03143fb966172e9e25d8cc8fe1c13cf",
    AllStructs
  )
);
registerContract(LoanFactory);

// Use this class to interact with the blockchain
export class LoanFactoryInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  maps = {
    tokenPairs: new RalphMap<HexString, PairInfo>(
      LoanFactory.contract,
      this.contractId,
      "tokenPairs"
    ),
  };

  async fetchState(): Promise<LoanFactoryTypes.State> {
    return fetchContractState(LoanFactory, this);
  }

  async getContractEventsCurrentCount(): Promise<number> {
    return getContractEventsCurrentCount(this.address);
  }

  subscribeNewLoanEvent(
    options: EventSubscribeOptions<LoanFactoryTypes.NewLoanEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      LoanFactory.contract,
      this,
      options,
      "NewLoan",
      fromCount
    );
  }

  subscribeAcceptedLoanEvent(
    options: EventSubscribeOptions<LoanFactoryTypes.AcceptedLoanEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      LoanFactory.contract,
      this,
      options,
      "AcceptedLoan",
      fromCount
    );
  }

  subscribeLoanRemovedEvent(
    options: EventSubscribeOptions<LoanFactoryTypes.LoanRemovedEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      LoanFactory.contract,
      this,
      options,
      "LoanRemoved",
      fromCount
    );
  }

  subscribeLoanCanceledEvent(
    options: EventSubscribeOptions<LoanFactoryTypes.LoanCanceledEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      LoanFactory.contract,
      this,
      options,
      "LoanCanceled",
      fromCount
    );
  }

  subscribeLoanLiqWithEvent(
    options: EventSubscribeOptions<LoanFactoryTypes.LoanLiqWithEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      LoanFactory.contract,
      this,
      options,
      "LoanLiqWith",
      fromCount
    );
  }

  subscribeLoanPayedEvent(
    options: EventSubscribeOptions<LoanFactoryTypes.LoanPayedEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      LoanFactory.contract,
      this,
      options,
      "LoanPayed",
      fromCount
    );
  }

  subscribeAddCollateralLoanEvent(
    options: EventSubscribeOptions<LoanFactoryTypes.AddCollateralLoanEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      LoanFactory.contract,
      this,
      options,
      "AddCollateralLoan",
      fromCount
    );
  }

  subscribeRemoveCollateralLoanEvent(
    options: EventSubscribeOptions<LoanFactoryTypes.RemoveCollateralLoanEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      LoanFactory.contract,
      this,
      options,
      "RemoveCollateralLoan",
      fromCount
    );
  }

  subscribeLoanLiquidationEvent(
    options: EventSubscribeOptions<LoanFactoryTypes.LoanLiquidationEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      LoanFactory.contract,
      this,
      options,
      "LoanLiquidation",
      fromCount
    );
  }

  subscribeAllEvents(
    options: EventSubscribeOptions<
      | LoanFactoryTypes.NewLoanEvent
      | LoanFactoryTypes.AcceptedLoanEvent
      | LoanFactoryTypes.LoanRemovedEvent
      | LoanFactoryTypes.LoanCanceledEvent
      | LoanFactoryTypes.LoanLiqWithEvent
      | LoanFactoryTypes.LoanPayedEvent
      | LoanFactoryTypes.AddCollateralLoanEvent
      | LoanFactoryTypes.RemoveCollateralLoanEvent
      | LoanFactoryTypes.LoanLiquidationEvent
    >,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvents(
      LoanFactory.contract,
      this,
      options,
      fromCount
    );
  }

  view = {
    determineCollateralRatio: async (
      params: LoanFactoryTypes.CallMethodParams<"determineCollateralRatio">
    ): Promise<
      LoanFactoryTypes.CallMethodResult<"determineCollateralRatio">
    > => {
      return callMethod(
        LoanFactory,
        this,
        "determineCollateralRatio",
        params,
        getContractByCodeHash
      );
    },
    getTime: async (
      params?: LoanFactoryTypes.CallMethodParams<"getTime">
    ): Promise<LoanFactoryTypes.CallMethodResult<"getTime">> => {
      return callMethod(
        LoanFactory,
        this,
        "getTime",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    depositFeeCollector: async (
      params: LoanFactoryTypes.CallMethodParams<"depositFeeCollector">
    ): Promise<LoanFactoryTypes.CallMethodResult<"depositFeeCollector">> => {
      return callMethod(
        LoanFactory,
        this,
        "depositFeeCollector",
        params,
        getContractByCodeHash
      );
    },
    getRequiredTokens: async (
      params: LoanFactoryTypes.CallMethodParams<"getRequiredTokens">
    ): Promise<LoanFactoryTypes.CallMethodResult<"getRequiredTokens">> => {
      return callMethod(
        LoanFactory,
        this,
        "getRequiredTokens",
        params,
        getContractByCodeHash
      );
    },
    checkTokenAmount: async (
      params: LoanFactoryTypes.CallMethodParams<"checkTokenAmount">
    ): Promise<LoanFactoryTypes.CallMethodResult<"checkTokenAmount">> => {
      return callMethod(
        LoanFactory,
        this,
        "checkTokenAmount",
        params,
        getContractByCodeHash
      );
    },
    createLoan: async (
      params: LoanFactoryTypes.CallMethodParams<"createLoan">
    ): Promise<LoanFactoryTypes.CallMethodResult<"createLoan">> => {
      return callMethod(
        LoanFactory,
        this,
        "createLoan",
        params,
        getContractByCodeHash
      );
    },
    accept: async (
      params: LoanFactoryTypes.CallMethodParams<"accept">
    ): Promise<LoanFactoryTypes.CallMethodResult<"accept">> => {
      return callMethod(
        LoanFactory,
        this,
        "accept",
        params,
        getContractByCodeHash
      );
    },
    cancel: async (
      params: LoanFactoryTypes.CallMethodParams<"cancel">
    ): Promise<LoanFactoryTypes.CallMethodResult<"cancel">> => {
      return callMethod(
        LoanFactory,
        this,
        "cancel",
        params,
        getContractByCodeHash
      );
    },
    pay: async (
      params: LoanFactoryTypes.CallMethodParams<"pay">
    ): Promise<LoanFactoryTypes.CallMethodResult<"pay">> => {
      return callMethod(
        LoanFactory,
        this,
        "pay",
        params,
        getContractByCodeHash
      );
    },
    forfeit: async (
      params: LoanFactoryTypes.CallMethodParams<"forfeit">
    ): Promise<LoanFactoryTypes.CallMethodResult<"forfeit">> => {
      return callMethod(
        LoanFactory,
        this,
        "forfeit",
        params,
        getContractByCodeHash
      );
    },
    liquidation: async (
      params: LoanFactoryTypes.CallMethodParams<"liquidation">
    ): Promise<LoanFactoryTypes.CallMethodResult<"liquidation">> => {
      return callMethod(
        LoanFactory,
        this,
        "liquidation",
        params,
        getContractByCodeHash
      );
    },
    addCollateral: async (
      params: LoanFactoryTypes.CallMethodParams<"addCollateral">
    ): Promise<LoanFactoryTypes.CallMethodResult<"addCollateral">> => {
      return callMethod(
        LoanFactory,
        this,
        "addCollateral",
        params,
        getContractByCodeHash
      );
    },
    removeCollateral: async (
      params: LoanFactoryTypes.CallMethodParams<"removeCollateral">
    ): Promise<LoanFactoryTypes.CallMethodResult<"removeCollateral">> => {
      return callMethod(
        LoanFactory,
        this,
        "removeCollateral",
        params,
        getContractByCodeHash
      );
    },
    editRate: async (
      params: LoanFactoryTypes.CallMethodParams<"editRate">
    ): Promise<LoanFactoryTypes.CallMethodResult<"editRate">> => {
      return callMethod(
        LoanFactory,
        this,
        "editRate",
        params,
        getContractByCodeHash
      );
    },
    tokenMapping: async (
      params: LoanFactoryTypes.CallMethodParams<"tokenMapping">
    ): Promise<LoanFactoryTypes.CallMethodResult<"tokenMapping">> => {
      return callMethod(
        LoanFactory,
        this,
        "tokenMapping",
        params,
        getContractByCodeHash
      );
    },
    withdrawLoanFactoryFees: async (
      params: LoanFactoryTypes.CallMethodParams<"withdrawLoanFactoryFees">
    ): Promise<
      LoanFactoryTypes.CallMethodResult<"withdrawLoanFactoryFees">
    > => {
      return callMethod(
        LoanFactory,
        this,
        "withdrawLoanFactoryFees",
        params,
        getContractByCodeHash
      );
    },
    updateLoanFactoryCode: async (
      params: LoanFactoryTypes.CallMethodParams<"updateLoanFactoryCode">
    ): Promise<LoanFactoryTypes.CallMethodResult<"updateLoanFactoryCode">> => {
      return callMethod(
        LoanFactory,
        this,
        "updateLoanFactoryCode",
        params,
        getContractByCodeHash
      );
    },
    updateLoanFactoryFields: async (
      params: LoanFactoryTypes.CallMethodParams<"updateLoanFactoryFields">
    ): Promise<
      LoanFactoryTypes.CallMethodResult<"updateLoanFactoryFields">
    > => {
      return callMethod(
        LoanFactory,
        this,
        "updateLoanFactoryFields",
        params,
        getContractByCodeHash
      );
    },
  };

  transact = {
    determineCollateralRatio: async (
      params: LoanFactoryTypes.SignExecuteMethodParams<"determineCollateralRatio">
    ): Promise<
      LoanFactoryTypes.SignExecuteMethodResult<"determineCollateralRatio">
    > => {
      return signExecuteMethod(
        LoanFactory,
        this,
        "determineCollateralRatio",
        params
      );
    },
    getTime: async (
      params: LoanFactoryTypes.SignExecuteMethodParams<"getTime">
    ): Promise<LoanFactoryTypes.SignExecuteMethodResult<"getTime">> => {
      return signExecuteMethod(LoanFactory, this, "getTime", params);
    },
    depositFeeCollector: async (
      params: LoanFactoryTypes.SignExecuteMethodParams<"depositFeeCollector">
    ): Promise<
      LoanFactoryTypes.SignExecuteMethodResult<"depositFeeCollector">
    > => {
      return signExecuteMethod(
        LoanFactory,
        this,
        "depositFeeCollector",
        params
      );
    },
    getRequiredTokens: async (
      params: LoanFactoryTypes.SignExecuteMethodParams<"getRequiredTokens">
    ): Promise<
      LoanFactoryTypes.SignExecuteMethodResult<"getRequiredTokens">
    > => {
      return signExecuteMethod(LoanFactory, this, "getRequiredTokens", params);
    },
    checkTokenAmount: async (
      params: LoanFactoryTypes.SignExecuteMethodParams<"checkTokenAmount">
    ): Promise<
      LoanFactoryTypes.SignExecuteMethodResult<"checkTokenAmount">
    > => {
      return signExecuteMethod(LoanFactory, this, "checkTokenAmount", params);
    },
    createLoan: async (
      params: LoanFactoryTypes.SignExecuteMethodParams<"createLoan">
    ): Promise<LoanFactoryTypes.SignExecuteMethodResult<"createLoan">> => {
      return signExecuteMethod(LoanFactory, this, "createLoan", params);
    },
    accept: async (
      params: LoanFactoryTypes.SignExecuteMethodParams<"accept">
    ): Promise<LoanFactoryTypes.SignExecuteMethodResult<"accept">> => {
      return signExecuteMethod(LoanFactory, this, "accept", params);
    },
    cancel: async (
      params: LoanFactoryTypes.SignExecuteMethodParams<"cancel">
    ): Promise<LoanFactoryTypes.SignExecuteMethodResult<"cancel">> => {
      return signExecuteMethod(LoanFactory, this, "cancel", params);
    },
    pay: async (
      params: LoanFactoryTypes.SignExecuteMethodParams<"pay">
    ): Promise<LoanFactoryTypes.SignExecuteMethodResult<"pay">> => {
      return signExecuteMethod(LoanFactory, this, "pay", params);
    },
    forfeit: async (
      params: LoanFactoryTypes.SignExecuteMethodParams<"forfeit">
    ): Promise<LoanFactoryTypes.SignExecuteMethodResult<"forfeit">> => {
      return signExecuteMethod(LoanFactory, this, "forfeit", params);
    },
    liquidation: async (
      params: LoanFactoryTypes.SignExecuteMethodParams<"liquidation">
    ): Promise<LoanFactoryTypes.SignExecuteMethodResult<"liquidation">> => {
      return signExecuteMethod(LoanFactory, this, "liquidation", params);
    },
    addCollateral: async (
      params: LoanFactoryTypes.SignExecuteMethodParams<"addCollateral">
    ): Promise<LoanFactoryTypes.SignExecuteMethodResult<"addCollateral">> => {
      return signExecuteMethod(LoanFactory, this, "addCollateral", params);
    },
    removeCollateral: async (
      params: LoanFactoryTypes.SignExecuteMethodParams<"removeCollateral">
    ): Promise<
      LoanFactoryTypes.SignExecuteMethodResult<"removeCollateral">
    > => {
      return signExecuteMethod(LoanFactory, this, "removeCollateral", params);
    },
    editRate: async (
      params: LoanFactoryTypes.SignExecuteMethodParams<"editRate">
    ): Promise<LoanFactoryTypes.SignExecuteMethodResult<"editRate">> => {
      return signExecuteMethod(LoanFactory, this, "editRate", params);
    },
    tokenMapping: async (
      params: LoanFactoryTypes.SignExecuteMethodParams<"tokenMapping">
    ): Promise<LoanFactoryTypes.SignExecuteMethodResult<"tokenMapping">> => {
      return signExecuteMethod(LoanFactory, this, "tokenMapping", params);
    },
    withdrawLoanFactoryFees: async (
      params: LoanFactoryTypes.SignExecuteMethodParams<"withdrawLoanFactoryFees">
    ): Promise<
      LoanFactoryTypes.SignExecuteMethodResult<"withdrawLoanFactoryFees">
    > => {
      return signExecuteMethod(
        LoanFactory,
        this,
        "withdrawLoanFactoryFees",
        params
      );
    },
    updateLoanFactoryCode: async (
      params: LoanFactoryTypes.SignExecuteMethodParams<"updateLoanFactoryCode">
    ): Promise<
      LoanFactoryTypes.SignExecuteMethodResult<"updateLoanFactoryCode">
    > => {
      return signExecuteMethod(
        LoanFactory,
        this,
        "updateLoanFactoryCode",
        params
      );
    },
    updateLoanFactoryFields: async (
      params: LoanFactoryTypes.SignExecuteMethodParams<"updateLoanFactoryFields">
    ): Promise<
      LoanFactoryTypes.SignExecuteMethodResult<"updateLoanFactoryFields">
    > => {
      return signExecuteMethod(
        LoanFactory,
        this,
        "updateLoanFactoryFields",
        params
      );
    },
  };

  async multicall<Calls extends LoanFactoryTypes.MultiCallParams>(
    calls: Calls
  ): Promise<LoanFactoryTypes.MultiCallResults<Calls>>;
  async multicall<Callss extends LoanFactoryTypes.MultiCallParams[]>(
    callss: Narrow<Callss>
  ): Promise<LoanFactoryTypes.MulticallReturnType<Callss>>;
  async multicall<
    Callss extends
      | LoanFactoryTypes.MultiCallParams
      | LoanFactoryTypes.MultiCallParams[]
  >(callss: Callss): Promise<unknown> {
    return await multicallMethods(
      LoanFactory,
      this,
      callss,
      getContractByCodeHash
    );
  }
}
