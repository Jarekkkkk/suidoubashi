<<<<<<< HEAD
import { useState, useCallback } from 'react'
=======
import { useState , useCallback } from 'react'
>>>>>>> 3aa265e ([front_end] deposit Vsdb api)
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

type Props = {
<<<<<<< HEAD
  currentVSDBId: string
=======
>>>>>>> 3aa265e ([front_end] deposit Vsdb api)
  isShowDepositVSDBModal: boolean
  setIsShowDepositVSDBModal: Function
}

const DepositVSDBModal = (props: Props) => {
<<<<<<< HEAD
  const { isShowDepositVSDBModal, setIsShowDepositVSDBModal, currentVSDBId } =
    props
=======
  const { isShowDepositVSDBModal, setIsShowDepositVSDBModal } = props
>>>>>>> 3aa265e ([front_end] deposit Vsdb api)
  if (!isShowDepositVSDBModal) return null
  const [endDate, setEndDate] = useState<string>(
    moment().add(168, 'days').toDate().toDateString(),
  )

<<<<<<< HEAD
  console.log(currentVSDBId)

  const { currentAccount } = useWalletKit()
  const { data: balance } = useGetBalance(Coin.SDB, currentAccount?.address)

  const [input, setInput] = useState<string>('')
  const handleOnInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value
      const isValid = /^-?\d*\.?\d*$/.test(value)

=======
  const { currentAccount } = useWalletKit()
  const { data: balance } = useGetBalance(Coin.SDB, currentAccount?.address)

  const [input, setInput] = useState<string>('')
  const handleOnInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value
      const isValid = /^-?\d*\.?\d*$/.test(value)

>>>>>>> 3aa265e ([front_end] deposit Vsdb api)
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
<<<<<<< HEAD
=======
  console.log(input)
>>>>>>> 3aa265e ([front_end] deposit Vsdb api)

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
            <Button text='Increase SDB' styletype='filled' onClick={() => {}} />
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
                    onClick={() => {}}
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
<<<<<<< HEAD
      title='Deposit VSDB'
=======
<<<<<<< HEAD
      title="Deposit VSDB"
>>>>>>> 3aa265e ([front_end] deposit Vsdb api)
      titleImg={Image.pageBackground_1}
=======
      title='Deposit VSDB'
      titleImg={Image.pageBackground_2}
>>>>>>> c8e2c40 ([front_end] deposit Vsdb api)
      isShow={isShowDepositVSDBModal}
      setIsShow={setIsShowDepositVSDBModal}
    >
      <Tabs links={tabDataKeys} styletype='ellipse' />
    </Dialog>
  )
}

export default DepositVSDBModal
