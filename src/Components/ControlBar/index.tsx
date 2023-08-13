import { NFTCard, Tabs, Coincard, Loading } from '@/Components';
import { Coins } from '@/Constants/coin'
import { formatBalance } from '@/Utils/format'
import * as styles from './index.styles';
import { Key } from 'react';

interface Props {
  nftData: any,
  coinData: Array<{
    [x: string]: any;
    balance: { data: { totalBalance: any; }; },
    idx: Key,
  }>,
  handleFetchNFTData: (e: any) => void,
  isPrevBtnDisplay: boolean,
  isNextBtnDisplay: boolean,
}

const ControlBarComponent = (props: Props) => {
	const { nftData, coinData, handleFetchNFTData, isPrevBtnDisplay, isNextBtnDisplay } = props;

  const tabDataKeys = [
    {
      id: 0,
      title: "Coin",
      children: coinData && coinData.map((balance, idx) => (
        <Coincard
          key={idx}
          coinIcon={Coins[idx].logo}
          coinName={Coins[idx].name}
          coinValue={formatBalance(balance?.data?.totalBalance, Coins[idx].decimals)}
        />
      )),
    },
    {
      id: 1,
      title: "LP",
      children: <p>3333</p>,
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
