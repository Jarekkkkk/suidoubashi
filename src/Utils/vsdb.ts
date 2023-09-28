const WEEK = 604800

export const calculate_vesdb = (bal: string, end: string) => {
  const diff = Math.floor(
    (new Date(parseInt(end) * 1000).getTime() - new Date().getTime()) / 1000,
  )
  return ((BigInt(diff) * BigInt(bal)) / BigInt(14515200)).toString()
}


export const parseIpfsUrl = (ipfsUrl: string) =>
  ipfsUrl.replace(/^ipfs:\/\//, 'https://ipfs.io/ipfs/')


export const round_down_week = (end: number) => end - end % WEEK
