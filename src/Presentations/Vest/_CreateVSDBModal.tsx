import { useState } from 'react'
import {
  Dialog,
  Input,
  InputSection,
  DatePicker,
  RadioGroup,
  Button,
  Error,
} from '@/Components'
import Image from '@/Assets/image'
import { CoinIcon, Icon } from '@/Assets/icon'
import { vsdbTimeSettingOptions } from '@/Constants/index'
import * as styles from './index.styles'
import { useLock } from '@/Hooks/VSDB/useLock'
import moment from 'moment'
import useGetBalance from '@/Hooks/Coin/useGetBalance'
import { Coin } from '@/Constants/coin'
import BigNumber from 'bignumber.js'
import { calculate_vesdb } from '@/Utils/calculateAPR'
import UserModule from '@/Modules/User'

type Props = {
  isShowCreateVSDBModal: boolean
  setIsShowCreateVSDBModal: Function
}

const CreateVSDBModal = (props: Props) => {
  const { isShowCreateVSDBModal, setIsShowCreateVSDBModal } = props

  const [endDate, setEndDate] = useState<string>(
    moment().add(168, 'days').toDate().toDateString(),
  )

  const walletAddress = UserModule.getUserToken()
  const balance = useGetBalance(Coin.SDB, walletAddress)

  const [input, setInput] = useState<string>('')
  const [error, setError] = useState<string>()

  const handleOnChange = (date: string) => {
    if (isLoading) return
    setEndDate(date)
  }

  const { mutate: lock, isLoading } = useLock(setIsShowCreateVSDBModal)

  const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading) return
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
  }

  const handleLock = () => {
    const extended_duration =
      (new Date(endDate).getTime() -
        moment().startOf('day').toDate().getTime()) /
      1000

    if (!input || extended_duration < 0 || balance?.totalBalance == '0')
      return null

    lock({
      deposit_value: (parseFloat(input) * Math.pow(10, 9)).toString(),
      extended_duration: extended_duration.toString(),
    })
  }

  return (
    <Dialog
      {...props}
      title='Create VSDB'
      titleImg={Image.pageBackground_3}
      isShow={isShowCreateVSDBModal}
      setIsShow={setIsShowCreateVSDBModal}
      disabled = {isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
            <RadioGroup
              selectedValue={endDate}
              options={vsdbTimeSettingOptions}
              onChange={handleOnChange}
              disabled={isLoading}
            />
          </>
        }
      />
      <div className={styles.vsdbCountContainer}>
        <div className={styles.vsdbCountBlock}>
          <div>Your VeSDB</div>
          <div className={styles.vsdbCountContent}>
            {BigNumber(
              calculate_vesdb(
                (parseFloat(input || '0') * Math.pow(10, 9)).toString(),
                (new Date(endDate).getTime() / 1000).toString(),
              ),
            )
              .shiftedBy(-9)
              .decimalPlaces(3)
              .toFormat()}
          </div>
        </div>
        <div className={styles.vsdbCountBlock}>
          <div>
            1 SDB locked for <span>24 weeks</span> = 1.00 VeSDB
          </div>
          <div>
            1 SDB locked for <span>18 weeks</span> = 0.75 VeSDB
          </div>
          <div>
            1 SDB locked for <span>12 weeks</span> = 0.50 VeSDB
          </div>
          <div>
            1 SDB locked for <span>6 weeks</span> = 0.25 VeSDB
          </div>
        </div>
      </div>
      <Error errorText={error || ''} />
      <div className={styles.vsdbModalbutton}>
        <Button
          disabled={!!error}
          isLoading={isLoading}
          text='Lock'
          styletype='filled'
          onClick={handleLock}
        />
      </div>
    </Dialog>
  )
}

export default CreateVSDBModal
