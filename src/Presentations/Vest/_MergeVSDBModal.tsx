import { Dialog, Button, Select } from '@/Components'
import Image from '@/Assets/image'
import { required_exp } from '@/Utils/game'
import BigNumber from 'bignumber.js'

import VestCardComponent from './_VestCard'
import * as styles from './index.styles'
import { Vsdb } from '@/Constants/API/vsdb'
import { formatBalance, formatDate, formatId } from '@/Utils/format'
import { useMemo, useState } from 'react'
import { SelectOption } from '@/Components/Select'
import { useMerge } from '@/Hooks/VSDB/useMerge'
import { calculate_vesdb } from '@/Utils/calculateAPR'

type Props = {
  vsdbs: Vsdb[]
  isShowMergeVSDBModal: boolean
  setIsShowMergeVSDBModal: Function
}

const MergeVSDBModal = (props: Props) => {
  const { isShowMergeVSDBModal, setIsShowMergeVSDBModal, vsdbs } = props

  const [currentVsdb, setCurrentVsdb] = useState<Vsdb>()
  const [secondVsdb, setSecondVsdb] = useState<Vsdb>()

  const mergedVsdb = useMemo(() => {
    if (!currentVsdb) return null
    if (!secondVsdb) return currentVsdb
    let _mergedVsdb = Object.assign({}, currentVsdb)

    if (
      _mergedVsdb.level < secondVsdb.level ||
      (_mergedVsdb.level == secondVsdb.level &&
        _mergedVsdb.experience < secondVsdb.experience)
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

  const { mutate: merge, isLoading } = useMerge(setIsShowMergeVSDBModal)

  const handleMerge = async () => {
    if (!currentVsdb || !secondVsdb) return null
    merge({ vsdb: currentVsdb.id, mergedVsdb: secondVsdb.id })
  }

  return (
    <Dialog
      {...props}
      title='Merge VSDB'
      titleImg={Image.pageBackground_2}
      isShow={isShowMergeVSDBModal}
      setIsShow={setIsShowMergeVSDBModal}
      disabled={isLoading}
    >
      <div className={styles.perviewContainer}>
        <div className={styles.perviewCardBlock}>
          <Select
            options={vsdbs.map(
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
                  currentVsdb ? currentVsdb.display.image_url : Image.nftDefault
                }
              />
            </div>
          </div>
        </div>
        <div className={styles.perviewCardBlock}>
          <Select
            options={vsdbs
              .filter((v) => v.id != currentVsdb?.id)
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
                  secondVsdb ? secondVsdb.display.image_url : Image.nftDefault
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
        expiration={
          mergedVsdb
            ? new Date(Number(mergedVsdb.end) * 1000).toLocaleDateString(
                'en-ZA',
              )
            : '---'
        }
      />
      <div className={styles.vsdbModalbutton}>
        <Button
          isloading={isLoading}
          text='Merge'
          styletype='filled'
          onClick={handleMerge}
        />
      </div>
    </Dialog>
  )
}

export default MergeVSDBModal
