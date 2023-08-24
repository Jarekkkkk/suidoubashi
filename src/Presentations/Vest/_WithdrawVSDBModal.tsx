import { useState, useCallback } from 'react'
import {
  Dialog,
  InputSection,
  Input,
  DatePicker,
  RadioGroup,
  Button,
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
import { useWalletKit } from '@mysten/wallet-kit'
import { useGetVsdb } from '@/Hooks/VSDB/useGetVSDB'
import { calculate_vesdb } from '@/Utils/calculateAPR'

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

  const balance = useGetBalance(Coin.SDB)
  const { currentAccount } = useWalletKit()
  const { data: vsdb } = useGetVsdb(currentAccount?.address, currentVSDBId)

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

  const handleRevive = () => {}
  const format = (vesdb: string) => {
    return BigNumber(vesdb).shiftedBy(-9).decimalPlaces(3).toFormat()
  }

  console.log(
    (
      Number(vsdb?.balance ?? '0') -
      parseFloat(input) * Math.pow(10, 9)
    ).toString(),
  )

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
            />
            <RadioGroup
              selectedValue={endDate}
              options={vsdbTimeSettingOptions}
              onChange={handleOnChange}
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
                    parseFloat(input) * Math.pow(10, 9)
                  ).toString(),
                  (new Date(endDate).getTime() / 1000).toString(),
                )
              : '0'}
          </span>
        </div>
      </div>
      <div className={styles.vsdbModalbutton}>
        <Button text='Claim' styletype='filled' onClick={handleRevive} />
      </div>
    </Dialog>
  )
}

export default WithdrawVSDBModal
