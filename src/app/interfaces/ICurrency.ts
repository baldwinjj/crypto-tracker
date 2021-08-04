export interface ICurrency {
  code: string,
  symbol: string,
  precision: number,
  name: string,
  plural: string,
  alts: string,
  minimum: number,
  sanctioned: boolean,
  decimals: number,
  chain?: string
}
