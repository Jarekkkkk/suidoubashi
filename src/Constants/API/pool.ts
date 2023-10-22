import {
  JsonRpcProvider,
  ObjectId,
  SUI_CLOCK_OBJECT_ID,
  SuiAddress,
  TransactionBlock,
  getObjectFields,
  getObjectType,
  isValidSuiAddress,
  normalizeStructTag,
  normalizeSuiAddress,
} from '@mysten/sui.js'
import { bcs_registry } from '../bcs'
import { sqrt } from '@/Utils/bigint_math'
import { vsdb_reg } from './vsdb'

export const amm_package = import.meta.env.VITE_AMM_PACKAGE_TESTNET as string
export const pool_reg = import.meta.env.VITE_POOL_REG_TESTNET as string
export const pools_df_id = import.meta.env.VITE_POOLS_DF_ID as string

export type poolReg = {
  id: ObjectId
  guardian: string
  pools: string[]
}

export interface AMMState {
  last_swap: string
  earned_times: string
}

export type Pool = {
  id: string
  type_x: string
  type_y: string
  name: string
  stable: boolean
  locked: boolean
  lp_supply: string
  reserve_x: string
  reserve_y: string
  decimal_x: number
  decimal_y: number
  fee: Fee
}
type Fee = {
  fee_x: string
  fee_y: string
  fee_percentage: string // 2 decimal places
  index_x: string
  index_y: string
}

export async function get_pools(
  rpc: JsonRpcProvider,
  pool_ids: string[],
): Promise<Pool[]> {
  const pools = await rpc.multiGetObjects({
    ids: pool_ids,
    options: { showType: true, showContent: true },
  })
  return pools.map((pool) => {
    const {
      id,
      name,
      stable,
      locked,
      lp_supply,
      reserve_x,
      reserve_y,
      decimal_x,
      decimal_y,
      fee,
    } = getObjectFields(pool) as any
    const type = getObjectType(pool)

    const [X, Y] =
      type
        ?.slice(type.indexOf('<') + 1, type.indexOf('>'))
        .split(',')
        .map((t) => t.trim()) ?? []
    return {
      id: id.id,
      name,
      stable,
      locked,
      reserve_x,
      reserve_y,
      lp_supply: lp_supply.fields.value,
      decimal_x,
      decimal_y,
      type_x: normalizeStructTag(X),
      type_y: normalizeStructTag(Y),
      fee: getObjectFields(fee),
    } as Pool
  })
}

export async function get_output(
  rpc: JsonRpcProvider,
  sender: SuiAddress,
  pool: string,
  pool_type_x: string,
  pool_type_y: string,
  input_type: string,
  input_amount: string | BigInt,
): Promise<string> {
  let txb = new TransactionBlock()
  txb.moveCall({
    target: `${amm_package}::pool::get_output`,
    typeArguments: [pool_type_x, pool_type_y, input_type],
    arguments: [txb.object(pool), txb.pure(input_amount)],
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

export async function get_output_fee(
  rpc: JsonRpcProvider,
  sender: SuiAddress,
  pool: string,
  pool_type_x: string,
  pool_type_y: string,
  input_type: string,
  input_amount: string | BigInt,
  fee_percentage: string,
): Promise<string> {
  let txb = new TransactionBlock()
  txb.moveCall({
    target: `${amm_package}::pool::get_output_fee`,
    typeArguments: [pool_type_x, pool_type_y, input_type],
    arguments: [
      txb.object(pool),
      txb.pure(input_amount),
      txb.pure(fee_percentage),
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

/// [POST] add_liquidity
export function add_liquidity(
  txb: TransactionBlock,
  pool: string,
  type_x: string,
  type_y: string,
  coin_x: any,
  coin_y: any,
  lp: any,
  deposit_x_min: bigint | number,
  deposit_y_min: bigint | number,
) {
  txb.moveCall({
    target: `${amm_package}::pool::add_liquidity`,
    typeArguments: [type_x, type_y],
    arguments: [
      txb.object(pool),
      coin_x,
      coin_y,
      lp,
      txb.pure(deposit_x_min),
      txb.pure(deposit_y_min),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })
}

export async function quote_add_liquidity(
  rpc: JsonRpcProvider,
  sender: SuiAddress,
  pool: string,
  pool_type_x: string,
  pool_type_y: string,
  value_x: string | bigint,
  value_y: string | bigint,
): Promise<string[]> {
  let txb = new TransactionBlock()
  txb.moveCall({
    target: `${amm_package}::pool::quote_add_liquidity`,
    typeArguments: [pool_type_x, pool_type_y],
    arguments: [txb.object(pool), txb.pure(value_x), txb.pure(value_y)],
  })
  let res = await rpc.devInspectTransactionBlock({
    sender,
    transactionBlock: txb,
  })

  return (
    res?.results?.[0]?.returnValues?.map((returnValue) => {
      if (!returnValue) {
        return '0'
      } else {
        const valueType = returnValue[1].toString()
        const valueData = Uint8Array.from(returnValue[0] as Iterable<number>)
        return bcs_registry.de(valueType, valueData, 'hex')
      }
    }) ?? []
  )
}
export async function zap_x(
  txb: TransactionBlock,
  pool: string,
  pool_type_x: string,
  pool_type_y: string,
  coin_x: any,
  lp: any,
  deposit_x_min: bigint | number,
  deposit_y_min: bigint | number,
) {
  txb.moveCall({
    target: `${amm_package}::pool::zap_x`,
    typeArguments: [pool_type_x, pool_type_y],
    arguments: [
      txb.object(pool),
      coin_x,
      lp,
      txb.pure(deposit_x_min),
      txb.pure(deposit_y_min),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })
}

export async function zap_y(
  txb: TransactionBlock,
  pool: string,
  pool_type_x: string,
  pool_type_y: string,
  coin_y: any,
  lp: any,
  deposit_x_min: bigint | number,
  deposit_y_min: bigint | number,
) {
  txb.moveCall({
    target: `${amm_package}::pool::zap_y`,
    typeArguments: [pool_type_x, pool_type_y],
    arguments: [
      txb.object(pool),
      coin_y,
      lp,
      txb.pure(deposit_x_min),
      txb.pure(deposit_y_min),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })
}

export async function zap_optimized_input(
  rpc: JsonRpcProvider,
  sender: SuiAddress,
  reserve: string,
  input_amount: string,
  fee: string,
) {
  let txb = new TransactionBlock()
  txb.moveCall({
    target: `${amm_package}::amm_math::zap_optimized_input`,
    arguments: [txb.pure(reserve), txb.pure(input_amount), txb.pure(fee)],
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

export function zap_optimized_input_(
  reserve: string,
  input: string,
  fee: string,
) {
  const reserve_ = BigInt(reserve)
  const input_ = BigInt(input)

  if (fee == '10') {
    return (
      (sqrt(
        reserve_ * (reserve_ * BigInt(399600100) + input_ * BigInt(399600000)),
      ) -
        reserve_ * BigInt(19990)) /
      BigInt(19980)
    )
  } else if (fee == '20') {
    return (
      (sqrt(
        reserve_ * (reserve_ * BigInt(399600400) + input_ * BigInt(399200000)),
      ) -
        reserve_ * BigInt(19980)) /
      BigInt(19960)
    )
  } else if (fee == '30') {
    return (
      (sqrt(
        reserve_ * (reserve_ * BigInt(398880900) + input_ * BigInt(398800000)),
      ) -
        reserve_ * BigInt(19970)) /
      BigInt(19940)
    )
  } else if (fee == '40') {
    return (
      (sqrt(
        reserve_ * (reserve_ * BigInt(398401600) + input_ * BigInt(39400000)),
      ) -
        reserve_ * BigInt(19960)) /
      BigInt(19920)
    )
  } else {
    return (
      (sqrt(
        reserve_ * (reserve_ * BigInt(398002500) + input_ * BigInt(398000000)),
      ) -
        reserve_ * BigInt(19950)) /
      BigInt(19900)
    )
  }
}
///[Response] for zap, add_liqudiity
export interface LiquidityAdded {
  deposit_x: string
  deposit_y: string
  lp_token: string
}

export function remove_liquidity(
  txb: TransactionBlock,
  pool: string,
  pool_type_x: string,
  pool_type_y: string,
  lp_id: string,
  value: bigint | number | string,
  deposit_x_min: bigint | number | string,
  deposit_y_min: bigint | number | string,
) {
  txb.moveCall({
    target: `${amm_package}::pool::remove_liquidity`,
    typeArguments: [pool_type_x, pool_type_y],
    arguments: [
      txb.object(pool),
      txb.object(lp_id),
      txb.pure(value),
      txb.pure(deposit_x_min),
      txb.pure(deposit_y_min),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })
}
export async function quote_remove_liquidity(
  rpc: JsonRpcProvider,
  sender: SuiAddress,
  pool: string,
  pool_type_x: string,
  pool_type_y: string,
  withdrawl: string,
): Promise<string[]> {
  let txb = new TransactionBlock()
  txb.moveCall({
    target: `${amm_package}::pool::quote_remove_liquidity`,
    typeArguments: [pool_type_x, pool_type_y],
    arguments: [txb.object(pool), txb.pure(withdrawl)],
  })
  let res = await rpc.devInspectTransactionBlock({
    sender,
    transactionBlock: txb,
  })

  return (
    res?.results?.[0]?.returnValues?.map((returnValue) => {
      if (!returnValue) {
        return '0'
      } else {
        const valueType = returnValue[1].toString()
        const valueData = Uint8Array.from(returnValue[0] as Iterable<number>)
        return bcs_registry.de(valueType, valueData, 'hex')
      }
    }) ?? []
  )
}
export interface LiquidityRemoved {
  withdrawl_x: string
  withdrawl_y: string
  lp_token: string
}

export function swap_for_x(
  txb: TransactionBlock,
  pool: string,
  pool_type_x: string,
  pool_type_y: string,
  coin_y: any,
  output_x_min: bigint | number | string,
  vsdb: string | null,
) {
  let arguments_ = [
    txb.object(pool),
    coin_y,
    txb.pure(output_x_min),
    txb.object(SUI_CLOCK_OBJECT_ID),
  ]

  if (vsdb) arguments_.splice(3, 0, txb.object(vsdb))

  txb.moveCall({
    target: `${amm_package}::pool::${vsdb ? 'swap_for_x_vsdb' : 'swap_for_x'}`,
    typeArguments: [pool_type_x, pool_type_y],
    arguments: arguments_,
  })
}

export function swap_for_y(
  txb: TransactionBlock,
  pool: string,
  pool_type_x: string,
  pool_type_y: string,
  coin_x: any,
  output_y_min: bigint | number | string,
  vsdb?: string | null,
) {
  const arguments_ = [
    txb.object(pool),
    coin_x,
    txb.pure(output_y_min),
    txb.object(SUI_CLOCK_OBJECT_ID),
  ]

  if (vsdb) arguments_.splice(3, 0, txb.object(vsdb))

  txb.moveCall({
    target: `${amm_package}::pool::${vsdb ? 'swap_for_y_vsdb' : 'swap_for_y'}`,
    typeArguments: [pool_type_x, pool_type_y],
    arguments: arguments_,
  })
}
export interface Swap {
  input: string
  output: string
}

export type LP = {
  id: string
  type_x: string
  type_y: string
  lp_balance: string
  claimable_x: string
  claimable_y: string
}

export async function get_lp(
  rpc: JsonRpcProvider,
  address: string,
): Promise<(LP | null)[] | null> {
  if (!address) {
    return null
  }

  let owner = normalizeSuiAddress(address)
  if (!isValidSuiAddress(address)) return null
  const { data } = await rpc.getOwnedObjects({
    owner,
    filter: {
      MatchAll: [{ StructType: `${amm_package}::pool::LP` }],
    },
    options: {
      showType: true,
      showContent: true,
    },
  })

  if (data.length == 0) {
    return null
  }

  return data.map((lp_data) => {
    const type = getObjectType(lp_data)
    let [type_x, type_y] =
      type
        ?.slice(type.indexOf('<') + 1, type.indexOf('>'))
        .split(',')
        .map((t) => t.trim()) ?? []

    const fields = getObjectFields(lp_data)
    if (!fields) return null
    return {
      ...fields,
      id: fields.id.id,
      type_x: normalizeStructTag(type_x),
      type_y: normalizeStructTag(type_y),
    } as LP
  })
}

export const create_lp = (
  txb: TransactionBlock,
  pool_id: string,
  type_x: string,
  type_y: string,
) => {
  return txb.moveCall({
    target: `${amm_package}::pool::create_lp`,
    typeArguments: [type_x, type_y],
    arguments: [txb.object(pool_id)],
  })
}

export function delete_lp(
  txb: TransactionBlock,
  lp_id: string,
  type_x: string,
  type_y: string,
) {
  txb.moveCall({
    target: `${amm_package}::pool::delete_lp`,
    typeArguments: [type_x, type_y],
    arguments: [txb.object(lp_id)],
  })
}

export async function get_claimable_x(
  rpc: JsonRpcProvider,
  sender: SuiAddress,
  lp: LP,
) {
  let txb = new TransactionBlock()
  txb.moveCall({
    target: `${amm_package}::pool::get_claimable_x`,
    typeArguments: [lp.type_x, lp.type_y] ?? [],
    arguments: [txb.object(lp.id)],
  })
  let res = await rpc.devInspectTransactionBlock({
    sender,
    transactionBlock: txb,
  })

  return res?.results?.[0]?.returnValues ?? 0
}

export async function get_claimable_y(
  rpc: JsonRpcProvider,
  sender: SuiAddress,
  lp: LP,
) {
  const txb = new TransactionBlock()
  txb.moveCall({
    target: `${amm_package}::pool::get_claimable_y`,
    typeArguments: [lp.type_x, lp.type_y] ?? [],
    arguments: [txb.object(lp.id)],
  })
  let res = await rpc.devInspectTransactionBlock({
    sender,
    transactionBlock: txb,
  })

  return res?.results?.[0]?.returnValues ?? 0
}

export function claim_fees_player(
  txb: TransactionBlock,
  pool: string,
  lp: string,
  type_x: string,
  type_y: string,
) {
  txb.moveCall({
    target: `${amm_package}::pool::claim_fees_player`,
    typeArguments: [type_x, type_y],
    arguments: [txb.object(pool), txb.object(lp)],
  })
}

export async function initialize_amm(txb: TransactionBlock, vsdb: string) {
  txb.moveCall({
    target: `${amm_package}::pool::initialize`,
    arguments: [txb.object(vsdb_reg), txb.object(vsdb)],
  })
}
