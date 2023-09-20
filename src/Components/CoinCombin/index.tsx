import { cx } from '@emotion/css'

import { CoinInterface } from '@/Constants/coin'
import * as constantsStyles from '@/Constants/constants.styles'

import * as styles from './index.styles';

interface Props {
  poolCoinX: CoinInterface | undefined,
  poolCoinY: CoinInterface | undefined,
}

const CoinCombin = (props: Props) => {
  const { poolCoinX, poolCoinY } = props;

  return (
    <div className={cx(constantsStyles.rowContent, styles.poolContent)}>
      <div className={styles.coinCombin}>
        {poolCoinX!.logo && poolCoinX!.logo}
        {poolCoinY!.logo && poolCoinY!.logo}
      </div>
      <div className={constantsStyles.columnContent}>
        <span className={constantsStyles.boldText}>{poolCoinX!.name}/{poolCoinY!.name}</span>
        <span className={constantsStyles.greyText}>Stable Pool</span>
      </div>
    </div>
  )
};

export default CoinCombin;
