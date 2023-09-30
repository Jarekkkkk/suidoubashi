import BigNumber from 'bignumber.js'

export const calculateAPR = (
  rewards: string,
  price_in_stable: string,
  tvl_in_stable: string,
) => {
  return (
    BigNumber(rewards)
      .multipliedBy(price_in_stable)
      .div(tvl_in_stable)
      .multipliedBy(100)
      .multipliedBy(365)
      .toFormat() + '%'
  )
}

export const calculateVAPR = (
  weekly_bribe_rewards: string,
  acc_votes: string,
  sdb_price: string,
) => {
  return (
    BigNumber(weekly_bribe_rewards)
      .div(acc_votes)
      .div(sdb_price)
      .multipliedBy(100)
      .toFormat() + '%'
  )
}

export const calculate_slippage = (slippage: string, output_value: string) => {
  return (
    ((BigInt('10000') - BigInt(slippage)) * BigInt(output_value)) /
    BigInt('10000')
  )
}

export const lp_position = (
  res: string,
  lp_supply: string,
  lp_balance: string,
  decimals: number,
) => {
  return BigNumber(res)
    .multipliedBy(lp_balance)
    .dividedBy(lp_supply)
    .shiftedBy(-decimals)
    .decimalPlaces(decimals)
    .toFormat()
}

export const get_fee_deduction = (stable: boolean, level: string) => {
  const level_ = parseInt(level)
  return stable ? Math.floor(level_ / 3) : level_
}
