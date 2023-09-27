import {
  JsonRpcProvider,
  ObjectId,
  SUI_CLOCK_OBJECT_ID,
  TransactionBlock,
  getObjectFields,
  getObjectDisplay,
  getObjectId,
  normalizeStructTag,
} from '@mysten/sui.js'
import { AMMState, amm_package } from './pool'
import { VotingState, vote_package } from './vote'
import { bcs_registry } from '../bcs'
import { parseIpfsUrl } from '@/Utils/vsdb'

export const vsdb_package = import.meta.env.VITE_VSDB_PACKAGE_TESTNET as string
export const vsdb_reg = import.meta.env.VITE_VSDB_REG_TESTNET as string
export const vsdb_cap = import.meta.env.VITE_SDB_CAP as string

export const coin_list_package = import.meta.env
  .VITE_COIN_LIST_PACKAGE as string
export const sdb_faucet = import.meta.env.VITE_SDB_FAUCET as string
export function mint_sdb(txb: TransactionBlock) {
  txb.moveCall({
    target: `${coin_list_package}::faucet::take`,
    arguments: [txb.object(sdb_faucet)],
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
  display: Record<Display, string>
}

enum Display {
  DESCRIPTION = 'description',
  IMAGE_URL = 'image_url',
  LINK = 'link',
  PROJECT_URL = 'project_url',
}

const vsdb_dynamic_key = (vsdb_key_type: string) =>
  `${vsdb_package}::vsdb::VSDBKey<${vsdb_key_type}>`

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
  //@ts-ignore
  const { balance, level, end, experience, modules } = getObjectFields(res)
  id = getObjectId(res)
  const display = getObjectDisplay(res).data as Record<Display, string>
  display['image_url'] = parseIpfsUrl(display['image_url'])
  // dynamic state
  const amm_state = await rpc.getDynamicFieldObject({
    parentId: id,
    name: {
      type: vsdb_dynamic_key(`${amm_package}::pool::VSDB`),
      value: { dummy_field: false },
    },
  })
  const voting_state_ = await rpc.getDynamicFieldObject({
    parentId: id,
    name: {
      type: vsdb_dynamic_key(`${vote_package}::voter::VSDB`),
      value: { dummy_field: false },
    },
    //name: df.data[0].name,
  })

  let voting_state = getObjectFields(voting_state_)?.value?.fields
  let pool_votes: any = {}
  let unclaimed_rewards: any = {}

  if (voting_state?.pool_votes) {
    voting_state?.pool_votes?.fields?.contents?.forEach((v_s: any) => {
      const { key, value } = v_s.fields
      pool_votes[key] = value
    })
    voting_state.pool_votes = pool_votes
  }

  if (voting_state?.unclaimed_rewards) {
    voting_state?.unclaimed_rewards?.fields?.contents.forEach((v_s: any) => {
      const { key, value } = v_s.fields
      const types = value.fields?.contents.map((t: any) =>
        normalizeStructTag(t.fields.name),
      )
      unclaimed_rewards[key] = types
    })
    voting_state.unclaimed_rewards = unclaimed_rewards
  }
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
    amm_state: getObjectFields(amm_state)?.value?.fields,
    voting_state,
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
  const returnValue = res?.results?.[0]?.returnValues?.[0]
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
