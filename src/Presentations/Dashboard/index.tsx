import { SuiWalletConnectButton } from '@/Components'
import Image from '@/Assets/image'
import { Icon } from '@/Assets/icon'

import * as styles from './index.styles'
import { css } from '@emotion/css'

interface SectionProps {
  positon?: string
  title: string
  content: string
  number: string
}

const Section = (props: SectionProps) => {
  const { positon, title, content, number } = props

  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        margin: positon === 'right' ? '20px 0 0 auto' : '20px auto 0 0',
        width: '300px',
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexDirection: 'row',
        })}
      >
        <div
          className={css({
            display: 'flex',
            padding: '2px 6px',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'var(--White)',
            borderRadius: '8px',
            background: 'var(--BrandDark)',
          })}
        >
          {number}
        </div>
        <div
          className={css({
            display: 'flex',
            marginLeft: '8px',
            padding: '2px 16px',
            alignItems: 'center',
            color: 'var(--White)',
            borderRadius: '8px',
            background: 'var(--BrandDark)',
          })}
        >
          {title}
        </div>
      </div>
      <div
        className={css({
          marginTop: '5px',
          padding: '8px',
          color: 'var(--BrandDark)',
          fontSize: '14px',
          fontWeight: 'normal',
          lineHeight: 1,
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.60)',
          backdropFilter: 'blur(2px)',
        })}
      >
        {content}
      </div>
    </div>
  )
}

const DashboardPresentation = () => {
  return (
    <div>
      <div className={styles.sectionA} id='sectionA'>
        <div className={styles.sectionContainer}>
          <Image.LogoText className={styles.logo} />
          <SuiWalletConnectButton />
        </div>
      </div>
      <div className={styles.sectionB} id='sectionB'>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionBContent}>
            <div className={styles.TitleGreen}>What is SuiDouBashi ?</div>
            <div
              className={css({
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: '30px',
              })}
            >
              <Icon.SwapGreenIcon
                className={css({
                  minWidth: '60px',
                  height: '60px',
                })}
              />
              <div
                className={css({
                  marginLeft: '30px',
                  width: 'calc(100% - 90px)',
                })}
              >
                <div className={styles.SecondTitleGreen}>Liquidity Station</div>
                <div className={styles.ContentGreen}>
                  A cutting-edge DeFi ecosystem that blends AMM, Vesting, and
                  Voting features is designed to become a VeModel-style DEX. It
                  focuses on liquidity provision and market stability.
                </div>
              </div>
            </div>
            <div
              className={css({
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: '30px',
              })}
            >
              <Icon.DefiGreenIcon
                className={css({
                  minWidth: '60px',
                  height: '60px',
                })}
              />
              <div
                className={css({
                  marginLeft: '30px',
                  width: 'calc(100% - 90px)',
                })}
              >
                <div className={styles.SecondTitleGreen}>Defi Playground</div>
                <div className={styles.ContentGreen}>
                  Holding NFTs enables players to earn experience points and
                  progress through levels. SuiDouBashi provides liquidity,
                  growth opportunities, and an enjoyable DeFi experience for
                  both small and large players
                </div>
              </div>
            </div>
            <div className={styles.TitleGreen}>
              4 steps to join <br />
              SuiDouBashi ecosystem
            </div>
            <div
              className={css({
                margin: '30px auto 0 auto',
              })}
            >
              <Section
                number='1'
                title='Buy $SDB'
                content='Purchase SDB tokens released by SuiDouBashi from any Dex or our pools.'
              />
              <Section
                number='2'
                title='Vesting'
                content='Locking up SDB token for up to 24 weeks in exchange for Vsdb NFT.'
                positon='right'
              />
              <Section
                number='3'
                title='Earn experience'
                content='Accumulate experience points by actively participating in SuiDouBashi through activities such as voting or swapping'
              />
              <Section
                number='4'
                title='Enjoy additional benefits'
                content='Enjoy additional bendfites like fee deduction and voting power bonus.'
                positon='right'
              />
            </div>
            <div className={styles.TitleWhite}>Features</div>
            <div
              className={css({
                marginTop: '30px',
              })}
            >
              <div className={styles.SecondTitleWhite}>Vesting</div>
              <div className={styles.ContentWhite}>
                SuiDouBashi promotes long-term stability and governance
                participation by introducing vesting mechanism. Anyone vesting
                SDB coins can be promised as our ecosystem members.
              </div>
            </div>
            <div
              className={css({
                marginTop: '30px',
              })}
            >
              <div className={styles.SecondTitleWhite}>AMM DEX</div>
              <div className={styles.ContentWhite}>
                SuiDouBashi brings liquidity to the Sui ecosystem and allows
                users to trade desired tokens with lower slippage and fees.
              </div>
            </div>
            <div
              className={css({
                marginTop: '30px',
              })}
            >
              <div className={styles.SecondTitleWhite}>Voting</div>
              <div className={styles.ContentWhite}>
                SuiDouBashi enables NFT holders to vote and participate in
                governance. The voting feature is integrated into the AMM model,
                allowing NFT holders to gain value from SuiDouBashi’s revenue by
                protecting our ecosystem.
              </div>
            </div>
            <div
              className={css({
                marginTop: '30px',
              })}
            >
              <div className={styles.SecondTitleWhite}>Gaming mechanism</div>
              <div className={styles.ContentWhite}>
                SuiDouBashi introduces gaming features such as levels and
                experience points as part of its loyalty program. Users can earn
                experience points through weekly voting and swap transactions,
                unlocking additional benefits.
              </div>
            </div>
            <div className={styles.TitleWhite}>What is SDB & VeSDB ?</div>
            <div
              className={css({
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: '30px',
              })}
            >
              <div
                className={css({
                  marginRight: '30px',
                  width: 'calc(100% - 90px)',
                })}
              >
                <div className={styles.SecondTitleWhite}>SDB</div>
                <div className={styles.ContentWhite}>
                  SDB token is used for rewarding liquidity providers through
                  weekly emissions provided by SuiDouBashi. Any SDB holders can
                  obtain NFT by vesting SDB to participate in SuiDouBashi
                  ecosystem.
                </div>
              </div>
              <img
                className={css({
                  minWidth: '120px',
                  height: '120px',
                })}
                src={Image.SdbCoinIcon}
              />
            </div>
            <div
              className={css({
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: '30px',
                marginBottom: '80px',
              })}
            >
              <div
                className={css({
                  marginRight: '30px',
                  width: 'calc(100% - 90px)',
                })}
              >
                <div className={styles.SecondTitleWhite}>VeSDB</div>
                <div className={styles.ContentWhite}>
                  All VeSDB is stored in the form of NFT and used for
                  governance. Any SDB holders can lock their tokens for up to 24
                  weeks to receive NFTs and gain access to the ecosystem and
                  enjoy additional benefits
                </div>
              </div>
              <img
                className={css({
                  minWidth: '120px',
                  height: '120px',
                })}
                src={Image.VesdbCoinIcon}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPresentation
