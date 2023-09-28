import { useContext } from 'react'
import { PageContainer, Button, Loading, Empty } from '@/Components'
import { VestContext } from '@/Containers/Vest'
import Image from '@/Assets/image'
import { Icon } from '@/Assets/icon'
import { required_exp } from '@/Utils/game'

import VestCardComponent from './_VestCard'
import CreateVSDBModal from './_CreateVSDBModal'
import MergeVSDBModal from './_MergeVSDBModal'
import WithdrawVSDBModal from './_WithdrawVSDBModal'
import DepositVSDBModal from './_DepositVSDBModal'

import * as constantsStyles from '@/Constants/constants.styles'
import * as styles from './index.styles'
import BigNumber from 'bignumber.js'
import { useMintSDB } from '@/Hooks/VSDB/useMintSDB'

const VestPresentation = () => {
  const {
    nftList,
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
      {nftList.isLoading ? (
        <div className={constantsStyles.LoadingContainer}>
          <Loading />
        </div>
      ) : (
        <div className={styles.controlContainer}>
          <div className={styles.buttonSection}>
            <TestMintSDBButton />
            {nftList.data.length > 1 && (
              <Button
                styletype='filled'
                text='Merge VSDB'
                icon={<Icon.FileIcon />}
                onClick={() => setIsShowMergeVSDBModal(true)}
              />
            )}
            <Button
              styletype='filled'
              text='Create VSDB'
              icon={<Icon.SquareAddIcon />}
              onClick={() => setIsShowCreateVSDBModal(true)}
            />
          </div>
          <div className={styles.contentSection}>
            {!!nftList.data.length ? (
              nftList.data.map((item, idx) => {
                return (
                  <VestCardComponent
                    key={idx}
                    nftId={item.id}
                    nftImg={item?.display?.image_url}
                    level={item.level}
                    expValue={
                      Number(item.experience) /
                      required_exp(Number(item.level) + 1)
                    }
                    expSpanValue={{
                      experience: Number(item.experience),
                      required_exp: required_exp(Number(item.level) + 1),
                    }}
                    vesdbSpanValue={item.vesdb}
                    vesdbValue={Number(item.vesdb) / Number(item.balance)}
                    lockSdbValue={BigNumber(item.balance)
                      .shiftedBy(-9)
                      .decimalPlaces(3)
                      .toFormat()}
                      end = {item.end}
                    expiration={new Date(
                      Number(item.end) * 1000,
                    ).toLocaleDateString('en-ZA')}
                    setCurrentVSDBId={setCurrentVSDBId}
                    setIsShowDepositVSDBModal={setIsShowDepositVSDBModal}
                    setIsShowWithdrawVSDBModal={setIsShowWithdrawVSDBModal}
                    amm_state={item.amm_state}
                    voting_state={item.voting_state}
                  />
                )
              })
            ) : (
              <div className={styles.EmptyContainer}>
                <Empty content='No Vesting NFT' />
              </div>
            )}
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
          vsdbs={nftList.data}
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

const TestMintSDBButton = () => {
  const { mutate: mint } = useMintSDB()
  return (
    <Button
      styletype='filled'
      text='Mint 100 SDB'
      icon={<Icon.LogoIcon />}
      onClick={() => mint()}
    />
  )
}
