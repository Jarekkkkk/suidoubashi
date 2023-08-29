import cx from 'classnames';
import Image from '@/Assets/image';
import * as styles from './index.styles'

type Props = {
  className?: string,
};

const LoadingComponent = (props: Props) => (
  <div
    className={cx(styles.wrap, props.className)}
    data-testid="loading"
  >
    <div className={styles.fishContent}>
      <Image.loadingFishDown className={styles.fishDown}  />
      <Image.loadingFishUp className={styles.fishUp} />
    </div>
  </div>
);

export default LoadingComponent;
