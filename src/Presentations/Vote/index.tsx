import { Slider } from '@blueprintjs/core'
import Image from '@/Assets/image'
import { Icon } from '@/Assets/icon'
import {
  PageContainer,
  ReactTable,
  Input,
  Button,
  Loading,
  Empty,
  CoinCombin,
} from '@/Components'
import * as constantsStyles from '@/Constants/constants.styles'
import { useVoteContext } from '@/Containers/Vote'
import * as styles from './index.styles'
import { cx } from '@emotion/css'
import { Gauge, Voter, Rewards } from '@/Constants/API/vote'
import { usePageContext } from '@/Components/Page'
import { fetchCoinByType } from '@/Constants'
import { useEffect, useState } from 'react'
import { CoinFormat, formatBalance } from '@/Utils/format'
import { useVote } from '@/Hooks/Vote/useVote'
import { toast } from 'react-hot-toast'
import { Coins } from '@/Constants/coin'
import { round_down_week } from '@/Utils/vsdb'

const renderLabel2 = (val: number) => {
  return `${Math.round(val * 100)}%`
}

const VotePresentation = () => {
  const {
    searchInput,
    handleOnInputChange,
    gaugeData,
    voterData,
    fetching,
    rewardsData,
  } = useVoteContext()

  const calculateCountdown = () => {
    const now = new Date()
    const currentDayOfWeek = now.getUTCDay() // 0 (Sunday) to 6 (Saturday)

    // Calculate the number of days until the next Wednesday
    const daysUntilWednesday = (3 - currentDayOfWeek + 7) % 7

    // Create a target date for the next Wednesday at 23:59 UTC
    const targetDate = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + daysUntilWednesday,
        23,
        59,
        0,
      ),
    )

    // Calculate the time difference
    // @ts-ignore
    const timeDifference = targetDate - now

    // Calculate hours, minutes, and seconds
    const days = Math.floor((timeDifference / (1000 * 60 * 60 * 24)) % 7)
    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((timeDifference / (1000 * 60)) % 60)
    const seconds = Math.floor((timeDifference / 1000) % 60)

    return { days, hours, minutes, seconds }
  }

  const [totalVoting, setTotalVoting] = useState<any>({})

  const { setting, currentNFTInfo } = usePageContext()

  const handleVotingOnchange = (pool: string, value: number) => {
    const value_ = Math.floor(10 * value) / 10
    const total_ = Number(
      (
        (totalVoting['total'] ?? 0) +
        value_ -
        (totalVoting[pool] ?? 0)
      ).toPrecision(2),
    )
    if (total_ > 1) return
    setTotalVoting({
      ...totalVoting,
      total: total_,
      [pool]: value_,
    })
  }

  const vote_mutation = useVote(setting)
  const handleVote = () => {
    if (totalVoting['total'] == 1 && currentNFTInfo.data && gaugeData) {
      try {
        if (!currentNFTInfo.data.voting_state)
          throw new Error('NFT should be registered')
        let vote = []
        let reset: Gauge[] = []
        let voting_weights = []
        if (currentNFTInfo.data.voting_state?.pool_votes) {
          for (const key of Object.keys(
            currentNFTInfo.data.voting_state?.pool_votes,
          )) {
            const gauge = gaugeData.find((g) => g.pool == key)
            if (gauge) {
              reset.push(gauge)
            }
          }
        }
        for (const [key, value] of Object.entries<number>(totalVoting)) {
          if (value > 0) {
            const gauge = gaugeData.find((g) => g.pool == key)
            if (gauge) {
              vote.push(gauge)
              voting_weights.push((value * 100).toString())
            }
          }
        }

        vote_mutation.mutate({
          vsdb: currentNFTInfo.data.id,
          reset,
          vote,
          voting_weights,
        })
      } catch (error: any) {
        toast.error(error.message)
      }
    }
  }

  useEffect(() => {
    if (
      currentNFTInfo?.data?.voting_state &&
      currentNFTInfo.data.voting_state.voted
    ) {
      const total = parseInt(
        currentNFTInfo.data.voting_state?.used_weights ?? '0',
      )

      for (const [key, value] of Object.entries(
        currentNFTInfo.data.voting_state?.pool_votes ?? {},
      )) {
        const foo = Number((parseInt(value) / total).toPrecision(2))
        setTotalVoting((prev: any) => ({
          ...prev,
          [key]: foo,
        }))
      }
      setTotalVoting((prev: any) => ({
        ...prev,
        total: 1,
      }))
    } else {
      setTotalVoting({})
    }
  }, [currentNFTInfo])

  const [countdown, setCountdown] = useState(calculateCountdown())

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateCountdown())
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const data = [{ id: 1 }, { id: 2 }]

  if (fetching)
    return (
      <PageContainer title='Vote' titleImg={Image.pageBackground_4}>
        <div className={constantsStyles.LoadingContainer}>
          <Loading />
        </div>
      </PageContainer>
    )

  if (!gaugeData || !voterData || !rewardsData)
    return (
      <PageContainer title='Vote' titleImg={Image.pageBackground_4}>
        <div className={constantsStyles.LoadingContainer}>
          <Empty content='Oops! No Data.' />
        </div>
      </PageContainer>
    )

  const columnsList = [
    {
      id: 'pool',
      Header: 'Pool',
    },
    {
      id: 'totalVotes',
      Header: 'Total Votes',
    },
    {
      id: 'rewards',
      Header: 'Rewards',
    },
    {
      id: 'apr',
      Header: 'APR',
    },
    {
      id: 'weights',
      Header: 'Weights',
    },
  ]

  const renderRow = (
    columns: any[],
    gaugeData: Gauge[],
    voterData: Voter,
    rewardsData: Rewards[],
  ) => {
    return gaugeData.map((gauge, idx) => {
      if (!rewardsData[idx].rewards) return null
      const _rewards = rewardsData[idx].rewards
      const weight =
        voterData.pool_weights.find((p) => p.pool_id == gauge.pool)?.weight ??
        '0'

      return columns.map((column: { id: string }, idx) => {
        switch (column.id) {
          case 'pool':
            return (
              <CoinCombin
                key={idx}
                poolCoinX={fetchCoinByType(gauge.type_x)}
                poolCoinY={fetchCoinByType(gauge.type_y)}
                stable={false}
              />
            )
          case 'totalVotes':
            return (
              <div
                key={idx}
                className={cx(
                  styles.VestTableContent,
                  constantsStyles.columnContent,
                )}
              >
                <div className={constantsStyles.boldText}>
                  {formatBalance(weight, 9, CoinFormat.FULL)}
                </div>
                <div className={constantsStyles.greyText}>
                  {voterData.total_weight != '0'
                    ? (
                      (Number(weight) / Number(voterData.total_weight)) *
                      100
                    ).toFixed(2)
                    : '0.00'}
                  %
                </div>
              </div>
            )
          case 'rewards':
            return (
              <div
                key={idx}
                className={cx(
                  styles.VestTableContent,
                  constantsStyles.columnContent,
                )}
              >
                <div className={constantsStyles.boldText}>$ 1,234.56</div>
                {_rewards.map((reward, key) => {
                  const coin = fetchCoinByType(reward.type)
                  return (
                    <div
                      className={cx(
                        constantsStyles.rowContent,
                        constantsStyles.greyText,
                      )}
                      key={idx + key}
                    >
                      <span>
                        {formatBalance(
                          reward.value,
                          coin?.decimals ?? 0,
                          CoinFormat.FULL,
                        )}
                      </span>
                      <div className={styles.smallIcon}>
                        {coin?.logo ?? Coins[0].logo}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          case 'apr':
            return (
              <div key={idx} className={constantsStyles.boldText}>
                12.34%
              </div>
            )
          case 'weights':
            return (
              <Slider
                key={idx}
                min={0}
                stepSize={0.1}
                labelStepSize={0.2}
                max={1}
                onChange={(value) => handleVotingOnchange(gauge.pool, value)}
                labelRenderer={renderLabel2}
                value={
                  totalVoting[gauge.pool]
                    ? parseFloat(totalVoting[gauge.pool])
                    : 0
                }
              />
            )
          default:
            return null
        }
      })
    })
  }

  return (
    <PageContainer title='Vote' titleImg={Image.pageBackground_4}>
      <div className={styles.voteWrapper}>
        <div className={styles.topContainer}>
          <div className={styles.inputContent}>
            <Input
              value={searchInput}
              onChange={handleOnInputChange}
              placeholder='SDB, SUI...'
              leftIcon={<Icon.SearchIcon className={styles.searchInputIcon} />}
            />
            <div className={constantsStyles.greyText}>
              Make sure you vote in each epoch, otherwise you lose all the
              underlying bribes.
            </div>
          </div>
          <div className={styles.infoContent}>
            <div className={styles.infoTitle}>Epoch 1</div>
            <div>
              <div>Finished in </div>
              <div
                className={styles.yellowText}
              >{`${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`}</div>
            </div>
          </div>
        </div>
        <ReactTable
          data={data}
          columns={columnsList}
          renderRow={renderRow(columnsList, gaugeData, voterData, rewardsData)}
        />
        <div className={styles.bottomVoteContent}>
          <div className={styles.bottomVoteTitle}>VeSDB used:</div>
          <div className={styles.bottomVotePercent}>
            {(totalVoting['total'] ?? 0) * 100}%
          </div>
          <Button
            styletype='filled'
            text='Vote'
            onClick={handleVote}
            disabled={
              !(
                currentNFTInfo.data?.voting_state &&
                round_down_week(
                  parseInt(currentNFTInfo.data.voting_state.last_voted),
                ) < round_down_week(Date.now() / 1000)
              )
            }
          />
        </div>
      </div>
    </PageContainer>
  )
}

export default VotePresentation
