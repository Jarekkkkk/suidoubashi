import { Dialog, Button, Select } from '@/Components';
import Image from '@/Assets/image';
import { required_exp } from '@/Utils/game';
import BigNumber from 'bignumber.js';

import VestCardComponent from './_VestCard';
import * as styles from './index.styles';

type Props = {
  isShowCreateVSDBModal: boolean,
  setIsShowCreateVSDBModal: Function,
}

const MergeVSDBModal = (props: Props) => {
  const { isShowCreateVSDBModal, setIsShowCreateVSDBModal } = props;

  return (
    <Dialog
      {...props}
      title="Merge VSDB"
      titleImg={Image.pageBackground_2}
      isShow={isShowCreateVSDBModal}
      setIsShow={setIsShowCreateVSDBModal}
    >
      <div className={styles.perviewContainer}>
        <div className={styles.perviewCardBlock}>
          <Select options={[{ label: '1', value: '1'}, { label: '2', value: '2'}]} />
          <div className={styles.perviewCard}>
            <div>15th Aug</div>
            <div>100 SDB</div>
            <div className={styles.perviewImage}>
              <img src={Image.nftDefault} />
            </div>
          </div>
        </div>
        <div className={styles.perviewCardBlock}>
          <Select options={[{ label: '1', value: '1'}, { label: '2', value: '2'}]} />
          <div className={styles.perviewCard}>
            <div>15th Aug</div>
            <div>100 SDB</div>
            <div className={styles.perviewImage}>
              <img src={Image.nftDefault} />
            </div>
          </div>
        </div>
      </div>
      <VestCardComponent
        isPerviewMode={true}
        nftId="0xd1cfa7b1f3a86a1ca3166dcb4a7f804bb8170c05fe4bfd025a85b69c17fd7f"
        nftImg={Image.nftDefault}
        level='1'
        expValue={parseInt("0") / required_exp(parseInt("0") + 1)}
        vesdbValue={parseInt("39186294428824") / parseInt("50000000000000")}
        lockSdbValue={BigNumber("50000000000000").shiftedBy(-9).decimalPlaces(3).toFormat()}
        expiration={new Date(Number(1703721600) * 1000).toLocaleDateString('en-ZA')}
      />
      <div className={styles.vsdbModalbutton}>
        <Button text="Merge" styletype='filled' onClick={() => {}} />
      </div>
    </Dialog>
  )
};

export default MergeVSDBModal;
