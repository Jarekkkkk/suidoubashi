import {
  JsonRpcProvider,
  ObjectId,
  SUI_CLOCK_OBJECT_ID,
  SUI_TYPE_ARG,
  SuiAddress,
  TransactionBlock,
  getObjectFields,
  getObjectType,
  isValidSuiObjectId,
  normalizeStructTag,
  normalizeSuiObjectId,
} from '@mysten/sui.js'

import { Vsdb, vsdb_package } from './vsdb'
import { bcs_registry } from '../bcs'

export const vote_package = import.meta.env.VITE_VOTE_PACKAGE as string
export const gauges_df_id = import.meta.env.VITE_GAUGES_DF_ID as string
export const pool_weights_df_id = import.meta.env
  .VITE_POOL_WEIGHTS_DF_ID as string
export const voter = import.meta.env.VITE_VOTER_TESTNET as string

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

export type Bribe = {
  id: ObjectId
  version: string
  type_x: string
  type_y: string
  total_votes: string
}

export type Rewards = {
  type_x: string
  type_y: string
  balance_x: string
  balance_y: string
  balance_sdb?: string
  balance_sui?: string
}

export interface VotingState {
  pool_votes: { pool_id: ObjectId; votes: string }[]
  voted: boolean
  used_weights: string
  last_voted: string
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

export async function get_rewards(
  rpc: JsonRpcProvider,
  id: string,
): Promise<Rewards | null> {
  if (!isValidSuiObjectId(id)) return null

  const rewards_obj = await rpc.getObject({ id, options: defaultOptions })
  const fields = getObjectFields(rewards_obj)

  if (!fields) return null

  const objectType = fields ? getObjectType(fields!) : null

  const [X, Y] =
    objectType
      ?.slice(objectType.indexOf('<') + 1, objectType.indexOf('>'))
      .split(',')
      .map((t) => t.trim()) ?? []

  // balances
  const entries = [
    {
      type: '0x1::type_name::TypeName',
      value: { name: X.slice(2) },
    },
    {
      type: '0x1::type_name::TypeName',
      value: { name: Y.slice(2) },
    },
  ]

  const sdb_type = `${vsdb_package}::sdb::SDB`
  if (entries[0].type != sdb_type && entries[1].type != sdb_type) {
    entries.push({
      type: '0x1::type_name::TypeName',
      value: { name: sdb_type.slice(2) },
    })
  }
  if (entries[0].type != SUI_TYPE_ARG && entries[1].type != SUI_TYPE_ARG) {
    entries.push({
      type: '0x1::type_name::TypeName',
      value: {
        name: '0000000000000000000000000000000000000000000000000000000000000002::sui::SUI',
      },
    })
  }

  const promises = entries.map((e) =>
    rpc.getDynamicFieldObject({ parentId: id, name: e }),
  )
  const rewards = (await Promise.all(promises)).map((reward) => {
    return getObjectFields(reward)?.balance ?? ''
  })

  return {
    ...fields,
    type_x: X,
    type_y: Y,
    balance_x: rewards[0],
    balance_y: rewards[1],
    balance_sdb: rewards?.[2] ?? undefined,
    balance_sui: rewards?.[3] ?? undefined,
  } as Rewards
}

// Voting Actions
export async function vote(
  txb: TransactionBlock,
  voter: Voter,
  vsdb: Vsdb,
  pools: string[],
  weights: string[],
  gauges: Gauge[],
  _bribes: Bribe[],
) {
  let potato = txb.moveCall({
    target: `${vote_package}::voter::voting_entry`,
    arguments: [txb.object(vsdb.id), txb.object(SUI_CLOCK_OBJECT_ID)],
  })

  potato = txb.moveCall({
    target: `${vote_package}::voter::vote_entry`,
    arguments: [
      potato,
      txb.object(voter.id),
      txb.pure(pools, 'vector<address>'),
      txb.pure(weights, 'vector<u64>'),
    ],
  })

  const member = voter.registry[0].members
  potato = txb.moveCall({
    target: `${vote_package}::voter::vote_`,
    typeArguments: [gauges[0].type_x, gauges[0].type_y],
    arguments: [
      potato,
      txb.object(voter.id),
      txb.object(vsdb.id),
      txb.object(member.gauge),
      txb.object(member.bribe),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })

  txb.moveCall({
    target: `${vote_package}::voter::vote_exit`,
    arguments: [potato, txb.object(voter.id), txb.object(vsdb.id)],
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
