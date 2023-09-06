import { Dialog, Button, Input } from '@/Components'
import Image from '@/Assets/image'
import * as styles from './index.styles'
import { useState } from 'react'
import SettingModule from '@/Modules/Setting'
import { Icon } from '@/Assets/icon'

const options = ['0.1', '0.2', '1', '2']

export interface SettingInterface {
  gasBudget: string
  expiration: string
  slippage: string // 4 decimals place
}

export const defaultSetting: SettingInterface = {
  gasBudget: '1000000',
  expiration: '30',
  slippage: '2',
}

interface Props {
  isSettingOpen: boolean
  setIsSettingOpen: Function
  setting: SettingInterface
  handleSetting: (setting: SettingInterface) => void
}

const SettingModal = (props: Props) => {
  const { isSettingOpen, setIsSettingOpen, setting, handleSetting } = props

  const handleGasBudgetOnchange = (gasBudget: string) => {
    handleSetting({ ...setting, gasBudget })
    SettingModule.setGadBudgetToken(gasBudget)
  }

  const handleExpirationOnchange = (expiration: string) => {
    handleSetting({ ...setting, expiration })
    SettingModule.setExpirationToken(expiration)
  }
  const handleSlippageOnchange = (slippage: string) => {
    const value = parseFloat(slippage)
    if (value >= 0.01 && value <= 100) {
      handleSetting({ ...setting, slippage })
      SettingModule.setSlippageToken(slippage)
    }
  }

  return (
    <Dialog
      title='Setting'
      titleImg={Image.setting}
      isShow={isSettingOpen}
      setIsShow={setIsSettingOpen}
      type='setting'
    >
      <div className={styles.settingContainer}>
        <div className={styles.settingLayout}>
          <div className={styles.settingSection}>
            <div className={styles.settingTitle}>
              <h1>Gas Budget</h1>
              <Icon.InformationIcon className={styles.informationIcon} />
            </div>
            <div className={styles.settingButtons}>
              <Button
                styletype={
                  setting.gasBudget == '10000000' ? 'filled' : 'outlined'
                }
                text='0.01 SUI'
                onClick={() => handleGasBudgetOnchange('10000000')}
              />
              <Button
                styletype={
                  setting.gasBudget == '5000000' ? 'filled' : 'outlined'
                }
                text='0.005 SUI'
                onClick={() => handleGasBudgetOnchange('5000000')}
              />
              <Button
                styletype={
                  setting.gasBudget == '1000000' ? 'filled' : 'outlined'
                }
                text='0.001 SUI'
                onClick={() => handleGasBudgetOnchange('1000000')}
              />
            </div>
            <div className={styles.settingTitle}>
              <h1>Expiration</h1>
              <Icon.InformationIcon className={styles.informationIcon} />
            </div>
            <div className={styles.settingButtons}>
              <Button
                styletype={setting.expiration == '20' ? 'filled' : 'outlined'}
                text='20 sec'
                onClick={() => handleExpirationOnchange('20')}
              />
              <Button
                styletype={setting.expiration == '30' ? 'filled' : 'outlined'}
                text='30 sec'
                onClick={() => handleExpirationOnchange('30')}
              />
              <Button
                styletype={setting.expiration == '60' ? 'filled' : 'outlined'}
                text='1 min'
                onClick={() => handleExpirationOnchange('60')}
              />
            </div>
            <div className={styles.settingTitle}>
              <h1>Slippage</h1>
              <Icon.InformationIcon className={styles.informationIcon} />
            </div>
            <div className={styles.settingButtons}>
              {options.map((opt, idx) => (
                <Button
                  key={idx}
                  styletype={setting.slippage == opt ? 'filled' : 'outlined'}
                  text={opt + '%'}
                  onClick={() => handleSlippageOnchange(opt)}
                  small
                />
              ))}
              <Input
                type='number'
                value={setting.slippage}
                //@ts-ignore
                min={0.01}
                step='0.01'
                onChange={(e) => {
                  handleSlippageOnchange(e.target.value)
                }}
                placeholder='Custom'
              />
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default SettingModal
