import { useState, useCallback, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import {
  Dialog,
  Input,
  Button,
  Coincard,
  Empty,
  Loading,
} from '@/Components'
import Image from '@/Assets/image'
import { CoinIcon, Icon } from '@/Assets/icon'
import { Balance } from '@/Hooks/Coin/useGetBalance'
import { Coins, fetchCoinByType } from '@/Constants/coin'
import { regexEn } from '@/Constants/index'
import * as styles from './index.styles'

type Props = {
  coinData: Balance[] | undefined,
  isCoinDataLoading: boolean,
  isShow: boolean,
  setIsShow: Function,
  setCoinType: Function,
};

const _coinList = [
  {
    id: 0,
    text: 'USDC',
    icon: <CoinIcon.USDCIcon />,
  },
  {
    id: 1,
    text: 'SUI',
    icon: <CoinIcon.SUIIcon />,
  },
  {
    id: 2,
    text: 'USDT',
    icon: <CoinIcon.USDTIcon />,
  },
  {
    id: 3,
    text: 'SDB',
    icon: <CoinIcon.SDBIcon />,
  },
];

const SelectCoinModal = (props: Props) => {
  const { coinData, isCoinDataLoading, isShow, setIsShow, setCoinType } = props;
  const [input, setInput] = useState<string>('');
  const _coinsData = coinData?.filter((coin) => new RegExp(input, 'ig').test(coin.coinName))?.sort((prev, next) => {
    const _prevIdx = fetchCoinByType(prev.coinType)!.decimals
    const _nextIdx = fetchCoinByType(next.coinType)!.decimals

    return Number(
      BigInt(next.totalBalance) *
      BigInt('10') ** BigInt((9 - _nextIdx).toString()) -
      BigInt(prev.totalBalance) *
      BigInt('10') ** BigInt((9 - _prevIdx).toString()),
    )
  });

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
      title="Select A Coin"
      titleImg={Image.pageBackground_3}
      isShow={isShow}
      setIsShow={setIsShow}
    >
      <div className={styles.selectContainer}>
        <div className={styles.inputContent}>
          <Input
            value={input}
            onChange={handleOnInputChange}
            placeholder='Search name, symbol or type...'
            leftIcon={<Icon.SearchIcon className={styles.searchInputIcon} />}
          />
        </div>
        <div className={styles.coinContent}>
          <div className={styles.coinBlock}>
            {
              _coinList.map((coin) => {
                const _coinData = _coinsData?.filter((item => item.coinName === coin.text))[0];
                const _coinIdx = _coinData && fetchCoinByType(_coinData.coinType);

                return (
                  <Button
                    onClick={() => {
                      setCoinType(_coinIdx);
                      setIsShow(false);
                    }}
                    styletype="outlined"
                    text={coin.text}
                    icon={coin.icon}
                    key={coin.id}
                    disabled={!_coinData}
                    size="medium"
                  />
                )
              })
            }
          </div>
        </div>
        <div className={styles.banlaceContent}>
          {
            isCoinDataLoading ? (
              <div className={styles.cardLoadingContent}>
                <Loading />
              </div>
            ) : _coinsData && !!_coinsData.length ? (
              _coinsData.map((balance, idx) => {
                const _coinIdx = fetchCoinByType(balance.coinType)

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setCoinType(_coinIdx);
                      setIsShow(false);
                    }}
                    className={styles.coincardContent}
                  >
                    <Coincard
                      coinXIcon={_coinIdx!.logo}
                      coinXName={_coinIdx!.name}
                      coinXValue={new BigNumber(balance.totalBalance
                        .toString())
                        .shiftedBy(-1 * _coinIdx!.decimals)
                        .toFormat()
                      }
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

export default SelectCoinModal;
