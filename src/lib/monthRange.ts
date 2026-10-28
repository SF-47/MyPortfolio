const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// Parses a range written like "January 2026 – July 2026" into month numbers (year * 12 + month),
// both ends included. Used to place roles on the experience timeline straight from the data.
export function parseMonthRange(text: string): { start: number; end: number } {
  const [from, to] = text.split(/\s*[–-]\s*/)
  const parse = (part: string) => {
    const [month, year] = part.trim().split(/\s+/)
    const index = MONTHS.findIndex((name) => name.toLowerCase() === month.toLowerCase())
    if (index < 0 || Number.isNaN(Number(year))) throw new Error(`Cannot read month and year from "${part}"`)
    return Number(year) * 12 + index
  }
  return { start: parse(from), end: parse(to) }
}

export const monthName = (monthNumber: number) => MONTHS[monthNumber % 12]
export const yearOf = (monthNumber: number) => Math.floor(monthNumber / 12)
