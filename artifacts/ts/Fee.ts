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
import { default as FeeContractJson } from "../fees/Fee.ral.json";
import { getContractByCodeHash, registerContract } from "./contracts";
import {
  DIAOracleValue,
  OracleData,
  PairInfo,
  TokenData,
  AllStructs,
} from "./types";

// Custom types for the contract
export namespace FeeTypes {
  export type Fields = {
    admin: Address;
    parentContract: Address;
    asset: HexString;
    fees: bigint;
    hasGas: boolean;
  };

  export type State = ContractState<Fields>;

  export interface CallMethodTable {
    withdrawAsset: {
      params: CallContractParams<{
        caller: Address;
        who: Address;
        amount: bigint;
      }>;
      result: CallContractResult<null>;
    };
    depositInCollector: {
      params: CallContractParams<{
        caller: Address;
        token: HexString;
        amount: bigint;
      }>;
      result: CallContractResult<null>;
    };
    destroyFee: {
      params: CallContractParams<{ caller: Address }>;
      result: CallContractResult<null>;
    };
    editAdmin: {
      params: CallContractParams<{ newAdmin: Address }>;
      result: CallContractResult<null>;
    };
    forceDestroy: {
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
    withdrawAsset: {
      params: SignExecuteContractMethodParams<{
        caller: Address;
        who: Address;
        amount: bigint;
      }>;
      result: SignExecuteScriptTxResult;
    };
    depositInCollector: {
      params: SignExecuteContractMethodParams<{
        caller: Address;
        token: HexString;
        amount: bigint;
      }>;
      result: SignExecuteScriptTxResult;
    };
    destroyFee: {
      params: SignExecuteContractMethodParams<{ caller: Address }>;
      result: SignExecuteScriptTxResult;
    };
    editAdmin: {
      params: SignExecuteContractMethodParams<{ newAdmin: Address }>;
      result: SignExecuteScriptTxResult;
    };
    forceDestroy: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
  }
  export type SignExecuteMethodParams<T extends keyof SignExecuteMethodTable> =
    SignExecuteMethodTable[T]["params"];
  export type SignExecuteMethodResult<T extends keyof SignExecuteMethodTable> =
    SignExecuteMethodTable[T]["result"];
}

class Factory extends ContractFactory<FeeInstance, FeeTypes.Fields> {
  encodeFields(fields: FeeTypes.Fields) {
    return encodeContractFields(
      addStdIdToFields(this.contract, fields),
      this.contract.fieldsSig,
      AllStructs
    );
  }

  at(address: string): FeeInstance {
    return new FeeInstance(address);
  }

  tests = {
    withdrawAsset: async (
      params: TestContractParamsWithoutMaps<
        FeeTypes.Fields,
        { caller: Address; who: Address; amount: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "withdrawAsset", params, getContractByCodeHash);
    },
    depositInCollector: async (
      params: TestContractParamsWithoutMaps<
        FeeTypes.Fields,
        { caller: Address; token: HexString; amount: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(
        this,
        "depositInCollector",
        params,
        getContractByCodeHash
      );
    },
    destroyFee: async (
      params: TestContractParamsWithoutMaps<
        FeeTypes.Fields,
        { caller: Address }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "destroyFee", params, getContractByCodeHash);
    },
    editAdmin: async (
      params: TestContractParamsWithoutMaps<
        FeeTypes.Fields,
        { newAdmin: Address }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "editAdmin", params, getContractByCodeHash);
    },
    forceDestroy: async (
      params: Omit<
        TestContractParamsWithoutMaps<FeeTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "forceDestroy", params, getContractByCodeHash);
    },
  };

  stateForTest(initFields: FeeTypes.Fields, asset?: Asset, address?: string) {
    return this.stateForTest_(initFields, asset, address, undefined);
  }
}

// Use this object to test and deploy the contract
export const Fee = new Factory(
  Contract.fromJson(
    FeeContractJson,
    "",
    "7d30a33f107ac7cd95192632eb2a92ee6891a9129039a7d91d04d9f6701fc7a2",
    AllStructs
  )
);
registerContract(Fee);

// Use this class to interact with the blockchain
export class FeeInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<FeeTypes.State> {
    return fetchContractState(Fee, this);
  }

  view = {
    withdrawAsset: async (
      params: FeeTypes.CallMethodParams<"withdrawAsset">
    ): Promise<FeeTypes.CallMethodResult<"withdrawAsset">> => {
      return callMethod(
        Fee,
        this,
        "withdrawAsset",
        params,
        getContractByCodeHash
      );
    },
    depositInCollector: async (
      params: FeeTypes.CallMethodParams<"depositInCollector">
    ): Promise<FeeTypes.CallMethodResult<"depositInCollector">> => {
      return callMethod(
        Fee,
        this,
        "depositInCollector",
        params,
        getContractByCodeHash
      );
    },
    destroyFee: async (
      params: FeeTypes.CallMethodParams<"destroyFee">
    ): Promise<FeeTypes.CallMethodResult<"destroyFee">> => {
      return callMethod(Fee, this, "destroyFee", params, getContractByCodeHash);
    },
    editAdmin: async (
      params: FeeTypes.CallMethodParams<"editAdmin">
    ): Promise<FeeTypes.CallMethodResult<"editAdmin">> => {
      return callMethod(Fee, this, "editAdmin", params, getContractByCodeHash);
    },
    forceDestroy: async (
      params?: FeeTypes.CallMethodParams<"forceDestroy">
    ): Promise<FeeTypes.CallMethodResult<"forceDestroy">> => {
      return callMethod(
        Fee,
        this,
        "forceDestroy",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
  };

  transact = {
    withdrawAsset: async (
      params: FeeTypes.SignExecuteMethodParams<"withdrawAsset">
    ): Promise<FeeTypes.SignExecuteMethodResult<"withdrawAsset">> => {
      return signExecuteMethod(Fee, this, "withdrawAsset", params);
    },
    depositInCollector: async (
      params: FeeTypes.SignExecuteMethodParams<"depositInCollector">
    ): Promise<FeeTypes.SignExecuteMethodResult<"depositInCollector">> => {
      return signExecuteMethod(Fee, this, "depositInCollector", params);
    },
    destroyFee: async (
      params: FeeTypes.SignExecuteMethodParams<"destroyFee">
    ): Promise<FeeTypes.SignExecuteMethodResult<"destroyFee">> => {
      return signExecuteMethod(Fee, this, "destroyFee", params);
    },
    editAdmin: async (
      params: FeeTypes.SignExecuteMethodParams<"editAdmin">
    ): Promise<FeeTypes.SignExecuteMethodResult<"editAdmin">> => {
      return signExecuteMethod(Fee, this, "editAdmin", params);
    },
    forceDestroy: async (
      params: FeeTypes.SignExecuteMethodParams<"forceDestroy">
    ): Promise<FeeTypes.SignExecuteMethodResult<"forceDestroy">> => {
      return signExecuteMethod(Fee, this, "forceDestroy", params);
    },
  };
}
