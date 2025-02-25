/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Address, HexString, Val, Struct } from "@alephium/web3";
import { default as allStructsJson } from "../structs.ral.json";
export const AllStructs = allStructsJson.map((json) => Struct.fromJson(json));
export interface DIAOracleValue extends Record<string, Val> {
  value: bigint;
  timestamp: bigint;
}
export interface OracleData extends Record<string, Val> {
  token: HexString;
  value: bigint;
  decimals: bigint;
}
export interface PairInfo extends Record<string, Val> {
  pair: HexString;
  decimals: bigint;
  oracle: boolean;
}
export interface TokenData extends Record<string, Val> {
  value: bigint;
}
