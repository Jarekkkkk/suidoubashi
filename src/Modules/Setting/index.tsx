export const GAS_BUDGET_STORAGE_NAME = 'gasBudget'
export const EXPIRATION_STORAGE_NAME = 'expiration'
export const SLIPPAGE_STORAGE_NAME = 'slippage'

const getGadBudgetToken = () => localStorage.getItem(GAS_BUDGET_STORAGE_NAME)
const getExpirationToken = () => localStorage.getItem(EXPIRATION_STORAGE_NAME)
const getSlippageToken = () => localStorage.getItem(SLIPPAGE_STORAGE_NAME)

const setGadBudgetToken = (value: string) =>
  localStorage.setItem(GAS_BUDGET_STORAGE_NAME, value)
const setExpirationToken = (value: string) =>
  localStorage.setItem(EXPIRATION_STORAGE_NAME, value)
const setSlippageToken = (value: string) =>
  localStorage.setItem(SLIPPAGE_STORAGE_NAME, value)

const removeGasBudgetToken = () =>
  localStorage.removeItem(GAS_BUDGET_STORAGE_NAME)
const removeExpirationToken = () =>
  localStorage.removeItem(EXPIRATION_STORAGE_NAME)
const removeSlippageToken = () => localStorage.removeItem(SLIPPAGE_STORAGE_NAME)

const SettingModule = {
  // get
  getGadBudgetToken,
  getExpirationToken,
  getSlippageToken,
  // set
  setGadBudgetToken,
  setExpirationToken,
  setSlippageToken,
  //remove
  removeGasBudgetToken,
  removeExpirationToken,
  removeSlippageToken,
}

export default SettingModule
