import { Slider } from '@blueprintjs/core'
import Image from '@/Assets/image'
import { Icon, CoinIcon } from '@/Assets/icon'
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


const VotePresentation = () => {
  const {
    searchInput,
    handleOnInputChange,
    gaugeData,
    voterData,
    fetching,
    rewardsData,
  } = useVoteContext()
  const { setting, currentNFTInfo } = usePageContext()

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

  const renderRow = (columns: any[], gaugeData: Gauge[], voterData: Voter, rewardsData: Rewards[]) => {
    return gaugeData.map((gauge, idx) => {
      if (!rewardsData[idx].rewards) return null
      const _rewards = rewardsData[idx].rewards
      const weight = voterData.pool_weights.find((p) => p.pool_id == gauge.pool)?.weight ?? '0'

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
                    : '0.00'}%
                </div>
              </div>
            )
          case 'rewards':
            return (
              <div
                className={cx(
                  styles.VestTableContent,
                  constantsStyles.columnContent,
                )}
              >
                <div className={constantsStyles.boldText}>$ 1,234.56</div>
                {
                  _rewards.map((reward) => {
                    return (
                    <div
                      className={cx(
                        constantsStyles.rowContent,
                        constantsStyles.greyText,
                      )}
                    >
                      <span>{reward.value}</span>
                      <div className={styles.smallIcon}>
                        {fetchCoinByType(reward.type)?.logo}
                      </div>
                    </div>
                  )})
                }
              </div>
            )
          case 'apr':
            return <div className={constantsStyles.boldText}>12.34%</div>
          case 'weights':
            return <Slider />
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
          <div className={styles.bottomVotePercent}>90%</div>
          <Button styletype='filled' text='Vote' onClick={() => {}} />
        </div>
      </div>
    </PageContainer>
  )
}

export default VotePresentation
2
