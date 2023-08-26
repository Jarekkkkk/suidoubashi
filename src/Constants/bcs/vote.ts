import { bcs_registry } from "./index";

export const vote_package = import.meta.env.VITE_VOTE_PACKAGE as string

bcs_registry
    .registerStructType([`${vote_package}::event::ClaimReward`], {
        claimer: "address",
        value: "u64",
    })
    .registerStructType([`${vote_package}::event::NotifyRewards`, "T"], {
        value: "u64",
    })
    .registerStructType([`${vote_package}::event::DepositLP`, "X", "Y"], {
        from: "address",
        amount: "u64",
    })
    .registerStructType([`${vote_package}::event::WithdrawLP`, "X", "Y"], {
        from: "address",
        amount: "u64",
    })
    .registerStructType([`${vote_package}::event::Voted`, "X", "Y"], {
        vadb: "address",
        amount: "u64",
    })
    .registerStructType([`${vote_package}::event::Abstain`, "X", "Y"], {
        vadb: "address",
        amount: "u64",
    })