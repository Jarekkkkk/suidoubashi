import { Key } from 'react';
import BigNumber from 'bignumber.js';
import { NFTCard, Tabs, Coincard, Loading } from '@/Components';
import { Coin, Coins } from '@/Constants/coin'
import { formatBalance } from '@/Utils/format'
import { LP, Pool } from '@/Constants/API/pool';
import { Vsdb } from '@/Constants/API/vsdb';

import * as styles from './index.styles';

interface Props {
  nftInfo: {
    data: Vsdb | undefined,
    isLoading: boolean,
  },
  poolDataList: Pool[] | undefined,
  coinData: any,
  lpData: LP [] | undefined,
  handleFetchNFTData: (e: any) => void,
  isPrevBtnDisplay: boolean,
  isNextBtnDisplay: boolean,
}

const fetchIcon = (type: string) => Coins.filter(coin => coin.type === type)[0];

const ControlBarComponent = (props: Props) => {
	const {
    nftInfo, coinData, lpData, poolDataList,
    handleFetchNFTData, isPrevBtnDisplay, isNextBtnDisplay
  } = props;

  const tabDataKeys = [
    {
      id: 0,
      title: "Coin",
      children: coinData && coinData
      .sort((
        prev: {
          data: {
            coinType: Coin;
            totalBalance: any;
          };
        },
        next: {
          data: {
            coinType: Coin;
            totalBalance: any;
          };
        }) => {
          const _prevIdx = fetchIcon(prev.data?.coinType)?.decimals || 0;
          const _nextIdx = fetchIcon(next.data?.coinType)?.decimals || 0;

          return Number(BigInt(next.data?.totalBalance ?? "0")* BigInt("10") ** BigInt((9 - _nextIdx).toString()) - BigInt(prev.data?.totalBalance ?? "0")* BigInt("10") ** BigInt((9 - _prevIdx).toString()))
        })
      .map((
        balance: {
          data: {
            coinType: Coin;
            totalBalance: string | number | bigint;
          };
        },
        idx: Key | null | undefined) => {
        if (!balance.data) return <div key={idx} className={styles.cardLoadingContent}><Loading /></div>;
        const _coinIdx = fetchIcon(balance.data.coinType);

        return (
          <Coincard
            key={idx}
            coinXIcon={_coinIdx.logo}
            coinXName={_coinIdx.name}
            coinXValue={formatBalance(balance.data.totalBalance, _coinIdx.decimals)}
          />
      )}),
    },
    {
      id: 1,
      title: "LP",
      children: lpData && lpData.map((data, idx) => {
        if (!data || !poolDataList) return <div className={styles.cardLoadingContent}><Loading /></div>;

        const _coinXIdx =  fetchIcon(data.type_x);
        const _coinYIdx =  fetchIcon(data.type_y);
        const { lp_supply, reserve_x, reserve_y } = poolDataList.find((p)=> p.type_x == data.type_x && p.type_y == data.type_y);
        const percentage = BigNumber(data.lp_balance).div(lp_supply);
        const x = percentage.multipliedBy(reserve_x).shiftedBy(- _coinXIdx.decimals).decimalPlaces(3).toString();
        const y = percentage.multipliedBy(reserve_y).shiftedBy(- _coinYIdx.decimals).decimalPlaces(3).toString();

        return (
          <Coincard
            key={idx}
            coinXIcon={_coinXIdx.logo}
            coinXName={_coinXIdx.name}
            coinXValue={x}
            coinYIcon={_coinYIdx.logo}
            coinYName={_coinYIdx.name}
            coinYValue={y}
          />
        )
      }),
    },
    {
      id: 2,
      title: "Stake",
      children: <p>4444</p>,
    }
  ];

  return (
    <div className={styles.barContainer}>
      {
        nftInfo.isLoading || !nftInfo.data ?
          <div className={styles.loadingContent}>
            <Loading />
          </div>
        :
          <NFTCard
            isPrevBtnDisplay={isPrevBtnDisplay}
            isNextBtnDisplay={isNextBtnDisplay}
            nftImg={nftInfo?.data?.display?.image_url}
            level={nftInfo?.data?.level}
            expValue={parseInt(nftInfo?.data?.experience)}
            sdbValue={parseInt(nftInfo?.data?.balance)}
            vesdbValue={parseInt(nftInfo?.data?.vesdb)}
            address={nftInfo?.data?.id}
            handleFetchNFTData={handleFetchNFTData}
          />
      }
      <Tabs links={tabDataKeys} />
    </div>
  );
};

export default ControlBarComponent;
