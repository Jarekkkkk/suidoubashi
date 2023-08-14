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
