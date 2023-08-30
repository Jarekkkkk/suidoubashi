import { Dialog, Button, Input } from '@/Components'
import Image from '@/Assets/image'
import * as styles from './index.styles'
import { useState } from 'react'
import SettingModule from '@/Modules/Setting'

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
}

const SettingModal = (props: Props) => {
  const { isSettingOpen, setIsSettingOpen } = props
  const [setting, setSetting] = useState<SettingInterface>({
    gasBudget: SettingModule.getGadBudgetToken() ?? '10000000',
    expiration: SettingModule.getExpirationToken() ?? '30',
    slippage: SettingModule.getSlippageToken() ?? '2',
  })

  const handleGasBudgetOnchange = (gasBudget: string) => {
    setSetting((_prev) => ({ ..._prev, gasBudget }))
    SettingModule.setGadBudgetToken(gasBudget)
  }

  const handleExpirationOnchange = (expiration: string) => {
    setSetting((_prev) => ({ ..._prev, expiration }))
    SettingModule.setExpirationToken(expiration)
  }
  const handleSlippageOnchange = (slippage: string) => {
    const value = parseFloat(slippage)
    if (value >= 0.01) {
      setSetting((_prev) => ({ ..._prev, slippage: value.toString() }))
      SettingModule.setSlippageToken(slippage)
    }
  }

  return (
    <Dialog
      title='Setting'
      titleImg={Image.setting}
      isShow={isSettingOpen}
      setIsShow={setIsSettingOpen}
      type="setting"
    >
      <div className={styles.settingContainer}>
        <div>
          <h1>Gas Budget</h1>
          <div style={{ display: 'flex' }}>
            <Button
              styletype={
                setting.gasBudget == '10000000' ? 'filled' : 'outlined'
              }
              text='0.01 SUI'
              onClick={() => handleGasBudgetOnchange('10000000')}
            />
            <Button
              styletype={setting.gasBudget == '5000000' ? 'filled' : 'outlined'}
              text='0.005 SUI'
              onClick={() => handleGasBudgetOnchange('5000000')}
            />
            <Button
              styletype={setting.gasBudget == '1000000' ? 'filled' : 'outlined'}
              text='0.001 SUI'
              onClick={() => handleGasBudgetOnchange('1000000')}
            />
          </div>
          <div>
            <h1>Expiration</h1>
            <div style={{ display: 'flex' }}>
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
          </div>
          <div>
            <h1>Slippage</h1>
            <div style={{ display: 'flex' }}>
              {options.map((opt, idx) => (
                <Button
                  key={idx}
                  styletype={setting.slippage == opt ? 'filled' : 'outlined'}
                  text={opt + '%'}
                  onClick={() => handleSlippageOnchange(opt)}
                />
              ))}
            </div>
            <Input
              type={'number'}
              value={setting.slippage}
              //@ts-ignore
              min={0.01}
              step='0.01'
              onChange={(e) => {
                handleSlippageOnchange(e.target.value)
              }}
              placeholder='Custom'
            />
            <h1>Slippage</h1>
            <h1>Slippage</h1>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default SettingModal
