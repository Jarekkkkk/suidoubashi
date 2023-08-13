import {
  JsonRpcProvider,
  ObjectId,
  SUI_CLOCK_OBJECT_ID,
  SuiAddress,
  TransactionBlock,
  getObjectFields,
  getObjectType,
  isValidSuiAddress,
  isValidSuiObjectId,
  normalizeSuiAddress,
  normalizeSuiObjectId,
} from '@mysten/sui.js'
import { bcs_registry } from '../bcs'

export const amm_package = import.meta.env.VITE_AMM_PACKAGE as string
export const pool_reg = import.meta.env.VITE_POOL_REG as string

export const pools_df_id =
  '0xd1792cdc93fbc30c05f87231748d88cc7417495987f4de27cd99e6ad5565d80b'
export const defaultOptions = {
  showType: true,
  showContent: true,
  showOwner: false,
  showPreviousTransaction: false,
  showStorageRebate: false,
  showDisplay: false,
}

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

/// [GET] Pool
export async function get_pool(
  rpc: JsonRpcProvider,
  id: string,
): Promise<Pool | null> {
  const pool = await rpc.getObject({
    id,
    options: { showType: true, showContent: true },
  })

  const {
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
    id,
    name,
    stable,
    locked,
    reserve_x,
    reserve_y,
    lp_supply: lp_supply.fields.value,
    decimal_x,
    decimal_y,
    type_x: X,
    type_y: Y,
    fee: getObjectFields(fee),
  } as Pool
}

/// [GET] get_output
export async function get_output(
  rpc: JsonRpcProvider,
  sender: SuiAddress,
  pool: Pool,
  input_type: string,
  input_amount: bigint | number,
): Promise<string> {
  let txb = new TransactionBlock()
  txb.moveCall({
    target: `${amm_package}::pool::get_output`,
    typeArguments: [pool.type_x, pool.type_y, input_type] ?? [],
    arguments: [txb.object(pool.id), txb.pure(input_amount)],
  })
  let res = await rpc.devInspectTransactionBlock({
    sender,
    transactionBlock: txb,
  })

  const returnValue = res?.results?.at(0)?.returnValues?.at(0)?.at(0)
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

export async function zap_x(
  txb: TransactionBlock,
  pool: Pool,
  coin_x: any,
  lp: any,
  deposit_x_min: bigint | number,
  deposit_y_min: bigint | number,
) {
  txb.moveCall({
    target: `${amm_package}::pool::zap_x`,
    typeArguments: [pool.type_x, pool.type_y],
    arguments: [
      txb.object(pool.id),
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
  pool: Pool,
  coin_y: any,
  lp: LP,
  deposit_x_min: bigint | number,
  deposit_y_min: bigint | number,
) {
  txb.moveCall({
    target: `${amm_package}::pool::zap_y`,
    typeArguments: [pool.type_x, pool.type_y],
    arguments: [
      txb.object(pool.id),
      coin_y,
      lp,
      txb.pure(deposit_x_min),
      txb.pure(deposit_y_min),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })
}
///[Response] for zap, add_liqudiity
export interface LiquidityAdded {
  deposit_x: string
  deposit_y: string
  lp_token: string
}

export function remove_liquidity(
  txb: TransactionBlock,
  pool: Pool,
  lp: any,
  value: bigint | number | string,
  deposit_x_min: bigint | number | string,
  deposit_y_min: bigint | number | string,
) {
  txb.moveCall({
    target: `${amm_package}::pool::remove_liquidity`,
    typeArguments: [pool.type_x, pool.type_y] ?? [],
    arguments: [
      txb.object(pool.id),
      lp,
      txb.pure(value),
      txb.pure(deposit_x_min),
      txb.pure(deposit_y_min),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })
}
export interface LiquidityRemoved {
  withdrawl_x: string
  withdrawl_y: string
  burned_lp: string
}

export function swap_for_x(
  txb: TransactionBlock,
  pool: Pool,
  coin_y: any,
  output_x_min: bigint | number | string,
) {
  txb.moveCall({
    target: `${amm_package}::pool::swap_for_x`,
    typeArguments: [pool.type_x, pool.type_y] ?? [],
    arguments: [
      txb.object(pool.id),
      coin_y,
      txb.pure(output_x_min),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })
}

export function swap_for_y(
  txb: TransactionBlock,
  pool: Pool,
  coin_x: any,
  output_y_min: bigint | number | string,
) {
  txb.moveCall({
    target: `${amm_package}::pool::swap_for_y`,
    typeArguments: [pool.type_x, pool.type_y] ?? [],
    arguments: [
      txb.object(pool.id),
      coin_x,
      txb.pure(output_y_min),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
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
      type_x,
      type_y,
    } as LP
  })
}

export const create_lp = (txb: TransactionBlock, pool: Pool) => {
  return txb.moveCall({
    target: `${amm_package}::pool::create_lp`,
    typeArguments: [pool.type_x, pool.type_y],
    arguments: [txb.object(pool.id)],
  })
}

export function delete_lp(txb: TransactionBlock, lp: LP) {
  txb.moveCall({
    target: `${amm_package}::pool::delete_lp`,
    typeArguments: [lp.type_x, lp.type_y] ?? [],
    arguments: [txb.object(lp.id)],
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

  return res?.results?.at(0)?.returnValues ?? 0
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

  return res?.results?.at(0)?.returnValues ?? 0
}
