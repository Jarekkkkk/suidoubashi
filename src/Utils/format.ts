import BigNumber from 'bignumber.js'
import moment from 'moment'

export enum CoinFormat {
  ROUNDED = 'ROUNDED',
  FULL = 'FULL',
}
export function formatBalance(
  balance: bigint | number | string | BigNumber,
  decimals: number,
  format: CoinFormat = CoinFormat.ROUNDED,
) {
  if (!balance) return ''
  let postfix = ''
  let bn = new BigNumber(balance.toString()).shiftedBy(-1 * decimals)
  if (format === CoinFormat.FULL) {
    return bn.toFormat()
  }
  if (bn.gte(1_000_000_000)) {
    bn = bn.shiftedBy(-9)
    postfix = ' B'
  } else if (bn.gte(1_000_000)) {
    bn = bn.shiftedBy(-6)
    postfix = ' M'
  } else if (bn.gte(1_000)) {
    bn = bn.shiftedBy(-3)
    postfix = ' K'
  }
  if (bn.gte(1)) {
    bn = bn.decimalPlaces(3, BigNumber.ROUND_DOWN)
  }
  return bn.toFormat() + postfix
}

export function formatDate(timestamp: string) {
  const date = moment.unix(parseInt(timestamp))

  return date.format('Do MMM')
}

export function formatId(id: string, places: number = 4) {
  return id.slice(0, places) + '.'.repeat(places) + id.slice(-places)
}
