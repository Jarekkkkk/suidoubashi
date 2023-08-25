import React, { PropsWithChildren, useState } from 'react'
import { useWalletKit } from '@mysten/wallet-kit'

import { useGetMulVsdb, useGetVsdbIDs } from '@/Hooks/VSDB/useGetVSDB'

import { Vsdb } from '@/Constants/API/vsdb'

export const VestContext = React.createContext<VestContext>({
  nftList: {
    data: [],
    isLoading: false,
  },
  currentVSDBId: '',
  setCurrentVSDBId: () => {},
  isShowCreateVSDBModal: false,
  isShowDepositVSDBModal: false,
  isShowMergeVSDBModal: false,
  isShowWithdrawVSDBModal: false,
  setIsShowCreateVSDBModal: () => {},
  setIsShowDepositVSDBModal: () => {},
  setIsShowMergeVSDBModal: () => {},
  setIsShowWithdrawVSDBModal: () => {},
})

const VestContainer = ({ children }: PropsWithChildren) => {
  const { currentAccount } = useWalletKit()
  const walletAddress = currentAccount?.address
  const { data: vsdbIdList } = useGetVsdbIDs(walletAddress)
  const nftList = useGetMulVsdb(walletAddress, vsdbIdList)
  const [isShowCreateVSDBModal, setIsShowCreateVSDBModal] = useState(false)
  const [isShowDepositVSDBModal, setIsShowDepositVSDBModal] = useState(false)
  const [isShowMergeVSDBModal, setIsShowMergeVSDBModal] = useState(false)
  const [isShowWithdrawVSDBModal, setIsShowWithdrawVSDBModal] = useState(false)

  const [currentVSDBId, setCurrentVSDBId] = useState('')

  return (
    <VestContext.Provider
      value={{
        nftList: nftList,
        isShowCreateVSDBModal,
        setIsShowCreateVSDBModal,
        isShowDepositVSDBModal,
        setIsShowDepositVSDBModal,
        isShowMergeVSDBModal,
        setIsShowMergeVSDBModal,
        isShowWithdrawVSDBModal,
        setIsShowWithdrawVSDBModal,
        currentVSDBId,
        setCurrentVSDBId,
      }}
    >
      {children}
    </VestContext.Provider>
  )
}

interface VestContext {
  readonly nftList: {
    data: Vsdb[],
    isLoading: boolean,
  }
  currentVSDBId: string
  isShowCreateVSDBModal: boolean
  isShowDepositVSDBModal: boolean
  isShowMergeVSDBModal: boolean
  isShowWithdrawVSDBModal: boolean
  setIsShowCreateVSDBModal: Function
  setIsShowDepositVSDBModal: Function
  setIsShowMergeVSDBModal: Function
  setIsShowWithdrawVSDBModal: Function
  setCurrentVSDBId: Function
}

export default VestContainer
