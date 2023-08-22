import { useState, useCallback } from 'react'
import {
  Dialog,
  InputSection,
  Input,
  DatePicker,
  RadioGroup,
  Tabs,
  Button,
} from '@/Components'
import Image from '@/Assets/image'
import { CoinIcon, Icon } from '@/Assets/icon'
import { vsdbTimeSettingOptions } from '@/Constants/index'

import * as styles from './index.styles'
import { cx } from '@emotion/css'
import moment from 'moment'
import useGetBalance from '@/Hooks/Coin/useGetBalance'
import BigNumber from 'bignumber.js'
import { useWalletKit } from '@mysten/wallet-kit'
import { Coin } from '@/Constants/coin'
import { useIncreaseUnlockTime } from '@/Hooks/VSDB/useIncreaseUnlockTime'
import { useIncreaseUnlockAmount } from '@/Hooks/VSDB/useIncreaseUnlockAmount'

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

  const { currentAccount } = useWalletKit()
  const { data: balance } = useGetBalance(Coin.SDB, currentAccount?.address)

  const [input, setInput] = useState<string>('')
  const handleOnInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value
      const isValid = /^-?\d*\.?\d*$/.test(value)

      if (!isValid) {
        value = value.slice(0, -1)
      }

      setInput(value)
    },

    [setInput],
  )
  const handleOnChange = (date: string) => {
    setEndDate(date)
  }

  const { mutate: increase_unlocked_amount } = useIncreaseUnlockAmount()
  const handleIncreaseAmount = () => {
    if (!input) return null

    increase_unlocked_amount({
      vsdb: currentVSDBId,
      depositValue: (parseFloat(input) * Math.pow(10, 9)).toString(),
    })
  }

  const { mutate: increase_unlocked_time } = useIncreaseUnlockTime()
  const handleIncreaseDuration = () => {
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
                />
              </>
            }
            balance={
              balance
                ? BigNumber(balance.totalBalance).shiftedBy(-9).toFormat()
                : '...'
            }
          />
          <div className={styles.vsdbDepositCountBlock}>
            <div className={cx(styles.vsdbDepositCount, styles.vsdbCountBlock)}>
              <div>Current VeSDB</div>
              <span className={styles.vsdbCountContent}>987.34</span>
            </div>
            <Icon.BgArrowIcon />
            <div className={cx(styles.vsdbDepositCount, styles.vsdbCountBlock)}>
              <div>New VeSDB</div>
              <span className={styles.vsdbCountContent}>997.34</span>
            </div>
          </div>
          <div className={styles.vsdbModalbutton}>
            <Button
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
                />
                <RadioGroup
                  selectedValue={endDate}
                  options={vsdbTimeSettingOptions}
                  onChange={handleOnChange}
                />
                <div className={styles.vsdbDepositCountBlock}>
                  <div
                    className={cx(
                      styles.vsdbDepositCount,
                      styles.vsdbCountBlock,
                    )}
                  >
                    <div>Current VeSDB</div>
                    <span className={styles.vsdbCountContent}>987.34</span>
                  </div>
                  <Icon.BgArrowIcon />
                  <div
                    className={cx(
                      styles.vsdbDepositCount,
                      styles.vsdbCountBlock,
                    )}
                  >
                    <div>New VeSDB</div>
                    <span className={styles.vsdbCountContent}>997.34</span>
                  </div>
                </div>
                <div className={styles.vsdbModalbutton}>
                  <Button
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
    >
      <Tabs links={tabDataKeys} styletype='ellipse' />
    </Dialog>
  )
}

export default DepositVSDBModal
