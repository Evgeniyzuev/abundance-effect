// TON address utilities for formatting and parsing

export function formatTonAddress(address: string): string {
  // Remove any URL prefixes if present
  let cleanAddress = address
  
  // Handle TON Connect deep links
  if (address.startsWith('ton://transfer/')) {
    const params = new URLSearchParams(address.split('?')[1])
    cleanAddress = params.get('address') || address
  }
  
  // Handle standard TON addresses (UQ...)
  if (cleanAddress.startsWith('UQ')) {
    const start = cleanAddress.slice(0, 6)
    const end = cleanAddress.slice(-6)
    return `${start}...${end}`
  }
  
  // If it's not a standard format, return as is
  return cleanAddress
}

export function extractTonAddress(input: string): string | null {
  // Handle TON Connect deep links
  if (input.startsWith('ton://transfer/')) {
    try {
      const url = new URL(input)
      const address = url.searchParams.get('address')
      return address || null
    } catch {
      return null
    }
  }
  
  // Handle standard TON addresses
  if (input.startsWith('UQ')) {
    return input
  }
  
  // If it doesn't match expected formats, return null
  return null
}

export function isValidTonAddress(address: string): boolean {
  // Basic validation for TON addresses
  return address.startsWith('UQ') && address.length >= 48
}