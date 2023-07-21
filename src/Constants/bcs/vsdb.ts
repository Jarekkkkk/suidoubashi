import { bcs_registry } from "./iindex";

export const vsdb_package = import.meta.env.VITE_VSDB_PACKAGE as string

bcs_registry
    .registerStructType([`${vsdb_package}::event::Deposit`, "X", "Y"], {
        id: "address",
        locked_value: "u64",
        unlock_time: "u64",
    })
    .registerStructType([`${vsdb_package}::event::Withdraw`, "X", "Y"], {
        id: "address",
        unlocked_value: "u64",
        ts: "u64",
    })