import { cx } from '@emotion/css'

import { CoinInterface } from '@/Constants/coin'
import * as constantsStyles from '@/Constants/constants.styles'

import * as styles from './index.styles';
interface ImgProps {
  poolCoinX: CoinInterface | undefined,
  poolCoinY: CoinInterface | undefined,
}
interface Props {
  poolCoinX: CoinInterface | undefined,
  poolCoinY: CoinInterface | undefined,
  stable?: boolean,
  isPool?: boolean,
}

export const CoinCombinImg = (props: ImgProps) => {
  const { poolCoinX, poolCoinY } = props;

  return (
    <div className={styles.coinCombin}>
      {poolCoinX!.logo && poolCoinX!.logo}
      {poolCoinY!.logo && poolCoinY!.logo}
    </div>
  )
}

const CoinCombin = (props: Props) => {
  const { poolCoinX, poolCoinY, stable, isPool } = props;

  return (
    <div className={cx(constantsStyles.rowContent, styles.poolContent)}>
      <CoinCombinImg poolCoinX={poolCoinX} poolCoinY={poolCoinY} />
      <div className={constantsStyles.columnContent}>
        <span className={constantsStyles.boldText}>{poolCoinX!.name}/{poolCoinY!.name}</span>
        {isPool && <span className={constantsStyles.greyText}>{stable ? 'Stable ' : 'Variable'} Pool</span>}
      </div>
    </div>
  )
};

export default CoinCombin;
