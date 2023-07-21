import { DynamicFieldName, JsonRpcProvider, ObjectId, SUI_CLOCK_OBJECT_ID, SuiAddress, TransactionBlock, getObjectFields, getObjectType, isValidSuiAddress, isValidSuiObjectId, normalizeSuiAddress, normalizeSuiObjectId } from "@mysten/sui.js";
import { bcs_registry } from "../bcs/iindex";
import { Vsdb, VsdbReg } from "./vsdb";
import { amm_package } from "../bcs/pool";

// Options for rpc calling
export const defaultOptions = {
    showType: true,
    showContent: true,
    showOwner: false,
    showPreviousTransaction: false,
    showStorageRebate: false,
    showDisplay: false,
};

export type poolReg = {
    id: ObjectId
    guardian: SuiAddress,
    pools: { name: string, id: ObjectId }[],
}

/// [GET] PoolReg
export async function get_pool_reg(rpc: JsonRpcProvider, id: string): Promise<poolReg | null> {
    if (!isValidSuiObjectId(id)) return null


    const pool_gov = await rpc.getObject({ id, options: defaultOptions })
    const fields = getObjectFields(pool_gov)

    if (!fields) return null

    const df_id = normalizeSuiObjectId(fields.pools.fields.id.id);
    const pools_ = await rpc.getDynamicFields({
        parentId: df_id
    })

    const promises = pools_.data.map((df) => rpc.getDynamicFieldObject({ parentId: df_id, name: df.name }))

    const pools = (await Promise.all(promises)).map((pool) => {
        const data = getObjectFields(pool)
        if (!data) return null
        return { name: data.name, id: data.value }
    })

    return {
        ...fields,
        pools
    } as poolReg
}

export type Pool = {
    type_x: string,
    type_y: string,
    id: string,
    name: string,
    stable: boolean,
    locked: boolean
    lp_supply: string
    reserve_x: string
    reserve_y: string
    decimal_x: number,
    decimal_y: number,
    fee: Fee,
}
type Fee = {
    fee_x: string
    fee_y: string
    fee_percentage: string // 2 decimal places
    index_x: string
    index_y: string
}

/// [GET] Pool
export async function get_pool(rpc: JsonRpcProvider, id: string): Promise<Pool | null> {
    const pool = await rpc.getObject({ id, options: defaultOptions });

    const fields = getObjectFields(pool)
    if (!fields?.id) return null

    const objectType = fields ? getObjectType(fields!) : null;

    const [X, Y] = objectType?.slice(objectType.indexOf("<") + 1, objectType.indexOf(">")).split(",").map((t) => t.trim()) ?? []

    return Object.assign({ ...fields }, {
        id: fields.id.id,
        type_x: X,
        type_y: Y,
        fee: getObjectFields(fields.fee),
        lp_supply: fields.lp_supply.fields.value
    }) as Pool
}

/// [GET] get_output
export async function get_output(rpc: JsonRpcProvider, sender: SuiAddress, pool: Pool, input_type: string, input_amount: bigint | number): Promise<string> {
    let txb = new TransactionBlock();
    txb.moveCall(
        {
            target: `${process.env.package}::pool::get_output`,
            typeArguments: [pool.type_x, pool.type_y, input_type] ?? [],
            arguments: [
                txb.object(pool.id), txb.pure(input_amount)
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

/// [POST] add_liquidity
export function add_liquidity(txb: TransactionBlock, pool: Pool, coin_x: any, coin_y: any, lp: any, deposit_x_min: bigint | number, deposit_y_min: bigint | number) {
    txb.moveCall(
        {
            target: `${process.env.package}::pool::add_liquidity`,
            typeArguments: [pool.type_x, pool.type_y] ?? [],
            arguments: [
                txb.object(pool.id),
                coin_x,
                coin_y,
                lp,
                txb.pure(deposit_x_min),
                txb.pure(deposit_y_min),
                txb.object(SUI_CLOCK_OBJECT_ID)
            ]
        }
    )
}

export async function zap_x(txb: TransactionBlock, pool: Pool, coin_x: any, lp: any, deposit_x_min: bigint | number, deposit_y_min: bigint | number) {
    txb.moveCall(
        {
            target: `${process.env.package}::pool::zap_x`,
            typeArguments: [pool.type_x, pool.type_y],
            arguments: [
                txb.object(pool.id),
                coin_x,
                lp,
                txb.pure(deposit_x_min),
                txb.pure(deposit_y_min),
                txb.object(SUI_CLOCK_OBJECT_ID)
            ]
        }
    )
}

export async function zap_y(txb: TransactionBlock, pool: Pool, coin_y: any, lp: LP, deposit_x_min: bigint | number, deposit_y_min: bigint | number) {
    txb.moveCall(
        {
            target: `${process.env.package}::pool::zap_y`,
            typeArguments: [pool.type_x, pool.type_y],
            arguments: [
                txb.object(pool.id),
                coin_y,
                lp,
                txb.pure(deposit_x_min),
                txb.pure(deposit_y_min),
                txb.object(SUI_CLOCK_OBJECT_ID)
            ]
        }
    )
}
///[Response] for zap, add_liqudiity
export interface LiquidityAdded {
    deposit_x: string,
    deposit_y: string,
    lp_token: string,
}

export function remove_liquidity(txb: TransactionBlock, pool: Pool, lp: any, value: bigint | number | string, deposit_x_min: bigint | number | string, deposit_y_min: bigint | number | string) {
    txb.moveCall(
        {
            target: `${process.env.package}::pool::remove_liquidity`,
            typeArguments: [pool.type_x, pool.type_y] ?? [],
            arguments: [
                txb.object(pool.id),
                lp,
                txb.pure(value),
                txb.pure(deposit_x_min),
                txb.pure(deposit_y_min),
                txb.object(SUI_CLOCK_OBJECT_ID)
            ]
        }
    )
}
export interface LiquidityRemoved {
    withdrawl_x: string,
    withdrawl_y: string,
    burned_lp: string
}

export function swap_for_x(txb: TransactionBlock, pool: Pool, coin_y: any, output_x_min: bigint | number | string) {
    txb.moveCall(
        {
            target: `${process.env.package}::pool::swap_for_x`,
            typeArguments: [pool.type_x, pool.type_y] ?? [],
            arguments: [
                txb.object(pool.id), coin_y, txb.pure(output_x_min), txb.object(SUI_CLOCK_OBJECT_ID)
            ]
        }
    )
}

export function swap_for_y(txb: TransactionBlock, pool: Pool, coin_x: any, output_y_min: bigint | number | string) {
    txb.moveCall(
        {
            target: `${process.env.package}::pool::swap_for_y`,
            typeArguments: [pool.type_x, pool.type_y] ?? [],
            arguments: [
                txb.object(pool.id), coin_x, txb.pure(output_y_min), txb.object(SUI_CLOCK_OBJECT_ID)
            ]
        }
    )
}
export interface Swap {
    input: string,
    output: string
}

export type LP = {
    id: string,
    type_x: string,
    type_y: string,
    lp_balance: string,
    claimable_x: string,
    claimable_y: string
}

export async function get_lp(rpc: JsonRpcProvider, address: string): Promise<(LP | null)[] | null> {
    if (!address) {
        return null;
    }

    let owner = normalizeSuiAddress(address);
    if (!isValidSuiAddress(address)) return null
    const { data } = await rpc.getOwnedObjects({
        owner,
        filter: {
            "MatchAll": [
                { StructType: `${process.env.package}::pool::LP` }
            ]
        },
        options: {
            showType: true,
            showContent: true,
        }
    });

    if (data.length == 0) {
        return null;
    }

    return data.map((lp_data) => {
        const type = getObjectType(lp_data)
        let [type_x, type_y] = type?.slice(type.indexOf("<") + 1, type.indexOf(">")).split(",").map((t) => t.trim()) ?? []

        const fields = getObjectFields(lp_data)
        if (!fields) return null
        return {
            ...fields,
            id: fields.id.id,
            type_x,
            type_y
        } as LP
    })
}

export const create_lp = (txb: TransactionBlock, pool: Pool) => {
    return txb.moveCall(
        {
            target: `${process.env.package}::pool::create_lp`,
            typeArguments: [pool.type_x, pool.type_y],
            arguments: [
                txb.object(pool.id),
            ]
        }
    )
}

export function delete_lp(txb: TransactionBlock, lp: LP) {
    txb.moveCall(
        {
            target: `${process.env.package}::pool::delete_lp`,
            typeArguments: [lp.type_x, lp.type_y] ?? [],
            arguments: [
                txb.object(lp.id),
            ]
        }
    );
}

export async function get_claimable_x(rpc: JsonRpcProvider, sender: SuiAddress, lp: LP) {
    let txb = new TransactionBlock();
    txb.moveCall(
        {
            target: `${process.env.package}::pool::get_claimable_x`,
            typeArguments: [lp.type_x, lp.type_y] ?? [],
            arguments: [
                txb.object(lp.id),
            ]
        }
    );
    let res = await rpc.devInspectTransactionBlock({ sender, transactionBlock: txb });

    return res?.results?.at(0)?.returnValues ?? 0
}

export async function get_claimable_y(rpc: JsonRpcProvider, sender: SuiAddress, lp: LP) {
    const txb = new TransactionBlock();
    txb.moveCall(
        {
            target: `${process.env.package}::pool::get_claimable_y`,
            typeArguments: [lp.type_x, lp.type_y] ?? [],
            arguments: [
                txb.object(lp.id),
            ]
        }
    );
    let res = await rpc.devInspectTransactionBlock({ sender, transactionBlock: txb });

    return res?.results?.at(0)?.returnValues ?? 0
}

// gaming

export const AMM_ENTRY: DynamicFieldName = {
    type: `${amm_package}::pool::AMM_SDB`
}
export interface AMMState {
    last_swap: string,
    earned_times: string
}

export async function initialize_AMM(txb: TransactionBlock, vsdb_reg: VsdbReg, vsdb: Vsdb) {
    txb.moveCall(
        {
            target: `${amm_package}::pool::initialize`,
            arguments: [
                txb.object(vsdb_reg.id),
                txb.object(vsdb.id)
            ]
        }
    );
}

export async function clear(txb: TransactionBlock, vsdb: Vsdb) {
    txb.moveCall(
        {
            target: `${amm_package}::pool::clear`,
            arguments: [
                txb.object(vsdb.id)
            ]
        }
    )
}