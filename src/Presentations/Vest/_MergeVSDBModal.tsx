import { Dialog, Button, Select } from '@/Components'
import Image from '@/Assets/image'
import { required_exp } from '@/Utils/game'
import BigNumber from 'bignumber.js'

import VestCardComponent from './_VestCard'
import * as styles from './index.styles'
import { Vsdb } from '@/Constants/API/vsdb'
import { formatBalance, formatDate, formatId } from '@/Utils/format'
import { useEffect, useMemo, useState } from 'react'
import { SelectOption } from '@/Components/Select'
import { useMerge } from '@/Hooks/VSDB/useMerge'
import { calculate_vesdb } from '@/Utils/vsdb'

type Props = {
  vsdbs: Vsdb[]
  isShowMergeVSDBModal: boolean
  setIsShowMergeVSDBModal: Function
}

const MergeVSDBModal = (props: Props) => {
  const { isShowMergeVSDBModal, setIsShowMergeVSDBModal, vsdbs } = props

  const [currentVsdb, setCurrentVsdb] = useState<Vsdb>()
  const [secondVsdb, setSecondVsdb] = useState<Vsdb>()
  const [newVsdb, setNewVsdb] = useState<Vsdb>()

  const mergedVsdb = useMemo(() => {
    if (!currentVsdb) return null
    if (!secondVsdb) return currentVsdb
    let _mergedVsdb = Object.assign({}, currentVsdb)

    if (
      secondVsdb.level > _mergedVsdb.level ||
      (secondVsdb.level === _mergedVsdb.level &&
        secondVsdb.experience > _mergedVsdb.experience)
    ) {
      _mergedVsdb.level = secondVsdb.level
      _mergedVsdb.experience = secondVsdb.experience
    }

    if (BigInt(_mergedVsdb.end) < BigInt(secondVsdb.end))
      _mergedVsdb.end = secondVsdb.end

    _mergedVsdb.balance = (
      BigInt(currentVsdb.balance) + BigInt(secondVsdb.balance)
    ).toString()

    _mergedVsdb.vesdb = calculate_vesdb(_mergedVsdb.balance, _mergedVsdb.end)
    return _mergedVsdb
  }, [secondVsdb, currentVsdb])

  const { mutate: merge, isLoading, isSuccess } = useMerge()

  const handleMerge = async () => {
    if (!currentVsdb || !secondVsdb) return null
    merge({ vsdb: currentVsdb.id, mergedVsdb: secondVsdb.id })
  }

  const _vsdbsList = vsdbs.filter(
    (vsdb) =>
      vsdb.voting_state == undefined &&
      new Date().getTime() < parseInt(vsdb.end) * 1000,
  )

  useEffect(() => {
    if (isSuccess) {
      const _vsdb = vsdbs.filter(
        (vsdb) =>
          vsdb.id === mergedVsdb?.id && vsdb.balance === mergedVsdb.balance,
      )[0]
      setNewVsdb(_vsdb)
    }
  }, [vsdbs])

  return (
    <Dialog
      {...props}
      title={!isSuccess ? 'Merge VSDB' : 'The New VSDB'}
      titleImg={Image.pageBackground_2}
      isShow={isShowMergeVSDBModal}
      setIsShow={setIsShowMergeVSDBModal}
      disabled={isLoading}
    >
      {!isSuccess ? (
        <>
          <div className={styles.perviewContainer}>
            <div className={styles.perviewCardBlock}>
              <Select
                options={_vsdbsList.map(
                  (vsdb) =>
                    ({
                      label: formatId(vsdb.id, 6),
                      value: vsdb,
                    }) as SelectOption,
                )}
                onChange={({ value }: SelectOption) => {
                  setCurrentVsdb(value)
                  setSecondVsdb(undefined)
                }}
                isDisabled={isLoading}
              />
              <div className={styles.perviewCard}>
                <div>{currentVsdb ? formatDate(currentVsdb.end) : '---'}</div>
                <div>
                  {currentVsdb
                    ? formatBalance(currentVsdb.balance, 9) + ' SDB'
                    : '---'}
                </div>
                <div className={styles.perviewImage}>
                  <img
                    src={
                      currentVsdb
                        ? currentVsdb.display.image_url
                        : Image.nftDefault
                    }
                  />
                </div>
              </div>
            </div>
            <div className={styles.perviewCardBlock}>
              <Select
                options={_vsdbsList
                  .filter((v) => v.id != currentVsdb?.id && !v.voting_state)
                  .map(
                    (vsdb) =>
                      ({
                        label: formatId(vsdb.id, 6),
                        value: vsdb,
                      }) as SelectOption,
                  )}
                value={
                  secondVsdb
                    ? ({
                        label: formatId(secondVsdb.id, 6),
                        value: secondVsdb,
                      } as SelectOption)
                    : null
                }
                onChange={({ value }: SelectOption) => setSecondVsdb(value)}
                isDisabled={isLoading}
              />
              <div className={styles.perviewCard}>
                <div>{secondVsdb ? formatDate(secondVsdb.end) : '---'}</div>
                <div>
                  {secondVsdb
                    ? formatBalance(secondVsdb.balance, 9) + ' SDB'
                    : '---'}
                </div>
                <div className={styles.perviewImage}>
                  <img
                    src={
                      secondVsdb
                        ? secondVsdb.display.image_url
                        : Image.nftDefault
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <VestCardComponent
            isPerviewMode={true}
            nftId={mergedVsdb?.id ?? '0x00'}
            nftImg={mergedVsdb?.display?.['image_url'] ?? Image.nftDefault}
            level={mergedVsdb?.level ?? '0'}
            expValue={
              mergedVsdb
                ? parseInt(mergedVsdb?.experience) /
                  required_exp(parseInt(mergedVsdb.level) + 1)
                : 0
            }
            vesdbValue={
              mergedVsdb
                ? parseInt(mergedVsdb.vesdb) / parseInt(mergedVsdb.balance)
                : 0
            }
            lockSdbValue={BigNumber(mergedVsdb?.balance ?? '0')
              .shiftedBy(-9)
              .decimalPlaces(3)
              .toFormat()}
            end={mergedVsdb?.end}
          />
          <div className={styles.vsdbModalbutton}>
            <Button
              isloading={isLoading ? 1 : 0}
              text='Merge'
              styletype='filled'
              onClick={handleMerge}
            />
          </div>
        </>
      ) : (
        <>
          <VestCardComponent
            isPerviewMode={true}
            nftId={newVsdb?.id ?? '0x00'}
            nftImg={newVsdb?.display?.['image_url'] ?? Image.nftDefault}
            level={newVsdb?.level ?? '0'}
            expValue={
              newVsdb
                ? parseInt(newVsdb?.experience) /
                  required_exp(parseInt(newVsdb.level) + 1)
                : 0
            }
            vesdbValue={
              newVsdb ? parseInt(newVsdb.vesdb) / parseInt(newVsdb.balance) : 0
            }
            lockSdbValue={BigNumber(newVsdb?.balance ?? '0')
              .shiftedBy(-9)
              .decimalPlaces(3)
              .toFormat()}
            end={mergedVsdb?.end}
          />
          <div className={styles.vsdbModalbutton}>
            <Button
              isloading={isLoading ? 1 : 0}
              text='Done'
              styletype='filled'
              onClick={() => setIsShowMergeVSDBModal(false)}
            />
          </div>
        </>
      )}
    </Dialog>
  )
}

export default MergeVSDBModal
