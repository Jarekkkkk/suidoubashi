import BigNumber from 'bignumber.js'

const WEEK = 604800

export const calculate_vesdb = (bal: string, end: string) => {
  const diff = Math.floor(
    (new Date(parseInt(end) * 1000).getTime() - new Date().getTime()) / 1000,
  )
  return ((BigInt(diff) * BigInt(bal)) / BigInt(14515200)).toString()
}

export const parseIpfsUrl = (ipfsUrl: string) =>
  ipfsUrl.replace(/^ipfs:\/\//, 'https://ipfs.io/ipfs/')

export const round_down_week = (end: number) => end - (end % WEEK)

export const handleIncreaseDurationVesdbOnchange = (
  balance: string | undefined,
  end: string,
) => {
  return BigNumber(
    calculate_vesdb(
      balance || '0',
      (new Date(end).getTime() / 1000).toString(),
    ),
  )
    .shiftedBy(-9)
    .decimalPlaces(3)
    .toFormat()
}
