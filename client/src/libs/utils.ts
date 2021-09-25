export const minimizeAddress = (address: string) =>
  address.substr(0, 6) + '...' + address.substr(-4);

export const isSolanaAddress = (address: string) => 
  address.indexOf('0x') === -1 && 32 <= address.length && address.length <= 44 
