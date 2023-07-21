import { JsonRpcProvider, ObjectId, SUI_CLOCK_OBJECT_ID, TransactionBlock, getObjectFields, isValidSuiAddress, normalizeSuiAddress } from "@mysten/sui.js";
import { vsdb_package } from "../bcs/vsdb";
import { AMMState } from "./pool";
import { VotingState } from "./vote";
import { bcs_registry } from "../bcs/iindex";


export const vsdb_reg = import.meta.env.VITE_VSDB_REG as string
// Options for rpc calling
export const defaultOptions = {
    showType: true,
    showContent: true,
    showOwner: false,
    showPreviousTransaction: false,
    showStorageRebate: false,
    showDisplay: false,
};

export type Vsdb = {
    id: ObjectId,
    level: string,
    experience: string,
    balance: string,
    end: string,
    player_epoch: string,
    modules: string[],

    amm_state?: AMMState,
    voting_state?: VotingState
}

export async function get_vsdb(rpc: JsonRpcProvider, address: string): Promise<(Vsdb | null)[] | null> {
    if (!address) return null

    if (!isValidSuiAddress(address)) return null
    const { data } = await rpc.getOwnedObjects({
        owner: normalizeSuiAddress(address),
        filter: {
            "MatchAll": [
                { StructType: `${vsdb_package}::vsdb::Vsdb` }
            ]
        },
        options: {
            showContent: true
        }
    });

    if (data.length == 0) return null

    return data.map((vsdb_d) => {
        const fields = getObjectFields(vsdb_d)
        if (!fields) return null
        return {
            ...fields,
            id: fields.id.id as string,
        } as Vsdb
    })
}

export async function lock(txb: TransactionBlock, coin_sdb: any, duration: string) {
    txb.moveCall(
        {
            target: `${vsdb_package}::vsdb::lock`,
            arguments: [
                txb.object(vsdb_reg),
                coin_sdb,
                txb.pure(duration),
                txb.object(SUI_CLOCK_OBJECT_ID)
            ]
        }
    )
}

export async function increase_unlock_time(txb: TransactionBlock, vsdb: Vsdb, extended_duration: string) {
    txb.moveCall(
        {
            target: `${vsdb_package}::vsdb::increase_unlock_time`,
            arguments: [
                txb.object(vsdb_reg),
                txb.object(vsdb.id),
                txb.pure(extended_duration),
                txb.object(SUI_CLOCK_OBJECT_ID)
            ]
        }
    )
}

export async function merge(txb: TransactionBlock, self: Vsdb, vsdb: Vsdb) {
    txb.moveCall(
        {
            target: `${vsdb_package}::vsdb::merge`,
            arguments: [
                txb.object(vsdb_reg),
                txb.object(self.id),
                txb.object(vsdb.id),
                txb.object(SUI_CLOCK_OBJECT_ID)
            ]
        }
    )
}

export async function revive(txb: TransactionBlock, vsdb: Vsdb) {
    txb.moveCall(
        {
            target: `${vsdb_package}::vsdb::revive`,
            arguments: [
                txb.object(vsdb_reg),
                txb.object(vsdb.id),
                txb.object(SUI_CLOCK_OBJECT_ID)
            ]
        }
    )
}

export interface Deposit {
    id: string,
    locked_value: string,
    unlock_time: string
}

export async function unlock(txb: TransactionBlock, vsdb: Vsdb) {
    txb.moveCall(
        {
            target: `${vsdb_package}::vsdb::unlock`,
            arguments: [
                txb.object(vsdb_reg),
                txb.object(vsdb.id),
                txb.object(SUI_CLOCK_OBJECT_ID)
            ]
        }
    )
}

export interface Withdraw {
    id: string,
    unlocked_value: string,
    ts: string
}

export async function voting_weight(rpc: JsonRpcProvider, sender: string, vsdb: Vsdb) {
    let txb = new TransactionBlock();
    txb.moveCall(
        {
            target: `${process.env.vsdb_pkg}::vsdb::voting_weight`,
            arguments: [
                txb.object(vsdb.id), txb.object(SUI_CLOCK_OBJECT_ID)
            ]
        }
    );
    let res = await rpc.devInspectTransactionBlock({ sender, transactionBlock: txb });

    const returnValue = res?.results?.at(0)?.returnValues?.at(0)?.at(0);
    if (!returnValue) {
        return "0"
    } else {
        const valueType = returnValue[1].toString();
        const valueData = Uint8Array.from(returnValue[0] as Iterable<number>);
        return bcs_registry.de(valueType, valueData, 'hex');
    }
}

// Gaming
export async function upgrade(txb: TransactionBlock, vsdb: Vsdb) {
    txb.moveCall(
        {
            target: `${vsdb_package}::vsdb::unlock`,
            arguments: [
                txb.object(vsdb_reg),
                txb.object(vsdb.id),
                txb.object(SUI_CLOCK_OBJECT_ID)
            ]
        }
    )
}

export interface LevelUp {
    id: string,
    level: string,
}
