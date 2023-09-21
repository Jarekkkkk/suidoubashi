import { useState } from 'react'
import {
  Dialog,
  InputSection,
  Input,
  DatePicker,
  RadioGroup,
  Tabs,
  Button,
  Error,
} from '@/Components'
import Image from '@/Assets/image'
import { CoinIcon, Icon } from '@/Assets/icon'
import { vsdbTimeSettingOptions } from '@/Constants/index'

import * as styles from './index.styles'
import { cx } from '@emotion/css'
import moment from 'moment'
import useGetBalance from '@/Hooks/Coin/useGetBalance'
import UserModule from '@/Modules/User'

import BigNumber from 'bignumber.js'
import { Coin } from '@/Constants/coin'
import { useIncreaseUnlockTime } from '@/Hooks/VSDB/useIncreaseUnlockTime'
import { useIncreaseUnlockAmount } from '@/Hooks/VSDB/useIncreaseUnlockAmount'
import { useGetVsdb } from '@/Hooks/VSDB/useGetVSDB'
import { calculate_vesdb } from '@/Utils/vsdb'

type Props = {
  currentVSDBId: string
  isShowDepositVSDBModal: boolean
  setIsShowDepositVSDBModal: Function
}

const DepositVSDBModal = (props: Props) => {
  const { isShowDepositVSDBModal, setIsShowDepositVSDBModal, currentVSDBId } =
    props

  const [endDate, setEndDate] = useState<string>(
    moment().add(168, 'days').toDate().toDateString(),
  )

  const walletAddress = UserModule.getUserToken()
  const balance = useGetBalance(Coin.SDB, walletAddress)

  const { data: vsdb } = useGetVsdb(walletAddress, currentVSDBId)

  const [input, setInput] = useState<string>()
  const [error, setError] = useState<string>()

  const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (incrase_amount_isLoading) return
    let value = e.target.value
    const isValid = /^-?\d*\.?\d{0,9}$/.test(value)

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
  }

  const handleOnChange = (date: string) => {
    if (increase_unlock_time_isLoading) return
    setEndDate(date)
  }

  const {
    mutate: increase_unlocked_amount,
    isLoading: incrase_amount_isLoading,
  } = useIncreaseUnlockAmount(setIsShowDepositVSDBModal)
  const handleIncreaseAmount = () => {
    if (!input) return null

    increase_unlocked_amount({
      vsdb: currentVSDBId,
      depositValue: (parseFloat(input) * 1e9).toString(),
    })
  }

  const {
    mutate: increase_unlocked_time,
    isLoading: increase_unlock_time_isLoading,
  } = useIncreaseUnlockTime(setIsShowDepositVSDBModal)

  const handleIncreaseDuration = () => {
    if (increase_unlock_time_isLoading) return
    const extended_duration =
      (new Date(endDate).getTime() -
        moment().startOf('day').toDate().getTime()) /
      1000

    if (extended_duration < 0) return null

    increase_unlocked_time({
      vsdb: currentVSDBId,
      extended_duration: extended_duration.toString(),
    })
  }

  const format = (vesdb: string) => {
    return BigNumber(vesdb).shiftedBy(-9).decimalPlaces(3).toFormat()
  }

  const handleIncreaseSDBVesdbOnchange = (input: string) => {
    if (!vsdb?.balance) return '0'
    return BigNumber(Number(vsdb?.vesdb || '0') / Number(vsdb.balance))
      .multipliedBy(Number(vsdb?.balance || '0') + parseFloat(input) * 1e9)
      .shiftedBy(-9)
      .decimalPlaces(3)
      .toFormat()
  }

  const handleIncreaseDurationVesdbOnchange = (end: string) => {
    return BigNumber(
      calculate_vesdb(
        vsdb?.balance || '0',
        (new Date(end).getTime() / 1000).toString(),
      ),
    )
      .shiftedBy(-9)
      .decimalPlaces(3)
      .toFormat()
  }

  const tabDataKeys = [
    {
      id: 0,
      title: 'Increase SDB',
      children: (
        <div className={styles.vsdbTabContainer}>
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
                  disabled={incrase_amount_isLoading}
                />
              </>
            }
            balance={balance ? format(balance.totalBalance) : '...'}
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
                {handleIncreaseSDBVesdbOnchange(input || '0')}
              </span>
            </div>
          </div>
          {error &&  <Error errorText={error} />}
          <div className={styles.vsdbModalbutton}>
            <Button
              disabled={!!error}
              isLoading={incrase_amount_isLoading}
              text='Increase SDB'
              styletype='filled'
              onClick={handleIncreaseAmount}
            />
          </div>
        </div>
      ),
    },
    {
      id: 1,
      title: 'Increase Duration',
      children: (
        <div className={styles.vsdbTabContainer}>
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
                  disabled={increase_unlock_time_isLoading}
                />
                <RadioGroup
                  selectedValue={endDate}
                  options={vsdbTimeSettingOptions}
                  onChange={handleOnChange}
                  disabled={increase_unlock_time_isLoading}
                />
                <div className={styles.vsdbDepositCountBlock}>
                  <div
                    className={cx(
                      styles.vsdbDepositCount,
                      styles.vsdbCountBlock,
                    )}
                  >
                    <div>Current VeSDB</div>
                    <span className={styles.vsdbCountContent}>
                      {format(vsdb?.vesdb ?? '0')}
                    </span>
                  </div>
                  <Icon.BgArrowIcon />
                  <div
                    className={cx(
                      styles.vsdbDepositCount,
                      styles.vsdbCountBlock,
                    )}
                  >
                    <div>New VeSDB</div>
                    <span className={styles.vsdbCountContent}>
                      {handleIncreaseDurationVesdbOnchange(endDate)}
                    </span>
                  </div>
                </div>
                {error &&  <Error errorText={error} />}
                <div className={styles.vsdbModalbutton}>
                  <Button
                    disabled={!!error}
                    isLoading={increase_unlock_time_isLoading}
                    text='Increase Duration'
                    styletype='filled'
                    onClick={handleIncreaseDuration}
                  />
                </div>
              </>
            }
          />
        </div>
      ),
    },
  ]

  return (
    <Dialog
      {...props}
      title='Deposit VSDB'
      titleImg={Image.pageBackground_1}
      isShow={isShowDepositVSDBModal}
      setIsShow={setIsShowDepositVSDBModal}
      disabled={increase_unlock_time_isLoading || incrase_amount_isLoading}
    >
      <Tabs
        isLoading={incrase_amount_isLoading || increase_unlock_time_isLoading}
        links={tabDataKeys}
        styletype='ellipse'
      />
    </Dialog>
  )
}

export default DepositVSDBModal
