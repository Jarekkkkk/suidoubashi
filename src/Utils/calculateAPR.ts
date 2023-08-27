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

export const calculate_vesdb = (bal: string, end: string) => {
  const diff = Math.floor(
    (new Date(parseInt(end) * 1000).getTime() - new Date().getTime()) / 1000,
  )
  return ((BigInt(diff) * BigInt(bal)) / BigInt(14515200)).toString()
}
