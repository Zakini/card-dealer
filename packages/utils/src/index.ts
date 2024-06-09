export const pingDelay = 30_000

export const cardMessage = 'deal-card-next'

interface FindOpenPortOptions<T> {
  attemptPort: (port: number) => T | Promise<T> | never
  isUnavailablePortError: (e: unknown) => boolean
}
const portRangeStart = 6660
const portRangeLength = 10
// eslint-disable-next-line max-len
export const findOpenPort = async <T>({ attemptPort, isUnavailablePortError }: FindOpenPortOptions<T>) => {
  for (let port = portRangeStart; port < portRangeStart + portRangeLength; port++) {
    try {
      return await attemptPort(port)
    } catch (e) {
      if (isUnavailablePortError(e)) continue
      throw e
    }
  }

  const portRangeString = `${portRangeStart} and ${portRangeStart + portRangeLength - 1}`
  throw new Error(`Failed to find open port between ${portRangeString}`)
}
