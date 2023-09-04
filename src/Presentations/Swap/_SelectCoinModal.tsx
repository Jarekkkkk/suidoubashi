import { useState, useCallback, useEffect } from 'react'
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
import { formatBalance } from '@/Utils/format'
import { Balance } from '@/Hooks/Coin/useGetBalance'
import { Coins } from '@/Constants/coin'
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
  const [input, setInput] = useState<string>('')
  const fetchIcon = (type: string) => Coins.find((coin) => coin.type === type)
  const _coinsData = coinData?.filter((coin) => new RegExp(input, 'ig').test(coin.coinName))

  const handleOnInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value
      const isValid = /^-?\D*\.?\D*$/.test(value)
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
          {
            _coinList.map((coin) => (
              <Button
                onClick={() => {}}
                styletype="outlined"
                text={coin.text}
                icon={coin.icon}
                key={coin.id}
                medium
              />
            ))
          }
        </div>
        <div className={styles.banlaceContent}>
          {
            isCoinDataLoading ? (
              <div className={styles.cardLoadingContent}>
                <Loading />
              </div>
            ) : _coinsData && !!_coinsData.length ? (
              _coinsData
                ?.sort((prev, next) => {
                  const _prevIdx = fetchIcon(prev.coinType)!.decimals
                  const _nextIdx = fetchIcon(next.coinType)!.decimals

                  return Number(
                    BigInt(next.totalBalance) *
                      BigInt('10') ** BigInt((9 - _nextIdx).toString()) -
                      BigInt(prev.totalBalance) *
                        BigInt('10') ** BigInt((9 - _prevIdx).toString()),
                  )
                })
                .map((balance, idx) => {
                  const _coinIdx = fetchIcon(balance.coinType)
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setCoinType(_coinIdx);
                        setIsShow(false);
                      }}
                    >
                      <Coincard
                        coinXIcon={_coinIdx!.logo}
                        coinXName={_coinIdx!.name}
                        coinXValue={formatBalance(
                          balance.totalBalance,
                          _coinIdx!.decimals,
                        )}
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
