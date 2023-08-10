
import * as styles from './index.styles';

interface Props {
  coinIcon: any,
  coinName: string,
  coinValue: string,
}

const Coincard = (props: Props) => {
  const { coinIcon, coinName, coinValue } = props;

  return (
    <div className={styles.coincardContainer}>
      {coinIcon && coinIcon}
      <div className={styles.coinname}>{coinName}</div>
      <div className={styles.coninvalue}>{coinValue}</div>
    </div>
  )
};

export default Coincard;
