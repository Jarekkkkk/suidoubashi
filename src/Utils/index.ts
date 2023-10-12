export function extract_err_message(err: string) {
  const regex = /(\d+)\)/

  const match = err.match(regex)

  if (match) {
    return match[1]
  } else {
    throw new Error('No Error Code')
  }
}
