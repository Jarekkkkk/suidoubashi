import Image from '@/Assets/image'
import { PageContainer, Input, Button, InputSection } from '@/Components'
import { fetchCoinByType } from '@/Constants/index'
import * as constantsStyles from '@/Constants/constants.styles'

import SelectPoolModal from './_SelectPoolModal'
import * as styles from './index.styles'
import { cx, css } from '@emotion/css'
import { useMemo, useState } from 'react'
import { useBribeContext } from '@/Containers/Bribe'
import { CoinInterface, Coins } from '@/Constants/coin'
import useGetBalance from '@/Hooks/Coin/useGetBalance'
import { formatBalance } from '@/Utils/format'
import { useBribe } from '@/Hooks/Vote/useBribe'
import { usePageContext } from '@/Components/Page'

const BribePresentation = () => {
  const [isShow, setIsShow] = useState(false)
  const [coinType, setCoinType] = useState<CoinInterface>(Coins[0])
  const balance = useGetBalance(coinType.type)

  const { rewardsData, handleInputOnchange, coinInput } = useBribeContext()
  const { setting } = usePageContext()

  const [rewardsId, setRewardsId] = useState('')
  const selectedReward = useMemo(() => {
    if (!rewardsData) return
    if (!rewardsId) return rewardsData[0]
    return rewardsData?.find((r) => r.id == rewardsId)
  }, [rewardsId, rewardsData])

  const bribe = useBribe(setting)
  const handleBribe = () => {
    if (selectedReward && coinType) {
      bribe.mutate({
        rewards: selectedReward.id,
        type_x: selectedReward.type_x,
        type_y: selectedReward.type_y,
        input_type: coinType.type,
        input_value: Math.round(
          parseFloat(coinInput) * 10 ** coinType.decimals,
        ).toString(),
      })
    }
  }

  return (
    <PageContainer title='Bribe' titleImg={Image.pageBackground_1}>
      <div className={styles.bribeWrapper}>
        <div className={styles.bribrContainer}>
          <div
            className={cx(
              constantsStyles.boldText,
              css({ marginBottom: '5px' }),
            )}
          >
            Create Bribes
          </div>
          <div className={constantsStyles.greyText}>
            Deposit Coins into Pool
          </div>
          <div className={styles.inputContent}>
            <Input
              value={'123'}
              onChange={(e) => {}}
              placeholder='Choose Pool'
              rightElement={
                <div
                  className={styles.arrowButton}
                  onClick={() => {
                    setIsShow(!isShow)
                  }}
                />
              }
              // disabled={isLoading}
            />
          </div>
          <div className={styles.inputContent}>
            <InputSection
              balance={formatBalance(
                balance?.totalBalance ?? '0',
                coinType.decimals,
              )}
              titleChildren={
                <div className={styles.coinButton} onClick={() => {}}>
                  {coinType.logo}
                  <span>{coinType.name}</span>
                </div>
              }
              inputChildren={
                <>
                  <Input
                    value={coinInput}
                    onChange={(e) => {
                      handleInputOnchange(e)
                    }}
                    placeholder={`${coinType.name} Value`}
                    // disabled={isLoading}
                  />
                </>
              }
            />
          </div>
          <div className={styles.coinBlock}>
            {selectedReward?.rewards
              .map((r) => fetchCoinByType(r.type))
              ?.map((_coinData, idx) => {
                if (!_coinData) return
                return (
                  <Button
                    onClick={() => {
                      setCoinType(_coinData)
                      setIsShow(false)
                    }}
                    styletype='outlined'
                    text={_coinData.name}
                    icon={_coinData.logo}
                    key={idx}
                    disabled={!_coinData}
                    size='medium'
                  />
                )
              })}
          </div>
          <div className={css({ marginTop: 'auto' })}>
            <Button styletype='filled' text='Bribe' onClick={handleBribe} />
          </div>
        </div>
        <SelectPoolModal
          isShow={isShow}
          setIsShow={setIsShow}
          rewardsData={rewardsData}
          setRewardsId={setRewardsId}
          isCoinDataLoading={false}
        />
      </div>
    </PageContainer>
  )
}

export default BribePresentation
