import {
  JsonRpcProvider,
  SUI_CLOCK_OBJECT_ID,
  SuiAddress,
  TransactionBlock,
  getObjectFields,
  getObjectType,
} from '@mysten/sui.js'
import { bcs_registry } from '../bcs'

export type Farm = {
  id: string
  type_x: string
  type_y: string
  lp_balance: string
  alloc_point: string
}

export const farm_package = import.meta.env.VITE_FARM_PACKAGE_TESTNET as string
export const farm_reg = import.meta.env.VITE_FARM_REG_TESTNET as string

export async function get_farm(rpc: JsonRpcProvider, id: string) {
  const res = await rpc.getObject({
    id,
    options: { showType: true, showContent: true },
  })

  const { lp_balance, alloc_point } = getObjectFields(res) as any
  const type = getObjectType(res)
  const [type_x, type_y] =
    type
      ?.slice(type.indexOf('<') + 1, type.indexOf('>'))
      .split(',')
      .map((t) => t.trim()) ?? []

  return {
    id,
    type_x,
    type_y,
    lp_balance,
    alloc_point,
  }
}

export async function get_farm_stake_balance(
  rpc: JsonRpcProvider,
  sender: SuiAddress,
  farm: string,
  farm_type_x: string,
  farm_type_y: string,
  lp: string,
): Promise<string> {
  let txb = new TransactionBlock()
  txb.moveCall({
    target: `${farm_package}::farm::farm_stake_balance`,
    typeArguments: [farm_type_x, farm_type_y],
    arguments: [txb.object(farm), txb.object(lp)],
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
  farm_id: string,
  pool_id: string,
  farm_type_x: string,
  farm_type_y: string,
  lp: string,
) {
  txb.moveCall({
    target: `${farm_package}::farm::stake_all`,
    typeArguments: [farm_type_x, farm_type_y],
    arguments: [
      txb.object(farm_reg),
      txb.object(farm_id),
      txb.object(pool_id),
      txb.object(lp),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })
}

export function unstake_all(
  txb: TransactionBlock,
  farm_id: string,
  pool_id: string,
  farm_type_x: string,
  farm_type_y: string,
  lp: string,
) {
  txb.moveCall({
    target: `${farm_package}::farm::unstake_all`,
    typeArguments: [farm_type_x, farm_type_y],
    arguments: [
      txb.object(farm_reg),
      txb.object(farm_id),
      txb.object(pool_id),
      txb.object(lp),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })
}
