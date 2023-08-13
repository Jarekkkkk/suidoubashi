import {
  JsonRpcProvider,
  ObjectId,
  SUI_CLOCK_OBJECT_ID,
  TransactionBlock,
  getObjectFields,
  getObjectDisplay,
  DisplayFieldsResponse,
  getObjectId,
} from '@mysten/sui.js'
import { AMMState } from './pool'
import { VotingState } from './vote'
import { bcs_registry } from '../bcs'

export const vsdb_package = import.meta.env.VITE_VSDB_PACKAGE as string
export const vsdb_reg = import.meta.env.VITE_VSDB_REG as string
// Options for rpc calling
export const defaultOptions = {
  showType: false,
  showContent: true,
  showOwner: false,
  showPreviousTransaction: false,
  showStorageRebate: false,
  showDisplay: false,
}

export function mint_sdb(txb: TransactionBlock, address: string) {
  txb.moveCall({
    target: '0x2::coin::mint_and_transfer',
    typeArguments: [`${vsdb_package}::sdb::SDB`],
    arguments: [
      txb.object(
        '0x472ec685810e4d0a5c7900a04330379685a1cceb5c9281c089f2e7d4a540438b',
      ),
      txb.pure(100000000000),
      txb.pure(address),
    ],
  })
}

export type Vsdb = {
  id: ObjectId
  level: string
  experience: string
  vesdb: string
  balance: string
  end: string
  modules: string[]
  amm_state?: AMMState
  voting_state?: VotingState
  display: DisplayFieldsResponse['data']
}

export async function get_vsdb(
  rpc: JsonRpcProvider,
  address: string,
  id: string,
): Promise<Vsdb> {
  const res = await rpc.getObject({
    id,
    options: {
      showContent: true,
      showDisplay: true,
    },
  })
  const { balance, level, end, experience, modules } = getObjectFields(res) as any
  id = getObjectId(res)
  const display = getObjectDisplay(res).data
  const vesdb = await voting_weight(rpc, address, id)
  return {
    id,
    level,
    balance,
    end,
    experience,
    vesdb,
    modules: modules.fields.contents,
    display,
  } as Vsdb
}

export async function lock(
  txb: TransactionBlock,
  coin_sdb: any,
  duration: string,
) {
  txb.moveCall({
    target: `${vsdb_package}::vsdb::lock`,
    arguments: [
      txb.object(vsdb_reg),
      coin_sdb,
      txb.pure(duration),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })
}

export async function increase_unlock_time(
  txb: TransactionBlock,
  vsdb: string,
  extended_duration: string,
) {
  txb.moveCall({
    target: `${vsdb_package}::vsdb::increase_unlock_time`,
    arguments: [
      txb.object(vsdb_reg),
      txb.object(vsdb),
      txb.pure(extended_duration),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })
}

export async function increase_unlock_amount(
  txb: TransactionBlock,
  vsdb: string,
  coin_sdb: any,
) {
  txb.moveCall({
    target: `${vsdb_package}::vsdb::increase_unlock_amount`,
    arguments: [
      txb.object(vsdb_reg),
      txb.object(vsdb),
      coin_sdb,
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })
}

export async function merge(txb: TransactionBlock, self: string, vsdb: string) {
  txb.moveCall({
    target: `${vsdb_package}::vsdb::merge`,
    arguments: [
      txb.object(vsdb_reg),
      txb.object(self),
      txb.object(vsdb),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })
}

export async function revive(
  txb: TransactionBlock,
  vsdb: string,
  withdrawl: string,
  extended_duration: string,
) {
  txb.moveCall({
    target: `${vsdb_package}::vsdb::revive`,
    arguments: [
      txb.object(vsdb_reg),
      txb.object(vsdb),
      txb.pure(withdrawl),
      txb.pure(extended_duration),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })
}

export interface Deposit {
  id: string
  locked_value: string
  unlock_time: string
}

export async function unlock(txb: TransactionBlock, vsdb: string) {
  txb.moveCall({
    target: `${vsdb_package}::vsdb::unlock`,
    arguments: [
      txb.object(vsdb_reg),
      txb.object(vsdb),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })
}

export interface Withdraw {
  id: string
  unlocked_value: string
  ts: string
}

export async function voting_weight(
  rpc: JsonRpcProvider,
  sender: string,
  vsdb: string,
) {
  let txb = new TransactionBlock()
  txb.moveCall({
    target: `${vsdb_package}::vsdb::voting_weight`,
    arguments: [txb.object(vsdb), txb.object(SUI_CLOCK_OBJECT_ID)],
  })
  let res = await rpc.devInspectTransactionBlock({
    sender,
    transactionBlock: txb,
  })
  const returnValue = res?.results?.at(0)?.returnValues?.at(0)
  if (!returnValue) {
    return '0'
  } else {
    const valueType = returnValue[1].toString()
    const valueData = Uint8Array.from(returnValue[0] as Iterable<number>)
    return bcs_registry.de(valueType, valueData, 'hex')
  }
}

// Gaming
export async function upgrade(txb: TransactionBlock, vsdb: string) {
  txb.moveCall({
    target: `${vsdb_package}::vsdb::unlock`,
    arguments: [
      txb.object(vsdb_reg),
      txb.object(vsdb),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })
}

export interface LevelUp {
  id: string
  level: string
}
