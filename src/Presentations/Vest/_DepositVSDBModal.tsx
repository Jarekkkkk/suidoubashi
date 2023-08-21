import { useState, useEffect } from 'react'
import { Dialog, InputSection, Input, DatePicker, RadioGroup, Tabs, Button } from '@/Components'
import Image from '@/Assets/image'
import { CoinIcon, Icon } from '@/Assets/icon';
import { vsdbTimeSettingOptions } from '@/Constants/index'

import * as styles from './index.styles';
import { cx } from '@emotion/css';

type Props = {
  isShowDepositVSDBModal: boolean,
  setIsShowDepositVSDBModal: Function,
}

const DepositVSDBModal = (props: Props) => {
  const { isShowDepositVSDBModal, setIsShowDepositVSDBModal } = props;
  if (!isShowDepositVSDBModal) return null;
  const [startDate, setStartDate] = useState(new Date());
  const [dateRange, setDateRange] = useState();

  const handleOnChange = (date: any) =>  {
    setStartDate(date)
  };

  const handleOnRadioChange = (e: any) =>  {
    setDateRange(e.target.value)
  };

  useEffect(() => {
    if (!!dateRange) {
      handleOnChange(Date.parse(dateRange));
    }
  }, [dateRange]);

  const tabDataKeys = [
    {
      id: 0,
      title: "Increase SDB",
      children: (
        <div className={styles.vsdbTabContainer}>
          <InputSection
            titleChildren={
              <>
                <CoinIcon.SDBIcon />
                <span>SDB</span>
              </>
            }
            inputChildren={
              <>
                <Input placeholder="Increase Unlocked Amount" />
              </>
            }
            balance={30000}
          />
          <div className={styles.vsdbDepositCountBlock}>
            <div className={cx(styles.vsdbDepositCount, styles.vsdbCountBlock)}>
              <div>Current VeSDB</div>
              <span className={styles.vsdbCountContent}>987.34</span>
            </div>
            <Icon.BgArrowIcon />
            <div className={cx(styles.vsdbDepositCount, styles.vsdbCountBlock)}>
              <div>New VeSDB</div>
              <span className={styles.vsdbCountContent}>997.34</span>
            </div>
          </div>
          <div className={styles.vsdbModalbutton}>
            <Button text="Increase SDB" styletype='filled' onClick={() => {}} />
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "Increase Duration",
      children: (
        <div className={styles.vsdbTabContainer}>
          <InputSection
            titleChildren={
              <>
                <Icon.VectorIcon />
                <span>Unlocked Date</span>
              </>
            }
            inputChildren={
              <>
                <DatePicker startDate={startDate} handleOnChange={handleOnChange} />
                <RadioGroup
                  selectedValue={dateRange}
                  options={vsdbTimeSettingOptions}
                  onChange={handleOnRadioChange}
                />
                <div className={styles.vsdbDepositCountBlock}>
                  <div className={cx(styles.vsdbDepositCount, styles.vsdbCountBlock)}>
                    <div>Current VeSDB</div>
                    <span className={styles.vsdbCountContent}>987.34</span>
                  </div>
                  <Icon.BgArrowIcon />
                  <div className={cx(styles.vsdbDepositCount, styles.vsdbCountBlock)}>
                    <div>New VeSDB</div>
                    <span className={styles.vsdbCountContent}>997.34</span>
                  </div>
                </div>
                <div className={styles.vsdbModalbutton}>
                  <Button text="Increase Duration" styletype='filled' onClick={() => {}} />
                </div>
              </>
            }
          />
        </div>
      )
    }
  ];


  return (
    <Dialog
      {...props}
      title="Deposit VSDB"
      titleImg={Image.pageBackground_1}
      isShow={isShowDepositVSDBModal}
      setIsShow={setIsShowDepositVSDBModal}
    >
      <Tabs links={tabDataKeys} styletype='ellipse' />
    </Dialog>
  )
};

export default DepositVSDBModal;
