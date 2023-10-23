import { useState } from 'react'
import {
  Dialog,
  InputSection,
  DatePicker,
  RadioGroup,
  Button,
} from '@/Components'
import Image from '@/Assets/image'
import { Icon } from '@/Assets/icon'
import { vsdbTimeSettingOptions } from '@/Constants/index'

import * as styles from './index.styles'
import { cx } from '@emotion/css'
import moment from 'moment'
import BigNumber from 'bignumber.js'
import { useGetVsdb } from '@/Hooks/VSDB/useGetVSDB'
import { useRevive } from '@/Hooks/VSDB/useRevive'
import UserModule from '@/Modules/User'
import { handleIncreaseDurationVesdbOnchange } from '@/Utils/vsdb'
import { usePageContext } from '@/Components/Page'

type Props = {
  isShowWithdrawVSDBModal: boolean
  setIsShowWithdrawVSDBModal: Function
  currentVSDBId: string
}

const WithdrawVSDBModal = (props: Props) => {
  const { isShowWithdrawVSDBModal, setIsShowWithdrawVSDBModal, currentVSDBId } =
    props
  const { setting } = usePageContext()

  const [endDate, setEndDate] = useState<string>(
    moment().add(168, 'days').toDate().toDateString(),
  )
  const handleOnChange = (date: string) => {
    setEndDate(date)
  }

  const walletAddress = UserModule.getUserToken()
  const { data: vsdb } = useGetVsdb(walletAddress, currentVSDBId)

  const { mutate: revive, isLoading: isReviveLoading } = useRevive(setting)

  const handleRevive = () => {
    if (isReviveLoading) return
    const extended_duration =
      (new Date(endDate).getTime() -
        moment().startOf('day').toDate().getTime()) /
      1000

    if (extended_duration < 0) return null

    revive({
      vsdb: currentVSDBId,
      extended_duration: extended_duration.toString(),
    })
  }
  const format = (vesdb: string) => {
    return BigNumber(vesdb).shiftedBy(-9).decimalPlaces(3).toFormat()
  }

  return (
    <Dialog
      {...props}
      title='Revive VSDB'
      titleImg={Image.pageBackground_3}
      isShow={isShowWithdrawVSDBModal}
      setIsShow={setIsShowWithdrawVSDBModal}
      disabled={isReviveLoading}
    >
      <InputSection
        titleChildren={
          <>
            <Icon.VectorIcon />
            <span>Unlocked Date</span>
          </>
        }
        inputChildren={
          <>
            <DatePicker
              endDate={new Date(endDate)}
              handleOnChange={handleOnChange}
              disabled={isReviveLoading}
            />
            <RadioGroup
              selectedValue={endDate}
              options={vsdbTimeSettingOptions}
              onChange={handleOnChange}
              disabled={isReviveLoading}
            />
          </>
        }
      />
      <div className={styles.vsdbDepositCountBlock}>
        <div className={cx(styles.vsdbDepositCount, styles.vsdbCountBlock)}>
          <div>Current VeSDB</div>
          <span className={styles.vsdbCountContent}>
            {format(vsdb?.vesdb ?? '0')}
          </span>
        </div>
        <Icon.BgArrowIcon />
        <div className={cx(styles.vsdbDepositCount, styles.vsdbCountBlock)}>
          <div>New VeSDB</div>
          <span className={styles.vsdbCountContent}>
            {vsdb
              ? handleIncreaseDurationVesdbOnchange(vsdb.balance, endDate)
              : '0'}
          </span>
        </div>
      </div>
      <div className={styles.vsdbModalbutton}>
        <Button
          text='Revive'
          isloading={isReviveLoading ? 1 : 0}
          styletype='filled'
          onClick={handleRevive}
        />
      </div>
    </Dialog>
  )
}

export default WithdrawVSDBModal
