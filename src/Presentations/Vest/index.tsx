import { useContext } from 'react'
import { PageContainer, Button, Loading } from '@/Components'
import { VestContext } from '@/Containers/Vest'
import Image from '@/Assets/image'
import { Icon } from '@/Assets/icon'
import { required_exp } from '@/Utils/game'

import VestCardComponent from './_VestCard'
import CreateVSDBModal from './_CreateVSDBModal'
import MergeVSDBModal from './_MergeVSDBModal'
import WithdrawVSDBModal from './_WithdrawVSDBModal'
import DepositVSDBModal from './_DepositVSDBModal'

import * as styles from './index.styles'
import BigNumber from 'bignumber.js'

const VestPresentation = () => {
  const {
    data,
    currentVSDBId,
    setCurrentVSDBId,
    isShowCreateVSDBModal,
    isShowDepositVSDBModal,
    isShowMergeVSDBModal,
    isShowWithdrawVSDBModal,
    setIsShowCreateVSDBModal,
    setIsShowDepositVSDBModal,
    setIsShowMergeVSDBModal,
    setIsShowWithdrawVSDBModal,
  } = useContext(VestContext)

  return (
    <PageContainer title='Vest' titleImg={Image.pageBackground_1}>
      {!data.length ? (
        <Loading />
      ) : (
        <div className={styles.controlContainer}>
          <div className={styles.buttonSection}>
            <Button
              styletype='filled'
              text='Merge VSDB'
              icon={<Icon.FileIcon />}
              onClick={() => setIsShowMergeVSDBModal(true)}
            />
            <Button
              styletype='filled'
              text='Create VSDB'
              icon={<Icon.SquareAddIcon />}
              onClick={() => setIsShowCreateVSDBModal(true)}
            />
          </div>
          <div className={styles.contentSection}>
            {data.map((item, idx) => {
              return (
                <VestCardComponent
                  key={idx}
                  nftId={item.id}
                  nftImg={item?.display?.image_url}
                  level={item.level}
                  expValue={
                    parseInt(item.experience) /
                    required_exp(parseInt(item.level) + 1)
                  }
                  vesdbValue={parseInt(item.vesdb) / parseInt(item.balance)}
                  lockSdbValue={BigNumber(item.balance)
                    .shiftedBy(-9)
                    .decimalPlaces(3)
                    .toFormat()}
                  expiration={new Date(
                    Number(item.end) * 1000,
                  ).toLocaleDateString('en-ZA')}
                    setCurrentVSDBId = {setCurrentVSDBId}
                    setIsShowDepositVSDBModal = {setIsShowDepositVSDBModal}
                  setIsShowWithdrawVSDBModal={setIsShowWithdrawVSDBModal}
                />
              )
            })}
          </div>
        </div>
      )}
      {isShowCreateVSDBModal && (
        <CreateVSDBModal
          isShowCreateVSDBModal={isShowCreateVSDBModal}
          setIsShowCreateVSDBModal={setIsShowCreateVSDBModal}
        />
      )}
      {isShowDepositVSDBModal && (
        <DepositVSDBModal
          currentVSDBId={currentVSDBId}
          isShowDepositVSDBModal={isShowDepositVSDBModal}
          setIsShowDepositVSDBModal={setIsShowDepositVSDBModal}
        />
      )}
      {isShowMergeVSDBModal && (
        <MergeVSDBModal
          vsdbs={data}
          isShowMergeVSDBModal={isShowMergeVSDBModal}
          setIsShowMergeVSDBModal={setIsShowMergeVSDBModal}
        />
      )}
      {isShowWithdrawVSDBModal && (
        <WithdrawVSDBModal
          currentVSDBId={currentVSDBId}
          isShowWithdrawVSDBModal={isShowWithdrawVSDBModal}
          setIsShowWithdrawVSDBModal={setIsShowWithdrawVSDBModal}
        />
      )}
    </PageContainer>
  )
}

export default VestPresentation
