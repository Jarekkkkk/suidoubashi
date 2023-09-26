import { useState, useCallback, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import {
  Dialog,
  Input,
  Button,
  CoinCombin,
  Empty,
  Loading,
} from '@/Components'
import Image from '@/Assets/image'
import { CoinIcon, Icon } from '@/Assets/icon'
import { Balance } from '@/Hooks/Coin/useGetBalance'
import { Coins } from '@/Constants/coin'
import { regexEn } from '@/Constants/index'
import * as styles from './index.styles'
import { Rewards } from '@/Constants/API/vote'

type Props = {
  rewardsData: Rewards[] | null,
  isCoinDataLoading: boolean,
  isShow: boolean,
  setIsShow: Function,
  setCoinType: Function,
};

const fetchIcon = (type: string) => Coins.find((coin) => coin.type === type)

const SelectPoolModal = (props: Props) => {
  const { rewardsData, isCoinDataLoading, isShow, setIsShow, setCoinType } = props;
  const [input, setInput] = useState<string>('');
  const _coinsData = rewardsData?.filter((reward) => new RegExp(input, 'ig').test(reward.name)) ?? []

  const handleOnInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value
      const isValid = regexEn.test(value)
      if (!isValid) {
        value = value.slice(0, -1)
      }
      setInput(value.toUpperCase())
    },

    [setInput],
  )

  useEffect(() => {
    setInput('');
  }, [isShow]);

  return (
    <Dialog
      {...props}
      title="Select A Pool"
      titleImg={Image.pageBackground_3}
      isShow={isShow}
      setIsShow={setIsShow}
    >
      <div className={styles.selectContainer}>
        <div className={styles.inputContent}>
          <Input
            value={input}
            onChange={handleOnInputChange}
            placeholder='Search'
            leftIcon={<Icon.SearchIcon className={styles.searchInputIcon} />}
          />
        </div>
        <div className={styles.banlaceContent}>
          {
            isCoinDataLoading ? (
              <div className={styles.cardLoadingContent}>
                <Loading />
              </div>
            ) : _coinsData && !!_coinsData.length ? (
              _coinsData.map((reward, idx) => {
                  const _coinIdx = fetchIcon(reward.type_x)

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setCoinType(_coinIdx);
                        setIsShow(false);
                      }}
                      className={styles.coincardContent}
                    >
                      <CoinCombin
                        poolCoinX={fetchIcon(reward.type_x)}
                        poolCoinY={fetchIcon(reward.type_y)}
                      />
                    </div>
                  )
                })
            ) : (
              <Empty content={'No Supported Coins'} />
            )
          }
        </div>
      </div>
    </Dialog>
  );
};

export default SelectPoolModal;
