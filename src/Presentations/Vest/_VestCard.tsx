import { ProgressBar } from '@blueprintjs/core';
import { Button } from '@/Components';
import Image from '@/Assets/image'

import * as styles from './index.styles';

interface Props {
  nftId: string,
  nftImg: any,
  level: string,
  expValue: number,
  vesdbValue: number,
  lockSdbValue: string,
  expiration: string,
	handleIncreaseUnlockedTime: Function,
	handleIncreaseUnlockedAmount: Function,
	handleRevival: Function,
	handleUnlock: Function,
}

interface TextItemProps {
	title: string,
	level: string,
}

interface ValueItemProps {
	title: string,
	value: number,
}

const TextItem = (props: TextItemProps) => {
  const { title, level } = props;
  return (
    <div className={styles.textContent}>
      <div>{title}</div>
      <span>{level}</span>
    </div>
  );
};

const ValueItem = (props: ValueItemProps) => {
  const { title, value } = props;
  return (
    <div className={styles.valueContent}>
      <div>{title}</div>
      <ProgressBar
        value={value}
        animate={false}
        stripes={false}
        intent='primary'
      />
    </div>
  );
};

const VestCardComponent = (props: Props) => {
  const {
    nftImg, level, expValue, nftId,
    vesdbValue, lockSdbValue, expiration,
		handleIncreaseUnlockedTime,
		handleIncreaseUnlockedAmount,
		handleRevival,
		handleUnlock,
  } = props;

  const _nowDate = new Date().toLocaleDateString('en-ZA');

  return (
    <div className={styles.vestCardContainer}>
      <div className={styles.imgSection}>
        <img src={nftImg || Image.nftDefault} />
      </div>
      <div className={styles.cardContentSection}>
        <TextItem title="Level" level={level}/>
        <ValueItem title="EXP" value={expValue}/>
        <ValueItem title="VeSDB" value={vesdbValue}/>
        <div className={styles.mulValueContent}>
          <TextItem title="Locked SDB" level={lockSdbValue} />
          <TextItem title="Expiration" level={expiration}  />
        </div>
        <div></div>
        <div className={styles.buttonContent}>
          {
            Date.parse(_nowDate) > Date.parse(expiration) ?
            (
              <>
                <Button
                  styletype='outlined'
                  text='Unlock'
                  onClick={() => handleUnlock(nftId)}
                />
                <Button
                  styletype='outlined'
                  text='Revival'
                  onClick={() => handleRevival(nftId)}
                />
              </>
            ) : (
              <>
                <Button
                  styletype='outlined'
                  text='Increase Unlocked Time'
                  onClick={() => handleIncreaseUnlockedTime(nftId)}
                />
                <Button
                  styletype='outlined'
                  text='Increase Unlocked Amount'
                  onClick={() => handleIncreaseUnlockedAmount(nftId)}
                />
              </>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default VestCardComponent;
