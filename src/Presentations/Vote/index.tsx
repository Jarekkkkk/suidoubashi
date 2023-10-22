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
import { fetchCoinByType } from '@/Constants/coin'
import { useEffect, useState } from 'react'
import { CoinFormat, formatBalance } from '@/Utils/format'
import { useVote } from '@/Hooks/Vote/useVote'
import { toast } from 'react-hot-toast'
import { Coins } from '@/Constants/coin'
import { round_down_week } from '@/Utils/vsdb'
import { useGetPrice } from '@/Hooks/useGetPrice'
import CountDownClock from '@/Components/CountDownClock.tsx'
import Skeleton from '@/Components/Skelton'

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
    pool_bribesData
  } = useVoteContext()

  const price = useGetPrice()
  const handleTotalRewards = (rewards: { type: string; value: string }[]) => {
    if (price.data) {
      return rewards.reduce((acc, reward) => {
        const coin = fetchCoinByType(reward.type)
        const price_ =
          coin?.name && price.data.hasOwnProperty(coin.name)
            ? price.data[coin.name]
            : 0
        acc +=
          parseInt(reward.value) * 10 ** -(coin?.decimals ?? 0) * (price_ ?? 0)

        return acc
      }, 0)
    } else {
      return 0
    }
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
    return gaugeData.map((gauge, idx_) => {
      if (!rewardsData[idx_].rewards) return null
      let _rewards = rewardsData[idx_].rewards
      // merge pool_bribes & external bribes from gauge
      if (pool_bribesData) pool_bribesData[idx_].forEach((r, idx) => {
        let value = r.value
        if (r.type == gauge.type_x)
          value = (Number(value) + Number(gauge.pool_bribes[0])).toString()
        if (r.type == gauge.type_y)
          value = (Number(value) + Number(gauge.pool_bribes[1])).toString()

        _rewards[idx].value = value
      })
      const weight =
        voterData.pool_weights.find((p) => p.pool_id == gauge.pool)?.weight ??
        '0'
      const totalValue = handleTotalRewards(_rewards)
      const VAPR =
        (totalValue /
          ((Number(weight) + 1000) * 10 ** -9) /
          (price.data?.['SDB'] ?? 1)) *
        52

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
                <div className={constantsStyles.boldText} style={{ width: "100%", display: 'flex', justifyContent: "right" }}>
                  $ {pool_bribesData ? totalValue.toFixed(6) : <Skeleton width='100' />}
                </div>
                {
                  _rewards.map((reward, key) => {
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
                          {pool_bribesData ? formatBalance(
                            reward.value,
                            coin?.decimals ?? 0,
                            CoinFormat.FULL,
                          ) : <Skeleton width='50' />}
                        </span>
                        <div className={styles.smallIcon}>
                          {coin?.logo ?? Coins[0].logo}
                        </div>
                      </div>
                    )
                  })
                }
              </div >
            )
          case 'apr':
            return (
              <div key={idx} className={constantsStyles.boldText} style={{ width: "100px" }}>
                {!pool_bribesData ? <Skeleton width='100' /> : VAPR > 1000 ? ">1000" : (VAPR / 100).toFixed(4)}%
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
          <CountDownClock />
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
