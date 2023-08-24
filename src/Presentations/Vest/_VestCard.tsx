import { ProgressBar } from '@blueprintjs/core'
import { cx } from '@emotion/css'
import { Button } from '@/Components'
import Image from '@/Assets/image'

import * as styles from './index.styles'
import { useUnlock } from '@/Hooks/VSDB/useUnlock'
import BigNumber from 'bignumber.js'

interface Props {
  nftId: string
  nftImg: any
  level: string
  expValue: number
  vesdbValue: number
  lockSdbValue: string
  expiration: string
  isPerviewMode?: boolean
  setCurrentVSDBId?: Function
  setIsShowDepositVSDBModal?: Function
  setIsShowWithdrawVSDBModal?: Function
  expSpanValue?: {
    experience: number,
    required_exp: number,
  },
  vesdbSpanValue?: number,
}

interface TextItemProps {
  title: string
  level: string
  className?: any
}

interface ValueItemProps {
  title: string
  value: number
  expSpanValue?: {
    experience: number,
    required_exp: number,
  },
  vesdbSpanValue?: number,
}

const TextItem = (props: TextItemProps) => {
  const { title, level, className } = props
  return (
    <div className={cx(styles.textContent, className)}>
      <div>{title}</div>
      <span>{level}</span>
    </div>
  )
}

const format = (value: string | number) =>{
  return BigNumber(value).shiftedBy(-9).decimalPlaces(5).toFormat()
}

const ValueItem = (props: ValueItemProps) => {
  const { title, value, expSpanValue, vesdbSpanValue } = props
  return (
    <div className={styles.valueContent}>
      <div className={styles.valueTitle}>
        <div>{title}</div>
        {expSpanValue && <span>{expSpanValue.experience} / {expSpanValue.required_exp}</span>}
        {vesdbSpanValue && <span>{format(vesdbSpanValue)}</span>}
      </div>
      <ProgressBar
        value={value}
        animate={false}
        stripes={false}
        intent='primary'
      />
    </div>
  )
}

const VestCardComponent = (props: Props) => {
  const {
    nftImg,
    level,
    expValue,
    nftId,
    isPerviewMode,
    vesdbValue,
    lockSdbValue,
    expiration,
    setIsShowDepositVSDBModal,
    setCurrentVSDBId,
    setIsShowWithdrawVSDBModal,
    expSpanValue,
    vesdbSpanValue,
  } = props

  const { mutate: unlock } = useUnlock()
  const handleUnlock = (nftId: string) => {
    unlock({ vsdb: nftId })
  }

  const _nowDate = new Date().toLocaleDateString('en-ZA')

  return (
    <div className={styles.vestCardContainer}>
      <div className={styles.imgSection}>
        <img src={nftImg || Image.nftDefault} />
      </div>
      <div className={styles.cardContentSection}>
        <TextItem title='Level' level={level} />
        <ValueItem title='EXP' value={expValue} expSpanValue={expSpanValue} />
        <ValueItem title='VeSDB' value={vesdbValue} vesdbSpanValue={vesdbSpanValue} />
        <div className={styles.mulValueContent}>
          <TextItem title='Locked SDB' level={lockSdbValue} />
          <TextItem
            className={cx({ [styles.marginTop]: isPerviewMode })}
            title='Expiration'
            level={expiration}
          />
        </div>
        {!isPerviewMode && (
          <div className={styles.buttonContent}>
            {Date.parse(_nowDate) >= Date.parse(expiration) ? (
              <>
                {
                  <Button
                    styletype='outlined'
                    text='Unlock'
                    onClick={() => handleUnlock(nftId)}
                  />
                }
                {setIsShowWithdrawVSDBModal && (
                  <Button
                    styletype='outlined'
                    text='Revival'
                    onClick={() => {
                      setIsShowWithdrawVSDBModal(true)
                      setCurrentVSDBId && setCurrentVSDBId(nftId)
                    }}
                  />
                )}
              </>
            ) : (
              <Button
                styletype='outlined'
                text='Deposit VSDB'
                onClick={() => {
                  setIsShowDepositVSDBModal && setIsShowDepositVSDBModal(true)
                  setCurrentVSDBId && setCurrentVSDBId(nftId)
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default VestCardComponent
