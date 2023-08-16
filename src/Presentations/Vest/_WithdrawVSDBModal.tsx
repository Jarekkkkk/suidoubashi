import { Dialog, Button } from '@/Components'
import Image from '@/Assets/image'

import * as styles from './index.styles';

type Props = {
  isShowCreateVSDBModal: boolean,
  setIsShowCreateVSDBModal: Function,
}

const CreateVSDBModal = (props: Props) => {
  const { isShowCreateVSDBModal, setIsShowCreateVSDBModal } = props;

  return (
    <Dialog
      {...props}
      title="Withdraw VSDB"
      titleImg={Image.pageBackground_2}
      isShow={isShowCreateVSDBModal}
      setIsShow={setIsShowCreateVSDBModal}
    >
      123
    </Dialog>
  )
};

export default CreateVSDBModal;
