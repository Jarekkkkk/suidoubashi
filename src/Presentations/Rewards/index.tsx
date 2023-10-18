import Image from '@/Assets/image'
import { Icon, CoinIcon } from '@/Assets/icon'
import {
  PageContainer,
  Button,
  Loading,
  Empty,
  CoinCombinImg,
} from '@/Components'
import { fetchCoinByType } from '@/Constants/index'
import * as constantsStyles from '@/Constants/constants.styles'
import * as styles from './index.styles'
import { cx, css } from '@emotion/css'
import { useRewardsContext } from '@/Containers/Rewards'
import { usePageContext } from '@/Components/Page'
import { useEffect, useState } from 'react'
import { all_earned } from '@/Constants/API/vote'
import useRpc from '@/Hooks/useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import { formatBalance } from '@/Utils/format'
import { useClaimRewards } from '@/Hooks/Vote/useClaimRewards'
import { useClaimBribes } from '@/Hooks/Vote/useClaimBribe'
import { useGetMulGauge } from '@/Hooks/Vote/useGetGauge'
import { Spinner } from '@blueprintjs/core'

const RewardsPresentation = () => {
  const { rewardsData, stakeData, fetching } = useRewardsContext()
  const { setting, currentNFTInfo } = usePageContext()

  const [voterRewards, setVoterRewards] = useState()
  const [voterRewardsIsLoading, setVoterRewardsIsLoading] = useState(false)
  const rpc = useRpc()
  const { currentAccount } = useWalletKit()
  const { data: gauges } = useGetMulGauge()

  const claim_rewards = useClaimRewards(setting)
  const handleClaimRewards = (
    stake_id: string,
    gauge_type_x: string,
    gauge_type_y: string,
  ) => {
    if (gauges) {
      const gauge = gauges.find(
        (g) => g.type_x == gauge_type_x && g.type_y == gauge_type_y,
      )

      if (gauge) {
        claim_rewards.mutate({
          gauge_id: gauge.id,
          stake_id,
          gauge_type_x,
          gauge_type_y,
        })
      } else {
        throw new Error('No Gauge Exist')
      }
    }
  }

  const claim_bribes = useClaimBribes(setting)
  const handleClaimBribes = (
    bribe: string,
    rewards: string,
    vsdb: string | undefined,
    type_x: string,
    type_y: string,
    input_types: string[],
  ) => {
    if (!vsdb) return
    claim_bribes.mutate({ bribe, rewards, vsdb, type_x, type_y, input_types })
  }

  useEffect(() => {
    const get_vote_rewards = async () => {
      if (!currentNFTInfo?.data?.voting_state?.unclaimed_rewards) {
        setVoterRewards(undefined)
        setVoterRewardsIsLoading(false)
        return
      }
      if (stakeData && currentAccount && rewardsData) {
        setVoterRewardsIsLoading(true)

        const unclaimed_rewards =
          currentNFTInfo.data.voting_state.unclaimed_rewards
        const rewards_ = rewardsData.filter((r) =>
          Object.keys(unclaimed_rewards).includes(r.id),
        )

        const promise = rewards_.map(
          async (r) =>
            await all_earned(
              rpc,
              currentAccount.address,
              r.bribe,
              r.id,
              currentNFTInfo.data!.id,
              r.type_x,
              r.type_y,
              unclaimed_rewards[r.id],
            ),
        )
        const res_ = await Promise.all(promise)
        let res: any = {}
        res_.forEach((r, idx) => (res[rewards_[idx].id] = r))
        setVoterRewardsIsLoading(false)
        setVoterRewards(res)
      }
    }
    if (!voterRewardsIsLoading) get_vote_rewards()
  }, [currentNFTInfo, rewardsData, stakeData])

  if (fetching)
    return (
      <PageContainer title='Rewards' titleImg={Image.pageBackground_2}>
        <div className={constantsStyles.LoadingContainer}>
          <Loading />
        </div>
      </PageContainer>
    )

  if (!rewardsData || !stakeData)
    return (
      <PageContainer title='Rewards' titleImg={Image.pageBackground_2}>
        <div className={constantsStyles.LoadingContainer}>
          <Empty content='Oops! No Data.' />
        </div>
      </PageContainer>
    )

  return (
    <PageContainer title='Rewards' titleImg={Image.pageBackground_1}>
      <div className={styles.rewardsWrapper}>
        <div className={styles.stakeContainer}>
          <div className={styles.title}>
            <Icon.StakeIcon />
            <span>Stake</span>
          </div>
          <div className={constantsStyles.lightGreyText}>
            Provide liquidity to SuiDoBashi to earn SDB.
          </div>
          <div
            className={cx(constantsStyles.boldText, css({ marginTop: '20px' }))}
          >
            Your Position
          </div>
          {stakeData
            .filter((r) => r.stakes !== '0')
            .map((r) => {
              const coin_x = fetchCoinByType(r.type_x)
              const coin_y = fetchCoinByType(r.type_y)
              return (
                <div className={styles.rewardsCard}>
                  <CoinCombinImg poolCoinX={coin_x} poolCoinY={coin_y} />
                  <span>
                    <CoinIcon.SDBIcon className={styles.smallIcon} />
                    {formatBalance(r.pending_sdb, 9)}
                  </span>
                  <Button
                    size='small'
                    styletype='outlined'
                    text='Claim'
                    onClick={() => handleClaimRewards(r.id, r.type_x, r.type_y)}
                  />
                </div>
              )
            })}
          {/**
            <div
              className={css({
                marginTop: 'auto',
                width: '100%',
                padding: '12px',
              })}
            >
              <Button styletype='filled' text='Claim All' onClick={() => {}} />
            </div>
          **/}
        </div>
        <div className={styles.votingContainer}>
          <div className={styles.title}>
            <Icon.VoteIcon />
            <span>Voting</span>
          </div>
          <div className={constantsStyles.lightGreyText}>
            Votes to pools to earn fee and bribe revenues.
          </div>
          <div
            className={cx(constantsStyles.boldText, css({ marginTop: '20px' }))}
          >
            Bribes
          </div>
          <div
            className={css({
              overflow: 'scroll',
              width: '100%',
              padding: '10px',
            })}
          >
            {voterRewardsIsLoading ? (
              <div className={styles.inputAnimation}>
                <Spinner size={20} />
              </div>
            ) : (
              voterRewards &&
              rewardsData &&
              Object.keys(voterRewards).map((rewards) => {
                const reward = rewardsData.find((r) => r.id == rewards)
                if (!reward) return
                let earned_ = Object.entries(voterRewards[reward.id])
                const group_earned = earned_.reduce((result, item, index) => {
                  if (index % 2 === 0) {
                    result.push([item])
                  } else {
                    result[result.length - 1].push(item)
                  }
                  return result
                }, [] as any)

                const coin_x = fetchCoinByType(reward.type_x)
                const coin_y = fetchCoinByType(reward.type_y)
                return (
                  <div className={styles.rewardsCard}>
                    <div className={constantsStyles.columnContent}>
                      <CoinCombinImg poolCoinX={coin_x} poolCoinY={coin_y} />
                      <div className={constantsStyles.boldText}>
                        {coin_x!.name + '/' + coin_y!.name}
                      </div>
                    </div>
                    <div className={constantsStyles.rowContent}>
                      {group_earned.map((group: any) => {
                        return (
                          <div
                            className={cx(
                              constantsStyles.columnContent,
                              css({ marginLeft: '10px' }),
                            )}
                          >
                            {group.map((g: any) => (
                              <div className={styles.bridesText}>
                                {fetchCoinByType(g[0])?.logo}
                                <span>{g[1] as string}</span>
                              </div>
                            ))}
                          </div>
                        )
                      })}
                    </div>
                    <Button
                      size='small'
                      styletype='outlined'
                      text='Claim'
                      onClick={() =>
                        handleClaimBribes(
                          reward.bribe,
                          reward.id,
                          currentNFTInfo.data?.id,
                          reward.type_x,
                          reward.type_y,
                          Object.keys(voterRewards[reward.id]),
                        )
                      }
                    />
                  </div>
                )
              })
            )}
          </div>
          {/**
            <div className={css({ marginTop: 'auto' })}>
              <Button styletype='filled' text='Claim All' onClick={() => {}} />
            </div>
          **/}
        </div>
      </div>
    </PageContainer>
  )
}

export default RewardsPresentation
