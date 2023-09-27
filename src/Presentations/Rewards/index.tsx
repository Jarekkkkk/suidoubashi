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
import { earned } from '@/Constants/API/vote'
import useRpc from '@/Hooks/useRpc'
import { useWalletKit } from '@mysten/wallet-kit'

const RewardsPresentation = () => {
  const { rewardsData, stakeData, fetching } = useRewardsContext()
  const { currentNFTInfo } = usePageContext()

  const [voterRewards, setVoterRewards] = useState()
  const rpc = useRpc()
  const { currentAccount } = useWalletKit()

  useEffect(() => {
    const get_vote_rewards = async () => {
      if (
        stakeData &&
        currentAccount &&
        rewardsData &&
        currentNFTInfo.data &&
        currentNFTInfo.data.voting_state?.unclaimed_rewards
      ) {
        const unclaimed_rewards =
          currentNFTInfo.data.voting_state.unclaimed_rewards
        const rewards_ = rewardsData.filter((r) =>
          Object.keys(unclaimed_rewards).includes(r.id),
        )

        const promise = rewards_.map((r) => {
          const types = unclaimed_rewards[r.id]
          return Promise.all(
            types.map((type: string) =>
              earned(
                rpc,
                currentAccount.address,
                r.bribe,
                r.id,
                currentNFTInfo.data!.id,
                r.type_x,
                r.type_y,
                type,
              ),
            ),
          )
            .then((res) => {
              console.log('res', res)
              return res.map((r, idx) => ({ [types[idx]]: r }))
            })
            .catch((e) => console.log(e))
        })
        const res = await Promise.all(promise)
        console.log('results_2', res)
      }
    }
    get_vote_rewards()
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
            Brides
          </div>
          <div className={styles.rewardsCard}>
            <div className={constantsStyles.columnContent}>
              <CoinCombinImg
                poolCoinX={fetchIcon('ETH')}
                poolCoinY={fetchIcon('SUI')}
              />
              <div className={constantsStyles.boldText}>ETH/SUI</div>
            </div>
            <div className={constantsStyles.rowContent}>
              <div
                className={cx(
                  constantsStyles.columnContent,
                  css({ marginLeft: '10px' }),
                )}
              >
                <div className={styles.bridesText}>
                  <CoinIcon.WETHIcon />
                  <span>12.3</span>
                </div>
                <div className={styles.bridesText}>
                  <CoinIcon.WETHIcon />
                  <span>12.3</span>
                </div>
              </div>
              <div
                className={cx(
                  constantsStyles.columnContent,
                  css({ margin: '0 10px' }),
                )}
              >
                <div className={styles.bridesText}>
                  <CoinIcon.SUIIcon />
                  <span>12.3</span>
                </div>
                <div className={styles.bridesText}>
                  <CoinIcon.SUIIcon />
                  <span>12.3</span>
                </div>
              </div>
            </div>
            <Button
              size='small'
              styletype='outlined'
              text='Claim'
              onClick={() => {}}
            />
          </div>
          <div className={css({ marginTop: 'auto' })}>
            <Button styletype='filled' text='Claim All' onClick={() => {}} />
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default RewardsPresentation
