import {
  JsonRpcProvider,
  ObjectId,
  SUI_CLOCK_OBJECT_ID,
  SuiAddress,
  TransactionBlock,
  getObjectFields,
  getObjectType,
  isValidSuiObjectId,
  normalizeStructTag,
} from '@mysten/sui.js'

import { vsdb_reg } from './vsdb'
import { bcs_registry } from '../bcs'

export const vote_package = import.meta.env.VITE_VOTE_PACKAGE_TESTNET as string
export const gauges_df_id = import.meta.env.VITE_GAUGES_DF_ID as string
export const pool_weights_df_id = import.meta.env
  .VITE_POOL_WEIGHTS_DF_ID as string
export const voter = import.meta.env.VITE_VOTER_TESTNET as string
export const minter = import.meta.env.VITE_MINTER_TESTNET as string

// Options for rpc calling
export const defaultOptions = {
  showType: true,
  showContent: true,
  showOwner: false,
  showPreviousTransaction: false,
  showStorageRebate: false,
  showDisplay: false,
}

export type Voter = {
  id: string
  total_weight: string
  pool_weights: { pool_id: ObjectId; weight: string }[]
}

export type Gauge = {
  id: string
  type_x: string
  type_y: string
  is_alive: boolean
  pool: string
  bribe: string
  rewards: string
  total_stakes: string
}

export type Stake = {
  type_x: string
  type_y: string
  stakes: string
  pending_sdb: string
}

export type Bribe = {
  id: ObjectId
  version: string
  type_x: string
  type_y: string
  total_votes: string
}

export type Rewards = {
  id: string
  bribe: string
  pool: string
  name: string
  type_x: string
  type_y: string
  rewards: {
    type: string
    value: string
  }[]
}

interface LooseObject {
  [key: string]: any
}

export interface VotingState {
  pool_votes: LooseObject
  unclaimed_rewards: LooseObject
  voted: boolean
  used_weights: string
  last_voted: string
}

export async function initialize_voting_state(
  txb: TransactionBlock,
  vsdb: string,
) {
  txb.moveCall({
    target: `${vote_package}::voter::initialize`,
    arguments: [txb.object(vsdb_reg), txb.object(vsdb)],
  })
}

export async function clear_voting_state(txb: TransactionBlock, vsdb: string) {
  txb.moveCall({
    target: `${vote_package}::voter::clear`,
    arguments: [txb.object(vsdb)],
  })
}

export async function get_voter(
  rpc: JsonRpcProvider,
  id: string,
): Promise<Voter | null> {
  if (!isValidSuiObjectId(id)) return null

  const voter = await rpc.getObject({ id, options: defaultOptions })
  const { total_weight } = getObjectFields(voter) as any

  // pool_weights
  const pools_ = await rpc.getDynamicFields({
    parentId: pool_weights_df_id,
  })
  const weights_promises = pools_.data.map((df) =>
    rpc.getDynamicFieldObject({ parentId: pool_weights_df_id, name: df.name }),
  )

  const pool_weights = (await Promise.all(weights_promises)).map((pool) => {
    const data = getObjectFields(pool)
    if (!data) return null
    return { pool_id: data.name, weight: data.value }
  })

  return {
    id,
    total_weight,
    pool_weights,
  } as Voter
}

export async function get_gauge(
  rpc: JsonRpcProvider,
  id: string,
): Promise<Gauge | null> {
  if (!isValidSuiObjectId(id)) return null

  const gauge = await rpc.getObject({ id, options: defaultOptions })
  const { bribe, rewards, pool, total_stakes, is_alive } = getObjectFields(
    gauge,
  ) as any

  const objectType = getObjectType(gauge)

  const [X, Y] =
    objectType
      ?.slice(objectType.indexOf('<') + 1, objectType.indexOf('>'))
      .split(',')
      .map((t) => t.trim()) ?? []

  return {
    id,
    type_x: normalizeStructTag(X),
    type_y: normalizeStructTag(Y),
    is_alive,
    pool,
    bribe,
    rewards,
    total_stakes: total_stakes.fields.lp_balance,
  } as Gauge
}

export async function get_bribe(
  rpc: JsonRpcProvider,
  id: string,
): Promise<Bribe | null> {
  if (!isValidSuiObjectId(id)) return null

  const bribe = await rpc.getObject({ id, options: defaultOptions })
  const fields = getObjectFields(bribe)

  if (!fields) return null

  const objectType = fields ? getObjectType(fields!) : null

  const [X, Y] =
    objectType
      ?.slice(objectType.indexOf('<') + 1, objectType.indexOf('>'))
      .split(',')
      .map((t) => t.trim()) ?? []

  return {
    ...fields,
    type_x: X,
    type_y: Y,
  } as Bribe
}

async function rewards_per_epoch(
  rpc: JsonRpcProvider,
  sender: SuiAddress,
  rewards: string,
  pool_type_x: string,
  pool_type_y: string,
  input_type: string,
  ts: string,
): Promise<string> {
  let txb = new TransactionBlock()
  txb.moveCall({
    target: `${vote_package}::bribe::rewards_per_epoch`,
    typeArguments: [pool_type_x, pool_type_y, input_type],
    arguments: [txb.object(rewards), txb.pure(ts)],
  })
  let res = await rpc.devInspectTransactionBlock({
    sender,
    transactionBlock: txb,
  })
  const returnValue = res?.results?.[0]?.returnValues?.[0]
  if (!returnValue) {
    return '0'
  } else {
    const valueType = returnValue[1].toString()
    const valueData = Uint8Array.from(returnValue[0] as Iterable<number>)
    return bcs_registry.de(valueType, valueData, 'hex')
  }
}

export async function get_rewards(
  rpc: JsonRpcProvider,
  sender: string,
  gauge: Gauge,
): Promise<Rewards | null> {
  const rewards_obj = await rpc.getObject({
    id: gauge.rewards,
    options: defaultOptions,
  })
  const fields = getObjectFields(rewards_obj)

  if (!fields) return null

  const objectType = getObjectType(rewards_obj)
  const rewards_type = fields.rewards_type.fields.contents.map(
    (r: any) => r.fields.name,
  )
  const [X, Y] =
    objectType
      ?.slice(objectType.indexOf('<') + 1, objectType.indexOf('>'))
      .split(',')
      .map((t) => normalizeStructTag(t.trim())) ?? []
  const name = X.split('::')[2] + '-' + Y.split('::')[2]
  //  // balances
  //  const entries = [
  //    {
  //      type: '0x1::type_name::TypeName',
  //      value: { name: X },
  //    },
  //    {
  //      type: '0x1::type_name::TypeName',
  //      value: { name: Y },
  //    },
  //  ]
  //
  //  const sdb_type = `${vsdb_package}::sdb::SDB`
  //  if (entries[0].value.name != sdb_type && entries[1].value.name != sdb_type) {
  //    entries.push({
  //      type: '0x1::type_name::TypeName',
  //      value: { name: sdb_type.slice(2) },
  //    })
  //  }
  //  if (
  //    entries[0].value.name != normalizeStructTag(SUI_TYPE_ARG) &&
  //    entries[1].value.name != normalizeStructTag(SUI_TYPE_ARG)
  //  ) {
  //    entries.push({
  //      type: '0x1::type_name::TypeName',
  //      value: {
  //        name: '0000000000000000000000000000000000000000000000000000000000000002::sui::SUI',
  //      },
  //    })
  //  }

  //  const promises = entries.map((e) =>
  //    rpc.getDynamicFieldObject({ parentId: id, name: e }),
  //  )
  const ts = Math.floor(Date.now() / 1000)
  let rewards = []

  for (const type of rewards_type) {
    const value = await rewards_per_epoch(
      rpc,
      sender,
      gauge.rewards,
      X,
      Y,
      type,
      ts.toString(),
    )
    rewards.push({ type: normalizeStructTag(type), value })
  }

  return {
    id: gauge.rewards,
    bribe: gauge.bribe,
    pool: gauge.pool,
    name,
    type_x: normalizeStructTag(X),
    type_y: normalizeStructTag(Y),
    rewards,
  } as Rewards
}

export function voting_entry(txb: TransactionBlock, vsdb: string) {
  return txb.moveCall({
    target: `${vote_package}::voter::voting_entry`,
    arguments: [txb.object(vsdb), txb.object(SUI_CLOCK_OBJECT_ID)],
  })
}

export function reset_(
  txb: TransactionBlock,
  potato: any,
  vsdb: string,
  gauge: string,
  bribe: string,
  type_x: string,
  type_y: string,
) {
  return txb.moveCall({
    target: `${vote_package}::voter::reset_`,
    typeArguments: [type_x, type_y],
    arguments: [
      potato,
      txb.object(voter),
      txb.object(minter),
      txb.object(vsdb),
      txb.object(gauge),
      txb.object(bribe),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })
}
export function reset_exit(txb: TransactionBlock, potato: any, vsdb: string) {
  txb.moveCall({
    target: `${vote_package}::voter::reset_exit`,
    arguments: [potato, txb.object(voter), txb.object(vsdb)],
  })
}

export function vote_entry(
  txb: TransactionBlock,
  potato: any,
  vsdb: string,
  pools: string[],
  weights: string[],
) {
  if (pools.length != weights.length) throw new Error('pools length unmatched ')
  return txb.moveCall({
    target: `${vote_package}::voter::vote_entry`,
    arguments: [
      potato,
      txb.object(voter),
      txb.object(vsdb),
      txb.pure(pools, 'vector<address>'),
      txb.pure(weights, 'vector<u64>'),
    ],
  })
}

export function vote_exit(txb: TransactionBlock, potato: any, vsdb: string) {
  txb.moveCall({
    target: `${vote_package}::voter::vote_exit`,
    arguments: [potato, txb.object(voter), txb.object(vsdb)],
  })
}

export function vote_(
  txb: TransactionBlock,
  potato: any,
  vsdb: string,
  gauge: string,
  bribe: string,
  rewards: string,
  type_x: string,
  type_y: string,
) {
  return txb.moveCall({
    target: `${vote_package}::voter::vote_`,
    typeArguments: [type_x, type_y],
    arguments: [
      potato,
      txb.object(voter),
      txb.object(minter),
      txb.object(vsdb),
      txb.object(gauge),
      txb.object(bribe),
      txb.object(rewards),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })
}

export async function pool_weights(
  rpc: JsonRpcProvider,
  sender: SuiAddress,
  pool: string,
  gauge_type_x: string,
  gauge_type_y: string,
): Promise<string> {
  let txb = new TransactionBlock()
  txb.moveCall({
    target: `${vote_package}::pool::get_output`,
    typeArguments: [gauge_type_x, gauge_type_y],
    arguments: [txb.object(voter), txb.object(pool)],
  })
  let res = await rpc.devInspectTransactionBlock({
    sender,
    transactionBlock: txb,
  })
  const returnValue = res?.results?.[0]?.returnValues?.[0]
  if (!returnValue) {
    return '0'
  } else {
    const valueType = returnValue[1].toString()
    const valueData = Uint8Array.from(returnValue[0] as Iterable<number>)
    return bcs_registry.de(valueType, valueData, 'hex')
  }
}

export function stake_all(
  txb: TransactionBlock,
  gauge_id: string,
  pool_id: string,
  gauge_type_x: string,
  gauge_type_y: string,
  lp: any,
) {
  txb.moveCall({
    target: `${vote_package}::gauge::stake_all`,
    typeArguments: [gauge_type_x, gauge_type_y],
    arguments: [
      txb.object(gauge_id),
      txb.object(pool_id),
      lp,
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })
}

export function unstake(
  txb: TransactionBlock,
  gauge_id: string,
  pool_id: string,
  gauge_type_x: string,
  gauge_type_y: string,
  lp: string,
  value: string,
) {
  txb.moveCall({
    target: `${vote_package}::gauge::unstake`,
    typeArguments: [gauge_type_x, gauge_type_y],
    arguments: [
      txb.object(gauge_id),
      txb.object(pool_id),
      txb.object(lp),
      txb.pure(value),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })
}

export function unstake_all(
  txb: TransactionBlock,
  gauge_id: string,
  pool_id: string,
  gauge_type_x: string,
  gauge_type_y: string,
  lp: string,
) {
  txb.moveCall({
    target: `${vote_package}::gauge::unstake_all`,
    typeArguments: [gauge_type_x, gauge_type_y],
    arguments: [
      txb.object(gauge_id),
      txb.object(pool_id),
      txb.object(lp),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })
}

export async function get_stake_balance(
  rpc: JsonRpcProvider,
  sender: SuiAddress,
  gauge: string,
  type_x: string,
  type_y: string,
): Promise<string> {
  let txb = new TransactionBlock()
  txb.moveCall({
    target: `${vote_package}::gauge::lp_stakes`,
    typeArguments: [type_x, type_y],
    arguments: [txb.object(gauge), txb.pure(sender)],
  })
  let res = await rpc.devInspectTransactionBlock({
    sender,
    transactionBlock: txb,
  })
  const returnValue = res?.results?.[0]?.returnValues?.[0]
  if (!returnValue) {
    return '0'
  } else {
    const valueType = returnValue[1].toString()
    const valueData = Uint8Array.from(returnValue[0] as Iterable<number>)
    return bcs_registry.de(valueType, valueData, 'hex')
  }
}

export function bribe(
  txb: TransactionBlock,
  rewards: string,
  coin: any,
  type_x: string,
  type_y: string,
  input_type: string,
) {
  txb.moveCall({
    target: `${vote_package}::bribe::bribe`,
    typeArguments: [type_x, type_y, input_type],
    arguments: [txb.object(rewards), coin, txb.object(SUI_CLOCK_OBJECT_ID)],
  })
}

export async function get_pending_sdb(
  rpc: JsonRpcProvider,
  sender: SuiAddress,
  gauge: string,
  gauge_type_x: string,
  gauge_type_y: string,
): Promise<string> {
  let txb = new TransactionBlock()
  txb.moveCall({
    target: `${vote_package}::gauge::pending_sdb`,
    typeArguments: [gauge_type_x, gauge_type_y],
    arguments: [
      txb.object(gauge),
      txb.pure(sender),
      txb.pure(SUI_CLOCK_OBJECT_ID),
    ],
  })
  let res = await rpc.devInspectTransactionBlock({
    sender,
    transactionBlock: txb,
  })
  const returnValue = res?.results?.[0]?.returnValues?.[0]
  if (!returnValue) {
    return '0'
  } else {
    const valueType = returnValue[1].toString()
    const valueData = Uint8Array.from(returnValue[0] as Iterable<number>)
    return bcs_registry.de(valueType, valueData, 'hex')
  }
}

export async function get_stake(
  rpc: JsonRpcProvider,
  sender: SuiAddress,
  gauge: string,
  type_x: string,
  type_y: string,
) {
  const stakes = await get_stake_balance(rpc, sender, gauge, type_x, type_y)
  const pending_sdb = await get_pending_sdb(rpc, sender, gauge, type_x, type_y)
  return {
    type_x,
    type_y,
    stakes,
    pending_sdb,
  } as Stake
}

export async function earned(
  rpc: JsonRpcProvider,
  sender: SuiAddress,
  bribe: string,
  rewards: string,
  vsdb: string,
  type_x: string,
  type_y: string,
  input_type: string,
): Promise<string> {
  let txb = new TransactionBlock()
  txb.moveCall({
    target: `${vote_package}::bribe::earned`,
    typeArguments: [type_x, type_y, input_type],
    arguments: [
      txb.object(bribe),
      txb.object(rewards),
      txb.object(vsdb),
      txb.pure(SUI_CLOCK_OBJECT_ID),
    ],
  })
  let res = await rpc.devInspectTransactionBlock({
    sender,
    transactionBlock: txb,
  })
  const returnValue = res?.results?.[0]?.returnValues?.[0]
  if (!returnValue) {
    return '0'
  } else {
    const valueType = returnValue[1].toString()
    const valueData = Uint8Array.from(returnValue[0] as Iterable<number>)
    return bcs_registry.de(valueType, valueData, 'hex')
  }
}
