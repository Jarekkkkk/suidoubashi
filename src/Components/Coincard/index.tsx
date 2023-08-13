
import * as styles from './index.styles';

interface Props {
  coinIcon: any,
  coinName: string,
  coinValue: number,
}

const Coincard = (props: Props) => {
  const { coinIcon, coinName, coinValue } = props;

  return (
    <div className={styles.coincardContainer}>
      {coinIcon && coinIcon}
      <div className={styles.coinname}>{coinName}</div>
      <div className={styles.coninvalue}>
        <span>{coinValue}</span>
      </div>
    </div>
  )
};

export default Coincard;
