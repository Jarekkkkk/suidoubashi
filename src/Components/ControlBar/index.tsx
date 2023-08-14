import { NFTCard, Tabs, Coincard, Loading } from '@/Components';
import { Coin, Coins } from '@/Constants/coin'
import { formatBalance } from '@/Utils/format'
import * as styles from './index.styles';
import { Key } from 'react';

interface Props {
  nftData: any,
  coinData: any,
  lpData: any,
  handleFetchNFTData: (e: any) => void,
  isPrevBtnDisplay: boolean,
  isNextBtnDisplay: boolean,
}

const fetchIcon = (type: Coin) => Coins.filter(coin => coin.type === type)[0];

const ControlBarComponent = (props: Props) => {
	const {
    nftData, coinData, lpData,
    handleFetchNFTData, isPrevBtnDisplay, isNextBtnDisplay
  } = props;

  const tabDataKeys = [
    {
      id: 0,
      title: "Coin",
      children: coinData && coinData
      .sort((
        prev: {
          data: { totalBalance: any; };
        },
        next: {
          data: { totalBalance: any; };
        }) => Number(next.data?.totalBalance) - Number(prev.data?.totalBalance))
      .map((
        balance: {
          data: {
            coinType: Coin;
            totalBalance: string | number | bigint;
          };
        },
        idx: Key | null | undefined) => {
        if (!balance.data) return <div className={styles.cardLoadingContent}><Loading /></div>;
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
      children: lpData && lpData.map((
          data: {
            type_x: Coin; type_y: Coin;
            claimable_x: string | number | bigint;
            claimable_y: string | number | bigint;
          },
          idx: Key | null | undefined
        ) => {
          if (!data) return <div className={styles.cardLoadingContent}><Loading /></div>;
        const _coinXIdx =  fetchIcon(data.type_x);
        const _coinYIdx =  fetchIcon(data.type_y);

        return (
          <Coincard
            key={idx}
            coinXIcon={_coinXIdx.logo}
            coinXName={_coinXIdx.name}
            coinXValue={formatBalance(data?.claimable_x, _coinXIdx.decimals)}
            coinYIcon={_coinYIdx.logo}
            coinYName={_coinYIdx.name}
            coinYValue={formatBalance(data?.claimable_y, _coinYIdx.decimals)}
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
        !nftData.data ?
          <div className={styles.loadingContent}>
            <Loading />
          </div>
        :
          <NFTCard
            isPrevBtnDisplay={isPrevBtnDisplay}
            isNextBtnDisplay={isNextBtnDisplay}
            nftImg={nftData.data.display.image_url}
            level={nftData.data.level}
            expValue={parseInt(nftData.data.experience)}
            sdbValue={parseInt(nftData.data.balance)}
            vesdbValue={parseInt(nftData.data.vesdb)}
            address={nftData.data.id}
            handleFetchNFTData={handleFetchNFTData}
          />
      }
      {
        !coinData ? (
          <div className={styles.loadingContent}>
            <Loading />
          </div>
        ) : <Tabs links={tabDataKeys} />
      }
    </div>
  );
};

export default ControlBarComponent;
