import { Dialog } from '@/Components'
import Image from '@/Assets/image'
import * as styles from './index.styles'
import { useEffect, useState } from 'react'
import SettingModule from '@/Modules/Setting'
import { Icon } from '@/Assets/icon'

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
  useEffect(() => {}, [])
  return (
    <Dialog
      title='Setting'
      titleImg={Image.setting}
      isShow={isShowSettingModal}
      setIsShow={setIsShowSettingModal}
    >
      <div className={styles.settingContainer}>
        <h1>Gas Budget</h1>
        <Icon.InformationIcon className={styles.informationButton} />
      </div>
    </Dialog>
  )
}

export default SettingModal
