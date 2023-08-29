export const SETTING_STORAGE_NAME = 'setting'

const setSettingToken = (token: string) => {
  localStorage.setItem(SETTING_STORAGE_NAME, token)
}

const getSettingToken = () => localStorage.getItem(SETTING_STORAGE_NAME)

const removeSettingToken = () => localStorage.removeItem(SETTING_STORAGE_NAME)

const SettingModule = {
  getSettingToken,
  setSettingToken,
  removeSettingToken,
}

export default SettingModule
