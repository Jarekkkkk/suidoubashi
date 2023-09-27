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

const RewardsPresentation = () => {
  const { rewardsData, stakeData, fetching } = useRewardsContext()

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
