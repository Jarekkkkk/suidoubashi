import { Loading } from '@/Components';
import * as styles from './index.styles';

interface Props {
  coinXIcon: any,
  coinXName: string,
  coinXValue: string,
  coinYIcon?: any,
  coinYName?: string,
  coinYValue?: string,
}

const Coincard = (props: Props) => {
  const { coinXIcon, coinXName, coinXValue,
    coinYIcon, coinYName, coinYValue,
   } = props;
   if (!coinXIcon) return <Loading />;

  return (
    <div className={styles.coincardContainer}>
      {
        !coinYIcon ? (
          <>
            {coinXIcon && coinXIcon}
            <div className={styles.coinname}>{coinXName}</div>
            <div className={styles.coninvalue}>
              <span>{coinXValue}</span>
            </div>
          </>
        ) : (
          <>
            <div className={styles.lpContent}>
              <div className={styles.coinCombin}>
                {coinXIcon && coinXIcon}
                {coinYIcon && coinYIcon}
              </div>
              <div className={styles.lpName}>{coinXName}/{coinYName}</div>
            </div>
            <div className={styles.lpvalueContent}>
              <div>{coinXValue}</div>
              <div>{coinYValue}</div>
            </div>
          </>
        )
      }
    </div>
  )
};

export default Coincard;
