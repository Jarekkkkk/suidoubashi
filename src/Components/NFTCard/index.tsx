import { ProgressBar } from '@blueprintjs/core';

import "@blueprintjs/core/lib/css/blueprint.css";

import { Icon } from '@/Assets/icon';
import * as styles from './index.styles';
import { cx } from '@emotion/css';

interface Props {
  nftImg: any,
  level: string,
  expValue: number,
  vesdbValue: number,
  address: string,
  onCardNextChange: (e: any) => void,
  onCardPrevChange: (e: any) => void,
}

const NFTCardComponent = (props: Props) => {
  const {
    level, address, nftImg,
    expValue, vesdbValue,
    onCardNextChange, onCardPrevChange,
  } = props;

  const handleOnCopy = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardContent}>
        <div className={styles.cardPrev} onClick={onCardNextChange} />
        <img src={nftImg} />
        <div className={styles.cardNext} onClick={onCardPrevChange} />
      </div>
      <div className={styles.cardInfo}>
        <div className={cx(styles.infoContent, styles.levelContent)}>
          <div className={styles.valueText}>Level</div>
          <span>{level}</span>
        </div>
        <div className={styles.infoContent}>
          <div className={styles.valueText}>EXP</div>
          <ProgressBar
            value={expValue}
            animate={false}
            stripes={false}
            intent='primary'
          />
        </div>
        <div className={styles.infoContent}>
          <div className={styles.valueText}>VeSDB</div>
          <ProgressBar
            value={vesdbValue}
            animate={false}
            stripes={false}
            intent='primary'
          />
        </div>
        <div className={styles.addressContent}>
          <span>{address}</span>
          <div className={styles.copyIcon} onClick={() => handleOnCopy(address)}>
            <Icon.CopyIcon />
          </div>
        </div>
      </div>
    </div>
  )
};

export default NFTCardComponent;
