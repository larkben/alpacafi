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
import { default as PoolContractJson } from "../pool-lending/Pool.ral.json";
import { getContractByCodeHash, registerContract } from "./contracts";
import {
  DIAOracleValue,
  OracleData,
  PairInfo,
  TokenData,
  AllStructs,
} from "./types";

// Custom types for the contract
export namespace PoolTypes {
  export type Fields = {
    admin: Address;
    debtTemplate: HexString;
    poolToken: HexString;
    poolDecimals: bigint;
    poolPair: HexString;
    name: HexString;
    symbol: HexString;
    sTokenSupply: bigint;
    exchangeRate: bigint;
    totalPoolAssets: bigint;
    depositedAmount: bigint;
    totalBorrowed: bigint;
    fees: bigint;
    oracle: HexString;
  };

  export type State = ContractState<Fields>;

  export type NewDebtEvent = ContractEvent<{
    who: Address;
    loan: bigint;
    collateral: bigint;
    rate: bigint;
    contract: HexString;
  }>;
  export type RemoveDebtEvent = ContractEvent<{
    who: Address;
    contract: HexString;
  }>;

  export interface CallMethodTable {
    getSymbol: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<HexString>;
    };
    getName: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<HexString>;
    };
    getDecimals: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getTotalSupply: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getPoolToken: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<HexString>;
    };
    getSPoolToken: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<HexString>;
    };
    getPoolRate: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    determineCollateralRatio: {
      params: CallContractParams<{
        tokenAmount: bigint;
        collateralAmount: bigint;
      }>;
      result: CallContractResult<bigint>;
    };
    determineCollateralAmount: {
      params: CallContractParams<{ tokenAmount: bigint; desiredRatio: bigint }>;
      result: CallContractResult<bigint>;
    };
    getTotalRepayment: {
      params: CallContractParams<{ contract: HexString }>;
      result: CallContractResult<bigint>;
    };
    getPoolFee: {
      params: CallContractParams<{ amount: bigint }>;
      result: CallContractResult<bigint>;
    };
    deposit: {
      params: CallContractParams<{ amount: bigint }>;
      result: CallContractResult<null>;
    };
    withdraw: {
      params: CallContractParams<{ amount: bigint }>;
      result: CallContractResult<null>;
    };
    borrow: {
      params: CallContractParams<{ amount: bigint }>;
      result: CallContractResult<null>;
    };
    repay: {
      params: CallContractParams<{ contract: HexString }>;
      result: CallContractResult<null>;
    };
    liquidate: {
      params: CallContractParams<{ contract: HexString }>;
      result: CallContractResult<null>;
    };
    collectFees: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<null>;
    };
    destoryPool: {
      params: Omit<CallContractParams<{}>, "args">;
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
    getSymbol: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getName: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getDecimals: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getTotalSupply: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getPoolToken: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getSPoolToken: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getPoolRate: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    determineCollateralRatio: {
      params: SignExecuteContractMethodParams<{
        tokenAmount: bigint;
        collateralAmount: bigint;
      }>;
      result: SignExecuteScriptTxResult;
    };
    determineCollateralAmount: {
      params: SignExecuteContractMethodParams<{
        tokenAmount: bigint;
        desiredRatio: bigint;
      }>;
      result: SignExecuteScriptTxResult;
    };
    getTotalRepayment: {
      params: SignExecuteContractMethodParams<{ contract: HexString }>;
      result: SignExecuteScriptTxResult;
    };
    getPoolFee: {
      params: SignExecuteContractMethodParams<{ amount: bigint }>;
      result: SignExecuteScriptTxResult;
    };
    deposit: {
      params: SignExecuteContractMethodParams<{ amount: bigint }>;
      result: SignExecuteScriptTxResult;
    };
    withdraw: {
      params: SignExecuteContractMethodParams<{ amount: bigint }>;
      result: SignExecuteScriptTxResult;
    };
    borrow: {
      params: SignExecuteContractMethodParams<{ amount: bigint }>;
      result: SignExecuteScriptTxResult;
    };
    repay: {
      params: SignExecuteContractMethodParams<{ contract: HexString }>;
      result: SignExecuteScriptTxResult;
    };
    liquidate: {
      params: SignExecuteContractMethodParams<{ contract: HexString }>;
      result: SignExecuteScriptTxResult;
    };
    collectFees: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    destoryPool: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
  }
  export type SignExecuteMethodParams<T extends keyof SignExecuteMethodTable> =
    SignExecuteMethodTable[T]["params"];
  export type SignExecuteMethodResult<T extends keyof SignExecuteMethodTable> =
    SignExecuteMethodTable[T]["result"];
}

class Factory extends ContractFactory<PoolInstance, PoolTypes.Fields> {
  encodeFields(fields: PoolTypes.Fields) {
    return encodeContractFields(
      addStdIdToFields(this.contract, fields),
      this.contract.fieldsSig,
      AllStructs
    );
  }

  eventIndex = { NewDebt: 0, RemoveDebt: 1 };
  consts = {
    PoolCodes: {
      CannotDepositZero: BigInt("0"),
      CannotBorrowZero: BigInt("1"),
      InsufficientLiquidity: BigInt("2"),
      InsufficientCollateral: BigInt("3"),
      NoActiveLoan: BigInt("4"),
      NoOverPayment: BigInt("5"),
      WrongDebtPool: BigInt("6"),
      NotOwner: BigInt("7"),
    },
  };

  at(address: string): PoolInstance {
    return new PoolInstance(address);
  }

  tests = {
    getSymbol: async (
      params: Omit<
        TestContractParamsWithoutMaps<PoolTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<HexString>> => {
      return testMethod(this, "getSymbol", params, getContractByCodeHash);
    },
    getName: async (
      params: Omit<
        TestContractParamsWithoutMaps<PoolTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<HexString>> => {
      return testMethod(this, "getName", params, getContractByCodeHash);
    },
    getDecimals: async (
      params: Omit<
        TestContractParamsWithoutMaps<PoolTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(this, "getDecimals", params, getContractByCodeHash);
    },
    getTotalSupply: async (
      params: Omit<
        TestContractParamsWithoutMaps<PoolTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(this, "getTotalSupply", params, getContractByCodeHash);
    },
    getPoolToken: async (
      params: Omit<
        TestContractParamsWithoutMaps<PoolTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<HexString>> => {
      return testMethod(this, "getPoolToken", params, getContractByCodeHash);
    },
    getSPoolToken: async (
      params: Omit<
        TestContractParamsWithoutMaps<PoolTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<HexString>> => {
      return testMethod(this, "getSPoolToken", params, getContractByCodeHash);
    },
    getPoolRate: async (
      params: Omit<
        TestContractParamsWithoutMaps<PoolTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(this, "getPoolRate", params, getContractByCodeHash);
    },
    determineCollateralRatio: async (
      params: TestContractParamsWithoutMaps<
        PoolTypes.Fields,
        { tokenAmount: bigint; collateralAmount: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(
        this,
        "determineCollateralRatio",
        params,
        getContractByCodeHash
      );
    },
    determineCollateralAmount: async (
      params: TestContractParamsWithoutMaps<
        PoolTypes.Fields,
        { tokenAmount: bigint; desiredRatio: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(
        this,
        "determineCollateralAmount",
        params,
        getContractByCodeHash
      );
    },
    getTotalRepayment: async (
      params: TestContractParamsWithoutMaps<
        PoolTypes.Fields,
        { contract: HexString }
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(
        this,
        "getTotalRepayment",
        params,
        getContractByCodeHash
      );
    },
    getPoolFee: async (
      params: TestContractParamsWithoutMaps<
        PoolTypes.Fields,
        { amount: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(this, "getPoolFee", params, getContractByCodeHash);
    },
    deposit: async (
      params: TestContractParamsWithoutMaps<
        PoolTypes.Fields,
        { amount: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "deposit", params, getContractByCodeHash);
    },
    withdraw: async (
      params: TestContractParamsWithoutMaps<
        PoolTypes.Fields,
        { amount: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "withdraw", params, getContractByCodeHash);
    },
    borrow: async (
      params: TestContractParamsWithoutMaps<
        PoolTypes.Fields,
        { amount: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "borrow", params, getContractByCodeHash);
    },
    repay: async (
      params: TestContractParamsWithoutMaps<
        PoolTypes.Fields,
        { contract: HexString }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "repay", params, getContractByCodeHash);
    },
    liquidate: async (
      params: TestContractParamsWithoutMaps<
        PoolTypes.Fields,
        { contract: HexString }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "liquidate", params, getContractByCodeHash);
    },
    collectFees: async (
      params: Omit<
        TestContractParamsWithoutMaps<PoolTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "collectFees", params, getContractByCodeHash);
    },
    destoryPool: async (
      params: Omit<
        TestContractParamsWithoutMaps<PoolTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "destoryPool", params, getContractByCodeHash);
    },
  };

  stateForTest(initFields: PoolTypes.Fields, asset?: Asset, address?: string) {
    return this.stateForTest_(initFields, asset, address, undefined);
  }
}

// Use this object to test and deploy the contract
export const Pool = new Factory(
  Contract.fromJson(
    PoolContractJson,
    "",
    "0a9ace41598c44188bf5ed4afe1528e5c21da991df7c76f8ed742bad80f73110",
    AllStructs
  )
);
registerContract(Pool);

// Use this class to interact with the blockchain
export class PoolInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<PoolTypes.State> {
    return fetchContractState(Pool, this);
  }

  async getContractEventsCurrentCount(): Promise<number> {
    return getContractEventsCurrentCount(this.address);
  }

  subscribeNewDebtEvent(
    options: EventSubscribeOptions<PoolTypes.NewDebtEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      Pool.contract,
      this,
      options,
      "NewDebt",
      fromCount
    );
  }

  subscribeRemoveDebtEvent(
    options: EventSubscribeOptions<PoolTypes.RemoveDebtEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      Pool.contract,
      this,
      options,
      "RemoveDebt",
      fromCount
    );
  }

  subscribeAllEvents(
    options: EventSubscribeOptions<
      PoolTypes.NewDebtEvent | PoolTypes.RemoveDebtEvent
    >,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvents(Pool.contract, this, options, fromCount);
  }

  view = {
    getSymbol: async (
      params?: PoolTypes.CallMethodParams<"getSymbol">
    ): Promise<PoolTypes.CallMethodResult<"getSymbol">> => {
      return callMethod(
        Pool,
        this,
        "getSymbol",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getName: async (
      params?: PoolTypes.CallMethodParams<"getName">
    ): Promise<PoolTypes.CallMethodResult<"getName">> => {
      return callMethod(
        Pool,
        this,
        "getName",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getDecimals: async (
      params?: PoolTypes.CallMethodParams<"getDecimals">
    ): Promise<PoolTypes.CallMethodResult<"getDecimals">> => {
      return callMethod(
        Pool,
        this,
        "getDecimals",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getTotalSupply: async (
      params?: PoolTypes.CallMethodParams<"getTotalSupply">
    ): Promise<PoolTypes.CallMethodResult<"getTotalSupply">> => {
      return callMethod(
        Pool,
        this,
        "getTotalSupply",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getPoolToken: async (
      params?: PoolTypes.CallMethodParams<"getPoolToken">
    ): Promise<PoolTypes.CallMethodResult<"getPoolToken">> => {
      return callMethod(
        Pool,
        this,
        "getPoolToken",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getSPoolToken: async (
      params?: PoolTypes.CallMethodParams<"getSPoolToken">
    ): Promise<PoolTypes.CallMethodResult<"getSPoolToken">> => {
      return callMethod(
        Pool,
        this,
        "getSPoolToken",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getPoolRate: async (
      params?: PoolTypes.CallMethodParams<"getPoolRate">
    ): Promise<PoolTypes.CallMethodResult<"getPoolRate">> => {
      return callMethod(
        Pool,
        this,
        "getPoolRate",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    determineCollateralRatio: async (
      params: PoolTypes.CallMethodParams<"determineCollateralRatio">
    ): Promise<PoolTypes.CallMethodResult<"determineCollateralRatio">> => {
      return callMethod(
        Pool,
        this,
        "determineCollateralRatio",
        params,
        getContractByCodeHash
      );
    },
    determineCollateralAmount: async (
      params: PoolTypes.CallMethodParams<"determineCollateralAmount">
    ): Promise<PoolTypes.CallMethodResult<"determineCollateralAmount">> => {
      return callMethod(
        Pool,
        this,
        "determineCollateralAmount",
        params,
        getContractByCodeHash
      );
    },
    getTotalRepayment: async (
      params: PoolTypes.CallMethodParams<"getTotalRepayment">
    ): Promise<PoolTypes.CallMethodResult<"getTotalRepayment">> => {
      return callMethod(
        Pool,
        this,
        "getTotalRepayment",
        params,
        getContractByCodeHash
      );
    },
    getPoolFee: async (
      params: PoolTypes.CallMethodParams<"getPoolFee">
    ): Promise<PoolTypes.CallMethodResult<"getPoolFee">> => {
      return callMethod(
        Pool,
        this,
        "getPoolFee",
        params,
        getContractByCodeHash
      );
    },
    deposit: async (
      params: PoolTypes.CallMethodParams<"deposit">
    ): Promise<PoolTypes.CallMethodResult<"deposit">> => {
      return callMethod(Pool, this, "deposit", params, getContractByCodeHash);
    },
    withdraw: async (
      params: PoolTypes.CallMethodParams<"withdraw">
    ): Promise<PoolTypes.CallMethodResult<"withdraw">> => {
      return callMethod(Pool, this, "withdraw", params, getContractByCodeHash);
    },
    borrow: async (
      params: PoolTypes.CallMethodParams<"borrow">
    ): Promise<PoolTypes.CallMethodResult<"borrow">> => {
      return callMethod(Pool, this, "borrow", params, getContractByCodeHash);
    },
    repay: async (
      params: PoolTypes.CallMethodParams<"repay">
    ): Promise<PoolTypes.CallMethodResult<"repay">> => {
      return callMethod(Pool, this, "repay", params, getContractByCodeHash);
    },
    liquidate: async (
      params: PoolTypes.CallMethodParams<"liquidate">
    ): Promise<PoolTypes.CallMethodResult<"liquidate">> => {
      return callMethod(Pool, this, "liquidate", params, getContractByCodeHash);
    },
    collectFees: async (
      params?: PoolTypes.CallMethodParams<"collectFees">
    ): Promise<PoolTypes.CallMethodResult<"collectFees">> => {
      return callMethod(
        Pool,
        this,
        "collectFees",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    destoryPool: async (
      params?: PoolTypes.CallMethodParams<"destoryPool">
    ): Promise<PoolTypes.CallMethodResult<"destoryPool">> => {
      return callMethod(
        Pool,
        this,
        "destoryPool",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
  };

  transact = {
    getSymbol: async (
      params: PoolTypes.SignExecuteMethodParams<"getSymbol">
    ): Promise<PoolTypes.SignExecuteMethodResult<"getSymbol">> => {
      return signExecuteMethod(Pool, this, "getSymbol", params);
    },
    getName: async (
      params: PoolTypes.SignExecuteMethodParams<"getName">
    ): Promise<PoolTypes.SignExecuteMethodResult<"getName">> => {
      return signExecuteMethod(Pool, this, "getName", params);
    },
    getDecimals: async (
      params: PoolTypes.SignExecuteMethodParams<"getDecimals">
    ): Promise<PoolTypes.SignExecuteMethodResult<"getDecimals">> => {
      return signExecuteMethod(Pool, this, "getDecimals", params);
    },
    getTotalSupply: async (
      params: PoolTypes.SignExecuteMethodParams<"getTotalSupply">
    ): Promise<PoolTypes.SignExecuteMethodResult<"getTotalSupply">> => {
      return signExecuteMethod(Pool, this, "getTotalSupply", params);
    },
    getPoolToken: async (
      params: PoolTypes.SignExecuteMethodParams<"getPoolToken">
    ): Promise<PoolTypes.SignExecuteMethodResult<"getPoolToken">> => {
      return signExecuteMethod(Pool, this, "getPoolToken", params);
    },
    getSPoolToken: async (
      params: PoolTypes.SignExecuteMethodParams<"getSPoolToken">
    ): Promise<PoolTypes.SignExecuteMethodResult<"getSPoolToken">> => {
      return signExecuteMethod(Pool, this, "getSPoolToken", params);
    },
    getPoolRate: async (
      params: PoolTypes.SignExecuteMethodParams<"getPoolRate">
    ): Promise<PoolTypes.SignExecuteMethodResult<"getPoolRate">> => {
      return signExecuteMethod(Pool, this, "getPoolRate", params);
    },
    determineCollateralRatio: async (
      params: PoolTypes.SignExecuteMethodParams<"determineCollateralRatio">
    ): Promise<
      PoolTypes.SignExecuteMethodResult<"determineCollateralRatio">
    > => {
      return signExecuteMethod(Pool, this, "determineCollateralRatio", params);
    },
    determineCollateralAmount: async (
      params: PoolTypes.SignExecuteMethodParams<"determineCollateralAmount">
    ): Promise<
      PoolTypes.SignExecuteMethodResult<"determineCollateralAmount">
    > => {
      return signExecuteMethod(Pool, this, "determineCollateralAmount", params);
    },
    getTotalRepayment: async (
      params: PoolTypes.SignExecuteMethodParams<"getTotalRepayment">
    ): Promise<PoolTypes.SignExecuteMethodResult<"getTotalRepayment">> => {
      return signExecuteMethod(Pool, this, "getTotalRepayment", params);
    },
    getPoolFee: async (
      params: PoolTypes.SignExecuteMethodParams<"getPoolFee">
    ): Promise<PoolTypes.SignExecuteMethodResult<"getPoolFee">> => {
      return signExecuteMethod(Pool, this, "getPoolFee", params);
    },
    deposit: async (
      params: PoolTypes.SignExecuteMethodParams<"deposit">
    ): Promise<PoolTypes.SignExecuteMethodResult<"deposit">> => {
      return signExecuteMethod(Pool, this, "deposit", params);
    },
    withdraw: async (
      params: PoolTypes.SignExecuteMethodParams<"withdraw">
    ): Promise<PoolTypes.SignExecuteMethodResult<"withdraw">> => {
      return signExecuteMethod(Pool, this, "withdraw", params);
    },
    borrow: async (
      params: PoolTypes.SignExecuteMethodParams<"borrow">
    ): Promise<PoolTypes.SignExecuteMethodResult<"borrow">> => {
      return signExecuteMethod(Pool, this, "borrow", params);
    },
    repay: async (
      params: PoolTypes.SignExecuteMethodParams<"repay">
    ): Promise<PoolTypes.SignExecuteMethodResult<"repay">> => {
      return signExecuteMethod(Pool, this, "repay", params);
    },
    liquidate: async (
      params: PoolTypes.SignExecuteMethodParams<"liquidate">
    ): Promise<PoolTypes.SignExecuteMethodResult<"liquidate">> => {
      return signExecuteMethod(Pool, this, "liquidate", params);
    },
    collectFees: async (
      params: PoolTypes.SignExecuteMethodParams<"collectFees">
    ): Promise<PoolTypes.SignExecuteMethodResult<"collectFees">> => {
      return signExecuteMethod(Pool, this, "collectFees", params);
    },
    destoryPool: async (
      params: PoolTypes.SignExecuteMethodParams<"destoryPool">
    ): Promise<PoolTypes.SignExecuteMethodResult<"destoryPool">> => {
      return signExecuteMethod(Pool, this, "destoryPool", params);
    },
  };

  async multicall<Calls extends PoolTypes.MultiCallParams>(
    calls: Calls
  ): Promise<PoolTypes.MultiCallResults<Calls>>;
  async multicall<Callss extends PoolTypes.MultiCallParams[]>(
    callss: Narrow<Callss>
  ): Promise<PoolTypes.MulticallReturnType<Callss>>;
  async multicall<
    Callss extends PoolTypes.MultiCallParams | PoolTypes.MultiCallParams[]
  >(callss: Callss): Promise<unknown> {
    return await multicallMethods(Pool, this, callss, getContractByCodeHash);
  }
}
