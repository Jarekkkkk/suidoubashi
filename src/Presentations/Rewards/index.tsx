import Image from '@/Assets/image'
import { Icon, CoinIcon } from '@/Assets/icon'
import {
  PageContainer,
  Button,
  Loading,
  Empty,
  CoinCombinImg,
} from '@/Components'
import { fetchIcon, fetchCoinByType } from '@/Constants/index'
import * as constantsStyles from '@/Constants/constants.styles'

import * as styles from './index.styles'
import { cx, css } from '@emotion/css'
import { useRewardsContext } from '@/Containers/Rewards'
import { usePageContext } from '@/Components/Page'
import { useEffect, useState } from 'react'
import { all_earned, earned } from '@/Constants/API/vote'
import useRpc from '@/Hooks/useRpc'
import { useWalletKit } from '@mysten/wallet-kit'

const RewardsPresentation = () => {
  const { rewardsData, stakeData, fetching } = useRewardsContext()
  const { currentNFTInfo } = usePageContext()

  const [voterRewards, setVoterRewards] = useState()
  const [voterRewardsIsLoading, setVoterRewardsIsLoading] = useState(false)
  const rpc = useRpc()
  const { currentAccount } = useWalletKit()

  useEffect(() => {
    const get_vote_rewards = async () => {
      if (!currentNFTInfo?.data?.voting_state?.unclaimed_rewards) {
        setVoterRewards(undefined)
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
      <PageContainer title='Pool' titleImg={Image.pageBackground_2}>
        <div className={constantsStyles.LoadingContainer}>
          <Loading />
        </div>
      </PageContainer>
    )

  if (!rewardsData || !stakeData)
    return (
      <PageContainer title='Pool' titleImg={Image.pageBackground_2}>
        <div className={constantsStyles.LoadingContainer}>
          <Empty content='Oops! No Data.' />
        </div>
      </PageContainer>
    )

  console.log(voterRewards)
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
                  <div
                    className={cx(
                      constantsStyles.columnContent,
                      css({ padding: '0 5px' }),
                    )}
                  >
                    <div className={constantsStyles.greyText}>
                      {coin_x?.name ?? ''}
                    </div>
                    <div className={constantsStyles.boldText}>12344</div>
                  </div>
                  <div
                    className={cx(
                      constantsStyles.columnContent,
                      css({ padding: '0 5px' }),
                    )}
                  >
                    <div className={constantsStyles.greyText}>
                      {coin_y?.name ?? ''}
                    </div>
                    <div className={constantsStyles.boldText}>12343</div>
                  </div>
                  <span>
                    <CoinIcon.SDBIcon className={styles.smallIcon} />
                    {r.pending_sdb}
                  </span>
                  <Button
                    size='small'
                    styletype='outlined'
                    text='Claim'
                    onClick={() => {}}
                  />
                </div>
              )
            })}
          <div className={css({ marginTop: 'auto' })}>
            <Button styletype='filled' text='Claim All' onClick={() => {}} />
          </div>
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
          {voterRewards &&
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
                      {coin_x?.name ?? '' + '/' + coin_y?.name ?? ''}
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
                          {group.map((g) => (
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
                    onClick={() => {}}
                  />
                </div>
              )
            })}
          <div className={css({ marginTop: 'auto' })}>
            <Button styletype='filled' text='Claim All' onClick={() => {}} />
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default RewardsPresentation
