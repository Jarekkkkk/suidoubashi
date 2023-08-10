import {
  JsonRpcProvider,
  ObjectId,
  SUI_CLOCK_OBJECT_ID,
  TransactionBlock,
  getObjectFields,
  isValidSuiAddress,
  normalizeSuiAddress,
} from '@mysten/sui.js'
import { AMMState } from './pool'
import { VotingState } from './vote'
import { bcs_registry } from '../bcs'
import { BCS } from '@mysten/bcs'

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
      txb.object("0x472ec685810e4d0a5c7900a04330379685a1cceb5c9281c089f2e7d4a540438b"),
      txb.pure(1000000000000),
      txb.pure(address),
    ],
  })
}
export type Vsdb = {
  id: ObjectId
  level: string
  experience: string
  balance: string
  end: string
  player_epoch: string
  modules: string[]
  amm_state?: AMMState
  voting_state?: VotingState
}

export async function get_vsdb(
  rpc: JsonRpcProvider,
  address: string,
): Promise<Vsdb[] | null> {
  if (!address) return null

  if (!isValidSuiAddress(address)) return null
  const { data } = await rpc.getOwnedObjects({
    owner: normalizeSuiAddress(address),
    filter: {
      MatchAll: [{ StructType: `${vsdb_package}::vsdb::Vsdb` }],
    },
    options: {
      showContent: true,
      showDisplay: true,
    },
  })

  if (data.length == 0) return null

  return data.map((vsdb_d) => {
    const fields = getObjectFields(vsdb_d)
    return {
      ...fields,
      id: fields!.id.id as string,
    } as Vsdb
  })
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
  vsdb: Vsdb,
  extended_duration: string,
) {
  txb.moveCall({
    target: `${vsdb_package}::vsdb::increase_unlock_time`,
    arguments: [
      txb.object(vsdb_reg),
      txb.object(vsdb.id),
      txb.pure(extended_duration),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })
}

export async function merge(txb: TransactionBlock, self: Vsdb, vsdb: Vsdb) {
  txb.moveCall({
    target: `${vsdb_package}::vsdb::merge`,
    arguments: [
      txb.object(vsdb_reg),
      txb.object(self.id),
      txb.object(vsdb.id),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })
}

export async function revive(txb: TransactionBlock, vsdb: Vsdb) {
  txb.moveCall({
    target: `${vsdb_package}::vsdb::revive`,
    arguments: [
      txb.object(vsdb_reg),
      txb.object(vsdb.id),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })
}

export interface Deposit {
  id: string
  locked_value: string
  unlock_time: string
}

export async function unlock(txb: TransactionBlock, vsdb: Vsdb) {
  txb.moveCall({
    target: `${vsdb_package}::vsdb::unlock`,
    arguments: [
      txb.object(vsdb_reg),
      txb.object(vsdb.id),
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
export async function upgrade(txb: TransactionBlock, vsdb: Vsdb) {
  txb.moveCall({
    target: `${vsdb_package}::vsdb::unlock`,
    arguments: [
      txb.object(vsdb_reg),
      txb.object(vsdb.id),
      txb.object(SUI_CLOCK_OBJECT_ID),
    ],
  })
}

export interface LevelUp {
  id: string
  level: string
}
