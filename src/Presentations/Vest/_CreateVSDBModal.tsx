import { useEffect, useState } from 'react';
import { Dialog, Input, InputSection, DatePicker, RadioGroup, Button } from '@/Components';
import Image from '@/Assets/image';
import { CoinIcon, Icon } from '@/Assets/icon';
import { vsdbTimeSettingOptions } from '@/Constants/index'

import * as styles from './index.styles';

type Props = {
  isShowCreateVSDBModal: boolean,
  setIsShowCreateVSDBModal: Function,
}

const CreateVSDBModal = (props: Props) => {
  const { isShowCreateVSDBModal, setIsShowCreateVSDBModal } = props;
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

  return (
    <Dialog
      {...props}
      title="Create VSDB"
      titleImg={Image.pageBackground_2}
      isShow={isShowCreateVSDBModal}
      setIsShow={setIsShowCreateVSDBModal}
    >
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
          </>
        }
      />
      <div className={styles.vsdbCountContainer}>
        <div className={styles.vsdbCountBlock}>
          <div>Your VeSDB</div>
          <div className={styles.vsdbCountContent}>987.34</div>
        </div>
        <div className={styles.vsdbCountBlock}>
          <div>1 SDB locked for <span>24 weeks</span> = 1.00 VeSDB</div>
          <div>1 SDB locked for <span>18 weeks</span> = 0.75 VeSDB</div>
          <div>1 SDB locked for <span>12 weeks</span> = 0.50 VeSDB</div>
          <div>1 SDB locked for <span>6 weeks</span> = 0.25 VeSDB</div>
        </div>
      </div>
      <div className={styles.vsdbModalbutton}>
        <Button text="Lock" styletype='filled' onClick={() => {}} />
      </div>
    </Dialog>
  )
};

export default CreateVSDBModal;
