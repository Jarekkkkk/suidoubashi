
import { bcs_registry } from "./index"
import { BCS } from "@mysten/bcs";

export const amm_package = import.meta.env.VITE_AMM_PACKAGE as string

bcs_registry.registerStructType(
    [`${amm_package}::pool::LP`, "X", "Y"], {
    id: "address",
    lp_balance: BCS.U64,
    index_x: BCS.U256,
    index_y: BCS.U256,
    claimable_x: BCS.U64,
    claimable_y: BCS.U64,
})
    .registerStructType(`${amm_package}::event::LiquidityAdded<V,X,Y>`, {
        deposit_x: "u64",
        deposit_y: "u64",
        lp_token: "u64"
    })
    .registerStructType(`${amm_package}::event::LiquidityRemoved<V,X,Y>`, {
        withdrawl_x: "u64",
        withdrawl_y: "u64",
        burned_lp: "u64"
    })
    .registerStructType([`${amm_package}::event::Swap`, "X", "Y"], {
        input: "u64",
        output: "u64",
    })
    .registerStructType([`${amm_package}::event::Sync`, "X", "Y"], {
        res_x: "u64",
        res_y: "u64",
    })
    .registerStructType([`${amm_package}::event::Fee`, "T"], {
        amount: "u64",
    })
    .registerStructType([`${amm_package}::event::Claim`, "X", "Y"], {
        from: "address",
        amount_x: "u64",
        amount_y: "u64",
    })
