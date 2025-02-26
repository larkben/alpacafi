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
import { default as AuctionContractJson } from "../auctions/Auction.ral.json";
import { getContractByCodeHash, registerContract } from "./contracts";
import {
  DIAOracleValue,
  OracleData,
  PairInfo,
  TokenData,
  AllStructs,
} from "./types";

// Custom types for the contract
export namespace AuctionTypes {
  export type Fields = {
    parentContract: Address;
    tokenRequested: HexString;
    tokenAmount: bigint;
    collateralToken: HexString;
    collateralAmount: bigint;
    fee: bigint;
    loaner: Address;
    highestBidder: Address;
    timeToEnd: bigint;
  };

  export type State = ContractState<Fields>;

  export interface CallMethodTable {
    blockTimeStamp: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    calculateFee: {
      params: CallContractParams<{ amount: bigint }>;
      result: CallContractResult<bigint>;
    };
    bid: {
      params: CallContractParams<{ caller: Address; amount: bigint }>;
      result: CallContractResult<[HexString, bigint, bigint]>;
    };
    redeem: {
      params: CallContractParams<{ caller: Address }>;
      result: CallContractResult<null>;
    };
    upgradeAuctionCode: {
      params: CallContractParams<{ newCode: HexString }>;
      result: CallContractResult<null>;
    };
    upgradeAuctionFields: {
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
    blockTimeStamp: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    calculateFee: {
      params: SignExecuteContractMethodParams<{ amount: bigint }>;
      result: SignExecuteScriptTxResult;
    };
    bid: {
      params: SignExecuteContractMethodParams<{
        caller: Address;
        amount: bigint;
      }>;
      result: SignExecuteScriptTxResult;
    };
    redeem: {
      params: SignExecuteContractMethodParams<{ caller: Address }>;
      result: SignExecuteScriptTxResult;
    };
    upgradeAuctionCode: {
      params: SignExecuteContractMethodParams<{ newCode: HexString }>;
      result: SignExecuteScriptTxResult;
    };
    upgradeAuctionFields: {
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
}

class Factory extends ContractFactory<AuctionInstance, AuctionTypes.Fields> {
  encodeFields(fields: AuctionTypes.Fields) {
    return encodeContractFields(
      addStdIdToFields(this.contract, fields),
      this.contract.fieldsSig,
      AllStructs
    );
  }

  consts = {
    AuctionCodes: {
      InvalidAmount: BigInt("0"),
      InvalidCaller: BigInt("1"),
      AuctionNotDone: BigInt("2"),
      CopyNotUpgradable: BigInt("3"),
      AuctionNotBidOn: BigInt("4"),
    },
  };

  at(address: string): AuctionInstance {
    return new AuctionInstance(address);
  }

  tests = {
    blockTimeStamp: async (
      params: Omit<
        TestContractParamsWithoutMaps<AuctionTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(this, "blockTimeStamp", params, getContractByCodeHash);
    },
    calculateFee: async (
      params: TestContractParamsWithoutMaps<
        AuctionTypes.Fields,
        { amount: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(this, "calculateFee", params, getContractByCodeHash);
    },
    bid: async (
      params: TestContractParamsWithoutMaps<
        AuctionTypes.Fields,
        { caller: Address; amount: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<[HexString, bigint, bigint]>> => {
      return testMethod(this, "bid", params, getContractByCodeHash);
    },
    redeem: async (
      params: TestContractParamsWithoutMaps<
        AuctionTypes.Fields,
        { caller: Address }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "redeem", params, getContractByCodeHash);
    },
    upgradeAuctionCode: async (
      params: TestContractParamsWithoutMaps<
        AuctionTypes.Fields,
        { newCode: HexString }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(
        this,
        "upgradeAuctionCode",
        params,
        getContractByCodeHash
      );
    },
    upgradeAuctionFields: async (
      params: TestContractParamsWithoutMaps<
        AuctionTypes.Fields,
        { newCode: HexString; immFields: HexString; mutFields: HexString }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(
        this,
        "upgradeAuctionFields",
        params,
        getContractByCodeHash
      );
    },
  };

  stateForTest(
    initFields: AuctionTypes.Fields,
    asset?: Asset,
    address?: string
  ) {
    return this.stateForTest_(initFields, asset, address, undefined);
  }
}

// Use this object to test and deploy the contract
export const Auction = new Factory(
  Contract.fromJson(
    AuctionContractJson,
    "",
    "34f755c68861d8b2b08c560e8ad73387913bafd0649f68536106f318e25b465e",
    AllStructs
  )
);
registerContract(Auction);

// Use this class to interact with the blockchain
export class AuctionInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<AuctionTypes.State> {
    return fetchContractState(Auction, this);
  }

  view = {
    blockTimeStamp: async (
      params?: AuctionTypes.CallMethodParams<"blockTimeStamp">
    ): Promise<AuctionTypes.CallMethodResult<"blockTimeStamp">> => {
      return callMethod(
        Auction,
        this,
        "blockTimeStamp",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    calculateFee: async (
      params: AuctionTypes.CallMethodParams<"calculateFee">
    ): Promise<AuctionTypes.CallMethodResult<"calculateFee">> => {
      return callMethod(
        Auction,
        this,
        "calculateFee",
        params,
        getContractByCodeHash
      );
    },
    bid: async (
      params: AuctionTypes.CallMethodParams<"bid">
    ): Promise<AuctionTypes.CallMethodResult<"bid">> => {
      return callMethod(Auction, this, "bid", params, getContractByCodeHash);
    },
    redeem: async (
      params: AuctionTypes.CallMethodParams<"redeem">
    ): Promise<AuctionTypes.CallMethodResult<"redeem">> => {
      return callMethod(Auction, this, "redeem", params, getContractByCodeHash);
    },
    upgradeAuctionCode: async (
      params: AuctionTypes.CallMethodParams<"upgradeAuctionCode">
    ): Promise<AuctionTypes.CallMethodResult<"upgradeAuctionCode">> => {
      return callMethod(
        Auction,
        this,
        "upgradeAuctionCode",
        params,
        getContractByCodeHash
      );
    },
    upgradeAuctionFields: async (
      params: AuctionTypes.CallMethodParams<"upgradeAuctionFields">
    ): Promise<AuctionTypes.CallMethodResult<"upgradeAuctionFields">> => {
      return callMethod(
        Auction,
        this,
        "upgradeAuctionFields",
        params,
        getContractByCodeHash
      );
    },
  };

  transact = {
    blockTimeStamp: async (
      params: AuctionTypes.SignExecuteMethodParams<"blockTimeStamp">
    ): Promise<AuctionTypes.SignExecuteMethodResult<"blockTimeStamp">> => {
      return signExecuteMethod(Auction, this, "blockTimeStamp", params);
    },
    calculateFee: async (
      params: AuctionTypes.SignExecuteMethodParams<"calculateFee">
    ): Promise<AuctionTypes.SignExecuteMethodResult<"calculateFee">> => {
      return signExecuteMethod(Auction, this, "calculateFee", params);
    },
    bid: async (
      params: AuctionTypes.SignExecuteMethodParams<"bid">
    ): Promise<AuctionTypes.SignExecuteMethodResult<"bid">> => {
      return signExecuteMethod(Auction, this, "bid", params);
    },
    redeem: async (
      params: AuctionTypes.SignExecuteMethodParams<"redeem">
    ): Promise<AuctionTypes.SignExecuteMethodResult<"redeem">> => {
      return signExecuteMethod(Auction, this, "redeem", params);
    },
    upgradeAuctionCode: async (
      params: AuctionTypes.SignExecuteMethodParams<"upgradeAuctionCode">
    ): Promise<AuctionTypes.SignExecuteMethodResult<"upgradeAuctionCode">> => {
      return signExecuteMethod(Auction, this, "upgradeAuctionCode", params);
    },
    upgradeAuctionFields: async (
      params: AuctionTypes.SignExecuteMethodParams<"upgradeAuctionFields">
    ): Promise<
      AuctionTypes.SignExecuteMethodResult<"upgradeAuctionFields">
    > => {
      return signExecuteMethod(Auction, this, "upgradeAuctionFields", params);
    },
  };

  async multicall<Calls extends AuctionTypes.MultiCallParams>(
    calls: Calls
  ): Promise<AuctionTypes.MultiCallResults<Calls>>;
  async multicall<Callss extends AuctionTypes.MultiCallParams[]>(
    callss: Narrow<Callss>
  ): Promise<AuctionTypes.MulticallReturnType<Callss>>;
  async multicall<
    Callss extends AuctionTypes.MultiCallParams | AuctionTypes.MultiCallParams[]
  >(callss: Callss): Promise<unknown> {
    return await multicallMethods(Auction, this, callss, getContractByCodeHash);
  }
}
