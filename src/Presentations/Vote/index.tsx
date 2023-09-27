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
      let vote = []
      let reset: Gauge[] = []
      let voting_weights = []
      //  if (currentNFTInfo.data?.voting_state) {
      //    console.log(currentNFTInfo.data.voting_state)
      //    currentNFTInfo.data.voting_state.pool_votes.forEach((p) => {
      //      const gauge = gaugeData.find((g) => g.pool == p.pool_id)
      //      if (gauge) reset.push(gauge)
      //    })
      //  }
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
    }
  }

  useEffect(() => {
    if (currentNFTInfo?.data?.voting_state) {
      const total = Number(
        parseInt(
          currentNFTInfo.data.voting_state?.used_weights ?? '0',
        ).toPrecision(2),
      )
      for (const [key, value] of Object.entries(
        currentNFTInfo.data.voting_state?.pool_votes ?? {},
      )) {
        const foo = Number((parseInt(value) / total).toPrecision(2))
        console.log('foo', foo)
        setTotalVoting((prev:any) => ({
          ...prev,
          [key]: foo,
        }))
      }
      setTotalVoting((prev:any) => ({
        ...prev,
        total: 1,
      }))
    }else{
      setTotalVoting({})
    }
  }, [currentNFTInfo])

  console.log('voting', totalVoting)

  const data = [{ id: 1 }, { id: 2 }]

  if (fetching)
    return (
      <PageContainer title='Vote' titleImg={Image.pageBackground_2}>
        <div className={constantsStyles.LoadingContainer}>
          <Loading />
        </div>
      </PageContainer>
    )

  if (!gaugeData || !voterData || !rewardsData)
    return (
      <PageContainer title='Vote' titleImg={Image.pageBackground_2}>
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
                <div className={constantsStyles.boldText}>{weight}</div>
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
                      <div className={styles.smallIcon}>{coin!.logo}</div>
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
    <PageContainer title='Vote' titleImg={Image.pageBackground_1}>
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
              <div className={styles.yellowText}>6d 23h 30s </div>
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
          <Button styletype='filled' text='Vote' onClick={handleVote} />
        </div>
      </div>
    </PageContainer>
  )
}

export default VotePresentation
2
