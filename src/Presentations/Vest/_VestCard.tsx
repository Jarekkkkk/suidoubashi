import { ProgressBar } from '@blueprintjs/core'
import { cx } from '@emotion/css'
import { Button } from '@/Components'
import Image from '@/Assets/image'

import * as constantsStyles from '@/Constants/constants.styles'
import * as styles from './index.styles'
import BigNumber from 'bignumber.js'
import { AMMState } from '@/Constants/API/pool'
import useRegisterAMMState from '@/Hooks/AMM/useRegisterAMMState'
import useRegisterVotingState from '@/Hooks/Vote/useRegisterVotingState'
import { VotingState } from '@/Constants/API/vote'
import { round_down_week } from '@/Utils/vsdb'
import { useGetAllGauge } from '@/Hooks/Vote/useGetGauge'
import { usePageContext } from '@/Components/Page'
import { useUnlock } from '@/Hooks/Vote/useUnlock'
import { useUpgrade } from '@/Hooks/VSDB/useUpgrade'
import { useRemoveVotingState } from '@/Hooks/Vote/useRemoveVotingState'

interface Props {
  nftId: string
  nftImg: string
  level: string
  expValue: number
  vesdbValue: number
  lockSdbValue: string
  end: string | undefined
  isPerviewMode?: boolean
  setCurrentVSDBId?: Function
  setIsShowDepositVSDBModal?: Function
  setIsShowWithdrawVSDBModal?: Function
  expSpanValue?: {
    experience: number
    required_exp: number
  }
  vesdbSpanValue?: string
  amm_state?: AMMState
  voting_state?: VotingState
}

interface TextItemProps {
  title: string
  level: string | any
  className?: any
}

interface ValueItemProps {
  title: string
  value: number
  expSpanValue?: {
    experience: number
    required_exp: number
  }
  vesdbSpanValue?: string
  buttonChildren?: any
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

const format = (value: string | number) => {
  return BigNumber(value).shiftedBy(-9).decimalPlaces(5).toFormat()
}

const ValueItem = (props: ValueItemProps) => {
  const { title, value, expSpanValue, vesdbSpanValue, buttonChildren } = props
  return (
    <div className={styles.valueContent}>
      <div className={styles.valueTitle}>
        <div>{title}</div>
        {expSpanValue && (
          <div className={constantsStyles.rowContent}>
            <span>
              {expSpanValue.experience} / {expSpanValue.required_exp}
            </span>
            {buttonChildren}
          </div>
        )}
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
    end,
    setIsShowDepositVSDBModal,
    setCurrentVSDBId,
    setIsShowWithdrawVSDBModal,
    expSpanValue,
    vesdbSpanValue,
    amm_state,
    voting_state,
  } = props

  const { setting } = usePageContext()

  const { mutate: unlock } = useUnlock(setting)
  const { data: gauges } = useGetAllGauge()

  const { mutate: remove_voting_state } = useRemoveVotingState(setting)
  //@ts-ignore
  const handleRemoveVotingState = () => {
    if (voting_state && gauges) {
      const reset_ = gauges.filter((g) =>
        Object.keys(voting_state.pool_votes).some((p) => p == g.pool),
      )
      remove_voting_state({ vsdb: nftId, voting_state, reset: reset_ })
    }
  }
  const handleUnlock = (nftId: string) => {
    if (!voting_state) {
      unlock({ vsdb: nftId })
    }
  }

  const { mutate: initialize_amm } = useRegisterAMMState(setting)
  const handleInitializeAMM = () => {
    if (!amm_state) initialize_amm({ vsdb: nftId })
  }

  const { mutate: initialize_voting_state } = useRegisterVotingState(setting)
  const handleInitializeVotingState = () => {
    if (!voting_state) initialize_voting_state({ vsdb: nftId })
  }

  const { mutate: upgrade } = useUpgrade(setting)
  const handleUpgrade = () => {
    upgrade({ vsdb: nftId })
  }

  const expiration = end
    ? new Date(Number(end) * 1000).toLocaleDateString('en-ZA')
    : '---'

  return (
    <div className={styles.vestCardContainer}>
      <div className={styles.imgSection}>
        <img src={nftImg || Image.nftDefault} />
      </div>
      <div className={styles.cardContentSection}>
        {!isPerviewMode && (
          <TextItem
            title='ID'
            level={
              nftId.length > 10 ? (
                <div className={styles.addressContent}>
                  <div className={styles.prev}>{nftId.slice(0, -8)}</div>
                  <div className={styles.next}>{nftId.slice(-8)}</div>
                </div>
              ) : (
                nftId
              )
            }
          />
        )}
        <TextItem title='Level' level={level} />
        <ValueItem
          title='EXP'
          value={expValue}
          expSpanValue={expSpanValue}
          buttonChildren={
            expSpanValue &&
            expSpanValue.experience > expSpanValue.required_exp && (
              <div className={styles.buttonLevelup}>
                <Button
                  text='Level Up'
                  styletype='badge'
                  onClick={handleUpgrade}
                />
              </div>
            )
          }
        />
        <ValueItem
          title='VeSDB'
          value={vesdbValue}
          vesdbSpanValue={vesdbSpanValue}
        />
        <div className={styles.mulValueContent}>
          <TextItem title='Locked SDB' level={lockSdbValue} />
          <TextItem
            className={cx({ [styles.marginTop]: isPerviewMode })}
            title='Expiration'
            level={expiration}
          />
        </div>
        {!isPerviewMode && (
          <>
            <div className={cx(styles.badgeContent)}>
              <div>Badge</div>
              <Button
                text='AMM'
                styletype='badge'
                disabled={!!amm_state}
                onClick={handleInitializeAMM}
              />
              <Button
                text='Vote'
                styletype='badge'
                disabled={!!voting_state}
                onClick={handleInitializeVotingState}
              />
            </div>
            <div className={styles.buttonContent}>
              {new Date().getTime() >= parseInt(end ?? '0') * 1000 ? (
                <>
                  {(!voting_state ||
                    round_down_week(new Date().getTime() / 1000) >=
                      parseInt(voting_state.last_voted)) && (
                    <Button
                      styletype='outlined'
                      text='Unlock'
                      onClick={() => handleUnlock(nftId)}
                    />
                  )}
                  {setIsShowWithdrawVSDBModal && (
                    <Button
                      styletype='outlined'
                      text='Revive'
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
          </>
        )}
      </div>
    </div>
  )
}

export default VestCardComponent
