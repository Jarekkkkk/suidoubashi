import { ProgressBar } from '@blueprintjs/core';
import { Button } from '@/Components';
import Image from '@/Assets/image'

import DepositVSDBModal from './_DepositVSDBModal';
import * as styles from './index.styles';

interface Props {
  nftId: string,
  nftImg: any,
  level: string,
  expValue: number,
  vesdbValue: number,
  lockSdbValue: string,
  expiration: string,
  isPerviewMode?: boolean,
	handleIncreaseUnlockedTime?: Function,
	handleIncreaseUnlockedAmount?: Function,
	handleRevival?: Function,
	handleUnlock?: Function,
  isShowDepositVSDBModal?: boolean,
  setIsShowDepositVSDBModal?: Function,
  setIsShowWithdrawVSDBModal?: Function,
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
    nftImg, level, expValue, nftId, isPerviewMode,
    vesdbValue, lockSdbValue, expiration,
		handleIncreaseUnlockedTime,
		handleIncreaseUnlockedAmount,
		handleRevival,
		handleUnlock,
    isShowDepositVSDBModal,
		setIsShowDepositVSDBModal,
		setIsShowWithdrawVSDBModal,
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
        {
          !isPerviewMode && (
            <div className={styles.buttonContent}>
              {
                Date.parse(_nowDate) > Date.parse(expiration) ?
                (
                  <>
                    {handleUnlock && <Button
                      styletype='outlined'
                      text='Unlock'
                      onClick={() => handleUnlock(nftId)}
                    />}
                    {setIsShowWithdrawVSDBModal && <Button
                      styletype='outlined'
                      text='Revival'
                      onClick={() => {
                        setIsShowWithdrawVSDBModal(true);
                        // handleRevival(nftId);
                      }}
                    />}
                  </>
                ) :
                  setIsShowDepositVSDBModal &&
                    <Button
                      styletype='outlined'
                      text='Increase Unlocked'
                      onClick={() => {
                        setIsShowDepositVSDBModal(true);
                        // handleIncreaseUnlockedTime(nftId);
                      }}
                    />
              }
            </div>
          )
        }
      </div>
			{(!isPerviewMode && isShowDepositVSDBModal && setIsShowDepositVSDBModal) &&
        <DepositVSDBModal
          isShowDepositVSDBModal={isShowDepositVSDBModal}
          setIsShowDepositVSDBModal={setIsShowDepositVSDBModal}
        />
      }
    </div>
  );
};

export default VestCardComponent;
