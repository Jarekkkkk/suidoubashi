import { Dialog, Button, Input, Select } from '@/Components'
import Image from '@/Assets/image'
import * as styles from './index.styles'
import { useCallback, useEffect, useState } from 'react'
import SettingModule from '@/Modules/Setting'
import { Icon } from '@/Assets/icon'

const options = [0.1, 0.2, 1, 2]

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

const SettingModal = () => {
  const [isShowSettingModal, setIsShowSettingModal] = useState(true)
  const [setting, setSetting] = useState<SettingInterface>(defaultSetting)
  const [radio, setRadio] = useState('0')

  const handleOnInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value
      const isValid = /^-?\d*\.?\d*$/.test(value)
      if (!isValid) {
        value = value.slice(0, -1)
      }
      setSetting((_prev) => ({ ..._prev, slippage: value }))
      setRadio('1')
    },

    [setSetting],
  )
  return (
    <Dialog
      title='Setting'
      titleImg={Image.setting}
      isShow={isShowSettingModal}
      setIsShow={setIsShowSettingModal}
    >
      <div className={styles.settingContainer}>
        <div>
          <h1>Gas Budget</h1>
          <div style={{ display: 'flex' }}>
            <Button
              styletype='filled'
              text='0.01 SUI'
              onClick={() =>
                setSetting((_prev) => ({ ..._prev, gasBudget: '10000000' }))
              }
            />
            <Button
              styletype='outlined'
              text='0.005 SUI'
              onClick={() =>
                setSetting((_prev) => ({ ..._prev, gasBudget: '5000000' }))
              }
            />
            <Button
              styletype='outlined'
              text='0.001 SUI'
              onClick={() =>
                setSetting((_prev) => ({ ..._prev, gasBudget: '1000000' }))
              }
            />
          </div>
          <div>
            <h1>Expiration</h1>
            <div style={{ display: 'flex' }}>
              <Button
                styletype='filled'
                text='20 sec'
                onClick={() =>
                  setSetting((_prev) => ({ ..._prev, expiration: '20' }))
                }
              />
              <Button
                styletype='outlined'
                text='30 sec'
                onClick={() =>
                  setSetting((_prev) => ({ ..._prev, expiration: '30' }))
                }
              />
              <Button
                styletype='outlined'
                text='1 min'
                onClick={() =>
                  setSetting((_prev) => ({ ..._prev, expiration: '60' }))
                }
              />
            </div>
          </div>
          <div>
            <h1>Slippage</h1>
            <div style={{ display: 'flex' }}>
              <input type='radio' value='0' checked={radio == '0'} />
              <label>
                <Select
                  options={options.map((obj) => ({
                    label: obj.toString() + '%',
                    value: (obj * 100).toString(),
                  }))}
                  onChange={({ value }) => {
                    setSetting((_prev) => ({
                      ..._prev,
                      slippage: value,
                    }))
                    setRadio('0')
                  }}
                />
              </label>
              <input type='radio' value='0' checked={radio == '1'} />
              <label>
                <Input onChange={handleOnInputChange} placeholder='Custom' />
              </label>
            </div>
            <h1>Slippage</h1>
            <h1>Slippage</h1>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default SettingModal
