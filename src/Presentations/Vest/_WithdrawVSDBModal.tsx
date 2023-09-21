import { useState, useCallback } from 'react'
import {
  Dialog,
  InputSection,
  Input,
  DatePicker,
  RadioGroup,
  Button,
  Error,
} from '@/Components'
import Image from '@/Assets/image'
import { CoinIcon, Icon } from '@/Assets/icon'
import { vsdbTimeSettingOptions } from '@/Constants/index'

import * as styles from './index.styles'
import { cx } from '@emotion/css'
import useGetBalance from '@/Hooks/Coin/useGetBalance'
import { Coin } from '@/Constants/coin'
import moment from 'moment'
import BigNumber from 'bignumber.js'
import { useGetVsdb } from '@/Hooks/VSDB/useGetVSDB'
import { useRevive } from '@/Hooks/VSDB/useRevive'
import UserModule from '@/Modules/User';
import { calculate_vesdb } from '@/Utils/vsdb'

type Props = {
  isShowWithdrawVSDBModal: boolean
  setIsShowWithdrawVSDBModal: Function
  currentVSDBId: string
}

const WithdrawVSDBModal = (props: Props) => {
  const { isShowWithdrawVSDBModal, setIsShowWithdrawVSDBModal, currentVSDBId } =
    props

  const [endDate, setEndDate] = useState<string>(
    moment().add(168, 'days').toDate().toDateString(),
  )
  const handleOnChange = (date: string) => {
    setEndDate(date)
  }

  const walletAddress = UserModule.getUserToken()
  const balance = useGetBalance(Coin.SDB, walletAddress)
  const { data: vsdb, isLoading: isGetVsdbLoading } = useGetVsdb(walletAddress, currentVSDBId)

  const [input, setInput] = useState<string>('')
  const [error, setError] = useState<string>()

  const handleOnInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value
      const isValid = /^-?\d*\.?\d*$/.test(value)
      if (!isValid) {
        value = value.slice(0, -1)
      }
      setInput(value)

      if (balance?.totalBalance) {
        if (parseFloat(value) * Math.pow(10, 9) > Number(balance.totalBalance)) {
          setError('Insufficient Balance')
        } else {
          setError('')
        }
      }
    },

    [setInput],
  )

  const { mutate: revive, isLoading: isReviveLoading } = useRevive()

  const handleRevive = () => {
    const extended_duration =
      (new Date(endDate).getTime() -
        moment().startOf('day').toDate().getTime()) /
      1000

    if (!input || extended_duration < 0) return null

    revive({
      vsdb: currentVSDBId,
      withdrawl: (parseFloat(input) * Math.pow(10, 9)).toString(),
      extended_duration: extended_duration.toString(),
    })
  }
  const format = (vesdb: string) => {
    return BigNumber(vesdb).shiftedBy(-9).decimalPlaces(3).toFormat()
  }

  return (
    <Dialog
      {...props}
      title='Withdraw VSDB'
      titleImg={Image.pageBackground_3}
      isShow={isShowWithdrawVSDBModal}
      setIsShow={setIsShowWithdrawVSDBModal}
    >
      <InputSection
        titleChildren={
          <>
            <CoinIcon.SDBIcon />
            <span>SDB</span>
          </>
        }
        inputChildren={
          <>
            <Input
              value={input}
              onChange={handleOnInputChange}
              placeholder='Increase Unlocked Amount'
              disabled={isReviveLoading}
            />
          </>
        }
        balance={
          balance
            ? BigNumber(balance.totalBalance).shiftedBy(-9).toFormat()
            : '...'
        }
      />
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
              ? calculate_vesdb(
                  (
                    Number(vsdb.balance) -
                    parseFloat(input || '0') * Math.pow(10, 9)
                  ).toString(),
                  (new Date(endDate).getTime() / 1000).toString(),
                )
              : '0'}
          </span>
        </div>
      </div>
      {error &&  <Error errorText={error} />}
      <div className={styles.vsdbModalbutton}>
        <Button
          text='Claim'
          styletype='filled'
          onClick={handleRevive}
          disabled={!!error}
        />
      </div>
    </Dialog>
  )
}

export default WithdrawVSDBModal
