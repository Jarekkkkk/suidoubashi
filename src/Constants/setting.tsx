export interface SettingInterface {
  gasBudget: string
  expiration: string
  slippage: string // 4 decimals place
}

export const defaultSetting: SettingInterface = {
  gasBudget: '1000000',
  expiration: '30',
  slippage: '200',
}
