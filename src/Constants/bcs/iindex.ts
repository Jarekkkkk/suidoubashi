// BCS_PACKAGE: https://www.npmjs.com/package/@mysten/bcs
import { BCS, getSuiMoveConfig, } from "@mysten/bcs";
const bcs = new BCS(getSuiMoveConfig());


export const GENERIC_COIN = '0x2::coin::Coin<T>';
export const GENERIC_BALANCE = "0x2::balance::Balance<T>"


export const bcs_registry = bcs
    .registerAlias("0x2::object::ID", BCS.ADDRESS)
    .registerEnumType("Option<T>", {
        none: null,
        some: "T",
    })
    .registerStructType("0x2::table::Table", {
        id: "address",
        size: "u64",
    })
    .registerStructType(["0x2::vec_map::Entry", "K", "V"], {
        key: "K",
        value: "V"
    })
    .registerStructType(["0x2::vec_map::VecMap", "K", "V"], {
        length: BCS.U8,
        contents: ["0x2::vec_map::Entry", "K", "V"]
    })
    .registerStructType(
        ["Balance", "T"], {
        value: BCS.U64
    })
    .registerStructType(
        GENERIC_COIN, {
        id: "address",
        balance: GENERIC_BALANCE
    })
