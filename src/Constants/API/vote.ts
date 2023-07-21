import { JsonRpcProvider, ObjectId, SUI_CLOCK_OBJECT_ID, SUI_TYPE_ARG, TransactionBlock, getObjectFields, getObjectType, isValidSuiAddress, isValidSuiObjectId, normalizeSuiAddress, normalizeSuiObjectId } from "@mysten/sui.js";

import { vote_package } from "../bcs/vote";
import { Vsdb } from "./vsdb";

// Options for rpc calling
export const defaultOptions = {
    showType: true,
    showContent: true,
    showOwner: false,
    showPreviousTransaction: false,
    showStorageRebate: false,
    showDisplay: false,
};

export type Voter = {
    id: ObjectId
    version: string,
    balance: string,
    total_weight: string,
    pool_weights: { pooL_id: ObjectId, weight: string }[],
    registry: { pool_id: ObjectId, members: { gauge: ObjectId, bribe: ObjectId, rewards: ObjectId } }[],
}

export type Gauge = {
    id: ObjectId,
    version: string,
    type_x: string,
    type_y: string,
    is_alive: boolean,
    pool: ObjectId,
    total_stakes: string
}

export type Bribe = {
    id: ObjectId,
    version: string,
    type_x: string,
    type_y: string,
    total_votes: string
}

export type Rewards = {
    type_x: string,
    type_y: string,
    balance_x: string,
    balance_y: string,
    balance_sdb?: string,
    balance_sui?: string
}

export interface VotingState {
    pool_votes: { pool_id: ObjectId, votes: string }[],
    voted: boolean,
    used_weights: string,
    last_voted: string
}

export async function get_voter(rpc: JsonRpcProvider, id: string): Promise<Voter | null> {
    if (!isValidSuiObjectId(id)) return null

    const voter = await rpc.getObject({ id, options: defaultOptions })
    const fields = getObjectFields(voter)

    if (!fields) return null

    // pool_weights
    const registry_df_id = normalizeSuiObjectId(fields.registry.fields.id.id);
    const pool_weights_df_id = normalizeSuiObjectId(fields.weights.fields.id.id)
    const pools_ = await rpc.getDynamicFields({
        parentId: registry_df_id
    })

    const registry_promises = pools_.data.map((df) => rpc.getDynamicFieldObject({ parentId: registry_df_id, name: df.name }))
    const weights_promises = pools_.data.map((df) => rpc.getDynamicFieldObject({ parentId: pool_weights_df_id, name: df.name }))

    const registry = (await Promise.all(registry_promises)).map((pool) => {
        const data = getObjectFields(pool)
        if (!data) return null
        return {
            pool_id: data.name, members: {
                gauge: data.value.fields.contents[0],
                bribe: data.value.fields.contents[1],
                rewards: data.value.fields.contents[2]
            }
        }
    })
    const pool_weights = (await Promise.all(weights_promises)).map((pool) => {
        const data = getObjectFields(pool)
        if (!data) return null
        return { pooL_id: data.name, weight: data.value }
    })

    return {
        ...fields,
        id: fields.id.id,
        pool_weights,
        registry
    } as Voter
}

export async function get_gauge(rpc: JsonRpcProvider, id: string): Promise<Gauge | null> {
    if (!isValidSuiObjectId(id)) return null

    const bribe = await rpc.getObject({ id, options: defaultOptions })
    const fields = getObjectFields(bribe)

    if (!fields) return null

    const objectType = fields ? getObjectType(fields!) : null;

    const [X, Y] = objectType?.slice(objectType.indexOf("<") + 1, objectType.indexOf(">")).split(",").map((t) => t.trim()) ?? []

    return {
        ...fields,
        type_x: X,
        type_y: Y
    } as Gauge
}

export async function get_bribe(rpc: JsonRpcProvider, id: string): Promise<Bribe | null> {
    if (!isValidSuiObjectId(id)) return null

    const bribe = await rpc.getObject({ id, options: defaultOptions })
    const fields = getObjectFields(bribe)

    if (!fields) return null

    const objectType = fields ? getObjectType(fields!) : null;

    const [X, Y] = objectType?.slice(objectType.indexOf("<") + 1, objectType.indexOf(">")).split(",").map((t) => t.trim()) ?? []

    return {
        ...fields,
        type_x: X,
        type_y: Y
    } as Bribe
}

export async function get_rewards(rpc: JsonRpcProvider, id: string): Promise<Rewards | null> {
    if (!isValidSuiObjectId(id)) return null

    const rewards_obj = await rpc.getObject({ id, options: defaultOptions })
    const fields = getObjectFields(rewards_obj)

    if (!fields) return null

    const objectType = fields ? getObjectType(fields!) : null;

    const [X, Y] = objectType?.slice(objectType.indexOf("<") + 1, objectType.indexOf(">")).split(",").map((t) => t.trim()) ?? []

    // balances
    const entries = [
        {
            type: "0x1::type_name::TypeName",
            value: { name: X.slice(2) }
        },
        {
            type: "0x1::type_name::TypeName",
            value: { name: Y.slice(2) }
        }
    ]

    const sdb_type = `${process.env.vsdb_pkg}::sdb::SDB`
    if (entries[0].type != sdb_type && entries[1].type != sdb_type) {
        entries.push({
            type: "0x1::type_name::TypeName",
            value: { name: sdb_type.slice(2) }
        })
    }
    if (entries[0].type != SUI_TYPE_ARG && entries[1].type != SUI_TYPE_ARG) {
        entries.push({
            type: "0x1::type_name::TypeName",
            value: { name: "0000000000000000000000000000000000000000000000000000000000000002::sui::SUI" }
        })
    }

    const promises = entries.map((e) => rpc.getDynamicFieldObject({ parentId: id, name: e }))
    const rewards = (await Promise.all(promises)).map((reward) => {
        return getObjectFields(reward)?.balance ?? ""
    })

    return {
        ...fields,
        type_x: X,
        type_y: Y,
        balance_x: rewards[0],
        balance_y: rewards[1],
        balance_sdb: rewards?.[2] ?? undefined,
        balance_sui: rewards?.[3] ?? undefined
    } as Rewards
}

// Voting Actions
export async function vote(txb: TransactionBlock, voter: Voter, vsdb: Vsdb, pools: string[], weights: string[], gauges: Gauge[], bribes: Bribe[]) {
    let potato = txb.moveCall({
        target: `${vote_package}::voter::voting_entry`,
        arguments: [
            txb.object(vsdb.id),
            txb.object(SUI_CLOCK_OBJECT_ID)
        ]
    });

    potato = txb.moveCall({
        target: `${vote_package}::voter::vote_entry`,
        arguments: [
            potato,
            txb.object(voter.id),
            txb.pure(pools, 'vector<address>'),
            txb.pure(weights, 'vector<u64>')
        ]
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
            txb.object(SUI_CLOCK_OBJECT_ID)
        ]
    })

    txb.moveCall({
        target: `${vote_package}::voter::vote_exit`,
        arguments: [
            potato,
            txb.object(voter.id),
            txb.object(vsdb.id)
        ]
    })
}