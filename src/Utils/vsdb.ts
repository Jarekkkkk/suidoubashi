
export const calculate_vesdb = (bal: string, end: string) => {
  const diff = Math.floor(
    (new Date(parseInt(end) * 1000).getTime() - new Date().getTime()) / 1000,
  )
  return ((BigInt(diff) * BigInt(bal)) / BigInt(14515200)).toString()
}
